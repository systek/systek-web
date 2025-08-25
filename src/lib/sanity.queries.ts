import { sanityClient } from "sanity:client";
import type {
  Activity,
  Blog,
  Citation,
  FrontPageType,
  Logo,
  News,
  Service,
  ServicesPageType,
  Staff,
  StaffPageType,
  Work,
  WorkerPageType,
} from "./sanity.types";

export async function fetchServiceItems(): Promise<Service[]> {
  return sanityClient.fetch(`*[_type == "service" && defined(slug)] {
    _id,
    title,
    description,
    slug
  }`);
}

export async function fetchNewsItems(limit = 8, skip = 0): Promise<News[]> {
  return sanityClient.fetch(`*[_type == "news" && defined(slug)] | order(publishedAt asc)[${skip}...${skip + limit}] {
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

export async function fetchCitationItem(): Promise<Citation> {
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

export async function fetchFrontPageSingleton(): Promise<
  Omit<FrontPageType, "selectedWorks"> & { selectedWorks: Work[] }
> {
  return sanityClient.fetch(`*[_type == "frontPageType"][0] {
    title,
    topDescription,
    heroImage,
    servicesTitle,
    workTitle,
    selectedWorks[]->{
      _id,
      title,
      description,
      slug,
      image
    },
    activityTitle,
    activityImage,
    vacanciesTitle,
    vacanciesPoints,
    vacanciesImage,
    contact
  }`);
}

export async function fetchWorkerSingleton(): Promise<WorkerPageType> {
  return sanityClient.fetch(`*[_type == "workerPageType"][0] {
    title,
    heroImage,
    logoTitle,
    listTitle,
    servicesTitle,
    contact,
    workCount
  }`);
}

export async function fetchServicesSingleton(): Promise<ServicesPageType> {
  return sanityClient.fetch(`*[_type == "servicesPageType"][0] {
    ...,
    citations->
  }`);
}

export async function fetchStaffSingleton(): Promise<StaffPageType> {
  return sanityClient.fetch(`*[_type == "staffPageType"][0] {
    title,
    heroImage,
    galleryText,
    imageGallery,
    contact,
  }`);
}
