"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Search,
  Check,
  Ruler,
  Compass,
  Layers,
  Palette,
  ShieldCheck,
  ChevronRight,
  Eye
} from "lucide-react";
import { PRODUCTS, WHATSAPP_NUMBER, Product } from "@/lib/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppModal from "@/components/WhatsAppModal";
import CartModal, { CartItem } from "@/components/CartModal";

export default function AllProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<string>("All");
  const [selectedFabric, setSelectedFabric] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppSubject, setWhatsAppSubject] = useState("");

  // Fetch dynamic Sanity products & images
  useEffect(() => {
    async function loadCmsProducts() {
      try {
        const res = await fetch("/api/sanity/products");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          const mapped: Product[] = data.products.map(
            (p: {
              slug: string;
              name: string;
              subtitle?: string;
              description?: string;
              price?: string;
              priceNum?: number;
              dimensions?: string;
              configurations?: string[];
              fabrics?: string[];
              colors?: string[];
              galleryUrls?: string[];
              mainImageUrl?: string;
            }) => {
              const local = PRODUCTS.find((lp) => lp.id === p.slug);
              const sanityImgs = [
                p.mainImageUrl,
                ...(p.galleryUrls || []),
              ].filter(Boolean) as string[];

              return {
                id: p.slug || local?.id || "cloud-01",
                name: p.name || local?.name || "Cloud Sofa",
                subtitle: p.subtitle || local?.subtitle || "Quiet luxury.",
                desc: p.description || local?.desc || "",
                price: p.price || local?.price || "₹78,000",
                priceNum: p.priceNum || local?.priceNum || 78000,
                dimensions: p.dimensions || local?.dimensions || "W 84 × D 38 × H 30 in",
                configs: p.configurations || local?.configs || ["2 Seater", "3 Seater"],
                fabrics: p.fabrics || local?.fabrics || ["Linen", "Bouclé"],
                colors: p.colors || local?.colors || ["Ivory", "Sand"],
                defaultImages: sanityImgs.length > 0 ? sanityImgs : local?.defaultImages || [],
              };
            }
          );
          setProductsList(mapped);
        }
      } catch (err) {
        console.warn("Using fallback local products:", err);
      }
    }
    loadCmsProducts();
  }, []);

  // Extract all unique configurations and fabrics across products
  const allConfigs = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => p.configs.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [productsList]);

  const allFabrics = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => p.fabrics.forEach((f) => set.add(f)));
    return ["All", ...Array.from(set)];
  }, [productsList]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Search query
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.desc.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Configuration filter
      if (selectedConfig !== "All" && !product.configs.includes(selectedConfig)) {
        return false;
      }

      // Fabric filter
      if (selectedFabric !== "All" && !product.fabrics.includes(selectedFabric)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNum - b.priceNum;
      if (sortBy === "price-desc") return b.priceNum - a.priceNum;
      return 0; // Default order
    });
  }, [searchQuery, selectedConfig, selectedFabric, sortBy]);

  const handleOpenWhatsApp = (subject?: string) => {
    setWhatsAppSubject(subject || "General inquiry for URU Cloud Sofas");
    setIsWhatsAppOpen(true);
  };

  const handleQuickAddToCart = (product: Product) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      configuration: product.configs[0],
      fabric: product.fabrics[0],
      color: product.colors[0],
      dimensions: product.dimensions,
      price: product.price,
      quantity: 1,
      priceNum: product.priceNum,
      image: product.defaultImages[0],
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans selection:bg-[#292524] selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#1c1917] text-stone-200 text-xs py-2 px-4 text-center border-b border-stone-800 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>The Cloud Collection — Handcrafted in Bangalore. 10-Year Hardwood Warranty.</span>
        </span>
        <span className="hidden md:inline text-stone-500">•</span>
        <button
          type="button"
          onClick={() => handleOpenWhatsApp("Store Visit Booking")}
          className="hidden md:inline text-amber-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
        >
          Book Bangalore Studio Visit →
        </button>
      </div>

      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[#e7e5e4] bg-[#f7f5f0]/60">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#78716c]">
              <Link href="/" className="hover:text-[#1c1917] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#1c1917] font-semibold">The Cloud Sofa Collection</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e7e5e4] text-xs font-semibold uppercase tracking-wider text-[#78716c] shadow-2xs">
                <span>Complete Catalog</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[#1c1917]">6 Tailored Models</span>
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1c1917] tracking-tight leading-[1.08]">
                Six distinct silhouettes. Boundless quiet luxury.
              </h1>

              <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-light">
                Each Cloud sofa is engineered with multi-density foam, feather-down toppers, and bespoke Belgian linen or textured bouclé. Made to your room dimensions and finished to perfection.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl border-t border-[#ded9d0]">
              <div className="p-3 bg-white/80 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                <span className="block text-2xl font-serif font-bold text-[#1c1917]">6</span>
                <span className="text-xs text-[#78716c]">Architectural Models</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                <span className="block text-2xl font-serif font-bold text-[#1c1917]">80+</span>
                <span className="text-xs text-[#78716c]">Curated Tactile Fabrics</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                <span className="block text-2xl font-serif font-bold text-[#1c1917]">10 Yrs</span>
                <span className="text-xs text-[#78716c]">Solid Hardwood Frame</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                <span className="block text-2xl font-serif font-bold text-[#1c1917]">100%</span>
                <span className="text-xs text-[#78716c]">Custom Sizing Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter, Search & Sort Control Bar */}
        <section className="sticky top-[76px] z-30 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#e7e5e4] py-4 shadow-2xs">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c]" />
                <input
                  type="text"
                  placeholder="Search models, features, or materials (e.g. modular, bouclé, low lounge)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#d6d3d1] text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1c1917] focus:ring-1 focus:ring-[#1c1917] transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#78716c] font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
                  className="px-3.5 py-2.5 rounded-full bg-white border border-[#d6d3d1] text-xs font-medium text-[#1c1917] focus:outline-none focus:border-[#1c1917] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured Collection (01 to 06)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                <span className="text-xs font-mono font-medium text-[#78716c] px-3 py-1.5 rounded-full bg-[#f0ede6] border border-[#e7e5e4]">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "Model" : "Models"}
                </span>
              </div>
            </div>

            {/* Pill Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-[#78716c] mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Config:</span>
              </span>
              {allConfigs.slice(0, 6).map((cfg) => (
                <button
                  key={cfg}
                  type="button"
                  onClick={() => setSelectedConfig(cfg)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedConfig === cfg
                      ? "bg-[#1c1917] text-white shadow-2xs scale-[1.02]"
                      : "bg-white text-[#57534e] hover:bg-[#ede9df] border border-[#e7e5e4]"
                  }`}
                >
                  {cfg}
                </button>
              ))}

              <span className="text-xs font-medium text-[#78716c] ml-3 mr-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Fabric:</span>
              </span>
              {allFabrics.slice(0, 5).map((fab) => (
                <button
                  key={fab}
                  type="button"
                  onClick={() => setSelectedFabric(fab)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedFabric === fab
                      ? "bg-[#1c1917] text-white shadow-2xs scale-[1.02]"
                      : "bg-white text-[#57534e] hover:bg-[#ede9df] border border-[#e7e5e4]"
                  }`}
                >
                  {fab}
                </button>
              ))}

              {(selectedConfig !== "All" || selectedFabric !== "All" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedConfig("All");
                    setSelectedFabric("All");
                    setSearchQuery("");
                  }}
                  className="text-xs text-amber-800 hover:text-black font-medium underline underline-offset-2 ml-2"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Product Cards Grid */}
        <section className="py-12 md:py-16 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <Compass className="w-12 h-12 text-[#a8a29e] mx-auto animate-bounce" />
              <h2 className="font-serif text-2xl text-[#1c1917]">No models matched your selection</h2>
              <p className="text-sm text-[#78716c]">
                Try adjusting your search keywords or resetting configuration and fabric filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedConfig("All");
                  setSelectedFabric("All");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-full bg-[#1c1917] text-white text-xs font-semibold tracking-wide hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi URU Furniture, I’m interested in the ${product.name} (${product.price}). Could you provide specifications, fabric options, and delivery timelines?`
                )}`;

                return (
                  <article
                    key={product.id}
                    className="group bg-white rounded-3xl border border-[#e7e5e4] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image Area with Link */}
                    <Link
                      href={`/products/${product.id}`}
                      className="relative aspect-[4/3] bg-[#ece7dd] overflow-hidden block select-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.defaultImages[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-[#1c1917] shadow-sm">
                          {product.name}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-white shadow-sm">
                          6+ Photos
                        </span>
                      </div>

                      {/* Hover Overlay Pill */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="text-white text-xs font-medium drop-shadow-sm flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details & Swatches</span>
                        </span>
                        <span className="w-7 h-7 rounded-full bg-white text-[#1c1917] flex items-center justify-center shadow-md transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>

                    {/* Card Content Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <Link href={`/products/${product.id}`} className="space-y-3 block focus:outline-none cursor-pointer">
                        <div className="flex items-baseline justify-between gap-2 border-b border-[#f5f3ef] pb-3">
                          <div>
                            <h2 className="font-serif text-2xl text-[#1c1917] font-normal group-hover:text-black transition-colors">
                              {product.name}
                            </h2>
                            <p className="text-xs text-[#78716c] italic mt-0.5">
                              “{product.subtitle}”
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-serif text-xl font-bold text-[#1c1917] block">
                              {product.price}
                            </span>
                            <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">
                              Custom Crafted
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                          {product.desc}
                        </p>

                        {/* Dimensions & Config Tags */}
                        <div className="space-y-2 pt-1 text-xs">
                          <div className="flex items-center gap-1.5 text-[#78716c] font-mono text-[11px]">
                            <Ruler className="w-3.5 h-3.5 text-[#a8a29e]" />
                            <span>{product.dimensions}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {product.configs.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded-md bg-[#f7f5f0] text-[10px] text-[#57534e] border border-[#e7e5e4]"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-[#f5f3ef] space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="py-2.5 px-3 rounded-xl bg-[#1c1917] hover:bg-black text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>Inspect Model</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAddToCart(product)}
                          className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#57534e] hover:text-[#1c1917] bg-[#f5f3ef] hover:bg-[#eae5dc] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Standard Configuration to Selection</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Bespoke Studio Section CTA Banner */}
        <section className="py-16 bg-[#1c1917] text-white border-t border-stone-800">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-300 font-semibold block">
                  Bespoke Architectural Solutions
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl">
                  Need a custom dimension, L-sectional layout, or specific fabric?
                </h2>
                <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
                  Our Bangalore atelier builds made-to-measure Cloud sofas. Share your room blueprints or wall measurements, and our design team will generate 3D CAD dimensions and mail tactile fabric swatches to your door.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi URU Furniture, I would like to consult with your bespoke sofa design team regarding a custom project."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-semibold text-center transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Consult Bespoke Studio via WhatsApp</span>
                </a>
                <Link
                  href="/#visit"
                  className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold text-center transition-all border border-white/20"
                >
                  Book Studio Visit in Bangalore →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenWhatsApp={(subject) => handleOpenWhatsApp(subject)} />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultSubject={whatsAppSubject}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onUpdateQuantity={(idx, qty) => {
          if (qty <= 0) {
            setCartItems((prev) => prev.filter((_, i) => i !== idx));
          } else {
            setCartItems((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)));
          }
        }}
      />
    </div>
  );
}
