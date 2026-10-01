"use client";

import { X, MessageSquare, ArrowRight, Ruler, Layers, Palette, Tag, Truck, Calendar } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/products";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  initialSubject?: string;
}

export default function WhatsAppModal({
  isOpen,
  onClose,
  productName,
  initialSubject
}: WhatsAppModalProps) {
  if (!isOpen) return null;

  const targetName = productName || initialSubject || "URU Furniture";

  const topics = [
    {
      id: "details",
      title: "General inquiry",
      desc: "Full details, catalog & lead times",
      icon: MessageSquare,
      text: `Hi, I’m interested in the ${targetName}. Could you share more details?`
    },
    {
      id: "size",
      title: "Different sizes & dimensions",
      desc: "Width, depth, floor clearance & room fit",
      icon: Ruler,
      text: `Hi, I’m interested in ${targetName}. Could you share the available sizes, custom dimension options, and floor clearance details?`
    },
    {
      id: "configuration",
      title: "Available configurations",
      desc: "2-Seater, 3-Seater, L-Shape, Chaise, Modular",
      icon: Layers,
      text: `Hi, I’m interested in ${targetName}. Could you share the configuration layouts and modular sectional options?`
    },
    {
      id: "fabric",
      title: "Fabric choices & swatches",
      desc: "Belgian Linen, Bouclé, Velvet, Micro-suede",
      icon: Palette,
      text: `Hi, I’m interested in ${targetName}. Could you share the available fabric textures, swatch catalog, and colour options?`
    },
    {
      id: "price",
      title: "Pricing & quote",
      desc: "Price breakdown based on size and fabric",
      icon: Tag,
      text: `Hi, I’m interested in ${targetName}. Could you share pricing details for standard configurations and current lead times?`
    },
    {
      id: "delivery",
      title: "Delivery & installation",
      desc: "White-glove delivery, doorway clearances",
      icon: Truck,
      text: `Hi, I’m interested in ${targetName}. Could you share delivery timelines, shipping charges, and doorway measurement guidance?`
    },
    {
      id: "visit",
      title: "Book a store visit",
      desc: "Experience the sofa in our Indiranagar studio",
      icon: Calendar,
      text: `Hi, I’d like to book a store visit to experience the ${targetName} in person. Could you share available appointment slots?`
    }
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#fffefa] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ded9d0] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#716c65] hover:text-[#171614] hover:bg-[#eae5dc] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8a847b]">
          WhatsApp Consultation
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#171614] mt-1 mb-2">
          Inquire about {productName}
        </h3>
        <p className="text-sm text-[#716c65] mb-6">
          Choose a question below. WhatsApp will open directly with your inquiry and the sofa model included.
        </p>

        <div className="space-y-2.5">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSend(t.text)}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-[#ded9d0] hover:border-[#171614] hover:bg-[#f7f5f0] transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#ede9e0] text-[#171614] group-hover:bg-[#171614] group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#171614]">{t.title}</h4>
                    <p className="text-xs text-[#716c65]">{t.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8a847b] group-hover:text-[#171614] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-[#ded9d0] text-center">
          <p className="text-xs text-[#8a847b]">
            Our design advisors typically respond on WhatsApp within 15–30 minutes during studio hours.
          </p>
        </div>
      </div>
    </div>
  );
}
