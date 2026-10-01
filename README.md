# URU Furniture

A clean, architectural website for URU Furniture that showcases designer sofa collections, drives automated WhatsApp consultations, facilitates studio experience centre visit bookings, provides dynamic content powered by **Sanity.io Headless CMS**, and sends transactional emails via **Nodemailer SMTP**.

---

## Key Features

- **The Cloud Sofa Collection**: 6 designer sofa models (`cloud-01` to `cloud-06`) with individual product pages, dimensions, modular configurations, curated fabric choices, color swatches, and real-time pricing.
- **Sanity.io Headless CMS & Global Image CDN**: Full content management for sofas, editorial descriptions, lifestyle photography, and price tiers. Images are uploaded, hotspotted, and delivered via Sanity's high-speed global CDN (`cdn.sanity.io`).
- **Embedded Sanity Studio (`/studio`)**: Built-in visual studio inside the Next.js app (`/studio`) with live connection diagnostics, dataset seeding, and authenticated access.
- **WhatsApp Inquiries & Automation**: Every sofa model includes a direct WhatsApp consultation trigger prefilled with the model name, selected configuration, fabric, and color, plus quick-prompt topics (sizes, configurations, fabrics, pricing, delivery, store visit).
- **Custom Sofa Section**: "Design Your Sofa" with a 4-step bespoke journey, inspiration gallery, and direct WhatsApp custom consultations.
- **Visual Archive & Lightbox**: Filterable image gallery with touch-swipe, keyboard navigation, and thumbnail previews.
- **Store Visit Booking**: Interactive studio reservation form integrated with WhatsApp.
- **Configurable Cart Drawer**: Add customized sofa combinations and export the entire selection directly into a structured WhatsApp message.

---

## Where to Change the WhatsApp Mobile Number

The WhatsApp number is centralized across the entire application and can be changed in two easy ways:

### Method 1: Via Environment Variable (Recommended for Production)
Add or update `NEXT_PUBLIC_WHATSAPP_NUMBER` in your `.env.local` file (or in your hosting provider's environment variables dashboard like Vercel):

```env
# Include country code without '+' or spaces (e.g., 91 for India + 10-digit number)
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

### Method 2: Directly in Code
Open [`lib/products.ts`](./lib/products.ts) and edit line 15:

```typescript
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
```

All WhatsApp triggers across the website (Navbar, Hero, Product Cards, Product Detail Pages, Cart Drawer, Footer, and Store Visit Booking) automatically use this value.

---

## Sanity.io CMS Credentials & Setup Guide

URU Furniture integrates with **Sanity.io** to provide structured headless content management and high-resolution image asset hosting.

### 1. Create a Free Sanity Account & Project
1. Visit [sanity.io](https://sanity.io/) and sign up or log in.
2. In your [Sanity Management Dashboard](https://sanity.io/manage), click **Create project** (or run `npm create sanity@latest` in a terminal).
3. Name your project (e.g., `uru-furniture`).
4. Choose the default dataset name: `production`.

### 2. Obtain Your Project ID and Dataset
1. Open your project in the [Sanity Management Dashboard](https://sanity.io/manage).
2. The **Project ID** is displayed right under your project name at the top (an 8-character alphanumeric string like `k3y8abcd`).
3. Note your **Dataset** name (typically `production`).

### 3. Generate Secret API Read Token
1. In your project dashboard, navigate to the **API** tab in the top navigation bar.
2. Scroll down to the **Tokens** section and click **Add API token**.
3. Configure the token:
   - **Name / Label**: `URU Furniture Server Read Token`
   - **Permissions**: **Viewer** (allows read access to published documents and drafts).
4. Click **Save** and copy the generated secret token string immediately. **Store it securely—Sanity will only display it once.**

### 4. Configure CORS Origins in Sanity Dashboard
Sanity requires whitelisting the domains that are permitted to communicate with the Sanity API:
1. In your project dashboard, go to the **API** tab.
2. Scroll to the **CORS Origins** section and click **Add CORS origin**.
3. Add the following origins:
   - **Local Development**:
     - **Origin**: `http://localhost:3000`
     - **Allow credentials**: **Yes (checked)**
   - **Production Domain**:
     - **Origin**: `https://yourdomain.com` (or `https://*.vercel.app` / your deployment URL)
     - **Allow credentials**: **Yes (checked)**
4. Click **Save**.

### 5. Configure Local Secrets (`.env.local`)
Create a `.env.local` file in your project root (this file is ignored by Git):

```env
# ==============================================================================
# URU Furniture Environment Configuration
# ==============================================================================

# WhatsApp Business / Studio Mobile Number
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"

# Sanity.io Public Identifiers
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id_here"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"

# Server-Only Secret Token (NEVER prefix with NEXT_PUBLIC_)
SANITY_API_READ_TOKEN="your_sanity_read_token_here"
```

---

## Production Setup & Deployment

### 1. Production Hosting (Vercel, Netlify, or Custom Server)
When deploying the Next.js application to production:

1. **Environment Variables**: Add all environment variables in your hosting provider's dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`

2. **CORS Origins**: In your [Sanity Management Dashboard](https://sanity.io/manage), make sure your live production domain (e.g., `https://urufurniture.com`) is added to **API** > **CORS Origins** with **Allow credentials** enabled.

### 2. Sanity Studio in Production (`/studio`)
The website includes an **embedded Sanity Studio** at `/studio`:

- **How it Works**: Navigating to `https://yourdomain.com/studio` loads the full Sanity Studio directly inside your Next.js application.
- **Authentication**: When accessing `/studio` in production, Sanity presents an authenticated login screen. Only authorized team members invited to your Sanity project (via **Project Settings** > **Members**) can log in and publish edits.
- **Asset Uploads**: Editors can drag and drop high-resolution sofa photos directly into Sanity Studio. Sanity handles WebP conversion, responsive thumbnail generation, and global CDN delivery.
- **Optional Standalone Studio Deployment**: If you prefer hosting Sanity Studio on a dedicated Sanity subdomain (e.g., `https://uru-furniture.sanity.studio`), you can run:
  ```bash
  npx sanity deploy
  ```

### 3. Seed Initial Sofa Catalog to Sanity
You can populate your Sanity dataset with all 6 URU Cloud Sofa models (`cloud-01` through `cloud-06`):
1. Navigate to `/studio` in your browser.
2. Click the **Seed Dataset (NDJSON)** tab.
3. Click **Copy Seed Data** and save it to a file named `seed.ndjson`.
4. In your terminal, run:
   ```bash
   npx sanity dataset import seed.ndjson production
   ```
5. All 6 models, descriptions, prices, dimensions, fabric options, and configuration tags will immediately appear in your Sanity Studio and on the live URU storefront.

---

## Contact Form & Nodemailer SMTP Setup

URU Furniture includes a full contact page at `/contact` that sends two emails on each form submission:

1. **Customer Confirmation** — A premium branded email thanking the visitor and letting them know the team will be in touch.
2. **Admin Lead Alert** — A detailed lead notification sent to your admin email with all form details, a WhatsApp reply button, and a direct email reply link.

### How it works

- The contact form (`/contact`) submits to the **`POST /api/contact`** route.
- The API route uses **Nodemailer** to send emails via any SMTP server (Gmail recommended).
- Both emails use responsive, branded HTML templates.

### Gmail SMTP Setup (Recommended)

Gmail is the easiest SMTP provider and requires zero paid plans.

**Step 1: Enable 2-Step Verification**
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "How you sign in to Google", click **2-Step Verification** and enable it.

**Step 2: Generate an App Password**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **App**: `Mail` and **Device**: `Other (Custom name)` → type `URU Furniture`
3. Click **Generate** — copy the 16-character password that appears (e.g., `xxxx xxxx xxxx xxxx`). You won't see it again.

**Step 3: Configure `.env.local`**

Add these variables to your `.env.local` file in the project root:

```env
# ==============================================================================
# Nodemailer SMTP — Gmail (with App Password)
# ==============================================================================

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"

# Your Gmail address (used as the sender)
SMTP_USER="your.gmail@gmail.com"

# The 16-character App Password generated in Step 2 above
SMTP_PASS="xxxx xxxx xxxx xxxx"

# The admin email that receives lead alert notifications
# (can be same as SMTP_USER or a different mailbox)
ADMIN_EMAIL="admin@urufurniture.com"
```

### Other SMTP Providers

| Provider | SMTP_HOST | SMTP_PORT | SMTP_SECURE |
|---|---|---|---|
| **Gmail** | `smtp.gmail.com` | `587` | `false` |
| **Outlook / Hotmail** | `smtp.office365.com` | `587` | `false` |
| **Yahoo Mail** | `smtp.mail.yahoo.com` | `465` | `true` |
| **Custom / cPanel** | your host's SMTP domain | `465` or `587` | `true`/`false` |

> **Important**: For production deployments (Vercel, Netlify, etc.), add all SMTP variables in your hosting provider's **Environment Variables** dashboard. Never commit `.env.local` to Git — it is already listed in `.gitignore`.

### Testing the Contact Form

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/contact`
3. Fill in the form with your real email address and submit
4. Check your inbox for the **customer confirmation** email
5. Check the `ADMIN_EMAIL` inbox for the **lead alert** email

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your values
cp .env.example .env.local
# Edit .env.local with your WhatsApp number, Sanity credentials, and SMTP config

# 3. Run development server
npm run dev

# 4. Open in browser
# Storefront:      http://localhost:3000
# Contact Page:    http://localhost:3000/contact
# Sanity Studio:   http://localhost:3000/studio
```
