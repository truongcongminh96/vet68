"use client";

import { useState } from "react";
import { Check, Copy, Tag, TicketPercent } from "lucide-react";

type Voucher = {
  code: string;
  title: string;
  condition: string;
  note: string;
};

const defaultVouchers: Voucher[] = [
  {
    code: "VET68VIP",
    title: "Giảm 10%",
    condition: "Tối đa 100.000đ",
    note: "Đơn từ 699.000đ",
  },
  {
    code: "FREESHIP",
    title: "Freeship Toàn Quốc",
    condition: "Hỗ trợ 30.000đ ship",
    note: "Đơn từ 500.000đ",
  },
  {
    code: "TRANGTRAI",
    title: "Chiết Khấu Đại Lý",
    condition: "Ưu đãi trang trại & trại nuôi",
    note: "Đơn sỉ số lượng lớn",
  },
];

export function ProductDetailVouchers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="rounded-3xl border border-[#f7ebde] bg-[#faf9f2] p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-main-green">
        <TicketPercent className="size-4 text-price-orange" />
        <span>Mã Ưu Đãi & Khuyến Mãi</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {defaultVouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;
          return (
            <div
              key={voucher.code}
              className="flex flex-col justify-between rounded-2xl border border-[#eaf0ec] bg-white p-3 shadow-2xs transition-all hover:border-price-orange/40 hover:shadow-xs"
            >
              <div>
                <span className="inline-block rounded-md bg-main-green/10 px-2 py-0.5 font-mono text-xs font-bold uppercase text-main-green">
                  {voucher.code}
                </span>
                <p className="mt-1.5 text-xs font-bold text-price-orange">{voucher.title}</p>
                <p className="text-[11px] text-muted-foreground">{voucher.condition}</p>
                <p className="text-[10px] text-muted-foreground/80">{voucher.note}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(voucher.code)}
                className={`mt-2.5 flex items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] font-bold transition-all ${
                  isCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#faf3ea] text-main-green hover:bg-main-green hover:text-white"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="size-3" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
