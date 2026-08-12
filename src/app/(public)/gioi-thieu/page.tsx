import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, ClipboardCheck, FileCheck2, HeartHandshake, MessageCircle, PawPrint, RefreshCcw, Truck, WalletCards } from "lucide-react";
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
    <>
      <section className="border-b border-border bg-white py-4 sm:py-6 lg:py-8">
        <div className="site-container">
          <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-deep-navy retail-card-shadow sm:min-h-[590px]">
            <Image src="/images/home/hero-veterinary-products.jpg" alt="Nhân viên thú y đang chăm sóc và kiểm tra sức khỏe cho chó" fill priority sizes="(max-width: 1400px) 100vw, 1320px" className="object-cover object-[68%_center]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,250,252,0.98)_0%,rgba(247,250,252,0.92)_35%,rgba(247,250,252,0.32)_66%,rgba(247,250,252,0.04)_100%)] max-md:bg-[linear-gradient(180deg,rgba(247,250,252,0.96)_0%,rgba(247,250,252,0.78)_64%,rgba(6,42,64,0.52)_100%)]" />
            <div className="relative z-10 flex min-h-[520px] max-w-[650px] flex-col justify-between p-6 sm:min-h-[590px] sm:p-10 lg:p-14">
              <div>
                <p className="mb-4 font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Về Vet Medicine 68</p>
                <h1 className="text-4xl font-bold leading-[1.06] tracking-[-0.045em] text-primary sm:text-5xl lg:text-[58px]">Đồng hành cùng quyết định chăm sóc vật nuôi</h1>
                <p className="mt-5 max-w-[560px] text-base leading-7 text-[#385565] md:text-lg md:leading-8">Vet Medicine 68 xây dựng một catalogue dễ tra cứu, giúp khách hàng kiểm tra sản phẩm theo công ty phân phối, danh mục và đối tượng sử dụng trước khi liên hệ đặt hàng.</p>
              </div>
              <Button className="action-button h-12 w-fit px-5" size="lg" asChild><Link href="/san-pham">Xem danh mục sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-soft-blue retail-card-shadow">
            <Image src="/images/demo/article-care.jpg" alt="Chăm sóc và tư vấn sức khỏe vật nuôi" fill sizes="(max-width: 1024px) 100vw, 43vw" className="object-cover" />
          </div>
          <div>
            <p className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Câu chuyện thương hiệu</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-primary md:text-5xl">Từ nhu cầu tra cứu đến một cuộc tư vấn rõ ràng</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>Vet Medicine 68 được xây dựng với một mục tiêu thực tế: giúp người nuôi, phòng khám và đơn vị chăn nuôi tìm đúng sản phẩm trước khi đưa ra quyết định.</p>
              <p>Chúng tôi tổ chức lại thông tin theo công ty phân phối, danh mục, vật nuôi và trạng thái giá để cuộc trao đổi sau đó ngắn gọn, chính xác hơn.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-white py-5">
              <Stat icon={PawPrint} value="Đang cập nhật" label="Năm thành lập" />
              <Stat icon={HeartHandshake} value="Đang cập nhật" label="Khách hàng" />
              <Stat icon={ClipboardCheck} value={`${productCount}+`} label="Sản phẩm đang phân phối" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dbeaf0] bg-soft-blue">
        <div className="site-container section-space">
          <div className="mx-auto max-w-2xl text-center"><p className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Giá trị cốt lõi</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-primary md:text-5xl">Bốn điều Vet68 đặt vào mỗi lần tư vấn</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(([Icon, title, body]) => <article key={title} className="rounded-2xl border border-white bg-white p-6 retail-card-shadow"><span className="flex size-12 items-center justify-center rounded-full bg-soft-blue text-primary"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="site-container section-space">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Sứ mệnh</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-primary md:text-5xl">Làm cho thông tin thú y dễ dùng hơn mỗi ngày</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Vet68 không cố làm thay công việc của bác sĩ thú y hay nhà sản xuất. Vai trò của chúng tôi là chuẩn bị một điểm bắt đầu đáng tin cậy để bạn biết mình cần hỏi gì tiếp theo.</p>
            <ul className="mt-7 grid gap-4">{missionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-foreground"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#257493]" aria-hidden="true" />{point}</li>)}</ul>
            <Button className="action-button mt-8 h-11 px-5" asChild><Link href="/lien-he"><MessageCircle aria-hidden="true" /> Liên hệ Vet68</Link></Button>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-soft-blue retail-card-shadow lg:order-2"><Image src="/images/demo/animal-dogs.jpg" alt="Hai chú chó trong nhóm vật nuôi Vet68 chăm sóc" fill sizes="(max-width: 1024px) 100vw, 43vw" className="object-cover" /></div>
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="site-container section-space">
          <div className="max-w-2xl"><p className="font-heading text-sm font-extrabold uppercase tracking-[0.14em] text-[#257493]">Chính sách bán hàng</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-primary md:text-5xl">Để mỗi lần mua hàng rõ ràng hơn</h2><p className="mt-4 leading-7 text-muted-foreground">Các chính sách cụ thể sẽ được Vet68 xác nhận theo từng sản phẩm, quy cách và thời điểm liên hệ.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salesPolicies.map(([Icon, title, body]) => <article key={title} className="rounded-2xl border border-border bg-[#f7f9fa] p-6"><span className="flex size-11 items-center justify-center rounded-full bg-white text-primary"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof PawPrint; value: string; label: string }) {
  return <div className="flex flex-col items-center gap-2 px-2 text-center"><Icon className="size-5 text-[#257493]" aria-hidden="true" /><strong className="text-sm font-extrabold text-primary sm:text-base">{value}</strong><span className="text-[11px] leading-4 text-muted-foreground sm:text-xs">{label}</span></div>;
}
