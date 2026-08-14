"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { readBannerPreview, type BannerPreviewDraft } from "@/lib/admin/preview";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function BannerPreviewButton() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [draft, setDraft] = useState<BannerPreviewDraft | null>(null);
  const [open, setOpen] = useState(false);

  function preview(button: HTMLButtonElement) {
    if (!button.form) return;
    setDraft(readBannerPreview(new FormData(button.form)));
    setOpen(true);
  }

  function imageUrl(path: string) {
    if (!path) return "";
    if (path.startsWith("/") || /^https?:\/\//.test(path)) return path;
    return supabase.storage.from("banners").getPublicUrl(path).data.publicUrl;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" onClick={(event) => preview(event.currentTarget)}><Eye aria-hidden="true" /> Xem trước</Button>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader><DialogTitle>Bản xem trước banner</DialogTitle><DialogDescription>Kiểm tra ảnh desktop/mobile, bố cục và link đích trước khi bật hiển thị.</DialogDescription></DialogHeader>
        {draft ? (
          <Tabs defaultValue="desktop">
            <TabsList><TabsTrigger value="desktop">Desktop</TabsTrigger><TabsTrigger value="mobile">Mobile</TabsTrigger></TabsList>
            <TabsContent value="desktop"><BannerCanvas draft={draft} imageUrl={imageUrl(draft.desktopPath)} mobile={false} /></TabsContent>
            <TabsContent value="mobile"><div className="mx-auto max-w-[390px]"><BannerCanvas draft={draft} imageUrl={imageUrl(draft.mobilePath || draft.desktopPath)} mobile /></div></TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function BannerCanvas({ draft, imageUrl, mobile }: { draft: BannerPreviewDraft; imageUrl: string; mobile: boolean }) {
  return (
    <section className={`relative overflow-hidden rounded-xl border bg-[#07384a] ${mobile ? "aspect-[4/5]" : "aspect-[16/7]"}`}>
      {imageUrl ? <Image src={imageUrl} alt={draft.imageAlt} fill unoptimized sizes={mobile ? "390px" : "1000px"} className="object-cover opacity-65" /> : <div className="absolute inset-0 grid place-items-center text-white/60">Chưa chọn ảnh</div>}
      <div className="absolute inset-0 bg-gradient-to-r from-[#062d3e]/95 via-[#062d3e]/60 to-transparent" />
      <div className={`relative z-10 flex h-full max-w-xl flex-col justify-center text-white ${mobile ? "p-6" : "p-10"}`}>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffcf38]">{placementLabel(draft.placement)}</p>
        <h2 className={`mt-3 font-heading font-extrabold leading-tight ${mobile ? "text-3xl" : "text-4xl"}`}>{draft.title}</h2>
        <p className="mt-4 max-w-lg leading-7 text-white/80">{draft.subtitle}</p>
        {draft.linkUrl ? <a href={draft.linkUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#ffcf38] px-5 py-3 font-bold text-[#07384a]">Kiểm tra link <ExternalLink className="size-4" aria-hidden="true" /></a> : <p className="mt-5 text-sm font-semibold text-white/60">Chưa nhập link đích</p>}
      </div>
    </section>
  );
}

function placementLabel(placement: BannerPreviewDraft["placement"]) {
  return placement === "home_hero" ? "Hero trang chủ" : placement === "home_promotion" ? "Banner trang chủ" : "Trang khuyến mãi";
}
