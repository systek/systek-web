import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import type { Image as SanityImage } from "sanity";

const builder = createImageUrlBuilder(sanityClient);

export function getOGImageUrl(source: SanityImage): string {
  return builder.image(source).height(630).width(1200).url();
}

// todo: use proper type annotations
export function getFirstImage(node: any): any | undefined {
  if (!node) return undefined;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = getFirstImage(item);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof node === "object") {
    if (node._type === "image" || node.type === "image") return node;
    for (const key of Object.keys(node)) {
      const found = getFirstImage(node[key]);
      if (found) return found;
    }
  }
  return undefined;
}
