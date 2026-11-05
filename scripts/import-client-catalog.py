"""Reproducible local catalog import from the inventoried customer workbook.
Does not infer equivalence between old and new manufacturer part numbers.
"""
import json,re,hashlib,shutil
from pathlib import Path
base=Path(__file__).resolve().parents[1]
ev=base/'evidence/catalog-reconciliation-2026-10-22'
j=json.loads((ev/'source-inventory.json').read_text())
assetroot=Path('/Users/trademax/Desktop/Qicable 产品线建站资料')
choices=dict(json.loads((ev/'image-choices.json').read_text()))
for model,idx in {'QC10A02':10,'QC12A00':1,'QC61C02':2,'QC62B02':1}.items():
 choices[model]=json.loads((ev/f'{model}-alts.json').read_text())[idx]['path']
# Customer confirmed: spreadsheet identity wins; suspect media stays out of storefront.
held={'QC12A01','QC62C01'}
catmap={'Machine Vision Cables':'machine-vision','Industrial Ethernet Cables':'industrial-ethernet','Circular Cable Assemblies':'m8-m12','Industrial Communication Cable':'industrial-communication','Industrial Display Cables':'industrial-display','Panel Mount Cables':'panel-mount'}
# Catalog consolidation only, not an electrical interchangeability declaration.
groups={
'QC10A01':['FS30A00'],'QC10B00':['FS30A04'],'QC10B02':['FS30A05'],
'QC11A00':['FS30B00'],'QC11B00':['FS30B01'],'QC12A00':['FS30C00'],
'QC13A00':['FS30D00'],'QC13A04':['FS30D05'],
'QC21A00':['FS33A01'],'QC21B00':['FS33A02'],
'QC31A00':['FS34A00','FS34A04'],'QC31B00':['FS34A05'],'QC30A00':['FS34B00'],'QC30B00':['FS34B03'],
'QC40A00':['FS32A02','FS32A05'],'QC41A00':['FS32B00'],'QC43A00':['FS32C00'],'QC44A00':['FS38A03'],
'QC60A00':['FS11A02'],'QC61A00':['FS12A03'],'QC51B00':['FS37B03'],'QC50C00':['FS37F01','FS37G00'],'QC53B00':['FS37H01']}
# All current source facts remain in the private source manifest; only unambiguous
# electrical/mechanical options are normalized into public fields.
endpoints={
'QC10A00':('RJ45','RJ45'),'QC10A01':('RJ45','RJ45 screw-lock'),'QC10A02':('RJ45','M12 A-coded 8-pin'),
'QC10B00':('RJ45','RJ45'),'QC10B01':('RJ45','RJ45 screw-lock'),'QC10B02':('RJ45','M12 X-coded'),
'QC11A00':('MDR','MDR'),'QC11B00':('MDR','SDR'),'QC11C00':('SDR','SDR'),
'QC12A00':('USB-A','USB Micro-B screw-lock'),'QC12A01':('USB-A','USB-B'),'QC12A02':('USB-A','USB-C screw-lock'),
'QC12B00':('USB-A','USB Micro-B screw-lock'),'QC12B01':('USB-A','USB-B screw-lock'),'QC12B02':('USB-A','USB-C screw-lock'),'QC12B03':('USB-A male','USB-A female'),
'QC13A00':('BNC','BNC'),'QC13A01':('DIN 1.0/2.3','BNC'),'QC13A02':('DIN 1.0/2.3','HD-BNC'),'QC13A03':('DIN 1.0/2.3','DIN 1.0/2.3'),'QC13A04':('HD-BNC','HD-BNC'),
'QC14A00':('Hirose 6-pin','Open end'),'QC14A01':('Hirose 8-pin','Open end'),'QC14A02':('Hirose 12-pin','Open end'),'QC14B00':('M8 A-coded 6-pin','Open end'),'QC14B01':('M12 A-coded 12-pin female','Open end'),
'QC20A00':('RJ45','RJ45'),'QC20B00':('RJ45','RJ45'),'QC20C00':('RJ45','RJ45'),'QC21A00':('M12 D-coded','RJ45'),'QC21B00':('M12 D-coded','M12 D-coded'),'QC22A00':('M12 X-coded','RJ45'),'QC22B00':('M12 X-coded','M12 X-coded'),
'QC40A00':('USB-A / USB-C','DB9 / DB25 / RJ12 / Open end'),'QC41A00':('USB','Terminal / RJ45 / DB9'),'QC42A00':('USB-A / USB-C','UART flying leads / header'),'QC43A00':('USB / RJ45 / RJ12','Device console port'),'QC44A00':('D-Sub','D-Sub'),
'QC60A00':('HDMI male','HDMI male'),'QC60B00':('HDMI male','HDMI female'),'QC60C00':('HDMI Type E','HDMI Type E'),'QC61A00':('DisplayPort male','DisplayPort male'),'QC61B00':('DisplayPort male','DisplayPort female'),'QC61C00':('DisplayPort male','HDMI male'),'QC61C01':('DisplayPort male','HDMI female'),'QC61C02':('DisplayPort male','VGA male'),
'QC62A00':('USB-C male','USB-C male'),'QC62A01':('USB-C male','USB-C female'),'QC62B00':('USB-C','HDMI male'),'QC62B01':('USB-C','VGA male'),'QC62B02':('USB-C','DisplayPort male'),'QC62C00':('USB-C','HDMI female'),'QC62C01':('USB-C','DisplayPort female'),
'QC50A00':('USB-A female','USB-A female'),'QC50A01':('USB-A male','USB-A female'),'QC50A02':('USB-C male','USB-A female'),'QC50B00':('USB-B male','USB-B female'),'QC50C00':('USB-C male','USB-C female'),'QC50C01':('USB-C female','USB-C female'),'QC50D00':('USB-C male','USB-C male'),'QC50D01':('USB-C male','USB-C male'),
'QC51A00':('HDMI female','HDMI female'),'QC51B00':('HDMI male','HDMI female'),'QC51C00':('HDMI male','HDMI male'),'QC52A00':('DisplayPort female','DisplayPort female'),'QC52A01':('DisplayPort male','DisplayPort female'),'QC53A00':('RJ45 female','RJ45 female'),'QC53B00':('RJ45 male','RJ45 female'),'QC53B01':('RJ45 male','RJ45 female module'),'QC54A00':('IEC C14','IEC C13'),'QC54B00':('NEMA 5-15P','IEC C13')}
products=[];assets=[]
for r in j['rows']:
 m=r['model'];c=r['cells'];cat=catmap[r['sheet']];sub=c['C'];name=c.get('D','');raw=c.get('E','');lengths=c.get('F','')
 if cat=='industrial-display':raw=c['D'];lengths=c.get('E','')
 interface=sub;mount='Configuration review';engineering=[]
 if cat=='m8-m12':
  name=c['D'];a=re.sub(r' (Sensor.*|Cables|Power.*)$','',name);a=a.replace('7/8″','7/8 inch');b='Open end / mating connector';interface=sub.replace('7/ 8″','7/8 inch');mount='Male / female / open-end options'
 elif cat=='industrial-communication':
  a,b=endpoints[m];name=c['D'];engineering=[{'label':'Configuration options','value':{'QC40A00':'Active USB-to-RS232 conversion; connector variant selected per project.','QC41A00':'RS422 or RS485 mode must be confirmed for the selected variant.','QC42A00':'3.3 V / 5 V TTL UART options; confirm logic level and pinout.','QC43A00':'Passive console and active USB console options; confirm device pinout and driver.','QC44A00':'DB9 / DB15 / DB25 / DB37 options; confirm wiring.'}[m]}]
 else:
  a,b=endpoints[m]
  name=f'{a} to {b} '+('Panel Mount Cable' if cat=='panel-mount' else ('Active Optical Cable' if sub=='USB3 AOC' else 'Cable'))
  if cat=='machine-vision':name+=f' — {sub}'
  if cat=='industrial-ethernet':
   if m.startswith('QC20'):interface={'QC20A00':'Cat5e','QC20B00':'Cat6','QC20C00':'Cat6A'}[m];name+=' — '+interface
  if cat=='panel-mount':mount='Panel mount';interface=sub.replace(' Panel Mount','');
  if '带锁' in c.get('D','') or '带螺丝' in c.get('D',''):mount='Screw-lock'
  if m=='QC50D00':mount='Dual screw-lock'
  if m=='QC50D01':mount='Single screw-lock'
 if cat=='machine-vision':
  construction=re.findall(r'CAT\d[A-Z]?\s+[A-Z/]+\s+\d+AWG\s+PVC|\d+(?:/\d+)?AWG|OD\d+(?:\.\d+)?(?:mm)?',raw)
  if construction:engineering.append({'label':'Construction options','value':' / '.join(dict.fromkeys(construction))})
  engineering.append({'label':'Installation options','value':'Fixed installation / continuous-flex variant; validate bend radius, travel and cycles for the selected configuration.'})
  if sub=='USB3 AOC':engineering.append({'label':'Cable technology','value':'Active optical USB 3.0; power and optical construction require configuration review.'})
 if cat=='panel-mount':engineering.append({'label':'Mounting','value':mount})
 images=[]
 if m not in held:
  src=assetroot/choices[m];digest=hashlib.sha256(src.read_bytes()).hexdigest();dest=f'/assets/products/{m.lower()}-{digest[:12]}{src.suffix.lower()}'
  (base/('ui'+dest)).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,base/('ui'+dest));images=[dest];assets.append({'model':m,'path':dest,'source':str(src),'sha256':digest,'review':'Selected from customer model folder; no performance inference from image'})
 products.append(dict(model=m,slug=m.lower(),category=cat,name=name,interface=interface,connectorA=a,connectorB=b,mounting=mount,lengths=re.findall(r'(\d+(?:\.\d+)?)\s*[mM]',str(lengths)),featured=False,images=images,sourceUrl=None,reviewStatus='draft',sourceRow=f"{r['sheet']}!B{r['row']}:F{r['row']}",subcategory=sub,engineering=engineering,legacyModels=groups.get(m,[]),mediaStatus='pending-review' if m in held else 'provided'))
assert len(products)==80 and len({p['model'] for p in products})==80
(base/'content/products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n')
# Old names and original products retained in evidence, not mixed into the active catalog.
(ev/'products-before.json').write_text(json.dumps(j['oldProducts'],ensure_ascii=False,indent=2)+'\n')
shutil.copy2(base/'content/product-names.json',ev/'product-names-before.json') if not (ev/'product-names-before.json').exists() else None
names={l:{} for l in ['de','es','fr','pt','ar']}
terms={'de':('Kabel','auf','Einbaukabel','Aktives optisches Kabel'),'es':('Cable','a','Cable de montaje en panel','Cable óptico activo'),'fr':('Câble','vers','Câble de montage sur panneau','Câble optique actif'),'pt':('Cabo','para','Cabo de montagem em painel','Cabo óptico ativo'),'ar':('كابل','إلى','كابل تثبيت على اللوحة','كابل ضوئي نشط')}
for p in products:
 for l,(cable,to,panel,aoc) in terms.items():
  prefix=panel if p['category']=='panel-mount' else aoc if p['interface']=='USB3 AOC' else cable
  names[l][p['model']]=f"{prefix} {p['connectorA']} {to} {p['connectorB']} · {p['interface']}"
(base/'content/product-names.json').write_text(json.dumps(names,ensure_ascii=False,indent=2)+'\n')
(base/'content/catalog-migration.json').write_text(json.dumps({'version':'2026-10-22','sourceSha256':j['sha256'],'activeCount':80,'consolidations':groups,'archiveWithoutReplacement':[p['model'] for p in j['oldProducts'] if not any(p['model'] in v for v in groups.values())],'note':'Editorial consolidation by connection family, not certified electrical equivalence; historical inquiries are unchanged.'},indent=2)+'\n')
(ev/'selected-assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
print('Imported 80 unique models; 78 selected photos; 2 media holds. Original source inventory retained.')
