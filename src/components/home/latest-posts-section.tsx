import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/catalogue";

export function LatestPostsSection({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section aria-label="Kiến thức thú y và tin tức" className="py-8 lg:py-14">
      <div className="site-container">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-12">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-price-orange">
            <Sparkles className="size-3.5" /> Tin mới nhất
          </span>
          <h2 className="mt-2 font-playfair text-2xl font-bold tracking-tight text-main-green sm:text-3xl lg:text-4xl">
            Cập nhật <span className="text-price-orange italic font-normal">Kiến Thức Thú Y</span>
          </h2>
          <div className="mx-auto my-3 flex items-center justify-center gap-2">
            <div className="h-0.5 w-10 bg-price-orange/60" />
            <div className="size-1.5 rotate-45 bg-price-orange" />
            <div className="h-0.5 w-10 bg-main-green/30" />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Khám phá những bài viết hướng dẫn phòng trị bệnh, phác đồ dùng thuốc an toàn và cẩm nang dinh dưỡng hữu ích từ các bác sĩ thú y.
          </p>
        </div>

        {/* 4 Articles Grid (Wolf Yoga Blog Style) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {posts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#eaf0ec] bg-white shadow-[0_8px_25px_rgba(31,74,58,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-main-green/40 hover:shadow-[0_16px_35px_rgba(31,74,58,0.09)]"
            >
              {/* Article Thumbnail */}
              <Link href={`/kien-thuc-thu-y/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#faf8f5]">
                <Image
                  src={post.coverImage || "/images/demo/article-care.jpg"}
                  alt={post.coverAlt ?? post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Article Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Date Badge */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-price-orange">
                  <Calendar className="size-3.5" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-main-green transition-colors group-hover:text-price-orange sm:text-base">
                  <Link href={`/kien-thuc-thu-y/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Article Excerpt */}
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="mt-auto pt-4">
                  <Link
                    href={`/kien-thuc-thu-y/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-main-green transition-colors group-hover:text-price-orange"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Button
            asChild
            className="rounded-xl bg-main-green px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#163b2e]"
          >
            <Link href="/kien-thuc-thu-y" className="flex items-center gap-2">
              <span>Xem tất cả bài viết kiến thức</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
