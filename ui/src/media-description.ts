import { expandLocales } from "./locale-runtime";
import type {Locale} from './i18n';
import type {Product} from './model';
import {productName} from './navigation';
const imageWords:Record<Locale,string>=expandLocales({en:'image',de:'Bild',es:'imagen',fr:'image',pt:'imagem',ar:'صورة'});
export function productImageAlt(product:Pick<Product,'model'|'name'>,locale:Locale,index?:number):string{
 const name=`${productName(product,locale)} — ${product.model}`;
 return index===undefined?name:`${name} — ${imageWords[locale]} ${index+1}`;
}
export const videoDescriptions:Record<Locale,string>=expandLocales({
 "en": "Silent footage of cable production floors, cable reels and manufacturing machinery, including close-up views of production equipment.",
 "de": "Stumme Aufnahmen von Kabelproduktionshallen, Kabeltrommeln und Fertigungsmaschinen mit Nahaufnahmen der Produktionsanlagen.",
 "es": "Vídeo sin sonido de áreas de producción de cables, bobinas y maquinaria de fabricación, con primeros planos de los equipos.",
 "fr": "Vidéo sans son des ateliers de production de câbles, des bobines et des machines de fabrication, avec des gros plans des équipements.",
 "pt": "Vídeo sem som das áreas de produção de cabos, bobinas e máquinas de fabricação, com detalhes dos equipamentos.",
 "ar": "لقطات صامتة لصالات إنتاج الكابلات وبكرات الكابلات وآلات التصنيع، مع لقطات قريبة لمعدات الإنتاج."
});

export const bannerVideoCopy = expandLocales({
 en:{title:'Cable production floor and manufacturing equipment',play:'Play banner video',pause:'Pause banner video'},
 de:{title:'Kabelproduktion und Fertigungsanlagen',play:'Banner-Video abspielen',pause:'Banner-Video pausieren'},
 es:{title:'Producción de cables y equipos de fabricación',play:'Reproducir vídeo',pause:'Pausar vídeo'},
 fr:{title:'Production de câbles et équipements de fabrication',play:'Lire la vidéo',pause:'Mettre en pause'},
 pt:{title:'Produção de cabos e equipamentos de fabricação',play:'Reproduzir vídeo',pause:'Pausar vídeo'},
 ar:{title:'إنتاج الكابلات ومعدات التصنيع',play:'تشغيل فيديو البانر',pause:'إيقاف الفيديو مؤقتًا'},
});
