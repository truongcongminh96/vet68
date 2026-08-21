import { PublicMobileContactBar } from "@/components/contact/public-mobile-contact-bar";
import { getContactSettings } from "@/lib/contact-settings";

export async function FloatingContactControls() {
  const contact = await getContactSettings();
  return <PublicMobileContactBar phone={contact.phone} zaloUrl={contact.zaloUrl} />;
}
