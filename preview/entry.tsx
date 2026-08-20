/**
 * Point d'entrée de l'aperçu autonome (une seule page HTML, aucun serveur).
 * Rend le site complet côté client, avec deux adaptations :
 *  - le formulaire de devis répond honnêtement "aperçu, envoi non actif" ;
 *  - un badge discret « Aperçu » est affiché.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { business } from "@/config/site";
import Header from "@/components/Header";
import MobileCtaBar from "@/components/MobileCtaBar";
import Footer from "@/components/Footer";
import CarExperience from "@/components/three/CarExperience";
import TrustBar from "@/components/sections/TrustBar";
import Services from "@/components/sections/Services";
import Method from "@/components/sections/Method";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Gallery from "@/components/sections/Gallery";
import Insurance from "@/components/sections/Insurance";
import QuoteSection from "@/components/sections/QuoteSection";
import Contact from "@/components/sections/Contact";

/* L'API n'existe pas dans l'aperçu : on répond le même message honnête
   que le site réel quand Resend n'est pas configuré. */
const originalFetch = window.fetch.bind(window);
window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url === "/api/quote") {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          error: `Ceci est un aperçu du site : l'envoi en ligne n'est pas encore activé. Appelez-nous directement au ${business.phone.display}.`,
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      )
    );
  }
  return originalFetch(input, init);
}) as typeof window.fetch;

function PreviewBadge() {
  return (
    <p
      aria-hidden
      style={{
        position: "fixed",
        left: "0.75rem",
        bottom: "4.5rem",
        zIndex: 60,
        background: "rgba(9,9,9,0.82)",
        border: "1px solid rgba(243,107,33,0.55)",
        color: "#f7f6f2",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "0.35rem 0.7rem",
        borderRadius: "999px",
        pointerEvents: "none",
        backdropFilter: "blur(4px)",
      }}
    >
      Aperçu
    </p>
  );
}

function App() {
  return (
    <StrictMode>
      <Header />
      <main>
        <CarExperience />
        <TrustBar />
        <Services />
        <Method />
        <BeforeAfter />
        <Gallery />
        <Insurance />
        <QuoteSection />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
      <PreviewBadge />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
