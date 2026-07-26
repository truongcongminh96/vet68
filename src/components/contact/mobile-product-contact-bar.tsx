import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZaloConsultationButton } from "@/components/contact/zalo-consultation-button";
import { getTelephoneUrl } from "@/lib/contact";

export function MobileProductContactBar({ phone, zaloUrl, message }: { phone: string; zaloUrl: string; message: string }) {
  return <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden"><div className="grid grid-cols-2 gap-2"><Button variant="outline" size="lg" asChild><a href={getTelephoneUrl(phone)}><Phone aria-hidden="true" /> Gọi Vet68</a></Button><ZaloConsultationButton zaloUrl={zaloUrl} message={message} size="lg" label="Tư vấn qua Zalo" /></div></div>;
}
