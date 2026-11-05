import type { Product } from "./model";

// Compare recorded connections only; this does not assert interchangeability.
export function relatedProducts(product:Product, catalog:readonly Product[], limit=3):Product[] {
  const similarity=(candidate:Product)=> Number(candidate.interface===product.interface)*4
    + Number(candidate.connectorA===product.connectorA)*2
    + Number(candidate.connectorB===product.connectorB)*2
    + Number(candidate.mounting===product.mounting);
  return catalog.filter(candidate=>candidate.category===product.category && candidate.model!==product.model)
    .sort((a,b)=>similarity(b)-similarity(a)||a.model.localeCompare(b.model))
    .slice(0,limit);
}
