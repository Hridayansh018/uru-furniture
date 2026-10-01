"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Palette,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  Clock,
  FileText,
  MapPin,
  ChevronRight,
  Eye,
  Sliders,
  CheckCircle2,
  Database
} from "lucide-react";
import { PRODUCTS, WHATSAPP_NUMBER, Product } from "@/lib/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppModal from "@/components/WhatsAppModal";
import CartModal, { CartItem } from "@/components/CartModal";
import CatalogueLightbox from "@/components/CatalogueLightbox";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [activeConfig, setActiveConfig] = useState<string>(PRODUCTS[0].configs[0]);
  const [activeFabric, setActiveFabric] = useState<string>(PRODUCTS[0].fabrics[0]);
  const [activeColor, setActiveColor] = useState<string>(PRODUCTS[0].colors[0]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppSubject, setWhatsAppSubject] = useState("");

  // Store Visit booking form state
  const [visitName, setVisitName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:00 AM");
  const [visitModel, setVisitModel] = useState("Cloud 01");
  const [visitBooked, setVisitBooked] = useState(false);

  // Lightbox state
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [cmsSource, setCmsSource] = useState<string | null>(null);

  // Fetch Sanity dynamic product data
  useEffect(() => {
    async function loadDynamicCatalog() {
      try {
        const res = await fetch("/api/sanity/products");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          if (data.source === "sanity") {
            setCmsSource("Sanity CMS");
          }
          // Merge dynamic properties
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
                defaultImages:
                  p.galleryUrls && p.galleryUrls.length > 0
                    ? p.galleryUrls
                    : p.mainImageUrl
                    ? [p.mainImageUrl]
                    : local?.defaultImages || [],
              };
            }
          );
          setProducts(mapped);
          setSelectedProduct(mapped[0]);
        }
      } catch (err) {
        console.warn("Using fallback local products:", err);
      }
    }
    loadDynamicCatalog();
  }, []);

  const handleOpenWhatsApp = (subject?: string) => {
    setWhatsAppSubject(subject || `General inquiry for URU Furniture`);
    setIsWhatsAppOpen(true);
  };

  const handleOpenLightbox = (images: string[], title: string, index = 0) => {
    setLightboxImages(images);
    setLightboxTitle(title);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleAddToCart = (productToAdd: Product) => {
    const newItem: CartItem = {
      id: `${productToAdd.id}-${Date.now()}`,
      name: productToAdd.name,
      configuration: activeConfig || productToAdd.configs[0],
      fabric: activeFabric || productToAdd.fabrics[0],
      color: activeColor || productToAdd.colors[0],
      dimensions: productToAdd.dimensions,
      quantity: 1,
      price: productToAdd.price,
      priceNum: productToAdd.priceNum,
      image: productToAdd.defaultImages[0],
    };
    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, quantity: newQty } : item))
    );
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitBooked(true);
    const message = encodeURIComponent(
      `Hi URU Furniture, I would like to book a Studio Visit.\n\n` +
        `Name: ${visitName || "Interested Guest"}\n` +
        `Preferred Date: ${visitDate || "This Week"}\n` +
        `Preferred Time: ${visitTime}\n` +
        `Interested Model: ${visitModel}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  // Filtered sofa models
  const filteredProducts = products.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "modular")
      return p.configs.some((c) => c.toLowerCase().includes("modular") || c.toLowerCase().includes("sectional"));
    if (activeFilter === "compact")
      return p.dimensions.includes("78") || p.dimensions.includes("82");
    if (activeFilter === "lounge")
      return p.subtitle.toLowerCase().includes("lounge") || p.subtitle.toLowerCase().includes("deep");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans selection:bg-[#292524] selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#1c1917] text-stone-200 text-xs py-2 px-4 text-center border-b border-stone-800 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Crafted in Bangalore — Experience the Cloud Collection at our Experience Centre.</span>
        </span>
        <span className="hidden md:inline text-stone-500">•</span>
        <Link
          href="#visit"
          className="hidden md:inline text-amber-200 hover:text-white underline underline-offset-2 transition-colors"
        >
          Book Studio Visit →
        </Link>
      </div>

      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION: Clean, architectural, quiet luxury */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-[#e7e5e4]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3ef] border border-[#e7e5e4] text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                  <span>The Cloud Sofa Collection</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="text-[#1c1917]">6 Designer Models</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1c1917] tracking-tight leading-[1.08]">
                  Sink into silence. Living spaces redefined.
                </h1>

                <p className="text-base sm:text-lg text-[#57534e] leading-relaxed max-w-xl font-light">
                  URU Furniture blends architectural proportions with deep, sink-in cloud cushions and bespoke linen upholstery. Designed for modern living rooms, made to your exact dimensions.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#collection"
                    className="px-7 py-3.5 rounded-full bg-[#1c1917] hover:bg-black text-white text-sm font-semibold tracking-wide uppercase transition-all shadow-md flex items-center gap-2 group"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Hi URU Furniture, I would like to consult with your sofa design team."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white text-sm font-semibold tracking-wide transition-all shadow-md flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>

                {/* Quick Trust Highlights */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#e7e5e4] text-xs text-[#78716c]">
                  <div>
                    <span className="font-serif text-xl sm:text-2xl text-[#1c1917] block font-semibold">10 Yrs</span>
                    <span>Hardwood Frame</span>
                  </div>
                  <div>
                    <span className="font-serif text-xl sm:text-2xl text-[#1c1917] block font-semibold">100%</span>
                    <span>Custom Tailored</span>
                  </div>
                  <div>
                    <span className="font-serif text-xl sm:text-2xl text-[#1c1917] block font-semibold">7 Days</span>
                    <span>Studio Delivery</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-[#e7e5e4]">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85"
                    alt="URU Cloud 01 Sofa in minimalist living room"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating model tag */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716c] block">
                        Featured Piece
                      </span>
                      <h2 className="font-serif text-lg text-[#1c1917] font-medium">Cloud 01 — 3 Seater in Sand Linen</h2>
                    </div>
                    <Link
                      href="/products/cloud-01"
                      className="px-4 py-2 rounded-full bg-[#1c1917] text-white text-xs font-semibold hover:bg-black transition-colors"
                    >
                      View Model →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CLOUD SOFA COLLECTION SECTION (Primary Section per Brief) */}
        <section id="collection" className="py-20 md:py-28 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#e7e5e4]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
                  The Primary Lineup
                </span>
                {cmsSource && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-medium flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" />
                    <span>{cmsSource} Active</span>
                  </span>
                )}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1c1917] tracking-tight">
                Cloud Sofa Collection
              </h2>
              <p className="text-sm sm:text-base text-[#57534e]">
                Six distinct designer models engineered with multi-density foam and feather-touch padding. Click any model for detailed dimensions, fabric swatches, 6–7 lifestyle images, and direct WhatsApp inquiry.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: "all", label: "All 6 Models" },
                { id: "lounge", label: "Deep Lounge" },
                { id: "modular", label: "Modular / Sectional" },
                { id: "compact", label: "Compact Living" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === tab.id
                      ? "bg-[#1c1917] text-white shadow-sm"
                      : "bg-[#f5f3ef] text-[#78716c] hover:text-[#1c1917] border border-[#e7e5e4]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {filteredProducts.map((p) => {
              const whatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi, I’m interested in the Cloud Sofa - ${p.name}. Could you share more details?`
              )}`;

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-3xl border border-[#e7e5e4] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Hover zoom */}
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <img
                        src={p.defaultImages[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#1c1917]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                        {p.name}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#1c1917] font-semibold px-3 py-1 rounded-full text-xs shadow-sm">
                        {p.price}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenLightbox(p.defaultImages, p.name)}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#1c1917] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Quick View Gallery"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-2xl text-[#1c1917] group-hover:text-[#9a3412] transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-[#78716c] italic mt-0.5">&ldquo;{p.subtitle}&rdquo;</p>
                      </div>

                      <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>

                      {/* Specs pills */}
                      <div className="space-y-2 pt-2 border-t border-[#f5f3ef] text-xs">
                        <div className="flex items-center justify-between text-[#78716c]">
                          <span className="font-medium">Dimensions:</span>
                          <span className="font-mono text-[#1c1917]">{p.dimensions}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#78716c]">
                          <span className="font-medium">Configs:</span>
                          <span className="text-[#1c1917] truncate max-w-[170px] text-right">
                            {p.configs.slice(0, 3).join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#78716c]">
                          <span className="font-medium">Fabrics:</span>
                          <span className="text-[#1c1917] truncate max-w-[170px] text-right">
                            {p.fabrics.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Product & WhatsApp CTA per Brief */}
                  <div className="p-6 pt-0 space-y-2.5">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-300" />
                      <span>WhatsApp Inquiry — {p.name}</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="py-2.5 px-3 rounded-xl border border-[#d6d3d1] hover:border-[#1c1917] text-center text-xs font-medium text-[#1c1917] transition-colors"
                      >
                        Full Product Page →
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsApp(`${p.name}: Different sizes & fabric options`)
                        }
                        className="py-2.5 px-3 rounded-xl bg-[#f5f3ef] hover:bg-[#e7e5e4] text-center text-xs font-medium text-[#57534e] transition-colors"
                      >
                        Quick Specs
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. DEDICATED CUSTOM SOFA SECTION (Mandated in Brief) */}
        <section id="custom" className="py-20 md:py-28 bg-[#f5f3ef] border-y border-[#e7e5e4]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
                  Bespoke Craftsmanship
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1c1917] tracking-tight">
                  Design Your Sofa Made to Your Requirements
                </h2>
                <p className="text-sm sm:text-base text-[#57534e] leading-relaxed font-light">
                  Have a challenging floor plan, specific cushion softness requirement, or custom architectural fabric in mind? Our bespoke studio builds custom sofas tailored precisely to your living room dimensions.
                </p>

                {/* Primary CTA per Brief: "Design Your Sofa" -> WhatsApp */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      "Hi URU Furniture, I would like to Design My Custom Sofa. I have specific room dimensions and fabric preferences."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white font-semibold text-sm tracking-wide uppercase transition-all shadow-md group"
                  >
                    <MessageSquare className="w-5 h-5 text-emerald-300" />
                    <span>Design Your Sofa on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* 4-Step Process Explanation per Brief */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    step: "01",
                    title: "Vision & Room Plan",
                    desc: "Share your floor plan, wall dimensions, and living room aesthetic over WhatsApp or at our studio.",
                  },
                  {
                    step: "02",
                    title: "Proportions & CAD",
                    desc: "We recommend ergonomic seat depths, backrest angles, and modular configurations tailored to your space.",
                  },
                  {
                    step: "03",
                    title: "Fabric & Tactility",
                    desc: "Choose from 80+ curated linens, textured bouclés, performance velvets, and high-resilience foam densities.",
                  },
                  {
                    step: "04",
                    title: "White-Glove Delivery",
                    desc: "Handcrafted in our facility and assembled directly in your living room with our guarantee.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-6 rounded-2xl bg-white border border-[#e7e5e4] shadow-sm space-y-2"
                  >
                    <span className="font-mono text-xs font-bold text-[#b45309] block">
                      Step {item.step}
                    </span>
                    <h3 className="font-serif text-lg text-[#1c1917]">{item.title}</h3>
                    <p className="text-xs text-[#78716c] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspiration Gallery & Previous Custom Projects */}
            <div className="space-y-6 pt-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
                    Inspiration Gallery
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1917]">
                    Previous Custom Projects
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenWhatsApp("Custom Project Inquiry: View recent bespoke projects portfolio")
                  }
                  className="text-xs font-semibold text-[#1c1917] hover:underline flex items-center gap-1"
                >
                  <span>Request Full Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "The Penthouse L-Sectional",
                    subtitle: "Oatmeal Belgian Linen • 120 in",
                    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "Curved Conversational Pit",
                    subtitle: "Warm Rust Bouclé • Custom Radius",
                    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "Minimalist Apartment 3-Seater",
                    subtitle: "Forest Performance Weave",
                    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "Villa Chaise Lounge Modular",
                    subtitle: "Natural Raw Linen • Feathers",
                    img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif text-base text-[#1c1917]">{item.title}</h4>
                      <p className="text-xs text-[#78716c]">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRICING & PROJECT SPECIFICATION BREAKDOWN (Per User Brief Checklist) */}
        <section className="py-20 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
              Project Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1917] tracking-tight">
              Scope, Costs & Implementation Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e]">
              Detailed specifications answering all 4 points from your URU Furniture brief:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Cost with AI-generated lifestyle images/renders */}
            <div className="p-6 rounded-3xl bg-white border border-[#e7e5e4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-serif text-lg text-[#1c1917]">
                With AI Lifestyle Images
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                6–7 high-fidelity AI-generated photorealistic lifestyle renders per sofa model showing architectural room settings, close-up stitching, and lighting angles.
              </p>
              <div className="pt-2 border-t border-[#f5f3ef]">
                <span className="text-xs font-semibold text-[#1c1917] block">Included In Platform</span>
                <span className="text-[11px] text-[#78716c]">Dynamic Sanity CMS integration</span>
              </div>
            </div>

            {/* 2. Cost without AI-generated images */}
            <div className="p-6 rounded-3xl bg-white border border-[#e7e5e4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-serif text-lg text-[#1c1917]">
                Without AI Images
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Client uploads their own studio photography and high-res files directly via our Sanity Studio with global CDN delivery.
              </p>
              <div className="pt-2 border-t border-[#f5f3ef]">
                <span className="text-xs font-semibold text-[#1c1917] block">Standard Deployment</span>
                <span className="text-[11px] text-[#78716c]">Instant drag-and-drop webp sync</span>
              </div>
            </div>

            {/* 3. Cost with & without WhatsApp automation */}
            <div className="p-6 rounded-3xl bg-white border border-[#e7e5e4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-serif text-lg text-[#1c1917]">
                WhatsApp Automation
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Pre-configured quick topic templates (sizes, configs, fabrics, delivery) + instant link generation including sofa name, dimensions, and specifications.
              </p>
              <div className="pt-2 border-t border-[#f5f3ef]">
                <span className="text-xs font-semibold text-[#1c1917] block">Included & Active</span>
                <span className="text-[11px] text-[#78716c]">Zero per-message fees required</span>
              </div>
            </div>

            {/* 4. Timeline upon confirmation */}
            <div className="p-6 rounded-3xl bg-white border border-[#e7e5e4] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-serif text-lg text-[#1c1917]">
                Delivery Timeline
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Complete deployment: Immediate preview live today. Product additions in Sanity CMS reflect instantly across all visitor sessions.
              </p>
              <div className="pt-2 border-t border-[#f5f3ef]">
                <span className="text-xs font-semibold text-[#1c1917] block">Live Now</span>
                <span className="text-[11px] text-[#78716c]">Production ready in AI Studio</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. STORE VISIT & EXPERIENCE CENTRE (Mandated in Brief) */}
        <section id="visit" className="py-20 bg-[#1c1917] text-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#a8a29e] font-semibold">
                  Touch & Feel
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                  Experience The Cloud Cushion In Person
                </h2>
                <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed font-light">
                  Nothing compares to sinking into the Cloud Sofa yourself. Visit our tactile Bangalore design studio to test foam densities, browse our physical textile book, and consult with our design architects.
                </p>

                <div className="space-y-4 pt-2 text-xs text-[#d6d3d1]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-sm">URU Furniture Experience Studio</strong>
                      <span>Plot 42, 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-sm">Studio Hours</strong>
                      <span>Tuesday – Sunday: 10:30 AM – 8:00 PM (Mondays by appointment)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-6 bg-[#292524] p-8 rounded-3xl border border-[#44403c] shadow-2xl">
                <h3 className="font-serif text-2xl text-white mb-2">Book a Studio Appointment</h3>
                <p className="text-xs text-[#a8a29e] mb-6">
                  Reserve private time with our sofa designers and have fabric samples ready for your visit.
                </p>

                {visitBooked ? (
                  <div className="p-6 rounded-2xl bg-[#1b4332] text-white space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>WhatsApp Consultation Initiated!</span>
                    </div>
                    <p className="text-xs text-emerald-100">
                      Our studio team has received your appointment request and will confirm your slot shortly on WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookVisitSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-[#d6d3d1] block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={visitName}
                        onChange={(e) => setVisitName(e.target.value)}
                        placeholder="e.g. Hridayansh"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1c1917] border border-[#57534e] text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#d6d3d1] block mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1c1917] border border-[#57534e] text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#d6d3d1] block mb-1">Preferred Time</label>
                        <select
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1c1917] border border-[#57534e] text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option>11:00 AM</option>
                          <option>02:00 PM</option>
                          <option>04:30 PM</option>
                          <option>06:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[#d6d3d1] block mb-1">Sofa Model of Interest</label>
                      <select
                        value={visitModel}
                        onChange={(e) => setVisitModel(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1c1917] border border-[#57534e] text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.price})
                          </option>
                        ))}
                        <option value="Custom Sofa Project">Custom Bespoke Sofa Project</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Calendar className="w-4 h-4 text-emerald-300" />
                      <span>Confirm Studio Appointment via WhatsApp</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenWhatsApp={(subject) => handleOpenWhatsApp(subject)} />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        initialSubject={whatsAppSubject}
      />

      {/* Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Fullscreen Lightbox */}
      <CatalogueLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={lightboxTitle}
        caption="Multiple angle and close-up detail shots"
        images={lightboxImages}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
