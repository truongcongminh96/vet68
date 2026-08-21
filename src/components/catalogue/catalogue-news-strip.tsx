import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import type { Post } from "@/types/catalogue";

export function CatalogueNewsStrip({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section aria-label="Kiến thức thú y liên quan" className="mt-12 border-t border-[#f0e6da] pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-main-green/10 text-main-green">
            <Sparkles className="size-5 text-price-orange" />
          </div>
          <div>
            <h2 className="font-playfair text-xl font-bold uppercase tracking-tight text-main-green sm:text-2xl">
              Cẩm Nang & Kiến Thức Liên Quan
            </h2>
            <p className="text-xs text-muted-foreground">
              Hướng dẫn phòng và điều trị bệnh, kỹ thuật sử dụng thuốc thú y an toàn
            </p>
          </div>
        </div>

        <Link
          href="/kien-thuc-thu-y"
          className="inline-flex items-center gap-1.5 rounded-full border border-main-green/20 bg-white px-4 py-1.5 text-xs font-bold text-main-green shadow-xs transition-all hover:bg-main-green hover:text-white"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#eaf0ec] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-main-green/30 hover:shadow-[0_12px_28px_rgba(31,74,58,0.08)]"
          >
            <Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#faf8f5]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Calendar className="size-3.5 text-price-orange" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </time>
              </div>

              <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-main-green">
                <Link href={`/kien-thuc-thu-y/${post.slug}`}>{post.title}</Link>
              </h3>

              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4">
                <Link
                  href={`/kien-thuc-thu-y/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-main-green transition-colors hover:text-price-orange"
                >
                  <span>Đọc tiếp</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
