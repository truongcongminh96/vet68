import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/catalogue/queries";

export const metadata: Metadata = { title: "Kiến thức thú y", description: "Bài viết tham khảo về cách đọc thông tin sản phẩm, chuẩn bị câu hỏi tư vấn và bảo quản sản phẩm thú y.", alternates: { canonical: "/kien-thuc-thu-y" } };

export default async function KnowledgePage() {
  const posts = await getPosts();
  return <div className="site-container section-space"><div className="max-w-3xl"><h1 className="text-4xl font-bold tracking-[-0.04em] text-primary md:text-5xl">Kiến thức thú y</h1><p className="mt-4 leading-7 text-muted-foreground">Nội dung giáo dục giúp khách hàng chuẩn bị thông tin tốt hơn. Bài viết không thay thế chẩn đoán hoặc tư vấn của bác sĩ thú y.</p></div><div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-action hover:retail-card-shadow"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[3/2] overflow-hidden bg-soft-blue"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={post.coverImage.endsWith(".svg") ? "object-contain p-3 transition-transform duration-200 hover:scale-[1.025]" : "object-cover transition-transform duration-200 hover:scale-[1.025]"} /></Link><div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold text-muted-foreground">{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))} | {post.readingMinutes} phút đọc</p><h2 className="mt-2 text-xl font-bold leading-7"><Link href={`/kien-thuc-thu-y/${post.slug}`} className="hover:text-primary">{post.title}</Link></h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><Button variant="ghost" className="mt-auto justify-start px-0 pt-5 text-primary" asChild><Link href={`/kien-thuc-thu-y/${post.slug}`}>Đọc bài viết <ArrowRight aria-hidden="true" /></Link></Button></div></article>)}</div></div>;
}
