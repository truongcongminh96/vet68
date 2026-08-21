"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "18",
    minutes: "45",
    seconds: "30",
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
    <div className="flex items-center gap-2 self-start rounded-2xl bg-white p-2 shadow-xs sm:self-auto">
      <div className="hidden items-center gap-1.5 px-2 text-xs font-bold text-main-green uppercase tracking-wider md:flex">
        <Timer className="size-4 text-price-orange" />
        <span>Kết thúc sau:</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col items-center rounded-xl bg-main-green px-2.5 py-1 text-white shadow-xs">
          <span className="font-mono text-sm font-bold sm:text-base">{timeLeft.days}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-80">Ngày</span>
        </div>
        <span className="font-bold text-main-green">:</span>
        <div className="flex flex-col items-center rounded-xl bg-main-green px-2.5 py-1 text-white shadow-xs">
          <span className="font-mono text-sm font-bold sm:text-base">{timeLeft.hours}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-80">Giờ</span>
        </div>
        <span className="font-bold text-main-green">:</span>
        <div className="flex flex-col items-center rounded-xl bg-main-green px-2.5 py-1 text-white shadow-xs">
          <span className="font-mono text-sm font-bold sm:text-base">{timeLeft.minutes}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-80">Phút</span>
        </div>
        <span className="font-bold text-main-green">:</span>
        <div className="flex flex-col items-center rounded-xl bg-price-orange px-2.5 py-1 text-white shadow-xs">
          <span className="font-mono text-sm font-bold sm:text-base">{timeLeft.seconds}</span>
          <span className="text-[9px] uppercase tracking-wider opacity-80">Giây</span>
        </div>
      </div>
    </div>
  );
}
