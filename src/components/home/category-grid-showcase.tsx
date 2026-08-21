import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bug, HeartPulse, Pill, ShieldCheck, Sparkles, Syringe, Wind, Wrench } from "lucide-react";

const categories = [
  {
    slug: "khang-sinh",
    name: "Kháng Sinh",
    description: "Đặc trị nhiễm khuẩn, hiệu lực cao, an toàn.",
    icon: Pill,
    image: "/images/products/demo-antibiotic-sachet.svg",
    colorBg: "bg-[#eaf4ef]",
  },
  {
    slug: "vitamin-khoang-chat",
    name: "Vitamin & Dinh Dưỡng",
    description: "Bổ sung dưỡng chất, nâng cao đề kháng toàn diện.",
    icon: Sparkles,
    image: "/images/products/demo-vitamin-bottle.svg",
    colorBg: "bg-[#faf3ea]",
  },
  {
    slug: "sat-trung",
    name: "Sát Trùng",
    description: "Khử khuẩn chuồng trại, tiêu diệt mầm bệnh an toàn.",
    icon: ShieldCheck,
    image: "/images/products/demo-disinfectant.svg",
    colorBg: "bg-[#eef5f8]",
  },
  {
    slug: "vaccine",
    name: "Vaccine",
    description: "Chủ động phòng bệnh, bảo vệ sức khỏe đàn vật nuôi.",
    icon: Syringe,
    image: "/images/products/demo-vaccine-vials.svg",
    colorBg: "bg-[#fdf0ea]",
  },
  {
    slug: "ho-tro-tieu-hoa",
    name: "Men Tiêu Hóa",
    description: "Ổn định đường ruột, phòng tiêu chảy, hấp thu tối ưu.",
    icon: HeartPulse,
    image: "/images/products/demo-mineral-bag.svg",
    colorBg: "bg-[#faf3ea]",
  },
  {
    slug: "ho-tro-ho-hap",
    name: "Hô Hấp & Hạ Sốt",
    description: "Giảm ho long đờm, hạ sốt, cắt cơn hen suyễn nhanh.",
    icon: Wind,
    image: "/images/products/demo-antibiotic-sachet.svg",
    colorBg: "bg-[#eaf4ef]",
  },
  {
    slug: "kiem-soat-ky-sinh-trung",
    name: "Ký Sinh Trùng",
    description: "Tẩy giun sán, diệt ve rận bọ chét hiệu quả lâu dài.",
    icon: Bug,
    image: "/images/products/demo-vitamin-bottle.svg",
    colorBg: "bg-[#fdf0ea]",
  },
  {
    slug: "dung-cu",
    name: "Dụng Cụ Y Tế",
    description: "Dụng cụ tiêm truyền thú y chính xác và bền bỉ.",
    icon: Wrench,
    image: "/images/products/demo-veterinary-syringe.svg",
    colorBg: "bg-[#eef5f8]",
  },
];

export function CategoryGridShowcase() {
  return (
    <section aria-label="Khám phá danh mục sản phẩm" className="py-8 lg:py-14">
      <div className="site-container">
        {/* Section Header (Wolf Yoga Style) */}
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-12">
          <h2 className="font-playfair text-3xl font-bold tracking-tight text-main-green sm:text-4xl lg:text-[42px] leading-tight">
            <span>Khám phá </span>
            <span className="text-[#b84c1e]">Sản phẩm</span>
          </h2>

          {/* Symmetrical Ornament Divider (Wolf Yoga Style) */}
          <div className="mx-auto my-3.5 flex items-center justify-center gap-2.5">
            <div className="h-px w-12 bg-[#d37643]/70" />
            <div className="flex items-center gap-1 text-[#d37643]">
              <span className="text-[10px]">✦</span>
              <span className="text-sm font-bold">❖</span>
              <span className="text-[10px]">✦</span>
            </div>
            <div className="h-px w-16 bg-main-green/30" />
          </div>

          <p className="text-xs leading-relaxed text-[#33302f]/80 sm:text-sm">
            Đa dạng sản phẩm chất lượng, nguồn gốc rõ ràng, đạt chuẩn GMP-WHO, đồng hành cùng bạn trên hành trình chăm sóc và bảo vệ sức khoẻ vật nuôi mỗi ngày.
          </p>
        </div>

        {/* Category Cards Grid (4 columns x 2 rows, Split Layout) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/danh-muc/${category.slug}`}
                className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#eaf0ec] bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-main-green/30 hover:shadow-[0_12px_28px_rgba(31,74,58,0.08)]"
              >
                {/* Left Content Side */}
                <div className="relative z-10 flex flex-1 flex-col pr-2">
                  {/* Round Line-Art Icon */}
                  <div className="flex size-10 items-center justify-center rounded-full border border-main-green/15 bg-[#faf8f5] text-main-green shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-main-green group-hover:text-white">
                    <Icon className="size-4.5" />
                  </div>

                  {/* Category Title */}
                  <h3 className="mt-3 text-[13px] font-extrabold uppercase tracking-wide text-main-green transition-colors group-hover:text-[#b84c1e] sm:text-sm">
                    {category.name}
                  </h3>

                  {/* Category Short Description */}
                  <p className="mt-1 text-[11px] leading-relaxed text-[#5e6973] line-clamp-2">
                    {category.description}
                  </p>

                  {/* View More Link */}
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#b84c1e] transition-colors group-hover:text-main-green">
                    <span>Xem thêm</span>
                    <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Right Product Image / Visual Showcase */}
                <div className="relative flex size-24 shrink-0 items-center justify-center sm:size-28">
                  {/* Subtle Soft Background Circle Highlight */}
                  <div
                    className={`absolute inset-0 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110 ${category.colorBg}`}
                  />
                  <div className="relative z-10 size-20 p-1 sm:size-24">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-108"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
