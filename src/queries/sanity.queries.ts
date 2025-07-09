import { sanityClient } from "sanity:client";
import type { Service } from "../types/sanity.types";

export async function fetchServiceItems(): Promise<Service[]> {
  const serviceItems =
    await sanityClient.fetch(`*[_type == "service" && defined(slug)]
  | order(order asc) {
    _id,
    title,
    description,
    slug
  }`);
  return serviceItems;
}
