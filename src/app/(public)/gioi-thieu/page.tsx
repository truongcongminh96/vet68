import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, ClipboardCheck, FileCheck2, Heart, HeartHandshake, HeartPulse, MessageCircle, RefreshCcw, Truck, UsersRound, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSitemapProducts } from "@/lib/catalogue/queries";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Vet Medicine 68 xây dựng catalogue sản phẩm thú y rõ ràng, dễ tìm và tập trung vào tư vấn trực tiếp.",
  alternates: { canonical: "/gioi-thieu" },
};

const coreValues = [
  [BadgeCheck, "Sản phẩm chất lượng", "Ưu tiên thông tin rõ ràng, nguồn gốc và quy cách cần được xác nhận trước khi tư vấn."],
  [FileCheck2, "Hóa đơn đầy đủ", "Minh bạch thông tin trong quá trình xác nhận sản phẩm và đơn hàng."],
  [Truck, "Giao hàng nhanh", "Phối hợp xử lý đơn hàng gọn gàng để sản phẩm đến đúng nơi, đúng thời gian."],
  [HeartHandshake, "Hỗ trợ kỹ thuật tận tình", "Vet68 luôn sẵn sàng tiếp nhận câu hỏi và kết nối tư vấn phù hợp."],
] as const;

const missionPoints = [
  "Giúp khách hàng tra cứu sản phẩm theo cách dễ hiểu.",
  "Tổ chức danh mục theo công ty, nhóm sản phẩm và đối tượng sử dụng.",
  "Hiển thị trạng thái giá đúng với dữ liệu đã được xác minh.",
  "Đặt tư vấn trực tiếp với Vet68 ở vị trí dễ tiếp cận.",
  "Không thay thế hướng dẫn của bác sĩ thú y hoặc nhà sản xuất.",
] as const;

const salesPolicies = [
  [Truck, "Giao hàng nhanh", "Vet68 xác nhận quy cách và thời gian giao trước khi xử lý đơn."],
  [RefreshCcw, "Đổi trả dễ dàng", "Tiếp nhận và hướng dẫn xử lý khi sản phẩm có vấn đề cần kiểm tra."],
  [WalletCards, "Thanh toán tiện lợi", "Trao đổi phương thức thanh toán phù hợp với từng đơn hàng."],
  [HeartHandshake, "Hỗ trợ kỹ thuật tận tâm", "Luôn có kênh Zalo và hotline để tiếp nhận câu hỏi sau tư vấn."],
] as const;

export default async function AboutPage() {
  const products = await getSitemapProducts();
  const productCount = products.length;

  return (
    <div className="about-page overflow-hidden bg-[#fffaf0]">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="site-container relative z-10 grid min-h-[500px] items-center gap-7 py-9 md:min-h-[570px] md:grid-cols-[0.94fr_1.06fr] md:py-12 lg:min-h-[600px] lg:gap-12">
          <div className="relative z-10 pb-1 md:pb-10">
            <span className="hero-ray-mark" aria-hidden="true" />
            <p className="font-heading text-sm font-extrabold uppercase tracking-[0.15em] text-petshop-teal">Về Vet Medicine 68</p>
            <h1 id="about-hero-title" className="mt-4 max-w-[620px] text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-primary sm:text-5xl lg:text-[56px]">Đồng hành cùng quyết định chăm sóc vật nuôi</h1>
            <p className="mt-5 max-w-[555px] text-[15px] leading-7 text-[#405c68] md:text-base">Vet Medicine 68 xây dựng catalogue dễ tra cứu, giúp bạn kiểm tra sản phẩm theo công ty phân phối, danh mục và đối tượng sử dụng trước khi liên hệ đặt hàng.</p>
            <Button className="action-button mt-7 h-13 rounded-full px-6 text-base font-extrabold shadow-[3px_4px_0_rgba(6,45,62,0.12)]" size="lg" asChild><Link href="/san-pham">Xem danh mục sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
          <div className="relative min-h-[330px] self-stretch md:min-h-[470px]">
            <span className="about-hero-loop about-hero-loop-top hidden md:block" aria-hidden="true" />
            <div className="about-hero-photo absolute inset-x-[5%] bottom-4 top-2 md:left-[10%] md:right-[8%] md:bottom-8 md:top-6">
              <div className="about-hero-photo-inner"><Image src="/images/home/hero-vet-dog.png" alt="Bác sĩ thú y đang chăm sóc chó golden retriever" fill priority sizes="(max-width: 768px) 94vw, 52vw" className="object-cover object-center" /></div>
            </div>
            <Heart className="about-hero-heart hidden md:block" strokeWidth={2.6} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="about-story-section" aria-labelledby="brand-story-title">
        <div className="site-container grid items-center gap-8 py-14 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-18 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="brand-story-photo relative aspect-[4/3] overflow-hidden"><Image src="/images/home/brand-story-vet-team.png" alt="Đội ngũ thú y và người nuôi cùng chăm sóc chó tại phòng khám" fill sizes="(max-width: 768px) 100vw, 44vw" className="object-cover" /></div>
          <div>
            <p className="font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-petshop-teal">Câu chuyện thương hiệu</p>
            <h2 id="brand-story-title" className="mt-3 max-w-xl text-3xl font-extrabold leading-[1.05] tracking-[-0.045em] text-primary md:text-[42px]">Để mỗi lần tra cứu bắt đầu bằng một thông tin rõ ràng</h2>
            <div className="mt-5 max-w-2xl space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
              <p>Vet Medicine 68 được xây dựng từ một nhu cầu rất thực tế: giúp người nuôi, phòng khám và đơn vị chăn nuôi tìm đúng sản phẩm trước khi liên hệ tư vấn.</p>
              <p>Chúng tôi tổ chức catalogue theo công ty phân phối, danh mục, vật nuôi và trạng thái giá để cuộc trao đổi sau đó ngắn gọn, dễ kiểm tra hơn.</p>
            </div>
            <div className="brand-story-stats mt-7 grid grid-cols-3 divide-x divide-[#e8ddc3] border-t border-[#e8ddc3] pt-5">
              <BrandStat icon={HeartPulse} value="Đang cập nhật" label="Năm thành lập" />
              <BrandStat icon={UsersRound} value="Đang cập nhật" label="Khách hàng tin tưởng" />
              <BrandStat icon={ClipboardCheck} value={`${productCount}+`} label="Sản phẩm đang phân phối" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section" aria-labelledby="core-values-title">
        <div className="site-container relative z-10 py-15 md:py-20 lg:py-24">
          <div className="max-w-2xl"><p className="font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-petshop-yellow">Giá trị cốt lõi</p><h2 id="core-values-title" className="mt-3 text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] text-white md:text-[46px]">Bốn điều Vet68 đặt vào mỗi lần tư vấn</h2></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(([Icon, title, body], index) => <article key={title} className={`about-value-card ${index % 2 ? "about-value-card-warm" : ""}`}><span className="flex size-12 items-center justify-center rounded-full bg-petshop-cream text-primary"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 text-lg font-extrabold text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-[#526b78]">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="about-mission-section" aria-labelledby="mission-title">
        <div className="site-container grid items-center gap-10 py-14 md:grid-cols-[1.04fr_0.96fr] md:gap-12 md:py-18 lg:gap-16">
          <div>
            <p className="font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-medical-red">Sứ mệnh</p>
            <h2 id="mission-title" className="mt-3 max-w-[680px] text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] text-primary md:text-[46px]">Làm cho thông tin thú y dễ dùng hơn mỗi ngày</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Vet68 không cố làm thay công việc của bác sĩ thú y hay nhà sản xuất. Vai trò của chúng tôi là chuẩn bị một điểm bắt đầu đáng tin cậy để bạn biết mình cần hỏi gì tiếp theo.</p>
            <ul className="mt-7 grid gap-3">{missionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-foreground"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-medical-red" aria-hidden="true" />{point}</li>)}</ul>
            <Button className="action-button mt-8 h-11 rounded-full px-5" asChild><Link href="/lien-he"><MessageCircle aria-hidden="true" /> Liên hệ Vet68</Link></Button>
          </div>
          <div className="about-mission-photo relative order-first aspect-[4/3] overflow-hidden md:order-none"><Image src="/images/demo/animal-dogs.jpg" alt="Hai chú chó trong nhóm vật nuôi Vet68 chăm sóc" fill sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" /></div>
        </div>
      </section>

      <section className="about-policy-section" aria-labelledby="sales-policy-title">
        <div className="site-container relative z-10 py-14 md:py-18 lg:py-20">
          <div className="max-w-2xl"><p className="font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-medical-red">Chính sách bán hàng</p><h2 id="sales-policy-title" className="mt-3 text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] text-primary md:text-[46px]">Để mỗi lần mua hàng rõ ràng hơn</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">Các chính sách cụ thể sẽ được Vet68 xác nhận theo từng sản phẩm, quy cách và thời điểm liên hệ.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salesPolicies.map(([Icon, title, body]) => <article key={title} className="about-policy-card"><span className="flex size-11 items-center justify-center rounded-full bg-white text-medical-red"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 text-lg font-extrabold text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
          </div>
        </div>
      </section>
    </div>
  );
}

function BrandStat({ icon: Icon, value, label }: { icon: typeof HeartPulse; value: string; label: string }) {
  return <div className="flex flex-col items-center gap-1 px-2 text-center"><Icon className="size-6 text-petshop-teal" strokeWidth={1.7} aria-hidden="true" /><strong className="mt-1 text-sm font-extrabold text-primary sm:text-base">{value}</strong><span className="text-[10px] leading-4 text-muted-foreground sm:text-xs">{label}</span></div>;
}
