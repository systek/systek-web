import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import type { Image as SanityImage } from "sanity";

const builder = createImageUrlBuilder(sanityClient);

export function getOGImageUrl(source: SanityImage): string {
  return builder.image(source).height(630).width(1200).url();
}

// Depth-first search for the first image in Sanity content
export function getFirstImage(node: unknown): SanityImage | undefined {
  if (!node || typeof node !== "object") return undefined;
  const record = node as Record<string, unknown>;
  if (record._type === "image" || record.type === "image") {
    return record as SanityImage;
  }
  for (const value of Array.isArray(node) ? node : Object.values(record)) {
    const found = getFirstImage(value);
    if (found) return found;
  }
}
