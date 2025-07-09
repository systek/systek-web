import { sanityClient } from "sanity:client";
import type { Activity, Blog, Logo, News, Service, Work } from "./sanity.types";

export async function fetchServiceItems(): Promise<Service[]> {
  return await sanityClient.fetch(`*[_type == "service" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug
  }`);
}

export async function fetchNewsItems(): Promise<News[]> {
  return await sanityClient.fetch(`*[_type == "news" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug, 
    publishedAt,
    updatedAt
  }`);
}

export async function fetchLogoItems(): Promise<Logo[]> {
  return await sanityClient.fetch(`*[_type == "logo" && defined(image)] | order(order asc) {
    _id,
    title,
    image
  }`);
}

export async function fetchWorkItems(): Promise<Work[]> {
  return await sanityClient.fetch(`*[_type == "work" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    slug,
    image
  }`);
}

export async function fetchActivityItems(): Promise<Activity[]> {
  return await sanityClient.fetch(`*[_type == "activity"] | order(order asc) {
    _id,
    title,
    date,
    location,
    slug
  }`);
}

export async function fetchBlogItems(): Promise<Blog[]> {
  return await sanityClient.fetch(`*[_type == "blog" && defined(slug)] | order(order asc) {
    _id,
    title,
    description,
    author,
    slug, 
    image
  }`);
}
