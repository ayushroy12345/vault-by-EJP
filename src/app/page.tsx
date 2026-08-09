import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Trust } from "@/components/trust";
import { Features } from "@/components/features";
import { WhatsIncluded } from "@/components/whats-included";
import { WhyChoose } from "@/components/why-choose";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { AboutEJP } from "@/components/about-ejp";
import { Footer } from "@/components/footer";
import { getCashfreeClientMode } from "@/lib/cashfree";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <Features />
        <WhatsIncluded />
        <WhyChoose />
        <Pricing cashfreeMode={getCashfreeClientMode()} />
        <FAQ />
        <AboutEJP />
      </main>
      <Footer />
    </>
  );
}
