import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

export const config = defineConfig({
  basePath: "/studio",
  name: "uru_furniture_studio",
  title: "URU Furniture Studio",
  projectId: projectId || "tszw11dd",
  dataset: dataset || "product-images",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

export default config;
