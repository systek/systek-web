import { sanityClient } from "sanity:client";
import type {
  AboutPageType,
  Activity,
  Blog,
  Citation,
  FrontPageType,
  Location,
  Logo,
  News,
  Service,
  ServicesPageType,
  SiteSettings,
  Staff,
  StaffPageType,
  Vacancies,
  Work,
  WorkerPageType,
  WorkherePageType,
} from "./sanity.types";
import { format } from "date-fns";

export async function fetchServiceItems(): Promise<Service[]> {
  return sanityClient.fetch(`*[_type == "service" && defined(slug) && visible == true] | order(order asc) {
    _id,
    title,
    description,
    slug
  }`);
}

export async function fetchServiceItemsAll(): Promise<Service[]> {
  return sanityClient.fetch(`*[_type == "service" && defined(slug)] | order(order asc) {
    title,
    slug
  }`);
}

export async function fetchLocations(): Promise<Location[]> {
  return sanityClient.fetch(`*[_type == "location"] | order(order asc)`);
}

export async function fetchNewsItems(limit = 8, skip = 0): Promise<News[]> {
  return sanityClient.fetch(`*[_type == "news" && defined(slug)] | order(publishedAt desc)[${skip}...${skip + limit}] {
    _id,
    title,
    description,
    slug,
    publishedAt,
    updatedAt
  }`);
}

export async function fetchLogoItems(limit = 8): Promise<Logo[]> {
  return sanityClient.fetch(`*[_type == "logo" && defined(image)] | order(order asc) ${limit ? `[0...${limit}]` : ""} {
    _id,
    title,
    image
  }`);
}

export async function fetchWorkItems(limit?: number): Promise<Work[]> {
  const query = `*[_type == "work" && defined(slug)] | order(order asc) ${limit ? `[0...${limit}]` : ""} {
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
    internal,
    registrationUrl
  }`);
}
export async function fetchActivityItemsByDate(
  limit = 5,
  date = new Date(),
): Promise<Activity[]> {
  const today = format(date, "yyyy-MM-dd");
  return sanityClient.fetch(
    `*[_type == "activity" && date >= $today] | order(date asc)${limit ? `[0...${limit}]` : ""} {
    _id,
    title,
    date,
    location,
    internal,
    registrationUrl
  }`,
    {
      today: today,
    },
  );
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

export async function fetchStaffItems(): Promise<
  (Omit<Staff, "serviceType" | "location"> & {
    serviceType: Service;
    location: Location;
  })[]
> {
  return sanityClient.fetch(`*[_type == "staff"] | order(name asc) {
    _id,
    name,
    position,
    location->,
    serviceType->,
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
    workHere
  }`);
}

export type WorkherePageTypeExtended = Omit<WorkherePageType, "citation"> & {
  citation: Citation;
};
export async function fetchWorkhereSingleton(): Promise<WorkherePageTypeExtended> {
  return sanityClient.fetch(`*[_type == "workherePageType"][0] {
    ...,
    introText[]{
      ...,
      _type == "citation" => @->
    },
    citation->
  }`);
}

// Fetch vacant positions, order those with service set first by service, then by date
export async function fetchVacantPositions(): Promise<Vacancies[]> {
  return sanityClient.fetch(`*[_type == "vacancies"] | order(service._ref asc, date desc) {
    _id,
    title,
    description,
    location,
    date,
    href
  }`);
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return sanityClient.fetch(`*[_type == "siteSettings"][0] {
    title,
    description,
    hostname,
    analytics,
    analyticsHostname
  }`);
}

export async function fetchAboutPage(): Promise<
  Omit<AboutPageType, "works"> & { works: Work[] }
> {
  return sanityClient.fetch(`*[_type == "aboutPageType"][0] {
    ...,
    works[]->
  }`);
}
