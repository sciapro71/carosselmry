/**
 * Logotype typographique fidèle à l'identité Carrosserie Lomrye
 * (wordmark deux lignes + cinq étoiles, comme sur les supports imprimés).
 *
 * TODO — remplacer par le fichier logo officiel dès qu'une version
 * vectorielle ou PNG haute définition est fournie : déposer le fichier
 * dans public/logo.svg (ou .png) et l'utiliser ici via <Image>.
 */
export default function Logo({
  variant = "light",
  compact = false,
}: {
  /** "light" = texte clair (fond sombre) ; "dark" = texte sombre (fond clair). */
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const main = variant === "light" ? "text-ivory" : "text-night";
  return (
    <span className="inline-flex flex-col leading-none select-none">
      <span
        className={`font-[family-name:var(--font-archivo-black)] uppercase tracking-tight ${main} ${
          compact ? "text-sm" : "text-base sm:text-lg"
        }`}
      >
        Carrosserie
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-px flex-1 bg-orange" />
        <span
          className={`font-[family-name:var(--font-archivo-black)] uppercase tracking-[0.18em] text-orange ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          Lomrye
        </span>
        <span aria-hidden className="h-px flex-1 bg-orange" />
      </span>
      {!compact && (
        <span aria-hidden className="mt-0.5 flex justify-center gap-0.5 text-orange text-[7px] tracking-[0.3em]">
          ★★★★★
        </span>
      )}
    </span>
  );
}
