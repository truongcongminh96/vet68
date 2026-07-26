import { MessageCircle, Phone } from "lucide-react";
import { getTelephoneUrl } from "@/lib/contact";
import { getContactSettings } from "@/lib/contact-settings";

export async function FloatingContactControls() {
  const contact = await getContactSettings();
  return (
    <div className="fixed bottom-5 right-5 z-20 hidden flex-col gap-2 md:flex" aria-label="Liên hệ nhanh">
      <a href={getTelephoneUrl(contact.phone)} className="flex size-12 items-center justify-center rounded-full border bg-card text-primary subtle-shadow transition-transform active:scale-[0.98]" aria-label={`Gọi Vet68 ${contact.phoneDisplay}`}><Phone aria-hidden="true" /></a>
      <a href={contact.zaloUrl} target="_blank" rel="noreferrer" className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground subtle-shadow transition-transform active:scale-[0.98]" aria-label="Mở Zalo Vet Medicine 68"><MessageCircle aria-hidden="true" /></a>
    </div>
  );
}
