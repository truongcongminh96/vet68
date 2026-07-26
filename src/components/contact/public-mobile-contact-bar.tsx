"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTelephoneUrl } from "@/lib/contact";

export function PublicMobileContactBar({ phone, zaloUrl }: { phone: string; zaloUrl: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isProductDetail = segments[0] === "san-pham" && segments.length === 2;

  if (isProductDetail) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/96 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(8,59,89,0.08)] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" className="h-11" asChild>
          <a href={getTelephoneUrl(phone)}><Phone aria-hidden="true" /> Gọi ngay</a>
        </Button>
        <Button size="lg" className="action-button h-11" asChild>
          <a href={zaloUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Tư vấn Zalo</a>
        </Button>
      </div>
    </div>
  );
}
