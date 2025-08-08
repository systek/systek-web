import { sanityClient } from "sanity:client";
import type { Activity, Blog, Logo, News, Service, Work } from "./sanity.types";

export async function fetchServiceItems(): Promise<Service[]> {
  return sanityClient.fetch(`*[_type == "service" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug
  }`);
}

export async function fetchNewsItems(): Promise<News[]> {
  return sanityClient.fetch(`*[_type == "news" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug, 
    publishedAt,
    updatedAt
  }`);
}

export async function fetchLogoItems(): Promise<Logo[]> {
  return sanityClient.fetch(`*[_type == "logo" && defined(image)] | order(order asc) {
    _id,
    title,
    image
  }`);
}

export async function fetchWorkItems(): Promise<Work[]> {
  return sanityClient.fetch(`*[_type == "work" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug,
    image
  }`);
}

export async function fetchActivityItems(): Promise<Activity[]> {
  return sanityClient.fetch(`*[_type == "activity"] | order(date desc)[0...5] {
    _id,
    title,
    date,
    location,
    href
  }`);
}

export async function fetchBlogItems(): Promise<Blog[]> {
  return sanityClient.fetch(`*[_type == "blog" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    author,
    slug, 
    image
  }`);
}
