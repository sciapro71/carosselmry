/* Shim next/link pour l'aperçu autonome : simple ancre. */
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, children, ...rest },
  ref
) {
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

export default Link;
