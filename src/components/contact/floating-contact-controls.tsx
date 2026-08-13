import { MessageCircle } from "lucide-react";
import { PublicMobileContactBar } from "@/components/contact/public-mobile-contact-bar";
import { getContactSettings } from "@/lib/contact-settings";

export async function FloatingContactControls() {
  const contact = await getContactSettings();
  return (
    <>
      <div className="group fixed bottom-6 right-6 z-20 hidden md:block" aria-label="Liên hệ nhanh">
        <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="flex h-13 items-center overflow-hidden rounded-full border-2 border-white bg-petshop-teal px-4 text-white petshop-card-shadow transition-[transform,box-shadow] hover:bg-[#128794] active:scale-[0.98]" aria-label="Mở Zalo Vet Medicine 68">
          <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
          <span className="ms-2 max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-[max-width,opacity] duration-200 group-hover:max-w-32 group-hover:opacity-100 group-focus-within:max-w-32 group-focus-within:opacity-100">Tư vấn Zalo</span>
        </a>
      </div>
      <PublicMobileContactBar phone={contact.phone} zaloUrl={contact.zaloUrl} />
    </>
  );
}
