"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";

export function FloatingControls() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside aria-label="Hỗ trợ và thao tác nhanh" className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Floating Speed Dial (Zalo & Phone) */}
      <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
        <a
          href="https://zalo.me/0909000068"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 rounded-full bg-[#0068ff] p-3 text-white shadow-[0_8px_25px_rgba(0,104,255,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,104,255,0.55)]"
          aria-label="Tư vấn phác đồ qua Zalo"
          title="Chat Zalo Tư Vấn"
        >
          <MessageCircle className="size-5 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs group-hover:pr-2">
            Chat Zalo tư vấn
          </span>
        </a>

        <a
          href="tel:0909000068"
          className="group flex items-center gap-2 rounded-full bg-main-green p-3 text-white shadow-[0_8px_25px_rgba(31,74,58,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#163b2e]"
          aria-label="Gọi hotline hỗ trợ 24/7"
          title="Hotline: 0909 000 068"
        >
          <Phone className="size-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-xs group-hover:pr-2">
            Hotline: 0909 000 068
          </span>
        </a>
      </div>

      {/* Back To Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
        className={`pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/20 bg-main-green text-white shadow-[0_6px_20px_rgba(31,74,58,0.35)] transition-all duration-300 hover:bg-[#163b2e] hover:scale-110 active:scale-95 ${
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-6 pointer-events-none opacity-0"
        }`}
      >
        <ArrowUp className="size-5" />
      </button>
    </aside>
  );
}
