"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  Ruler,
  Truck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Palette,
  Layers,
  Info,
  Clock,
  MapPin,
  Compass,
  CheckCircle2,
  FileText
} from "lucide-react";
import { getProduct, PRODUCTS, WHATSAPP_NUMBER, Product } from "@/lib/products";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppModal from "@/components/WhatsAppModal";
import CartModal, { CartItem } from "@/components/CartModal";

// Color swatches mapping with realistic luxury furniture tones
const COLOR_HEX_MAP: Record<string, string> = {
  Ivory: "#f8f6f0",
  Sand: "#dcd2c4",
  Olive: "#5a6241",
  Charcoal: "#2e2d2b",
  Cream: "#fcfaf4",
  Taupe: "#9c8c7f",
  Rust: "#984732",
  Forest: "#2b3e32",
  Oat: "#e4dcce",
  Camel: "#b68453",
  Wine: "#662430",
  "Deep Green": "#1c3125",
  Pearl: "#eee9e1",
  Beige: "#d6c7b7",
  Terracotta: "#bc6147",
  Grey: "#767573",
  Stone: "#b9b3aa",
  Navy: "#212e3c",
  Mocha: "#6d5244",
  Brick: "#8b3c33",
  Black: "#1a1a1a",
};

// Fabric tactile descriptions
const FABRIC_INFO: Record<string, { label: string; desc: string }> = {
  Linen: { label: "Belgian Flax Linen", desc: "100% natural, crisp and breathable with relaxed architectural drape." },
  Bouclé: { label: "French Textured Bouclé", desc: "Nubby loop-pile weave with cloud-like sink-in softness (45,000 double rubs)." },
  "Micro-suede": { label: "Artisanal Micro-suede", desc: "Silky tactile matte finish, stain-resistant and easy to clean." },
  Performance: { label: "Shield Performance Weave", desc: "Commercial-grade spill-proof & pet-friendly tactile weave." },
  "Cotton Blend": { label: "Organic Cotton Weave", desc: "Soft textured matte finish with breathable thermal comfort." },
  Velvet: { label: "Lustrous Cotton Velvet", desc: "Deep pile with subtle liquid shimmer and ultra-soft hand feel." },
  Chenille: { label: "Caterpillar Chenille", desc: "Tufted plush yarn weave offering dimensional warmth and durability." },
};

// Configuration pricing delta based on size/scale
function getConfigurationPriceDelta(configName: string, basePrice: number): number {
  const c = configName.toLowerCase();
  if (c.includes("2.5 seater")) return 4000;
  if (c.includes("3 seater")) return 8000;
  if (c.includes("3+1")) return 14000;
  if (c.includes("l-shape") || c.includes("sectional")) return 22000;
  if (c.includes("chaise")) return 12000;
  if (c.includes("corner")) return 24000;
  if (c.includes("u-shape")) return 32000;
  return 0; // 2 seater or base
}

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const baseProduct = getProduct(slug);

  const [product, setProduct] = useState<Product | null>(baseProduct || null);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"dimensions" | "comfort" | "fabric" | "guarantee">("dimensions");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppSubject, setWhatsAppSubject] = useState("");
  const [addedNotice, setAddedNotice] = useState(false);

  // Sync state when slug / baseProduct changes
  useEffect(() => {
    if (baseProduct) {
      setProduct(baseProduct);
      setSelectedConfig(baseProduct.configs[0] || "Standard");
      setSelectedFabric(baseProduct.fabrics[0] || "Standard");
      setSelectedColor(baseProduct.colors[0] || "Standard");
    }
  }, [baseProduct]);

  // Optionally fetch dynamic Sanity data
  useEffect(() => {
    let isMounted = true;
    async function fetchCmsData() {
      try {
        const res = await fetch(`/api/sanity/products/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.product) return;

        if (data.source === "sanity") {
          setProduct((prev) => ({
            id: data.product.slug || slug,
            name: data.product.name,
            subtitle: data.product.subtitle || prev?.subtitle || "",
            desc: data.product.description || prev?.desc || "",
            price: data.product.price || prev?.price || "",
            priceNum: data.product.priceNum || prev?.priceNum || 0,
            dimensions: data.product.dimensions || prev?.dimensions || "",
            configs: data.product.configurations || prev?.configs || [],
            fabrics: data.product.fabrics || prev?.fabrics || [],
            colors: data.product.colors || prev?.colors || [],
            defaultImages: data.product.galleryUrls?.length
              ? data.product.galleryUrls
              : prev?.defaultImages || [],
          }));
        }
      } catch (err) {
        console.warn("Could not fetch Sanity override:", err);
      }
    }
    fetchCmsData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!baseProduct && !product) {
    notFound();
  }

  const currentProduct = product || baseProduct!;

  // Current product index in catalog
  const currentIndex = PRODUCTS.findIndex((p) => p.id === currentProduct.id);
  const prevProduct = PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length];
  const nextProduct = PRODUCTS[(currentIndex + 1) % PRODUCTS.length];

  // Dynamic calculated price
  const configDelta = useMemo(() => {
    return getConfigurationPriceDelta(selectedConfig, currentProduct.priceNum);
  }, [selectedConfig, currentProduct.priceNum]);

  const finalPriceNum = currentProduct.priceNum + configDelta;
  const finalPriceFormatted = `₹${finalPriceNum.toLocaleString("en-IN")}`;
  const emiAmount = Math.round(finalPriceNum / 12);

  const handleOpenWhatsApp = (subject?: string) => {
    setWhatsAppSubject(subject || `Inquiry for ${currentProduct.name}`);
    setIsWhatsAppOpen(true);
  };

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: `${currentProduct.id}-${Date.now()}`,
      name: currentProduct.name,
      configuration: selectedConfig || currentProduct.configs[0],
      fabric: selectedFabric || currentProduct.fabrics[0],
      color: selectedColor || currentProduct.colors[0],
      dimensions: currentProduct.dimensions,
      price: finalPriceFormatted,
      quantity: 1,
      priceNum: finalPriceNum,
      image: currentProduct.defaultImages[0],
    };

    setCartItems((prev) => [...prev, newItem]);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
    setIsCartOpen(true);
  };

  // WhatsApp pre-formatted direct link
  const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi URU Furniture, I’m interested in customized ordering for the ${currentProduct.name}.\n\n` +
      `• Selected Model: ${currentProduct.name} (${currentProduct.subtitle})\n` +
      `• Configuration: ${selectedConfig || "Standard"}\n` +
      `• Fabric: ${selectedFabric || "Standard"}\n` +
      `• Colour Tone: ${selectedColor || "Standard"}\n` +
      `• Calculated Price: ${finalPriceFormatted} (incl. GST)\n` +
      `• Dimensions: ${currentProduct.dimensions}\n\n` +
      `Could you confirm delivery timelines and fabric swatch availability?`
  )}`;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans selection:bg-[#292524] selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#1c1917] text-stone-200 text-xs py-2 px-4 text-center border-b border-stone-800 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Bespoke Cloud Collection — Tailored to your exact living room dimensions.</span>
        </span>
        <span className="hidden md:inline text-stone-500">•</span>
        <button
          type="button"
          onClick={() => handleOpenWhatsApp("Store Visit")}
          className="hidden md:inline text-amber-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
        >
          Book Studio Visit in Bangalore →
        </button>
      </div>

      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      {/* QUICK MODEL SWITCHER BAR (Allows changing product easily right at top) */}
      <div className="bg-[#f2efe9] border-b border-[#ded9d0] sticky top-[76px] z-30 shadow-2xs">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] shrink-0 font-semibold mr-1">
              Switch Model:
            </span>
            {PRODUCTS.map((p) => {
              const isSelected = p.id === currentProduct.id;
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1c1917] text-white shadow-sm font-semibold scale-[1.02]"
                      : "bg-white text-[#57534e] hover:bg-[#eae5dc] border border-[#d6d3d1]"
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  <span>{p.name}</span>
                  <span className={`text-[10px] ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    {p.price}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Prev / Next Model Quick Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 border-l border-[#ded9d0] pl-4">
            <Link
              href={`/products/${prevProduct.id}`}
              className="p-1.5 rounded-full bg-white hover:bg-[#eae5dc] text-[#57534e] border border-[#d6d3d1] transition-colors"
              title={`Previous: ${prevProduct.name}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              href={`/products/${nextProduct.id}`}
              className="p-1.5 rounded-full bg-white hover:bg-[#eae5dc] text-[#57534e] border border-[#d6d3d1] transition-colors"
              title={`Next: ${nextProduct.name}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#78716c] pb-4 mb-6">
          <nav className="flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-[#1c1917] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1c1917] transition-colors">
              All Sofas
            </Link>
            <span>/</span>
            <span className="text-[#1c1917] font-semibold">{currentProduct.name}</span>
          </nav>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Studio Production Active · Bangalore Atelier</span>
          </div>
        </div>

        {/* Product Showcase Grid: 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Column: Fixed / Sticky Multi-Angle Carousel Gallery */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[128px] space-y-4">
              <ProductGallery
                productId={currentProduct.id}
                productName={currentProduct.name}
                defaultImages={currentProduct.defaultImages}
              />

              {/* Craftsmanship Highlight Bar */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4]">
                  <span className="block text-xs font-semibold text-[#1c1917]">5-Layer Comfort</span>
                  <span className="text-[10px] text-[#78716c]">Feathers + HR 40 Foam</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4]">
                  <span className="block text-xs font-semibold text-[#1c1917]">10-Yr Guarantee</span>
                  <span className="text-[10px] text-[#78716c]">Kiln-Dried Hardwood</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4]">
                  <span className="block text-xs font-semibold text-[#1c1917]">White Glove</span>
                  <span className="text-[10px] text-[#78716c]">Assembly Included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer, Specs, Pricing & WhatsApp CTAs */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Header: Title, Subtitle, Price */}
            <div className="space-y-3 border-b border-[#e7e5e4] pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2efe9] text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                  <span>Cloud Series</span>
                  <span>•</span>
                  <span>{currentProduct.id.toUpperCase()}</span>
                </div>

                <Link
                  href="/products"
                  className="text-xs text-[#78716c] hover:text-[#1c1917] underline underline-offset-2 transition-colors"
                >
                  View All Models (6)
                </Link>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] tracking-tight">
                {currentProduct.name}
              </h1>

              <p className="font-serif italic text-base text-[#78716c]">
                “{currentProduct.subtitle}”
              </p>

              {/* Dynamic Price Display */}
              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917]">
                    {finalPriceFormatted}
                  </span>
                  <span className="text-xs text-[#78716c] ml-2 font-medium">
                    (incl. GST & White Glove Delivery)
                  </span>
                </div>
                {configDelta > 0 && (
                  <span className="text-xs font-mono px-2 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                    +₹{configDelta.toLocaleString("en-IN")} size opt
                  </span>
                )}
              </div>

              {/* EMI Note */}
              <div className="flex items-center gap-1.5 text-xs text-[#78716c] pt-1 font-light">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Starting at ₹{emiAmount.toLocaleString("en-IN")}/mo at 0% interest with leading banks.</span>
              </div>
            </div>

            {/* Design Editorial Paragraph */}
            <div className="space-y-2 text-sm text-[#57534e] leading-relaxed">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
                Architectural Silhouette
              </h2>
              <p>{currentProduct.desc}</p>
            </div>

            {/* Dimensions Badge */}
            <div className="p-4 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4] space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#1c1917] font-semibold">
                <div className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-[#78716c]" />
                  <span>Standard Dimensions</span>
                </div>
                <span className="font-mono text-[#57534e]">{currentProduct.dimensions}</span>
              </div>
              <p className="text-[11px] text-[#78716c]">
                Need a specific length to fit your room blueprint? We customize dimensions down to the inch.
              </p>
            </div>

            {/* Configuration Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Select Configuration</span>
                </label>
                <span className="text-xs font-medium text-[#1c1917]">{selectedConfig}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentProduct.configs.map((config) => {
                  const isSelected = selectedConfig === config;
                  const delta = getConfigurationPriceDelta(config, currentProduct.priceNum);
                  return (
                    <button
                      key={config}
                      type="button"
                      onClick={() => setSelectedConfig(config)}
                      className={`p-2.5 rounded-2xl text-xs font-medium text-center border transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm scale-[1.02]"
                          : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#1c1917]"
                      }`}
                    >
                      <span>{config}</span>
                      {delta > 0 && (
                        <span className={`text-[10px] ${isSelected ? "text-amber-200" : "text-[#78716c]"}`}>
                          +₹{delta / 1000}k
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Selector with Tactile Card */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Tactile Fabric Choice</span>
                </label>
                <span className="text-xs font-medium text-[#1c1917]">{selectedFabric}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentProduct.fabrics.map((fabric) => {
                  const isSelected = selectedFabric === fabric;
                  return (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() => setSelectedFabric(fabric)}
                      className={`py-2 px-3 rounded-2xl text-xs font-medium text-center border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm scale-[1.02]"
                          : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#1c1917]"
                      }`}
                    >
                      {fabric}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Fabric Explanation Card */}
              {FABRIC_INFO[selectedFabric] && (
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2 animate-in fade-in duration-200">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{FABRIC_INFO[selectedFabric].label}</span>
                    <span className="text-[11px] text-amber-900/80">{FABRIC_INFO[selectedFabric].desc}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Colour Palette Swatches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>3. Curated Colour Swatch</span>
                </label>
                <span className="text-xs font-medium text-[#1c1917]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {currentProduct.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  const hex = COLOR_HEX_MAP[color] || "#dcd2c4";
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1c1917] text-white border-[#1c1917] shadow-md scale-105"
                          : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#1c1917]"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTAs: WhatsApp & Cart Selection */}
            <div className="pt-4 space-y-3">
              {/* Primary Direct WhatsApp CTA */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <span>Inquire via WhatsApp — {currentProduct.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(`Consultation for ${currentProduct.name}`)}
                  className="py-3 px-4 rounded-full border border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Topic Inquiries</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-full bg-[#1c1917] hover:bg-black text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Selection</span>
                </button>
              </div>

              {addedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Added {currentProduct.name} ({selectedConfig}) to your selection drawer!</span>
                </div>
              )}
            </div>

            {/* Quick Guarantees Checklist */}
            <div className="pt-2 border-t border-[#e7e5e4] grid grid-cols-2 gap-2 text-xs text-[#57534e]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>10-Yr Hardwood Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free In-Home Swatch Box</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bangalore White Glove Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom CAD Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* SPECIFICATION & ARCHITECTURAL TABS */}
        <section className="mt-20 pt-12 border-t border-[#e7e5e4] space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#e7e5e4] pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917]">
              Architectural Specifications & Integrity
            </h2>

            {/* Tabs Bar */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "dimensions", label: "Dimensions & Fit" },
                { id: "comfort", label: "5-Layer Comfort" },
                { id: "fabric", label: "Fabric & Swatches" },
                { id: "guarantee", label: "Delivery & Guarantee" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1c1917] text-white shadow-sm"
                      : "bg-[#f5f3ef] text-[#57534e] hover:bg-[#eae5dc]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Dimensions */}
          {activeTab === "dimensions" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#e7e5e4] shadow-xs">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#78716c] font-semibold">Standard Footprint</span>
                <p className="font-serif text-xl text-[#1c1917]">{currentProduct.dimensions}</p>
                <p className="text-xs text-[#57534e]">Engineered for comfortable proportion in standard and open living spaces.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#78716c] font-semibold">Seat Depth & Height</span>
                <p className="font-serif text-xl text-[#1c1917]">Depth 26 in · Height 16 in</p>
                <p className="text-xs text-[#57534e]">Generously deep seating with relaxed posture and lower lumbar support.</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#78716c] font-semibold">Custom Made-to-Measure</span>
                <p className="font-serif text-xl text-[#1c1917]">Blueprint Fit Available</p>
                <p className="text-xs text-[#57534e]">Send your room dimensions over WhatsApp for a customized configuration plan.</p>
              </div>
            </div>
          )}

          {/* Tab 2: 5-Layer Comfort */}
          {activeTab === "comfort" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-[#e7e5e4] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-800">LAYER 01</span>
                <h3 className="font-serif text-base text-[#1c1917]">Feather Down Pillow Topper</h3>
                <p className="text-xs text-[#57534e]">Generous channel-quilted down clusters for that unmistakable initial sink-in sensation.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#e7e5e4] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-800">LAYER 02</span>
                <h3 className="font-serif text-base text-[#1c1917]">40-Density HR Core</h3>
                <p className="text-xs text-[#57534e]">High-resilience foam core prevents sagging and maintains silhouette rebound for a decade.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#e7e5e4] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-800">LAYER 03</span>
                <h3 className="font-serif text-base text-[#1c1917]">S-Spring Webbing Bed</h3>
                <p className="text-xs text-[#57534e]">Tempered steel sinuous springs interconnected with Italian elastic webbing.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#e7e5e4] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-800">LAYER 04</span>
                <h3 className="font-serif text-base text-[#1c1917]">Kiln-Dried Hardwood</h3>
                <p className="text-xs text-[#57534e]">FAS-grade solid timber with reinforced dowels and corner blocks backed by 10-year warranty.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Fabric & Swatches */}
          {activeTab === "fabric" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e7e5e4] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="font-serif text-2xl text-[#1c1917]">Order a Free Fabric Swatch Box</h3>
                <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
                  Touch before you choose. We courier a curated box of Belgian Linens, Textured Bouclés, and Performance Weaves in your selected color palette to your address in India with zero fee.
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi URU Furniture, I would like to order a Free Fabric Swatch Box for the ${currentProduct.name}. My preferred fabrics are: ${currentProduct.fabrics.join(", ")}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#1c1917] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Request Swatches on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Tab 4: Guarantee */}
          {activeTab === "guarantee" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#e7e5e4] shadow-xs">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif text-lg text-[#1c1917]">10-Year Frame Warranty</h3>
                <p className="text-xs text-[#57534e]">Complete coverage of hardwood structural frame, joints, and spring system.</p>
              </div>
              <div className="space-y-1">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif text-lg text-[#1c1917]">White Glove Bangalore Delivery</h3>
                <p className="text-xs text-[#57534e]">Delivered, unpacked, and assembled in your designated living room space.</p>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif text-lg text-[#1c1917]">30-Day Comfort Guarantee</h3>
                <p className="text-xs text-[#57534e]">Experience it at home. We support cushion firmness tuning and exchange assistance.</p>
              </div>
            </div>
          )}
        </section>

        {/* BROWSE SIBLING CLOUD SOFAS SECTION */}
        <section className="mt-20 pt-12 border-t border-[#e7e5e4] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#78716c]">The Cloud Collection</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917]">Explore Sibling Models</h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-[#1c1917] hover:underline flex items-center gap-1"
            >
              <span>View All 6</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter((p) => p.id !== currentProduct.id).slice(0, 3).map((sibling) => (
              <div
                key={sibling.id}
                className="group bg-white rounded-3xl border border-[#e7e5e4] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <Link href={`/products/${sibling.id}`} className="relative aspect-[4/3] overflow-hidden block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sibling.defaultImages[0]}
                    alt={sibling.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#1c1917]">
                    {sibling.name}
                  </span>
                </Link>
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-medium text-[#1c1917]">
                      <Link href={`/products/${sibling.id}`}>{sibling.name}</Link>
                    </h3>
                    <span className="font-serif font-bold text-sm text-[#1c1917]">{sibling.price}</span>
                  </div>
                  <p className="text-xs text-[#78716c] line-clamp-1 italic">“{sibling.subtitle}”</p>
                  <Link
                    href={`/products/${sibling.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-[#f5f3ef] hover:bg-[#1c1917] hover:text-white text-xs font-semibold text-center transition-colors block"
                  >
                    Switch to {sibling.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM MOBILE ACTION BAR */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ded9d0] p-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#1c1917] block leading-none">
              {currentProduct.name} · {selectedConfig}
            </span>
            <span className="font-serif font-bold text-base text-[#1c1917]">
              {finalPriceFormatted}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2.5 rounded-full bg-[#f2efe9] text-[#1c1917] border border-[#d6d3d1]"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-full bg-[#1b4332] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </div>

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
