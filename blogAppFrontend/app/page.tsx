import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/Features";


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
     <HeroSection />
     <FeaturedSection />
     </main>
    </div>
  );
}
