export interface Product {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  price: string;
  priceNum: number;
  dimensions: string;
  configs: string[];
  fabrics: string[];
  colors: string[];
  defaultImages: string[];
}

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9876543210"; // URU Furniture WhatsApp number (configurable via .env.local)

export const PRODUCTS: Product[] = [
  {
    id: "cloud-01",
    name: "Cloud 01",
    subtitle: "Quietly iconic.",
    desc: "A deep, relaxed silhouette with generous cushioning and a soft architectural profile. Designed as the anchor of the living room, blending casual comfort with precise tailoring.",
    price: "₹78,000",
    priceNum: 78000,
    dimensions: "W 84 × D 38 × H 30 in",
    configs: ["2 Seater", "3 Seater", "L-Shape", "Chaise"],
    fabrics: ["Linen", "Bouclé", "Micro-suede", "Performance"],
    colors: ["Ivory", "Sand", "Olive", "Charcoal"],
    defaultImages: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    id: "cloud-02",
    name: "Cloud 02",
    subtitle: "Clean and elevated.",
    desc: "A cleaner, slightly raised interpretation of the Cloud family, designed for modern apartments and open-plan rooms. Offers breathable proportions without compromising on sink-in comfort.",
    price: "₹82,000",
    priceNum: 82000,
    dimensions: "W 82 × D 36 × H 30 in",
    configs: ["2 Seater", "3 Seater", "3+1", "Corner"],
    fabrics: ["Linen", "Cotton Blend", "Bouclé", "Performance"],
    colors: ["Cream", "Taupe", "Rust", "Forest"],
    defaultImages: [
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    id: "cloud-03",
    name: "Cloud 03",
    subtitle: "Low, relaxed lounge.",
    desc: "Low, lounge-like seating with rounded edges for a softer, more conversational living room. The seamless cushions invite lounging across any angle.",
    price: "₹86,000",
    priceNum: 86000,
    dimensions: "W 86 × D 39 × H 29 in",
    configs: ["2 Seater", "3 Seater", "Chaise", "U-Shape"],
    fabrics: ["Bouclé", "Velvet", "Linen", "Performance"],
    colors: ["Oat", "Camel", "Wine", "Deep Green"],
    defaultImages: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    id: "cloud-04",
    name: "Cloud 04",
    subtitle: "Compact consideration.",
    desc: "A compact Cloud silhouette with a refined arm profile — ideal when comfort matters but floor space is limited. Perfect for stylish urban apartments.",
    price: "₹74,000",
    priceNum: 74000,
    dimensions: "W 78 × D 35 × H 30 in",
    configs: ["2 Seater", "2.5 Seater", "3 Seater"],
    fabrics: ["Linen", "Cotton Blend", "Micro-suede"],
    colors: ["Pearl", "Beige", "Terracotta", "Grey"],
    defaultImages: [
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    id: "cloud-05",
    name: "Cloud 05",
    subtitle: "Generous modularity.",
    desc: "A generous modular design for larger rooms, built around flexibility and relaxed everyday comfort. Rearrange sections effortlessly as entertaining needs change.",
    price: "₹94,000",
    priceNum: 94000,
    dimensions: "W 96 × D 40 × H 30 in",
    configs: ["3 Seater", "L-Shape", "Large Sectional", "U-Shape"],
    fabrics: ["Linen", "Bouclé", "Performance", "Chenille"],
    colors: ["Sand", "Stone", "Olive", "Navy"],
    defaultImages: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1000&q=85"
    ]
  },
  {
    id: "cloud-06",
    name: "Cloud 06",
    subtitle: "Sculptural anchor.",
    desc: "The most sculptural member of the collection — rounded, grounded and designed to anchor a room. Bold curved backrests with artisanal hand-stitched detailing.",
    price: "₹98,000",
    priceNum: 98000,
    dimensions: "W 88 × D 39 × H 31 in",
    configs: ["2 Seater", "3 Seater", "Chaise", "Corner"],
    fabrics: ["Bouclé", "Velvet", "Micro-suede", "Performance"],
    colors: ["Ivory", "Mocha", "Brick", "Black"],
    defaultImages: [
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1000&q=85"
    ]
  }
];

export function getProduct(id: string): Product | undefined {
  if (id === "cloud-sofa") return PRODUCTS[0];
  return PRODUCTS.find((p) => p.id === id);
}

export function isValidProductId(id: string): boolean {
  if (id === "cloud-sofa") return true;
  return PRODUCTS.some((p) => p.id === id);
}

export interface CatalogueItem {
  id: string;
  category: "sofa" | "living" | "detail" | "inspiration";
  title: string;
  caption: string;
  productId?: string;
  images: string[];
}

export const CATALOGUE_ITEMS: CatalogueItem[] = [
  {
    id: "cat-cloud-01",
    category: "sofa",
    title: "Cloud 01",
    caption: "Soft forms designed for everyday living.",
    productId: "cloud-01",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-cloud-02",
    category: "sofa",
    title: "Cloud 02",
    caption: "A clean silhouette for modern spaces.",
    productId: "cloud-02",
    images: [
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-cloud-03",
    category: "sofa",
    title: "Cloud 03",
    caption: "Low lounge seating with rounded edges.",
    productId: "cloud-03",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-cloud-04",
    category: "sofa",
    title: "Cloud 04",
    caption: "Compact comfort for considered spaces.",
    productId: "cloud-04",
    images: [
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-cloud-05",
    category: "sofa",
    title: "Cloud 05",
    caption: "A generous modular expression.",
    productId: "cloud-05",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-cloud-06",
    category: "sofa",
    title: "Cloud 06",
    caption: "A sculptural anchor for the living room.",
    productId: "cloud-06",
    images: [
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-living-warm",
    category: "living",
    title: "Warm Minimal Living Room",
    caption: "Natural textures and soft neutrals.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-living-quiet",
    category: "living",
    title: "Quiet Living",
    caption: "A calm, tactile living space.",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-detail-material",
    category: "detail",
    title: "Material Detail",
    caption: "Texture, stitching and soft upholstery.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=88"
    ]
  },
  {
    id: "cat-inspiration-calm",
    category: "inspiration",
    title: "Contemporary Calm",
    caption: "A refined, approachable interior.",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=88"
    ]
  }
];
