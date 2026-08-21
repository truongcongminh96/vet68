import { Award, HeartPulse, HelpCircle, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Sản phẩm chất lượng",
    description: "Được lựa chọn kỹ lưỡng, an toàn & đạt chuẩn GMP-WHO.",
    badgeColor: "text-main-green bg-[#faf3ea]",
  },
  {
    icon: HeartPulse,
    title: "Hỗ trợ toàn diện",
    description: "Phác đồ chuẩn xác giúp nâng cao sức đề kháng vật nuôi.",
    badgeColor: "text-price-orange bg-[#faf3ea]",
  },
  {
    icon: ShieldCheck,
    title: "Trải nghiệm an tâm",
    description: "Quy cách rõ ràng, minh bạch, đầy đủ hoá đơn VAT.",
    badgeColor: "text-main-green bg-[#faf3ea]",
  },
  {
    icon: HelpCircle,
    title: "Đồng hành tận tâm",
    description: "Đội ngũ thú y luôn lắng nghe và hỗ trợ tư vấn 24/7.",
    badgeColor: "text-price-orange bg-[#faf3ea]",
  },
];

export function WhyChooseUs() {
  return (
    <section aria-label="Cam kết chất lượng" className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-14">
      <div className="site-container">
        <div className="wolf-scroll-tab flex gap-3 overflow-x-auto rounded-2xl border border-[#eaf0ec] bg-white p-3 shadow-[0_12px_36px_rgba(31,74,58,0.07)] sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:p-4 sm:rounded-3xl">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex min-w-[240px] items-center gap-3 rounded-2xl p-2.5 transition-all duration-200 hover:bg-[#faf8f5] sm:min-w-0"
              >
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${item.badgeColor}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-main-green sm:text-sm">{item.title}</h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2 sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
