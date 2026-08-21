import { Award, HeartPulse, HelpCircle, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Sản phẩm chất lượng",
    description: "Được lựa chọn kỹ lưỡng từ các công ty uy tín, đạt chuẩn GMP-WHO.",
    badgeColor: "bg-[#faf3ea] text-main-green",
  },
  {
    icon: HeartPulse,
    title: "Hỗ trợ toàn diện",
    description: "Phác đồ phòng & điều trị hiệu quả, nâng cao sức đề kháng vật nuôi.",
    badgeColor: "bg-[#faf3ea] text-price-orange",
  },
  {
    icon: ShieldCheck,
    title: "Trải nghiệm an tâm",
    description: "Thông tin quy cách, hoạt chất minh bạch, đầy đủ hoá đơn VAT.",
    badgeColor: "bg-[#faf3ea] text-main-green",
  },
  {
    icon: HelpCircle,
    title: "Đồng hành tận tâm",
    description: "Đội ngũ chuyên môn thú y luôn sẵn sàng tư vấn và hỗ trợ 24/7.",
    badgeColor: "bg-[#faf3ea] text-price-orange",
  },
];

export function WhyChooseUs() {
  return (
    <section aria-label="Lý do chọn Vet68" className="py-4 lg:py-6">
      <div className="site-container">
        <div className="wolf-scroll-tab flex gap-4 overflow-x-auto rounded-3xl border border-[#eaf0ec] bg-white p-3 shadow-[0_8px_30px_rgba(31,74,58,0.05)] sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:p-4">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex min-w-[240px] items-center gap-3.5 rounded-2xl p-2.5 transition-all duration-200 hover:bg-[#faf8f5] sm:min-w-0"
              >
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${item.badgeColor}`}>
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-main-green">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
