import { methodSteps } from "@/config/site";
import Reveal from "@/components/Reveal";

/** Notre savoir-faire : le parcours d'une réparation, étape par étape. */
export default function Method() {
  return (
    <section
      id="savoir-faire"
      aria-labelledby="methode-title"
      className="bg-ivory py-20 text-night sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="kicker mb-4">Notre savoir-faire</p>
          <h2 id="methode-title" className="section-title max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            La précision artisanale, <span className="text-orange-deep">étape par étape</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-night/65 sm:text-lg">
            Une belle finition ne doit rien au hasard. Chaque véhicule suit le même
            parcours rigoureux, du diagnostic à la restitution des clés.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {methodSteps.map((step, i) => (
            <Reveal key={step.step} delay={Math.min(i * 0.06, 0.3)}>
              <li className="relative border-l-2 border-night/10 pl-6 transition-colors hover:border-orange">
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-archivo-black)] text-5xl leading-none text-orange/25 sm:text-6xl"
                >
                  {String(step.step).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-extrabold uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-night/65">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
