import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import type { Image as SanityImage } from "sanity";

const builder = createImageUrlBuilder(sanityClient);

export function getOGImageUrl(source: SanityImage): string {
  return builder.image(source).height(630).width(1200).url();
}
