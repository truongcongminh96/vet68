import type { Viewport } from "next";
import { FloatingContactControls } from "@/components/contact/floating-contact-controls";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const viewport: Viewport = { themeColor: "#FFFFFF", colorScheme: "light" };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-storefront flex min-h-full flex-1 flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContactControls />
    </div>
  );
}
