import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "sanity:client";

const builder = imageUrlBuilder(sanityClient);

export function getOGImageUrl(source: SanityImageSource): string {
  return builder.image(source).height(630).width(1200).url();
}
