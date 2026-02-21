import { HeroHorizontalSlider } from "@/components/storefront/HeroHorizontalSlider";
import { FeaturedCategories } from "@/components/storefront/FeaturedCategories";
import { PopularProducts } from "@/components/storefront/PopularProducts";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <main className="flex-1">
        <HeroHorizontalSlider />
        <FeaturedCategories />
        <PopularProducts />
      </main>
    </div>
  );
}
