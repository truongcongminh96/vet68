import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-3" aria-label="Vet Medicine 68, về trang chủ">
      <Image
        src="/brand/vet-medicine-68-mark.png"
        alt=""
        width={260}
        height={260}
        priority
        className={compact ? "h-11 w-11 rounded-full object-contain" : "h-14 w-14 rounded-full object-contain"}
      />
      <span className="block">
        <span className={`block whitespace-nowrap font-heading font-extrabold tracking-[-0.035em] ${inverted ? "text-white" : "text-primary"} ${compact ? "text-[14px] min-[390px]:text-[16px] sm:text-[18px]" : "text-[16px] sm:text-[18px]"}`}>
          VET MEDICINE <span className={inverted ? "text-petshop-yellow" : "text-medical-red"}>68</span>
        </span>
      </span>
    </Link>
  );
}
