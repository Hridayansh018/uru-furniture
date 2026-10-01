import Link from "next/link";
import { MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { PRODUCTS, WHATSAPP_NUMBER } from "@/lib/products";

export default function Footer({ onOpenWhatsApp }: { onOpenWhatsApp?: (subject: string) => void }) {
  const handleWhatsApp = (topic: string) => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(topic);
    } else {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in ${topic}.`)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <footer className="bg-[#ede8df] border-t border-[#ded9d0] pt-16 pb-12 text-[#171614]">
      <div className="max-w-[1240px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#ded9d0]">
          <div className="space-y-4">
            <span className="font-serif text-3xl tracking-[0.18em]">URU</span>
            <p className="text-sm text-[#716c65] leading-relaxed max-w-sm">
              Designer sofas crafted for real homes. Thoughtful proportions, tactile Belgian linens,
              plush bouclés, and bespoke modular configurations.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#716c65]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>Studio open for visits & fabric viewings</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#716c65]">The Collection</h4>
            <ul className="space-y-2 text-sm text-[#48433e]">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.id}`} className="hover:text-[#171614] transition-colors">
                    {p.name} — <span className="text-xs text-[#716c65]">{p.subtitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#716c65]">Conversations</h4>
            <div className="space-y-2.5 text-sm text-[#48433e]">
              <button
                type="button"
                onClick={() => handleWhatsApp("URU Furniture")}
                className="flex items-center gap-2 hover:text-[#171614] text-left"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp: +{WHATSAPP_NUMBER}</span>
              </button>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-2 hover:text-[#171614]">
                <Phone className="w-4 h-4 text-[#716c65]" />
                <span>Call Studio: +{WHATSAPP_NUMBER}</span>
              </a>
              <a href="mailto:hello@urufurniture.com" className="flex items-center gap-2 hover:text-[#171614]">
                <Mail className="w-4 h-4 text-[#716c65]" />
                <span>hello@urufurniture.com</span>
              </a>
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 text-xs text-[#716c65] hover:text-[#171614] pt-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span>Sanity.io Content Studio</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#716c65]">Store & Studio</h4>
            <div className="text-sm text-[#716c65] space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#716c65] mt-1 shrink-0" />
                <span>
                  URU Design Studio & Gallery<br />
                  Level 2, Design Pavilion, Indiranagar<br />
                  Bengaluru, Karnataka 560038
                </span>
              </div>
              <p className="text-xs text-[#8a847b] pt-1">
                Tuesday – Sunday · 11:00 AM to 8:00 PM<br />
                Appointments recommended for custom consultations.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a847b] gap-4">
          <p>© {new Date().getFullYear()} URU Furniture. All rights reserved. Designed for Living.</p>
          <div className="flex items-center gap-6">
            <Link href="/#custom" className="hover:text-[#171614]">Custom Sofas</Link>
            <Link href="/#visit" className="hover:text-[#171614]">Visit Store</Link>
            <Link href="/studio" className="hover:text-[#171614]">Sanity Studio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
