"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  RotateCcw,
  Palette,
  Layers,
  Image as ImageIcon,
  Database
} from "lucide-react";
import { getProduct, PRODUCTS, WHATSAPP_NUMBER, Product } from "@/lib/products";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppModal from "@/components/WhatsAppModal";
import CartModal, { CartItem } from "@/components/CartModal";

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const baseProduct = getProduct(slug);

  const [product, setProduct] = useState<Product | null>(baseProduct || null);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppSubject, setWhatsAppSubject] = useState("");
  const [addedNotice, setAddedNotice] = useState(false);
  const [cmsSource, setCmsSource] = useState<string | null>(null);

  // Initialize selections once product is loaded
  useEffect(() => {
    if (baseProduct) {
      setSelectedConfig(baseProduct.configs[0] || "");
      setSelectedFabric(baseProduct.fabrics[0] || "");
      setSelectedColor(baseProduct.colors[0] || "");
    }
  }, [baseProduct]);

  // Optionally fetch live content from Sanity CMS
  useEffect(() => {
    let isMounted = true;
    async function fetchCmsData() {
      try {
        const res = await fetch(`/api/sanity/products/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.product) return;

        if (data.source === "sanity") {
          setCmsSource("Sanity CMS");
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
      price: currentProduct.price,
      quantity: 1,
      priceNum: currentProduct.priceNum,
      image: currentProduct.defaultImages[0],
    };

    setCartItems((prev) => [...prev, newItem]);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
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

  // WhatsApp pre-formatted link
  const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I’m interested in the Cloud Sofa - ${currentProduct.name}. Could you share more details?\n\n` +
      `Selected Configuration: ${selectedConfig || "Standard"}\n` +
      `Fabric Choice: ${selectedFabric || "Standard"}\n` +
      `Colour: ${selectedColor || "Standard"}\n` +
      `Dimensions: ${currentProduct.dimensions}`
  )}`;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c1917] flex flex-col font-sans">
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
      />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#78716c] pb-6 border-b border-[#e7e5e4] mb-8">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-[#1c1917] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
            <Link href="/#collection" className="hover:text-[#1c1917] transition-colors">
              Cloud Sofa Collection
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a8a29e]" />
            <span className="text-[#1c1917] font-semibold">{currentProduct.name}</span>
          </nav>

          <div className="flex items-center gap-2">
            {cmsSource && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-medium flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>Live from {cmsSource}</span>
              </span>
            )}
            <Link
              href={`/studio`}
              className="text-[11px] text-[#78716c] hover:text-[#1c1917] flex items-center gap-1 underline underline-offset-2"
            >
              Edit in Sanity Studio
            </Link>
            <span className="text-[#d6d3d1]">|</span>
            <Link
              href={`/admin/images?productId=${currentProduct.id}`}
              className="text-[11px] text-[#78716c] hover:text-[#1c1917] flex items-center gap-1 underline underline-offset-2"
            >
              <ImageIcon className="w-3 h-3" />
              Manage Images
            </Link>
          </div>
        </div>

        {/* Product Grid: 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Column: Dynamic Multi-Angle Image Gallery (approx 6-7 images) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-4">
              <ProductGallery
                productId={currentProduct.id}
                productName={currentProduct.name}
                defaultImages={currentProduct.defaultImages}
              />

              <div className="p-4 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4] text-xs text-[#57534e] flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#78716c] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-medium text-[#1c1917]">
                    Dynamic Image Management Active
                  </p>
                  <p>
                    Images load dynamically from Sanity CMS and high-speed CDN.
                    Click any image for full-screen zoom and multi-angle inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Specs, Customization, Pricing & WhatsApp CTAs */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-2 border-b border-[#e7e5e4] pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
                  Cloud Sofa Collection
                </span>
                <span className="text-xs font-mono text-[#a8a29e]">
                  SKU: URU-{currentProduct.id.toUpperCase()}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1917] tracking-tight">
                {currentProduct.name}
              </h1>
              <p className="text-base text-[#78716c] italic font-serif">
                &ldquo;{currentProduct.subtitle}&rdquo;
              </p>
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-[#1c1917]">
                  {currentProduct.price}
                </span>
                <span className="text-xs text-[#78716c]">
                  Includes standard upholstery & delivery consultation
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-sm text-[#57534e] leading-relaxed">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1c1917]">
                The Design
              </h2>
              <p>{currentProduct.desc}</p>
            </div>

            {/* Dimensions */}
            <div className="p-4 rounded-2xl bg-[#f5f3ef] border border-[#e7e5e4] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-[#1c1917] font-semibold">
                <Ruler className="w-3.5 h-3.5" />
                <span>Dimensions</span>
              </div>
              <p className="text-[#57534e] font-mono pl-5.5">
                {currentProduct.dimensions}
              </p>
              <p className="text-[11px] text-[#78716c] pl-5.5">
                Custom sizing available upon request via our design studio.
              </p>
            </div>

            {/* Configuration Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Configuration</span>
                </label>
                <span className="text-xs text-[#78716c]">{selectedConfig}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentProduct.configs.map((config) => (
                  <button
                    key={config}
                    type="button"
                    onClick={() => setSelectedConfig(config)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition-all ${
                      selectedConfig === config
                        ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                        : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#a8a29e]"
                    }`}
                  >
                    {config}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Options */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fabric Options</span>
                </label>
                <span className="text-xs text-[#78716c]">{selectedFabric}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentProduct.fabrics.map((fabric) => (
                  <button
                    key={fabric}
                    type="button"
                    onClick={() => setSelectedFabric(fabric)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition-all ${
                      selectedFabric === fabric
                        ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                        : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#a8a29e]"
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Options */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1917] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Curated Colour</span>
                </label>
                <span className="text-xs text-[#78716c]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProduct.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`py-2 px-3.5 rounded-full text-xs font-medium border flex items-center gap-2 transition-all ${
                      selectedColor === color
                        ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                        : "bg-white text-[#44403c] border-[#d6d3d1] hover:border-[#a8a29e]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{
                        backgroundColor:
                          color.toLowerCase().includes("ivory") || color.toLowerCase().includes("pearl")
                            ? "#f5f5f0"
                            : color.toLowerCase().includes("sand") || color.toLowerCase().includes("oat")
                            ? "#e0d7c7"
                            : color.toLowerCase().includes("taupe") || color.toLowerCase().includes("camel")
                            ? "#b39b82"
                            : color.toLowerCase().includes("olive") || color.toLowerCase().includes("forest")
                            ? "#556b2f"
                            : color.toLowerCase().includes("rust") || color.toLowerCase().includes("terracotta")
                            ? "#b7410e"
                            : color.toLowerCase().includes("charcoal") || color.toLowerCase().includes("black")
                            ? "#262626"
                            : "#9ca3af",
                      }}
                    />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs: WhatsApp & Cart */}
            <div className="pt-4 space-y-3">
              {/* Primary WhatsApp Inquiry CTA per Brief */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-md group"
              >
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <span>Inquire on WhatsApp — {currentProduct.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp()}
                  className="py-3 px-4 rounded-full border border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Topic Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-full bg-[#1c1917] hover:bg-black text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? "Added to Cart!" : "Save Configuration"}</span>
                </button>
              </div>

              {/* Automated Inquiry Quick Topics per Brief */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-[#e7e5e4] space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716c] block">
                  Quick WhatsApp Automations (Instant Response):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Different sizes",
                    "Different configurations",
                    "Fabric choices",
                    "Pricing & discounts",
                    "Delivery timeline",
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        handleOpenWhatsApp(`${currentProduct.name}: ${topic}`)
                      }
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#d6d3d1] hover:border-[#1c1917] text-[11px] text-[#44403c] transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Service & Guarantee Highlights */}
            <div className="pt-4 border-t border-[#e7e5e4] grid grid-cols-2 gap-4 text-xs text-[#57534e]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1c1917] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c1917] block">10-Year Frame Warranty</strong>
                  <span>Kiln-dried hardwood construction.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#1c1917] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c1917] block">White-Glove Delivery</strong>
                  <span>Direct room placement & setup.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#1c1917] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c1917] block">Custom Proportions</strong>
                  <span>Made to your room dimensions.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#1c1917] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c1917] block">Studio Consultation</strong>
                  <span>Experience cushions in person.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Models in Collection */}
        <section className="mt-20 pt-12 border-t border-[#e7e5e4] space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#78716c] font-semibold">
                Explore The Family
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917]">
                Other Cloud Sofa Models
              </h2>
            </div>
            <Link
              href="/#collection"
              className="text-xs font-semibold text-[#1c1917] hover:underline flex items-center gap-1"
            >
              <span>View All 6 Models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter((p) => p.id !== currentProduct.id)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group bg-white rounded-3xl border border-[#e7e5e4] overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <img
                      src={p.defaultImages[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-[#1c1917]">
                      {p.price}
                    </div>
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="font-serif text-lg text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#78716c] line-clamp-1">{p.subtitle}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-medium text-[#1c1917]">
                      <span>{p.dimensions}</span>
                      <span className="text-[#b45309] flex items-center gap-0.5">
                        Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
    </div>
  );
}
