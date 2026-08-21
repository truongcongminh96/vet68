"use client";

import { useEffect, useState } from "react";

export function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "04",
    minutes: "42",
    seconds: "47",
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 48);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/80 bg-white px-5 py-4 pt-5 shadow-[0_6px_24px_rgba(31,74,58,0.06)] sm:px-8 sm:py-5">
      {/* Top Attached Badge (Wolf Yoga Style) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-main-green px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs sm:text-xs">
        KẾT THÚC SAU
      </div>

      {/* 4 Large Serif Digits with Labels (No Colons) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-7">
        <div className="flex flex-col items-center">
          <span className="font-playfair text-2xl font-bold leading-none text-[#b84c1e] sm:text-3xl lg:text-[34px]">
            {timeLeft.days}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-wider text-[#33302f] uppercase sm:text-xs">
            NGÀY
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-playfair text-2xl font-bold leading-none text-[#b84c1e] sm:text-3xl lg:text-[34px]">
            {timeLeft.hours}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-wider text-[#33302f] uppercase sm:text-xs">
            GIỜ
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-playfair text-2xl font-bold leading-none text-[#b84c1e] sm:text-3xl lg:text-[34px]">
            {timeLeft.minutes}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-wider text-[#33302f] uppercase sm:text-xs">
            PHÚT
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-playfair text-2xl font-bold leading-none text-[#b84c1e] sm:text-3xl lg:text-[34px]">
            {timeLeft.seconds}
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-wider text-[#33302f] uppercase sm:text-xs">
            GIÂY
          </span>
        </div>
      </div>
    </div>
  );
}
