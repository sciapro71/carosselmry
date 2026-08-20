import { advantages } from "@/config/site";
import { advantageIcons } from "@/components/icons";
import Reveal from "@/components/Reveal";

/** Bandeau de confiance : les engagements clés, juste sous le héro. */
export default function TrustBar() {
  return (
    <section aria-label="Nos engagements" className="border-y border-white/8 bg-coal">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {advantages.map((a) => {
              const Icon = advantageIcons[a.icon];
              return (
                <li key={a.id} className="flex flex-col items-center gap-2.5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-orange/40 bg-orange/10 text-orange">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="text-sm font-bold uppercase leading-snug tracking-wide text-ivory">
                    {a.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
