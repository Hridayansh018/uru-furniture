# Sanity CMS Integration Guide for URU Furniture

This guide provides the complete end-to-end instructions for configuring Sanity CMS: what to create in the **Sanity Dashboard**, what documents to add in **Sanity Studio**, and **where & how to implement** everything in this Next.js project.

---

## Table of Contents

1. [Step 1: Sanity Dashboard Setup (`manage.sanity.io`)](#step-1-sanity-dashboard-setup)
   - [1.1 Create or Select Your Project](#11-create-or-select-your-project)
   - [1.2 Note Down Your Project ID and Dataset](#12-note-down-your-project-id-and-dataset)
   - [1.3 Generate an API Token](#13-generate-an-api-token)
   - [1.4 Configure CORS Origins](#14-configure-cors-origins)
2. [Step 2: Content Schema & Documents to Create](#step-2-content-schema--documents-to-create)
   - [2.1 Document Type: `product`](#21-document-type-product)
   - [2.2 Required Fields Breakdown](#22-required-fields-breakdown)
   - [2.3 Ready-to-Use Sample Product Data](#23-ready-to-use-sample-product-data)
3. [Step 3: Where and How to Implement in the Codebase](#step-3-where-and-how-to-implement-in-the-codebase)
   - [3.1 Environment Variables Setup (`.env.local`)](#31-environment-variables-setup-envlocal)
   - [3.2 Existing Architecture in this Repository](#32-existing-architecture-in-this-repository)
   - [3.3 Connecting Sanity to Products Pages](#33-connecting-sanity-to-products-pages)
   - [3.4 Image Handling (`next/image` + Sanity CDN)](#34-image-handling-nextimage--sanity-cdn)
4. [Step 4: Verification, Testing & Troubleshooting](#step-4-verification-testing--troubleshooting)
   - [4.1 Test via In-App Diagnostic Studio](#41-test-via-in-app-diagnostic-studio)
   - [4.2 Test via API Health Route](#42-test-via-api-health-route)
   - [4.3 Common Issues & Fixes](#43-common-issues--fixes)

---

## Step 1: Sanity Dashboard Setup

Go to [Sanity Management Console](https://manage.sanity.io) and log in.

### 1.1 Create or Select Your Project
1. Click **"Create Project"** (or choose an existing one).
2. Project Name: `uru-furniture` (or your preferred name).
3. Plan: Choose the **Free** tier (includes generous quota for assets, bandwidth, and API requests).

### 1.2 Note Down Your Project ID and Dataset
- **Project ID**: Found directly below the project name on your project overview (e.g. `a1b2c3d4`).
- **Dataset**: Go to **Datasets** tab. By default, Sanity creates a dataset named **`production`**. Keep visibility set to **Public** (or Private if using an authenticated token).

### 1.3 Generate an API Token
1. In the Sanity project dashboard, navigate to **API** > **Tokens**.
2. Click **+ Add API token**.
3. Configure the token:
   - **Name**: `URU Furniture Next.js Reader`
   - **Permissions**: Select **Viewer** (read-only access) or **Editor** (read & write if you want to publish from scripts).
4. Click **Save** and copy the generated token immediately (you will not be able to view it again).

### 1.4 Configure CORS Origins
For security, Sanity blocks requests from unknown web origins. You must whitelist your domains:
1. In the project dashboard, navigate to **API** > **CORS Origins**.
2. Click **+ Add CORS origin**.
3. Add the local development origin:
   - **Origin**: `http://localhost:3000`
   - **Allow credentials**: **Check / Enable** (required for authenticated reads)
4. Add your production domain(s) when deployed:
   - **Origin**: `https://your-domain.vercel.app` (or your custom domain)
   - **Allow credentials**: **Check / Enable**

---

## Step 2: Content Schema & Documents to Create

The schema is already defined in your code at [sanity/schemaTypes/productType.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/schemaTypes/productType.ts).

### 2.1 Document Type: `product`
When logging into Sanity Studio (or creating documents via Sanity CLI / Vision plugin), create documents of type **`product`** (`Sofa Product`).

### 2.2 Required Fields Breakdown

| Field Name | Type | Required | Description / Example |
| :--- | :--- | :---: | :--- |
| `name` | String | **Yes** | Product name (e.g., `The Kyoto Curved Sofa`) |
| `slug` | Slug | **Yes** | URL slug (e.g., `kyoto-curved-sofa`), click **Generate** |
| `subtitle` | String | No | Short tagline (e.g., `Organic silhouette with dual-density foam core`) |
| `description` | Text | No | Detailed story & design philosophy |
| `price` | String | **Yes** | Formatted price string (e.g., `₹78,000`) |
| `priceNum` | Number | No | Numerical price for cart calculation (e.g., `78000`) |
| `dimensions` | String | No | Measurements (e.g., `W 88 × D 40 × H 31 in`) |
| `configurations` | Array of strings | No | Tags: `3-Seater`, `4-Seater`, `L-Shape`, `Chaise` |
| `fabrics` | Array of strings | No | Tags: `Bouclé`, `Linen Blend`, `Velvet`, `Chenille` |
| `colors` | Array of strings | No | Tags: `Ivory`, `Taupe`, `Olive`, `Charcoal` |
| `mainImage` | Image (Hotspot) | **Yes** | Primary hero photo shown in catalog card & top of gallery |
| `gallery` | Array of Images | No | Detail photos, side profiles, room setting shots |

### 2.3 Ready-to-Use Sample Product Data

You can manually input these in Sanity Studio to populate the initial catalog:

#### Product 1: The Kyoto Curved Sofa
- **Name**: `The Kyoto Curved Sofa`
- **Slug**: `kyoto-curved-sofa`
- **Subtitle**: `Organic silhouette inspired by Japandi minimalism`
- **Description**: `Sculptural curves meet deep relaxation. Crafted with FSC-certified kiln-dried hardwood and layered high-resilience foam wrapped in natural fiber.`
- **Price**: `₹78,000`
- **Numeric Price**: `78000`
- **Dimensions**: `W 88 × D 40 × H 31 in`
- **Configurations**: `["3-Seater", "4-Seater", "Curved Sectional"]`
- **Fabrics**: `["Bouclé", "Linen Blend", "Textured Chenille"]`
- **Colors**: `["Ivory", "Sand", "Olive", "Charcoal"]`
- **Main Image**: Upload a high-resolution sofa hero image.

#### Product 2: The Solstice Chaise Sectional
- **Name**: `The Solstice Chaise Sectional`
- **Slug**: `solstice-chaise-sectional`
- **Subtitle**: `Low-slung profile with floating plinth base`
- **Description**: `Architectural elegance designed for spacious open living rooms. Features an extended chaise lounge and feather-blend back cushions.`
- **Price**: `₹98,000`
- **Numeric Price**: `98000`
- **Dimensions**: `W 112 × D 65 × H 30 in`
- **Configurations**: `["Left Chaise", "Right Chaise", "4-Seater"]`
- **Fabrics**: `["Heavy Linen", "Brushed Cotton", "Velvet"]`
- **Colors**: `["Taupe", "Oat", "Rust", "Forest"]`

---

## Step 3: Where and How to Implement in the Codebase

### 3.1 Environment Variables Setup (`.env.local`)

Create or update `.env.local` in your root directory:

```env
# Sanity.io CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your_actual_project_id_here"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
SANITY_API_READ_TOKEN="your_actual_read_token_here"
```

> **Note:**
> - `NEXT_PUBLIC_SANITY_PROJECT_ID` is public and accessible in the client browser.
> - `SANITY_API_READ_TOKEN` stays server-side (only accessed in API routes / Server Components).

### 3.2 Existing Architecture in this Repository

The repository already includes modular Sanity files:

| File | Role |
| :--- | :--- |
| [sanity.config.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity.config.ts) | Official Sanity Studio configuration (basePath: `/studio`). |
| [app/studio/[[...tool]]/page.tsx](file:///c:/Users/hrida/Desktop/uru-furniture/app/studio/[[...tool]]/page.tsx) | Embedded Sanity Studio route rendered via `next-sanity/studio`. |
| [sanity/env.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/env.ts) | Reads project credentials and exposes `isSanityConfigured`. |
| [sanity/schemaTypes/productType.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/schemaTypes/productType.ts) | Document schema definition for sofas/products. |
| [sanity/lib/client.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/lib/client.ts) | Pre-configured `@sanity/client` instance. |
| [sanity/lib/queries.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/lib/queries.ts) | GROQ queries (`PRODUCTS_QUERY`, `PRODUCT_BY_SLUG_QUERY`). |
| [sanity/lib/image.ts](file:///c:/Users/hrida/Desktop/uru-furniture/sanity/lib/image.ts) | `@sanity/image-url` builder for responsive CDN images. |
| [app/api/sanity/products/route.ts](file:///c:/Users/hrida/Desktop/uru-furniture/app/api/sanity/products/route.ts) | Dynamic API route that queries Sanity with automatic local fallback. |
| [app/api/sanity/status/route.ts](file:///c:/Users/hrida/Desktop/uru-furniture/app/api/sanity/status/route.ts) | Diagnostic endpoint testing token, dataset, and product counts. |
| [next.config.ts](file:///c:/Users/hrida/Desktop/uru-furniture/next.config.ts) | Already whitelists `cdn.sanity.io` for Next.js `<Image />`. |

### 3.3 Connecting Sanity to Products Pages

#### Method A: Using the built-in API (Client Components / Hybrid)
The endpoint `/api/sanity/products` automatically switches between Sanity and local catalog fallback:

```tsx
useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("/api/sanity/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  }
  loadProducts();
}, []);
```

#### Method B: Direct Fetching in Server Components (Recommended for SEO)
In Next.js Server Components, you can fetch directly using the client:

```tsx
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY, PRODUCT_BY_SLUG_QUERY } from "@/sanity/lib/queries";

// Revalidate data every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await client.fetch(PRODUCTS_QUERY);
  // Render products...
}
```

And for individual product pages (`app/products/[slug]/page.tsx`):

```tsx
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });

  if (!product) {
    notFound();
  }

  // Render product details...
}
```

### 3.4 Image Handling (`next/image` + Sanity CDN)

Sanity images are hosted on `cdn.sanity.io`. In [next.config.ts](file:///c:/Users/hrida/Desktop/uru-furniture/next.config.ts), `cdn.sanity.io` is already configured in `remotePatterns`.

To generate optimized image URLs with custom widths or crops:

```tsx
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

// Inside your component:
<Image
  src={product.mainImageUrl || urlForImage(product.mainImage)?.width(800).url() || "/fallback.jpg"}
  alt={product.name}
  width={800}
  height={600}
  className="object-cover w-full h-full"
/>
```

---

## Step 4: Verification, Testing & Troubleshooting

### 4.1 Accessing the Studio to Create & Edit Products
You can access your visual Sanity Studio in two ways:
1. **Locally in Next.js (Fastest)**:
   - Navigate to: **`http://localhost:3000/studio`**
   - Log in with your Sanity account credentials.
   - You can immediately create, upload images for, and publish **Sofa Product** items.
2. **Via the Online Sanity Console**:
   - Go to [https://manage.sanity.io/projects/tszw11dd](https://manage.sanity.io/projects/tszw11dd).

### 4.2 Test via API Health Route
You can query the status endpoint directly in your browser or terminal to verify your API connection:
```bash
curl http://localhost:3000/api/sanity/status
```
Expected response when properly connected:
```json
{
  "ok": true,
  "status": "connected",
  "projectId": "your_project_id",
  "dataset": "production",
  "hasToken": true,
  "productCount": 2,
  "sampleFound": true,
  "message": "Successfully connected to Sanity CMS dataset 'production'. Found 2 sofa product(s)."
}
```

### 4.3 Common Issues & Fixes

1. **CORS Error (`Blocked by CORS policy`)**:
   - Cause: `http://localhost:3000` is missing in Sanity Dashboard > API > CORS Origins.
   - Fix: Add `http://localhost:3000` with **Allow credentials** checked.

2. **401 Unauthorized / Forbidden**:
   - Cause: Invalid or missing token when dataset is private.
   - Fix: Verify `SANITY_API_READ_TOKEN` in `.env.local` and restart the Next.js dev server.

3. **404 Dataset Not Found**:
   - Cause: Typo in `NEXT_PUBLIC_SANITY_DATASET` (check if your dataset is named `production` or something else).

4. **Next.js `<Image>` Hostname Error**:
   - Verify [next.config.ts](file:///c:/Users/hrida/Desktop/uru-furniture/next.config.ts) contains `cdn.sanity.io` under `images.remotePatterns` (already present in this project).
