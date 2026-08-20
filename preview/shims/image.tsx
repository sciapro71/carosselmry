/* Shim next/image pour l'aperçu autonome : balise img simple. */
import { type CSSProperties, type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  unoptimized?: boolean;
  priority?: boolean;
};

export default function Image({
  src,
  alt,
  fill,
  sizes: _sizes,
  unoptimized: _u,
  priority: _p,
  style,
  ...rest
}: Props) {
  const fillStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : {};
  return <img src={src} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />;
}
