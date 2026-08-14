"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { readPostPreview, type PostPreviewDraft } from "@/lib/admin/preview";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function PostPreviewButton() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [draft, setDraft] = useState<PostPreviewDraft | null>(null);
  const [open, setOpen] = useState(false);

  function preview(button: HTMLButtonElement) {
    if (!button.form) return;
    setDraft(readPostPreview(new FormData(button.form)));
    setOpen(true);
  }

  const coverUrl = draft?.coverPath
    ? draft.coverPath.startsWith("/") || /^https?:\/\//.test(draft.coverPath)
      ? draft.coverPath
      : supabase.storage.from("article-covers").getPublicUrl(draft.coverPath).data.publicUrl
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" onClick={(event) => preview(event.currentTarget)}><Eye aria-hidden="true" /> Xem trước</Button>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader><DialogTitle>Bản xem trước bài viết</DialogTitle><DialogDescription>Dữ liệu lấy trực tiếp từ form hiện tại và chưa được xuất bản.</DialogDescription></DialogHeader>
        {draft ? (
          <article className="rounded-xl bg-background p-4 sm:p-7">
            <header className="mx-auto max-w-3xl text-center">
              <p className="paper-eyebrow">Bản xem trước · Chưa công khai</p>
              <h1 className="paper-heading mt-4 text-3xl md:text-5xl">{draft.title}</h1>
              <p className="mt-5 text-base leading-7 text-muted-foreground">{draft.excerpt}</p>
            </header>
            {coverUrl ? <div className="paper-hero-photo relative mx-auto mt-8 aspect-[16/8] max-w-4xl"><Image src={coverUrl} alt={draft.coverAlt} fill unoptimized sizes="900px" className="object-cover" /></div> : <div className="mx-auto mt-8 flex aspect-[16/8] max-w-4xl items-center justify-center rounded-xl border border-dashed text-muted-foreground">Chưa chọn ảnh bìa</div>}
            <div className="article-content mx-auto mt-10 max-w-3xl text-base leading-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{draft.content}</ReactMarkdown>
            </div>
          </article>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
