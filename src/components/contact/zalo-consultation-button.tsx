"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ZaloConsultationButton({ zaloUrl, message, className, size = "default", label = "Tư vấn qua Zalo" }: { zaloUrl: string; message: string; className?: string; size?: "default" | "sm" | "lg"; label?: string }) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "manual">("idle");

  async function handleClick() {
    window.open(zaloUrl, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(message);
      setFeedback("copied");
      window.setTimeout(() => setFeedback("idle"), 3500);
    } catch {
      setFeedback("manual");
    }
  }

  async function copyFromDialog() {
    try {
      await navigator.clipboard.writeText(message);
      setFeedback("copied");
      window.setTimeout(() => setFeedback("idle"), 3500);
    } catch {
      setFeedback("manual");
    }
  }

  return (
    <>
      <Button type="button" size={size} onClick={handleClick} className={cn("whitespace-nowrap", className)}>
        {feedback === "copied" ? <Check aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        {feedback === "copied" ? "Đã sao chép lời nhắn" : label}
      </Button>
      <span className="sr-only" aria-live="polite">{feedback === "copied" ? "Nội dung tư vấn đã được sao chép. Zalo đang mở trong tab mới." : ""}</span>
      <Dialog open={feedback === "manual"} onOpenChange={(open) => !open && setFeedback("idle")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sao chép nội dung tư vấn</DialogTitle>
            <DialogDescription>Trình duyệt chưa cho phép tự động sao chép. Hãy sao chép nội dung dưới đây rồi gửi trong Zalo.</DialogDescription>
          </DialogHeader>
          <Textarea value={message} readOnly rows={6} aria-label="Nội dung tư vấn sản phẩm" />
          <Button type="button" onClick={copyFromDialog}>
            <Copy aria-hidden="true" /> Sao chép
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
