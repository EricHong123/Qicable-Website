/** Candidate-only renderer. It never builds a template or changes a live pointer. */
import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:net';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
async function canonical(value, directory = false) {
  if (!path.isAbsolute(value) || await fs.realpath(value) !== value) throw Error('Canonical input required');
  const stat = await fs.lstat(value);
  if (stat.isSymbolicLink() || (directory ? !stat.isDirectory() : !stat.isFile())) throw Error('Invalid input type');
  return value;
}
async function inventory(root) {
  const files = {}; let size = 0;
  async function visit(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
      const file = path.join(dir,entry.name);
      if (entry.isSymbolicLink()) throw Error('Release symlinks are forbidden');
      if (entry.isDirectory()) await visit(file);
      else {
        if (!entry.isFile()) throw Error('Invalid release file');
        const stat = await fs.stat(file); size += stat.size;
        if (size > 2*1024**3 || stat.size > 32*1024**2 || Object.keys(files).length >= 10000) throw Error('Release budget exceeded');
        files[path.relative(root,file).split(path.sep).join('/')] = sha(await fs.readFile(file));
      }
    }
  }
  await visit(root);
  return files;
}
function routeFile(route) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(route) && !['/sitemap.xml','/robots.txt','/llms.txt'].includes(route)) throw Error('Invalid renderer route');
  return route.endsWith('/') ? route.slice(1)+'index.html' : route.slice(1);
}
async function writeNew(file, bytes) {
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file, bytes,{flag:'wx'});
}
async function port() {
  const server = createServer();
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const number = server.address().port;
  await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
  return number;
}
export async function candidate({project,snapshot,destination,previous,template,snapshotSha256,mediaManifest,mediaSha256}) {
  await canonical(project,true); await canonical(snapshot);
  if (!/^qicable-theme-v1:[a-f0-9]{64}:[A-Za-z0-9_-]+$/.test(template)) throw Error('Invalid template identity');
  if (!path.isAbsolute(destination) || path.resolve(destination)!==destination || !/^[a-f0-9]{32}$/.test(path.basename(destination))) throw Error('Fresh candidate identity required');
  await canonical(path.dirname(destination),true);
  if (destination.startsWith(project+'/') || project.startsWith(destination+'/')) throw Error('Candidate overlaps runtime');
  if (await fs.lstat(destination).catch(e=>{if(e.code!=='ENOENT')throw e;return null;})) throw Error('Candidate already exists');
  const bytes=await fs.readFile(snapshot);
  if (bytes.length>32*1024**2 || sha(bytes)!==snapshotSha256) throw Error('Snapshot digest mismatch');
  const content=JSON.parse(bytes);
  const buildId=(await fs.readFile(path.join(project,'native-template/.next/BUILD_ID'),'utf8')).trim();
  if (!template.endsWith(':'+buildId)) throw Error('Compiled build identity mismatch');
  let prior=null;
  if(previous){
    await canonical(previous,true);
    if (previous===destination || previous.startsWith(project+'/')) throw Error('Invalid prior release');
    prior=JSON.parse(await fs.readFile(path.join(previous,'.publication.json'),'utf8'));
    if(prior.template!==template || prior.site!=='https://www.qicable.com' || prior.version!==1) throw Error('Prior template differs: explicit code release required');
    const actual=await inventory(previous);
    delete actual['manifest.json'];delete actual['.publication.json'];
    if(JSON.stringify(Object.entries(actual).sort())!==JSON.stringify(Object.entries(prior.files).sort())) throw Error('Prior release bytes changed');
  }
  const token=randomBytes(32).toString('hex'),number=await port(),origin=`http://127.0.0.1:${number}`;
  const child=spawn(process.execPath,[path.join(project,'node_modules/next/dist/bin/next'),'start','native-template','--hostname','127.0.0.1','--port',String(number)],{
    cwd:project,env:{...(process.env.HOME?{HOME:process.env.HOME}:{}),PATH:path.dirname(process.execPath)+':/usr/bin:/bin',NODE_ENV:'production',NODE_OPTIONS:'--max-old-space-size=512',NEXT_TELEMETRY_DISABLED:'1',SWC_NATIVE_BINDING_CACHE:'0',QICABLE_RENDER_TOKEN:token,QICABLE_CONTENT_SNAPSHOT:snapshot,QICABLE_TEMPLATE_ID:template},stdio:['ignore','pipe','pipe'],
  });
  let log='';child.stdout.on('data',data=>{log=(log+data).slice(-16000);});child.stderr.on('data',data=>{log=(log+data).slice(-16000);});
  let spawnError;child.on('error',error=>{spawnError=error;});
  try{
    let manifest;
    const deadline=Date.now()+20000;
    while(Date.now()<deadline){
      if(spawnError || child.exitCode!==null) throw Error('Renderer exited before readiness');
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      try{
        const response=await fetch(origin+'/api/render-manifest/',{headers:{authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(Math.min(10000, remaining))});
        if(response.ok){manifest=await response.json();break;}
        if(response.status>=500) throw Error('Renderer rejected content');
      }catch(error){if(!['TypeError','TimeoutError'].includes(error.name))throw error;}
      await delay(Math.min(100, Math.max(0, deadline - Date.now())));
    }
    if(!manifest || manifest.version!==1 || manifest.site!=='https://www.qicable.com' || manifest.template!==template || manifest.snapshotSha256!==snapshotSha256 || !Array.isArray(manifest.routes) || !manifest.routes.length || manifest.routes.length>5000) throw Error('Renderer manifest identity mismatch');
    const identities=new Set();
    for(const item of manifest.routes){
      routeFile(item.route);
      if(identities.has(item.route)||item.canonical!==manifest.site+item.route||!/^[a-f0-9]{64}$/.test(item.fingerprint)) throw Error('Invalid route identity');
      identities.add(item.route);
    }
    await fs.mkdir(destination,{mode:0o755});
    let reusedAssets=0;
    async function copyAssets(source,prefix=''){
      const assets=await inventory(source);
      for(const [relative,hash] of Object.entries(assets)){
        const name=prefix+relative,file=path.join(destination,name);
        await fs.mkdir(path.dirname(file),{recursive:true});
        if(prior?.files[name]===hash){await fs.link(path.join(previous,name),file);reusedAssets++;}
        else await fs.copyFile(path.join(source,relative),file,fs.constants.COPYFILE_EXCL);
      }
    }
    await copyAssets(path.join(project,'native-template/public'));
    await copyAssets(path.join(project,'native-template/.next/static'),'_next/static/');
    const notFound=path.join(project,'native-template/.next/server/app/_not-found.html');
    await fs.copyFile(notFound,path.join(destination,'404.html'));
    if(mediaManifest){
      await canonical(mediaManifest);
      const metadata=await fs.readFile(mediaManifest);
      if(metadata.length>256*1024||sha(metadata)!==mediaSha256)throw Error('Media manifest digest mismatch');
      const assets=JSON.parse(metadata);let total=0;
      if(!Array.isArray(assets)||assets.length>128)throw Error('Media manifest budget exceeded');
      for(const asset of assets){
        if(!/^\/media\/native\/[a-f0-9]{64}\/[a-f0-9]{64}\.png$/.test(asset.url)||!/^[a-f0-9]{64}$/.test(asset.sha256)||asset.path!==path.join(path.dirname(mediaManifest),'media',asset.sha256+'.png'))throw Error('Invalid admitted media identity');
        await canonical(asset.path);
        const bytes=await fs.readFile(asset.path);total+=bytes.length;
        if(total>64*1024**2||bytes.length>8*1024**2||sha(bytes)!==asset.sha256)throw Error('Admitted media bytes differ');
        await writeNew(path.join(destination,asset.url.slice(1)),bytes);
      }
    }
    const rendered=[],reused=[],routes={};
    for(const item of manifest.routes){
      const relative=routeFile(item.route),file=path.join(destination,relative),old=prior?.routes[item.route];
      if(old?.fingerprint===item.fingerprint){
        await fs.mkdir(path.dirname(file),{recursive:true});
        await fs.link(path.join(previous,relative),file);
        routes[item.route]=old;reused.push(item.route);continue;
      }
      const response=await fetch(origin+item.route,{redirect:'error',signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw Error(`Route rendering failed: ${item.route} (${response.status})`);
      const output=Buffer.from(await response.arrayBuffer());
      if(output.length>20*1024**2)throw Error('Rendered route too large');
      if(item.route.endsWith('/')){
        const html=output.toString('utf8');
        if(!html.includes(`rel="canonical" href="${item.canonical}"`) || /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html) || !html.includes('</html>')) throw Error('Canonical/indexing/HTML check failed: '+item.route);
      }
      await writeNew(file,output);
      routes[item.route]={...item,outputHash:sha(output)};rendered.push(item.route);
    }
    const files=await inventory(destination);
    // Every referenced local asset must be present. Remote editorial links are not fetched.
    for(const route of Object.keys(routes).filter(route=>route.endsWith('/'))){
      const html=await fs.readFile(path.join(destination,routeFile(route)),'utf8');
      for(const match of html.matchAll(/(?:src|href)="(\/(?:assets|media|_next)\/[^"?#]+)(?:[?#][^"]*)?"/g)){
        if(!files[match[1].slice(1)])throw Error('Missing local asset: '+match[1]);
      }
    }
    const publication={version:1,site:manifest.site,template,snapshotSha256,routes,files,assetHashes:Object.fromEntries(Object.entries(files).filter(([name])=>!name.endsWith('index.html')).map(([name,hash])=>['/'+name,hash]))};
    await writeNew(path.join(destination,'.publication.json'),JSON.stringify(publication));
    const result={version:1,template,snapshotSha256,rendered,reused,reusedAssets,removed:Object.keys(prior?.routes??{}).filter(route=>!identities.has(route)),files:Object.keys(files).length,products:content.products.length,articles:content.articles.length};
    return result;
  }catch(error){
    // Keep only a bounded private diagnostic. Never put runtime logs in a release.
    if(log)process.stderr.write(log);
    throw error;
  }finally{
    if(child.exitCode===null){child.kill('SIGTERM');await Promise.race([new Promise(resolve=>child.once('exit',resolve)),delay(3000)]);if(child.exitCode===null)child.kill('SIGKILL');}
  }
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const [project,snapshot,destination,template,snapshotSha256,previous,mediaManifest,mediaSha256]=process.argv.slice(2);
  candidate({project,snapshot,destination,template,snapshotSha256,previous:previous||null,mediaManifest,mediaSha256}).then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error(error.message);process.exitCode=1;});
}
