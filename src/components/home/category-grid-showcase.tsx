import Link from "next/link";
import { ArrowRight, Bug, HeartPulse, Pill, ShieldCheck, Sparkles, Syringe, Wind, Wrench } from "lucide-react";

const categories = [
  {
    slug: "khang-sinh",
    name: "Kháng Sinh & Đặc Trị",
    description: "Đặc trị nhiễm khuẩn, hiệu lực cao, phác đồ chuẩn y khoa.",
    icon: Pill,
    bgGradient: "from-[#f7ebde] to-[#faf8f5]",
    iconBg: "bg-white text-main-green",
  },
  {
    slug: "vitamin-khoang-chat",
    name: "Vitamin & Dinh Dưỡng",
    description: "Bổ sung dưỡng chất, tăng lực, nâng cao đề kháng toàn diện.",
    icon: Sparkles,
    bgGradient: "from-[#faf3ea] to-[#faf8f5]",
    iconBg: "bg-white text-price-orange",
  },
  {
    slug: "sat-trung",
    name: "Sát Trùng & Chuồng Trại",
    description: "Khử khuẩn môi trường, tiêu diệt mầm bệnh an toàn.",
    icon: ShieldCheck,
    bgGradient: "from-[#f4f3ef] to-[#faf8f5]",
    iconBg: "bg-white text-main-green",
  },
  {
    slug: "vaccine",
    name: "Vaccine & Sinh Phẩm",
    description: "Chủ động phòng bệnh, bảo vệ sức khỏe đàn vật nuôi.",
    icon: Syringe,
    bgGradient: "from-[#f7ebde] to-[#faf8f5]",
    iconBg: "bg-white text-price-orange",
  },
  {
    slug: "ho-tro-tieu-hoa",
    name: "Men Vi Sinh & Tiêu Hóa",
    description: "Ổn định hệ vi sinh ruột, phòng tiêu chảy, tối ưu hấp thu.",
    icon: HeartPulse,
    bgGradient: "from-[#faf3ea] to-[#faf8f5]",
    iconBg: "bg-white text-main-green",
  },
  {
    slug: "ho-tro-ho-hap",
    name: "Hô Hấp & Hạ Sốt",
    description: "Giảm ho long đờm, hạ sốt, cắt cơn hen suyễn nhanh chóng.",
    icon: Wind,
    bgGradient: "from-[#f4f3ef] to-[#faf8f5]",
    iconBg: "bg-white text-price-orange",
  },
  {
    slug: "kiem-soat-ky-sinh-trung",
    name: "Ký Sinh Trùng",
    description: "Tẩy giun sán, diệt ve rận bọ chét hiệu quả lâu dài.",
    icon: Bug,
    bgGradient: "from-[#f7ebde] to-[#faf8f5]",
    iconBg: "bg-white text-main-green",
  },
  {
    slug: "dung-cu",
    name: "Dụng Cụ & Thiết Bị",
    description: "Dụng cụ tiêm truyền, y tế thú y chính xác và bền bỉ.",
    icon: Wrench,
    bgGradient: "from-[#faf3ea] to-[#faf8f5]",
    iconBg: "bg-white text-price-orange",
  },
];

export function CategoryGridShowcase() {
  return (
    <section aria-label="Danh mục sản phẩm nổi bật" className="py-8 lg:py-14">
      <div className="site-container">
        {/* Section Header (Wolf Yoga Style) */}
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-price-orange">
            Danh mục sản phẩm
          </span>
          <h2 className="mt-2 font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl lg:text-4xl">
            Khám phá <span className="text-price-orange italic font-normal">Nhóm Sản Phẩm</span>
          </h2>
          <div className="mx-auto my-3 flex items-center justify-center gap-2">
            <div className="h-0.5 w-10 bg-price-orange/60" />
            <div className="size-1.5 rotate-45 bg-price-orange" />
            <div className="h-0.5 w-10 bg-main-green/30" />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Đa dạng sản phẩm chất lượng, nguồn gốc rõ ràng, đạt chuẩn kiểm định y tế thú y, đồng hành cùng bạn trên hành trình chăm sóc vật nuôi mỗi ngày.
          </p>
        </div>

        {/* Category Cards Grid (8 Cards) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/danh-muc/${category.slug}`}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eaf0ec] bg-gradient-to-b ${category.bgGradient} p-6 shadow-[0_8px_25px_rgba(31,74,58,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-main-green/40 hover:shadow-[0_16px_35px_rgba(31,74,58,0.09)]`}
              >
                <div>
                  {/* Category Circle Icon */}
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110 ${category.iconBg}`}
                  >
                    <Icon className="size-7" />
                  </div>

                  {/* Category Title */}
                  <h3 className="mt-4 text-base font-bold uppercase tracking-tight text-main-green transition-colors group-hover:text-price-orange">
                    {category.name}
                  </h3>

                  {/* Category Short Description */}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                {/* View More Link with animated arrow */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-main-green transition-colors group-hover:text-price-orange">
                  <span>Xem thêm</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
