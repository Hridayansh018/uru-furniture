import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, isSanityConfigured } from "../env";

export const client = createClient({
  projectId: projectId || "uru-project-id",
  dataset: dataset || "production",
  apiVersion: apiVersion || "2024-01-01",
  useCdn: false, // Set to false to avoid caching stale content
  token: process.env.SANITY_API_READ_TOKEN,
});

export { isSanityConfigured };
