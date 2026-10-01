import { NextResponse } from "next/server";
import { client, isSanityConfigured } from "@/sanity/lib/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasToken = Boolean(
    process.env.SANITY_API_READ_TOKEN &&
      process.env.SANITY_API_READ_TOKEN.trim().length > 0 &&
      process.env.SANITY_API_READ_TOKEN !== "your_token_here"
  );

  if (!isSanityConfigured) {
    return NextResponse.json({
      ok: false,
      status: "unconfigured",
      projectId: projectId || null,
      dataset: dataset || "production",
      apiVersion: apiVersion || "2024-01-01",
      hasToken,
      message:
        "Sanity Project ID is not configured. Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local to connect.",
    });
  }

  try {
    // Perform a lightweight probe query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sample: any[] = await client.fetch('*[_type == "product"][0...1]');
    const count: number = await client.fetch('count(*[_type == "product"])');

    return NextResponse.json({
      ok: true,
      status: "connected",
      projectId,
      dataset,
      apiVersion,
      hasToken,
      productCount: count,
      sampleFound: sample && sample.length > 0,
      message: `Successfully connected to Sanity CMS dataset '${dataset}'. Found ${count} sofa product(s).`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);

    let advice = "Check your Sanity Project ID and dataset permissions.";
    if (errMessage.includes("CORS") || errMessage.includes("Origin")) {
      advice =
        "CORS error: Add your current domain (including port 3000) to Sanity Dashboard -> API -> CORS Origins with credentials enabled.";
    } else if (errMessage.includes("401") || errMessage.includes("Unauthorized")) {
      advice =
        "Authentication error: Check that your SANITY_API_READ_TOKEN has Viewer or Editor permissions.";
    } else if (errMessage.includes("404")) {
      advice = `Dataset '${dataset}' or Project ID '${projectId}' was not found. Verify names in your Sanity Dashboard.`;
    }

    return NextResponse.json({
      ok: false,
      status: "error",
      projectId,
      dataset,
      apiVersion,
      hasToken,
      error: errMessage,
      advice,
      message: `Connection failed: ${errMessage}`,
    });
  }
}
