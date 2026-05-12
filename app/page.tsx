import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { ProductsOfTheDay } from "@/components/home/ProductsOfTheDay";
import { ShopByCategories } from "@/components/home/ShopByCategories";
import { ReviewsBanner } from "@/components/home/ReviewsBanner";
import { InstagramSection } from "@/components/home/InstagramSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { TrustBadges } from "@/components/home/TrustBadges";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryStrip />
        <ProductsOfTheDay />
        <ShopByCategories />
        <ReviewsBanner />
        <InstagramSection />
        <NewsletterSection />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
}
