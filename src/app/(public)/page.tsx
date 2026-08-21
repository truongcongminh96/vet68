import type { Metadata } from "next";
import { CategoryGridShowcase } from "@/components/home/category-grid-showcase";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { HomeHeroSlider } from "@/components/home/home-hero-slider";
import { LatestPostsSection } from "@/components/home/latest-posts-section";
import { PromoSplitBanner } from "@/components/home/promo-split-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { getFeaturedProducts, getNewProducts, getPosts, getTaxonomy } from "@/lib/catalogue/queries";
import { DEMO_NOTICE } from "@/lib/site";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Vet68 - Thuốc Thú Y, Vaccine & Dinh Dưỡng Vật Nuôi",
  description: "Hệ thống tra cứu và cung cấp thuốc thú y, vaccine, dinh dưỡng, sát trùng và thiết bị y tế chuẩn GMP-WHO. Hỗ trợ tư vấn phác đồ và xác nhận giá chuyên nghiệp.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [taxonomy, featuredProducts, newProducts, posts] = await Promise.all([
    getTaxonomy(),
    getFeaturedProducts(8),
    getNewProducts(8),
    getPosts(),
  ]);

  const demoMode = !hasSupabaseEnv();

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. Hero Banner Slider */}
      <HomeHeroSlider />

      {/* 2. Four Pillars Trust Strip */}
      <WhyChooseUs />

      {/* Demo Notice Banner (if in demo mode) */}
      {demoMode ? (
        <div className="border-y border-[#f0e6da] bg-[#faf3ea]">
          <div className="site-container py-2 text-center text-xs font-semibold text-main-green">
            {DEMO_NOTICE}
          </div>
        </div>
      ) : null}

      {/* 3. Flash Sale Deal Section with Live Countdown */}
      <FlashSaleSection products={featuredProducts.slice(0, 5)} />

      {/* 4. Category Grid Showcase (8 Tiles) */}
      <CategoryGridShowcase />

      {/* 5. Mid-page Split Promotional Banner (Pet Care vs Farm Care) */}
      <PromoSplitBanner />

      {/* 6. New Products & Featured Collections */}
      <FeaturedCollections
        newProducts={newProducts}
        featuredProducts={featuredProducts}
      />

      {/* 7. Latest Articles & Knowledge Hub */}
      <LatestPostsSection posts={posts} />
    </div>
  );
}
