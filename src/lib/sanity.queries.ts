import { sanityClient } from "sanity:client";
import type {
  Activity,
  Blog,
  Logo,
  News,
  Service,
  Staff,
  Work,
} from "./sanity.types";

export async function fetchServiceItems(): Promise<Service[]> {
  return sanityClient.fetch(`*[_type == "service" && defined(slug)] {
    _id,
    title,
    description,
    slug
  }`);
}

export async function fetchNewsItems(): Promise<News[]> {
  return sanityClient.fetch(`*[_type == "news" && defined(slug)] | order(publishedAt asc) {
    _id,
    title,
    description,
    slug, 
    publishedAt,
    updatedAt
  }`);
}

export async function fetchLogoItems(limit = 8): Promise<Logo[]> {
  return sanityClient.fetch(`*[_type == "logo" && defined(image)]${limit ? `[0...${limit}]` : ""} {
    _id,
    title,
    image
  }`);
}

export async function fetchWorkItems(limit?: number): Promise<Work[]> {
  const query = `*[_type == "work" && defined(slug)]${limit ? `[0...${limit}]` : ""} {
        _id,
        title,
        description,
        slug,
        image
      }`;

  return sanityClient.fetch(query);
}

export async function fetchActivityItems(limit = 5): Promise<Activity[]> {
  return sanityClient.fetch(`*[_type == "activity"] | order(date desc)${limit ? `[0...${limit}]` : ""} {
    _id,
    title,
    date,
    location,
    slug
  }`);
}

export async function fetchBlogItems(): Promise<
  (Omit<Blog, "author"> & { author: Staff })[]
> {
  return sanityClient.fetch(`*[_type == "blog"] {
    _id,
    title,
    description,
    author->,
    link, 
    image
  }`);
}

export async function fetchStaffItems(): Promise<Staff[]> {
  return sanityClient.fetch(`*[_type == "staff"] | order(name asc) {
    _id,
    name,
    position,
    location,
    department,
    slug,
    image
  }`);
}

export async function fetchCitationItem() {
  return sanityClient.fetch(`*[_type == "citation"][0] {
      _id,
      text,
      service->{
        name,
        slug
      },
      name,
      position,
      picture
    }`);
}
