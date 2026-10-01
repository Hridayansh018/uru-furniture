import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder =
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset })
    : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlForImage = (source: any) => {
  if (!builder || !source) return null;
  return builder.image(source);
};
