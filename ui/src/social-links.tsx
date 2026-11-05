import { expandLocales } from "./locale-runtime";
import {Facebook, Instagram, Youtube, Linkedin} from 'lucide-react';
import social from '../../config/social-links.json';
import type {Locale} from './i18n';
const labels:Record<Locale,string>=expandLocales({en:'Follow Qicable',de:'Qicable folgen',es:'Siga a Qicable',fr:'Suivre Qicable',pt:'Siga a Qicable',ar:'تابع Qicable'});
export function SocialLinks({locale}:{locale:Locale}){
 const items=[{name:'Facebook',url:social.facebook,Icon:Facebook},{name:'LinkedIn',url:social.linkedin,Icon:Linkedin},{name:'YouTube',url:social.youtube,Icon:Youtube},{name:'Instagram',url:social.instagram,Icon:Instagram}];
 return <nav className="social-links" aria-label={labels[locale]} dir="ltr">{items.map(({name,url,Icon})=><a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Qicable · ${name}`} title={`Qicable · ${name}`}><Icon size={18} aria-hidden="true"/></a>)}</nav>;
}
