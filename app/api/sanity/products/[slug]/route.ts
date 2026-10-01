import { NextRequest, NextResponse } from "next/server";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { getProduct, PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Product slug required" }, { status: 400 });
    }

    if (isSanityConfigured) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sanityProduct: any = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
        if (sanityProduct) {
          return NextResponse.json({
            source: "sanity",
            sanityConfigured: true,
            product: sanityProduct,
          });
        }
      } catch (err) {
        console.warn("Sanity fetch single product error:", err);
      }
    }

    // Fallback: look up local product
    const localProduct = getProduct(slug);
    if (!localProduct) {
      // Check if it matched without 'cloud-' prefix or similar
      const found = PRODUCTS.find(
        (p) => p.id === slug || p.id === `cloud-${slug}` || p.name.toLowerCase() === slug.toLowerCase()
      );
      if (!found) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return buildProductResponse(found);
    }

    return buildProductResponse(localProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

function buildProductResponse(p: NonNullable<ReturnType<typeof getProduct>>) {
  return NextResponse.json({
    source: "local",
    sanityConfigured: isSanityConfigured,
    product: {
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
    },
  });
}
