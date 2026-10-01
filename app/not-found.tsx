import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/products";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col justify-center items-center px-6 py-24 text-center font-sans">
      <div className="max-w-md space-y-6">
        <span className="font-serif text-3xl tracking-[0.16em] text-[#1c1917]">
          URU
        </span>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
            Page Not Found • 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917]">
            This space is unoccupied.
          </h1>
          <p className="text-sm text-[#57534e] leading-relaxed">
            The sofa model, collection page, or document you are looking for has moved or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1c1917] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi URU Furniture, I need help finding a product on your website."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#d6d3d1] hover:border-[#1c1917] text-[#1c1917] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
