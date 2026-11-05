import type { ImgHTMLAttributes } from "react";
import imageData from "../../content/responsive-images.json";

const images: Record<string, {width:number;height:number;srcSet:string}> = imageData;
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "alt"> & {src:string | undefined;alt:string};
export function ResponsiveImage({src, alt, sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 50vw, 640px", ...props}:Props) {
  const image = src ? images[src] : undefined;
  return <img alt={alt} decoding="async" {...props} src={src} srcSet={image?.srcSet} sizes={image ? sizes : undefined}/>;
}
