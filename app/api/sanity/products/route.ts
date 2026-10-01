import { NextResponse } from "next/server";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isSanityConfigured) {
      try {
        // Query Sanity CMS with timeout
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sanityProducts: any[] = await client.fetch(PRODUCTS_QUERY);
        if (Array.isArray(sanityProducts) && sanityProducts.length > 0) {
          return NextResponse.json({
            source: "sanity",
            sanityConfigured: true,
            products: sanityProducts,
          });
        }
      } catch (sanityErr) {
        console.warn("Sanity fetch error, falling back to local catalog:", sanityErr);
      }
    }

    // Fallback: standard local PRODUCTS
    const localProducts = PRODUCTS.map((p) => ({
      _id: `product-${p.id}`,
      name: p.name,
      slug: p.id,
      subtitle: p.subtitle,
      description: p.desc,
      price: p.price,
      priceNum: p.priceNum,
      dimensions: p.dimensions,
      configurations: p.configs,
      fabrics: p.fabrics,
      colors: p.colors,
      mainImageUrl: p.defaultImages[0],
      galleryUrls: p.defaultImages,
      source: "local",
    }));

    return NextResponse.json({
      source: "local",
      sanityConfigured: isSanityConfigured,
      products: localProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products", details: String(error) },
      { status: 500 }
    );
  }
}
