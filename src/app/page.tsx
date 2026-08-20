import Header from "@/components/Header";
import MobileCtaBar from "@/components/MobileCtaBar";
import Footer from "@/components/Footer";
import CarExperienceLoader from "@/components/three/CarExperienceLoader";
import TrustBar from "@/components/sections/TrustBar";
import Services from "@/components/sections/Services";
import Method from "@/components/sections/Method";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Gallery from "@/components/sections/Gallery";
import Insurance from "@/components/sections/Insurance";
import QuoteSection from "@/components/sections/QuoteSection";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <CarExperienceLoader />
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
    </>
  );
}
