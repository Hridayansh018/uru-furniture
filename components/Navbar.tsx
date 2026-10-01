"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, ShoppingBag, Menu, X } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/products";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenWhatsApp: (subject: string) => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenWhatsApp }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-[76px] bg-[#f7f5f0]/95 backdrop-blur-md border-b border-[#ded9d0]">
      <div className="max-w-[1240px] mx-auto px-5 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.16em] text-[#171614] hover:opacity-90 transition-opacity"
        >
          URU
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#48433e]">
          <Link href="/#collection" className="hover:text-[#171614] transition-colors">
            Cloud Collection
          </Link>
          <Link href="/#catalogue" className="hover:text-[#171614] transition-colors">
            Catalogue
          </Link>
          <Link href="/#custom" className="hover:text-[#171614] transition-colors">
            Custom Sofa
          </Link>
          <Link href="/#visit" className="hover:text-[#171614] transition-colors">
            Visit Store
          </Link>
          <Link href="/products" className="hover:text-[#171614] transition-colors font-medium flex items-center gap-1.5">
            <span>All Sofas</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#ede9e0] text-[#716c65]">6</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#171614] bg-[#eae5dc] hover:bg-[#ded8cc] rounded-full transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Selection</span>
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-[#211d19] rounded-full tabular-nums">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWhatsApp("URU Furniture")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#211d19] hover:bg-black rounded-full transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Us
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#171614] hover:bg-[#eae5dc] rounded-full"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#ded9d0] bg-[#f7f5f0] px-5 py-5 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base text-[#171614] border-b border-[#ece7dc]"
          >
            Cloud Collection
          </Link>
          <Link
            href="/#catalogue"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base text-[#171614] border-b border-[#ece7dc]"
          >
            Visual Catalogue
          </Link>
          <Link
            href="/#custom"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base text-[#171614] border-b border-[#ece7dc]"
          >
            Custom Sofa
          </Link>
          <Link
            href="/#visit"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-base text-[#171614] border-b border-[#ece7dc]"
          >
            Visit Store
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 text-base font-medium text-[#171614] border-b border-[#ece7dc] flex items-center justify-between"
          >
            <span>All Sofas Collection</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#211d19] text-white">6 Models</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenWhatsApp("URU Furniture");
            }}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-[#211d19] text-white rounded-full text-sm font-semibold"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Consultation
          </button>
        </div>
      )}
    </header>
  );
}
