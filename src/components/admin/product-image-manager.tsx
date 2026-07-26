"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export function ProductImageManager({ productId, initialImages }: { productId: string; initialImages: ProductImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [pending, startTransition] = useTransition();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const publicUrl = (path: string) => supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;

  function upload() {
    const normalizedAlt = altText.trim();
    if (!file?.size) return setMessage("Vui lòng chọn ảnh.");
    if (!normalizedAlt) return setMessage("Vui lòng nhập alt text có ý nghĩa.");
    if (file.size > 8 * 1024 * 1024) return setMessage("Ảnh không được vượt quá 8 MB.");
    if (!file.type.startsWith("image/")) return setMessage("Tệp đã chọn không phải hình ảnh.");

    startTransition(async () => {
      setMessage("");
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const storagePath = `${productId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(storagePath, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) return setMessage(uploadError.message);

      const { data, error } = await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: storagePath,
        alt_text: normalizedAlt,
        sort_order: images.length,
        is_primary: images.length === 0,
      }).select("*").single();

      if (error || !data) {
        await supabase.storage.from("product-images").remove([storagePath]);
        return setMessage(error?.message ?? "Không thể lưu thông tin ảnh.");
      }
      setImages((current) => [...current, data]);
      setFile(null);
      setAltText("");
      setMessage("Đã tải ảnh lên.");
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((image, sortOrder) => ({ ...image, sort_order: sortOrder }));
    setImages(reordered);
    startTransition(async () => {
      const results = await Promise.all(reordered.map((image) => supabase.from("product_images").update({ sort_order: image.sort_order }).eq("id", image.id)));
      if (results.some((result) => result.error)) setMessage("Không thể lưu thứ tự ảnh. Hãy tải lại trang và thử lại.");
      else setMessage("Đã cập nhật thứ tự ảnh.");
    });
  }

  function makePrimary(id: string) {
    startTransition(async () => {
      const currentPrimary = images.find((image) => image.is_primary);
      if (currentPrimary?.id === id) return;
      if (currentPrimary) await supabase.from("product_images").update({ is_primary: false }).eq("id", currentPrimary.id);
      const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", id);
      if (error) return setMessage(error.message);
      setImages((current) => current.map((image) => ({ ...image, is_primary: image.id === id })));
      setMessage("Đã chọn ảnh đại diện.");
    });
  }

  function remove(image: ProductImage) {
    if (!window.confirm(`Xóa ảnh "${image.alt_text}"?`)) return;
    startTransition(async () => {
      const { error } = await supabase.from("product_images").delete().eq("id", image.id);
      if (error) return setMessage(error.message);
      await supabase.storage.from("product-images").remove([image.storage_path]);
      const remaining = images.filter((item) => item.id !== image.id);
      setImages(remaining);
      setMessage("Đã xóa ảnh.");
      if (image.is_primary && remaining[0]) makePrimary(remaining[0].id);
    });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-lg border p-4">
        <div className="grid gap-2"><Label htmlFor="product-image-file">Tệp ảnh</Label><Input id="product-image-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></div>
        <div className="grid gap-2"><Label htmlFor="product-image-alt">Alt text</Label><Input id="product-image-alt" value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={240} placeholder="Mô tả đúng nội dung ảnh sản phẩm" /></div>
        <Button type="button" variant="outline" disabled={pending} onClick={upload}>{pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ImagePlus aria-hidden="true" />} Tải ảnh lên</Button>
      </div>
      {images.length ? <div className="grid gap-3">
        {images.map((image, index) => (
          <div key={image.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-lg border p-3">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted"><Image src={publicUrl(image.storage_path)} alt={image.alt_text} fill unoptimized sizes="72px" className="object-cover" /></div>
            <div className="min-w-0"><p className="line-clamp-2 text-sm font-semibold">{image.alt_text}</p>{image.is_primary ? <p className="mt-1 text-xs font-bold text-success">Ảnh đại diện</p> : null}<div className="mt-2 flex flex-wrap gap-1"><Button type="button" size="icon-sm" variant="outline" onClick={() => move(index, -1)} disabled={pending || index === 0} aria-label="Đưa ảnh lên"><ArrowUp aria-hidden="true" /></Button><Button type="button" size="icon-sm" variant="outline" onClick={() => move(index, 1)} disabled={pending || index === images.length - 1} aria-label="Đưa ảnh xuống"><ArrowDown aria-hidden="true" /></Button><Button type="button" size="icon-sm" variant="outline" onClick={() => makePrimary(image.id)} disabled={pending || image.is_primary} aria-label="Chọn làm ảnh đại diện"><Star aria-hidden="true" /></Button><Button type="button" size="icon-sm" variant="destructive" onClick={() => remove(image)} disabled={pending} aria-label="Xóa ảnh"><Trash2 aria-hidden="true" /></Button></div></div>
          </div>
        ))}
      </div> : <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">Sản phẩm chưa có hình ảnh.</p>}
      {message ? <p role="status" className="text-sm font-semibold text-muted-foreground">{message}</p> : null}
    </div>
  );
}
