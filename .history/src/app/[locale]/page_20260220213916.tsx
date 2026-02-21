import { HeroHorizontalSlider } from "@/components/storefront/HeroHorizontalSlider";
import { FeaturedCategories } from "@/components/storefront/FeaturedCategories";
import { PopularProducts } from "@/components/storefront/PopularProducts";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  return (
    <div className="contents md:grid md:grid-cols-12 md:gap-sides">
      <FeaturedCategories />
      <div className="flex relative flex-col grid-cols-2 col-span-8 w-full md:grid">
        <div className="fixed top-0 left-0 z-10 w-full pointer-events-none base-grid py-sides">
          <div className="col-span-8 col-start-5">
            <div className="hidden px-6 lg:block">
              <Badge variant="outline-secondary">latest drop</Badge>
            </div>
          </div>
        </div>
        <HeroHorizontalSlider />
        <PopularProducts />
      </div>
    </div>
  );
}
