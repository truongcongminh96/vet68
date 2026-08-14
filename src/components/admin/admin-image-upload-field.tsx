"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildAdminImagePath, DEFAULT_ADMIN_IMAGE_TYPES, validateAdminImageFile } from "@/lib/admin/image-upload";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminImageUploadField({
  id,
  name,
  label,
  bucket,
  folder,
  defaultValue = "",
  maxBytes,
  required = false,
  allowSvg = false,
}: {
  id: string;
  name: string;
  label: string;
  bucket: "category-images" | "animal-images" | "brand-logos" | "banners" | "article-covers";
  folder: string;
  defaultValue?: string | null;
  maxBytes: number;
  required?: boolean;
  allowSvg?: boolean;
}) {
  const [path, setPath] = useState(defaultValue ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const allowedTypes = allowSvg ? [...DEFAULT_ADMIN_IMAGE_TYPES, "image/svg+xml"] : DEFAULT_ADMIN_IMAGE_TYPES;
  const previewUrl = path
    ? path.startsWith("/") || /^https?:\/\//.test(path)
      ? path
      : supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    : "";

  function upload() {
    if (!file) return setMessage("Vui lòng chọn ảnh.");
    const validationMessage = validateAdminImageFile(file, maxBytes, allowedTypes);
    if (validationMessage) return setMessage(validationMessage);

    startTransition(async () => {
      setMessage("");
      const storagePath = buildAdminImagePath(file, folder);
      const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) return setMessage(error.message);

      setPath(storagePath);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Đã tải ảnh lên. Hãy lưu form để áp dụng ảnh này.");
    });
  }

  return (
    <div className="grid gap-3 rounded-lg border p-3">
      <div className="grid gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} name={name} value={path} readOnly aria-required={required} placeholder="Chưa có ảnh" />
      </div>
      {previewUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted">
          <Image src={previewUrl} alt="Xem trước ảnh đã chọn" fill unoptimized sizes="360px" className="object-contain" />
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor={`${id}-file`}>Chọn tệp {label.toLowerCase()}</Label>
        <Input
          ref={fileInputRef}
          id={`${id}-file`}
          type="file"
          accept={allowedTypes.join(",")}
          disabled={pending}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setMessage("");
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={pending || !file} onClick={upload}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ImagePlus aria-hidden="true" />}
          {pending ? "Đang tải..." : "Tải ảnh lên"}
        </Button>
        {path ? (
          <Button type="button" variant="ghost" disabled={pending} onClick={() => { setPath(""); setMessage("Đã bỏ chọn ảnh. Hãy lưu form để áp dụng."); }}>
            <X aria-hidden="true" /> Bỏ ảnh
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">Tối đa {formatMegabytes(maxBytes)}. Path được điền tự động sau khi upload.</p>
      {message ? <p role="status" className="text-sm font-semibold text-muted-foreground">{message}</p> : null}
    </div>
  );
}

function formatMegabytes(bytes: number) {
  return `${bytes / (1024 * 1024)} MB`;
}
