import { schemaTypes } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";

export const config = {
  basePath: "/studio",
  name: "uru_furniture_studio",
  title: "URU Furniture Studio",
  projectId: projectId || "uru-project-id",
  dataset: dataset || "production",
  schema: {
    types: schemaTypes,
  },
};

export default config;
