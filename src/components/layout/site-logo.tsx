import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="Vet Medicine 68, về trang chủ">
      <Image
        src="/brand/vet-medicine-68-mark.png"
        alt=""
        width={260}
        height={260}
        priority
        className={compact ? "h-11 w-11 rounded-full object-contain" : "h-13 w-13 rounded-full object-contain"}
      />
      {compact ? null : (
        <span className="leading-none">
          <span className="block font-heading text-[17px] font-extrabold tracking-[-0.03em] text-primary">VET MEDICINE</span>
          <span className="mt-1 block font-heading text-[14px] font-bold tracking-[0.2em] text-medical-red">68</span>
        </span>
      )}
    </Link>
  );
}
