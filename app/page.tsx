import { Navbar } from "@/components/home/navbar";
import { HeroBanner } from "@/components/home/hero-banner";
import { ProductGrid } from "@/components/home/product-grid";
import { Categories } from "@/components/home/categories";
import { PromoBanner } from "@/components/home/promo-banner";
import { Newsletter } from "@/components/home/newsletter";
import { Footer } from "@/components/home/footer";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <ProductGrid
          title="Produkty dne"
          subtitle="Nejprodávanější textilní materiály tohoto týdne za speciální ceny"
          products={MOCK_PRODUCTS.slice(0, 4)}
          viewAllHref="/katalog"
        />
        <Categories />
        <ProductGrid
          title="Nové kolekce"
          subtitle="Právě přidané materiály — buďte první, kdo je vyzkouší"
          products={MOCK_PRODUCTS.slice(4, 8)}
          viewAllHref="/katalog/novinky"
        />
        <PromoBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
