import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/catalogue/queries";

export const metadata: Metadata = { title: "Kiến thức thú y", description: "Bài viết tham khảo về cách đọc thông tin sản phẩm, chuẩn bị câu hỏi tư vấn và bảo quản sản phẩm thú y.", alternates: { canonical: "/kien-thuc-thu-y" } };

export default async function KnowledgePage() {
  const posts = await getPosts();
  return (
    <div className="paper-page">
      <section className="paper-hero">
        <div className="site-container grid min-h-[370px] items-center gap-8 py-10 md:min-h-[430px] md:grid-cols-[1fr_.9fr] md:py-12 lg:gap-14">
          <div className="relative z-10"><span className="hero-ray-mark" aria-hidden="true" /><p className="paper-eyebrow">Tài liệu tham khảo</p><h1 className="paper-heading mt-4 max-w-[650px] text-[2.45rem] sm:text-5xl lg:text-[58px]">Kiến thức thú y dễ đọc, dễ kiểm tra</h1><p className="mt-5 max-w-[570px] text-[15px] leading-7 text-[#405c68] md:text-base">Các bài viết giúp bạn chuẩn bị thông tin trước khi trao đổi với nhà cung cấp hoặc bác sĩ thú y.</p></div>
          <div className="paper-hero-photo relative aspect-[4/3]"><Image src="/images/home/brand-story-vet-team.png" alt="Đội ngũ thú y trao đổi cùng người nuôi tại phòng khám" fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" /></div>
        </div>
      </section>
      <section className="site-container py-12 md:py-16 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="paper-eyebrow">Bài viết mới</p><h2 className="paper-heading mt-2 text-3xl md:text-[42px]">Ghi lại điều cần biết</h2></div><p className="max-w-lg text-sm leading-6 text-muted-foreground">Thông tin trong bài viết mang tính tham khảo và không thay thế chẩn đoán hoặc hướng dẫn từ nhà sản xuất.</p></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="paper-article-card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[3/2] overflow-hidden bg-petshop-cream"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={post.coverImage.endsWith(".svg") ? "object-contain p-5 transition-transform duration-200 group-hover:scale-[1.04]" : "object-cover transition-transform duration-200 group-hover:scale-[1.04]"} /></Link><div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-2 text-xs font-semibold text-petshop-teal"><BookOpen className="size-4" aria-hidden="true" />{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))} · {post.readingMinutes} phút đọc</div><h2 className="mt-3 text-xl font-extrabold leading-7 text-primary"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-medical-red">{post.title}</Link></h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><Button variant="ghost" className="mt-auto justify-start px-0 pt-5 font-extrabold text-medical-red hover:bg-transparent hover:text-medical-red" asChild><Link href={`/kien-thuc-thu-y/${post.slug}`}>Đọc bài viết <ArrowRight aria-hidden="true" /></Link></Button></div></article>)}</div>
      </section>
    </div>
  );
}
