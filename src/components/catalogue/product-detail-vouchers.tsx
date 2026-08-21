"use client";

import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";

type Voucher = {
  code: string;
  discount: string;
  maxDiscount?: string;
  minOrder: string;
};

const defaultVouchers: Voucher[] = [
  {
    code: "VET68VIP",
    discount: "Giảm 10%",
    maxDiscount: "Tối đa 100.000đ",
    minOrder: "Đơn từ 699.000đ",
  },
  {
    code: "VET68PRO",
    discount: "Giảm 20%",
    maxDiscount: "Tối đa 200.000đ",
    minOrder: "Đơn từ 1.299.000đ",
  },
  {
    code: "FREESHIP",
    discount: "Giảm 30.000đ",
    minOrder: "Đơn từ 399.000đ",
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
    <div className="mt-5">
      {/* Header */}
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#20212b] sm:text-sm">
        Mã Giảm Giá
      </h3>

      {/* Voucher Horizontal Strip (Wolf Yoga Style) */}
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {defaultVouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;
          return (
            <div
              key={voucher.code}
              className="flex flex-col justify-between rounded-xl border border-[#e2ebe2] bg-[#f7f9f7] p-3 transition-all hover:border-main-green/40 hover:shadow-xs"
            >
              <div>
                <span className="text-xs font-bold text-main-green">
                  {voucher.code}
                </span>
                <p className="mt-1 text-xs font-semibold text-[#20212b]">
                  {voucher.discount}
                </p>
                {voucher.maxDiscount && (
                  <p className="text-[11px] text-[#5e6973]">
                    {voucher.maxDiscount}
                  </p>
                )}
                <p className="text-[10px] text-[#5e6973]/80">
                  {voucher.minOrder}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(voucher.code)}
                className={`mt-2.5 flex w-full items-center justify-center gap-1 rounded-md py-1 text-xs font-bold transition-all ${
                  isCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#e2ebe2] text-main-green hover:bg-main-green hover:text-white"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="size-3" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <span>Sao chép</span>
                )}
              </button>
            </div>
          );
        })}

        {/* 4th Card: "Xem thêm mã giảm giá" */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#d0ded0] bg-[#fafcf9] p-3 text-center transition-colors hover:border-main-green hover:bg-[#f0f6f0] cursor-pointer">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf2ea] text-main-green mb-1.5">
            <Tag className="size-4.5" />
          </div>
          <span className="text-xs font-bold text-main-green leading-snug">
            Xem thêm<br />mã giảm giá
          </span>
        </div>
      </div>
    </div>
  );
}
