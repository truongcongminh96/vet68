import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Vet Medicine 68, về trang chủ">
      <Image
        src={compact ? "/brand/vet-medicine-68-mark.png" : "/brand/vet-medicine-68-logo-header.png"}
        alt="Vet Medicine 68"
        width={compact ? 260 : 600}
        height={compact ? 260 : 330}
        priority
        className={compact ? "h-11 w-11 rounded-lg object-contain" : "h-auto w-[154px] object-contain sm:w-[176px]"}
      />
    </Link>
  );
}
