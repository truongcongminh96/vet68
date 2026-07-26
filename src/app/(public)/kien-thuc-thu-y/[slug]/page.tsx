import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { AlertTriangle } from "lucide-react";
import { getPostBySlug } from "@/lib/catalogue/queries";
import { absoluteUrl, serializeJsonLd, SITE_NAME } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/kien-thuc-thu-y/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt, images: [{ url: post.coverImage, alt: post.coverAlt }] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/vet-medicine-68-logo.png") } },
    mainEntityOfPage: absoluteUrl(`/kien-thuc-thu-y/${post.slug}`),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Kiến thức thú y", item: absoluteUrl("/kien-thuc-thu-y") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/kien-thuc-thu-y/${post.slug}`) },
    ],
  };

  return (
    <article className="site-container section-space">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <nav className="mb-6 flex gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/kien-thuc-thu-y">Kiến thức thú y</Link></nav>
      <header className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-primary">{new Intl.DateTimeFormat("vi-VN").format(new Date(post.publishedAt))} | {post.readingMinutes} phút đọc</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
      </header>
      <div className="relative mx-auto mt-8 aspect-[16/8] max-w-5xl overflow-hidden rounded-2xl bg-soft-blue"><Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(max-width: 1200px) 100vw, 1000px" className={post.coverImage.endsWith(".svg") ? "object-contain p-5" : "object-cover"} /></div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_280px]">
        <div className="article-content min-w-0 text-base leading-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              h2: ({ children }) => <h2 className="mb-4 mt-9 text-2xl font-extrabold">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-3 mt-7 text-xl font-bold">{children}</h3>,
              p: ({ children }) => <p className="mb-5 text-muted-foreground">{children}</p>,
              ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 ps-6 text-muted-foreground">{children}</ul>,
              ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 ps-6 text-muted-foreground">{children}</ol>,
              strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
              a: ({ href, children }) => <a href={href} className="font-semibold text-primary underline underline-offset-4">{children}</a>,
            }}
          >{post.content}</ReactMarkdown>
        </div>
        <aside className="h-fit rounded-xl border border-medical-red/30 bg-card p-5 lg:sticky lg:top-5">
          <AlertTriangle className="size-6 text-medical-red" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold">Lưu ý</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Thông tin trong bài viết mang tính tham khảo và không thay thế tư vấn của bác sĩ thú y hoặc hướng dẫn từ nhà sản xuất.</p>
        </aside>
      </div>
    </article>
  );
}
