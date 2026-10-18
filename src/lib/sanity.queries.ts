import { sanityClient } from "sanity:client";
import { defineQuery } from "groq";
import { format } from "date-fns";
import type {
  AboutPageQueryResult,
  ActivityItemsLatestQueryResult,
  ActivityItemsUpcomingQueryResult,
  BlogItemsQueryResult,
  FrontPageQueryResult,
  LocationsQueryResult,
  LogoItemsQueryResult,
  NewsItemsQueryResult,
  NewsPagesQueryResult,
  PagesQueryResult,
  ServiceItemsAllQueryResult,
  ServiceItemsQueryResult,
  ServicePagesQueryResult,
  ServicesPageQueryResult,
  ServiceVacanciesQueryResult,
  SiteSettingsQueryResult,
  StaffItemsQueryResult,
  StaffPageQueryResult,
  VacantPositionsQueryResult,
  WorkerPageQueryResult,
  WorkherePageQueryResult,
  WorkItemsQueryResult,
  WorkPagesQueryResult,
} from "./sanity.types";

const serviceItemsQuery =
  defineQuery(`*[_type == "service" && defined(slug) && visible == true] | order(order asc) {
  _id,
  title,
  description,
  slug
}`);

export async function fetchServiceItems(): Promise<ServiceItemsQueryResult> {
  return sanityClient.fetch(serviceItemsQuery);
}

const serviceItemsAllQuery =
  defineQuery(`*[_type == "service" && defined(slug)] | order(order asc) {
  title,
  slug
}`);

export async function fetchServiceItemsAll(): Promise<ServiceItemsAllQueryResult> {
  return sanityClient.fetch(serviceItemsAllQuery);
}

const locationsQuery = defineQuery(`*[_type == "location"] | order(order asc)`);

export async function fetchLocations(): Promise<LocationsQueryResult> {
  return sanityClient.fetch(locationsQuery);
}

const newsItemsQuery =
  defineQuery(`*[_type == "news" && defined(slug)] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  description,
  slug,
  publishedAt,
  updatedAt
}`);

export async function fetchNewsItems(
  limit = 8,
  skip = 0,
): Promise<NewsItemsQueryResult> {
  return sanityClient.fetch(newsItemsQuery, {
    start: skip,
    end: skip + limit,
  });
}

const logoItemsQuery =
  defineQuery(`*[_type == "logo" && defined(image)] | order(order asc)[0...$limit] {
  _id,
  title,
  image
}`);

export async function fetchLogoItems(limit = 8): Promise<LogoItemsQueryResult> {
  return sanityClient.fetch(logoItemsQuery, { limit });
}

const workItemsQuery =
  defineQuery(`*[_type == "work" && defined(slug)] | order(order asc) {
  _id,
  title,
  description,
  slug,
  image
}`);

export async function fetchWorkItems(
  limit?: number,
): Promise<WorkItemsQueryResult> {
  const items = await sanityClient.fetch(workItemsQuery);
  return limit ? items.slice(0, limit) : items;
}

const activityItemsUpcomingQuery =
  defineQuery(`*[_type == "activity" && date >= $today] | order(date asc)[0...$limit] {
  _id,
  title,
  date,
  location,
  internal,
  registrationUrl,
  isRegistrationUrl
}`);

const activityItemsLatestQuery =
  defineQuery(`*[_type == "activity"] | order(date desc)[0...$limit] {
  _id,
  title,
  date,
  location,
  internal,
  registrationUrl,
  isRegistrationUrl
}`);

export async function fetchActivityItemsByDate(
  limit = 5,
  date = new Date(),
): Promise<ActivityItemsUpcomingQueryResult | ActivityItemsLatestQueryResult> {
  const today = format(date, "yyyy-MM-dd");
  // Try to fetch the 5 next activities from today if posible
  const activities = await sanityClient.fetch(activityItemsUpcomingQuery, {
    today,
    limit,
  });

  if (activities.length === limit) {
    return activities;
  }

  // If there are not enough upcoming activities, 5 newest activities are fetched
  return sanityClient.fetch(activityItemsLatestQuery, { limit });
}

const blogItemsQuery =
  defineQuery(`*[_type == "blog" && defined(publishedAt)] | order(publishedAt desc)[0...$limit] {
  _id,
  title,
  description,
  author->{ name },
  link,
  image
}`);

export async function fetchBlogItems(limit = 8): Promise<BlogItemsQueryResult> {
  return sanityClient.fetch(blogItemsQuery, { limit });
}

const staffItemsQuery = defineQuery(`*[_type == "staff"] | order(name asc) {
  _id,
  name,
  position,
  location->{ slug },
  serviceType->{ slug },
  slug,
  image,
  imageSecondary
}`);

export async function fetchStaffItems(): Promise<StaffItemsQueryResult> {
  const collator = new Intl.Collator("nb", {
    usage: "sort",
    sensitivity: "base",
  });

  const items = await sanityClient.fetch(staffItemsQuery);

  // fixes sorting Å, Æ, Ø -> Æ, Ø, Å
  return items.toSorted((a, b) => collator.compare(a.name, b.name));
}

const frontPageQuery = defineQuery(`*[_type == "frontPageType"][0] {
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

export async function fetchFrontPageSingleton(): Promise<
  NonNullable<FrontPageQueryResult>
> {
  const data = await sanityClient.fetch(frontPageQuery);
  if (!data) throw new Error("Missing frontPage document");
  return data;
}

const workerPageQuery = defineQuery(`*[_type == "workerPageType"][0] {
  title,
  heroImage,
  logoTitle,
  listTitle,
  servicesTitle,
  contact,
  workCount
}`);

export async function fetchWorkerSingleton(): Promise<
  NonNullable<WorkerPageQueryResult>
> {
  const data = await sanityClient.fetch(workerPageQuery);
  if (!data) throw new Error("Missing workerPage document");
  return data;
}

const servicesPageQuery = defineQuery(`*[_type == "servicesPageType"][0] {
  ...,
  citations->
}`);

export async function fetchServicesSingleton(): Promise<
  NonNullable<ServicesPageQueryResult>
> {
  const data = await sanityClient.fetch(servicesPageQuery);
  if (!data) throw new Error("Missing servicesPage document");
  return data;
}

const staffPageQuery = defineQuery(`*[_type == "staffPageType"][0] {
  title,
  heroImage,
  galleryText,
  imageGallery,
  workHere
}`);

export async function fetchStaffSingleton(): Promise<
  NonNullable<StaffPageQueryResult>
> {
  const data = await sanityClient.fetch(staffPageQuery);
  if (!data) throw new Error("Missing staffPage document");
  return data;
}

const workherePageQuery = defineQuery(`*[_type == "workherePageType"][0] {
  ...,
  introText[]{
    ...,
    _type == "citation" => @->
  },
  citation->
}`);

export async function fetchWorkhereSingleton(): Promise<
  NonNullable<WorkherePageQueryResult>
> {
  const data = await sanityClient.fetch(workherePageQuery);
  if (!data) throw new Error("Missing workherePage document");
  return data;
}

// Fetch vacant positions, order those with at least one linked service first, then by date
const vacantPositionsQuery =
  defineQuery(`*[_type == "vacancies" && (!defined(date) || date >= $today)] | order(select(defined(services[0]) => 0, 1) asc, date desc) {
  _id,
  title,
  description,
  location,
  date,
  href
}`);

export async function fetchVacantPositions(): Promise<VacantPositionsQueryResult> {
  const today = format(new Date(), "yyyy-MM-dd");

  return sanityClient.fetch(vacantPositionsQuery, { today });
}

// Fetch vacancies whose services field includes the service, or those without any services assigned, ordered by those with the service first, then by date
const serviceVacanciesQuery = defineQuery(`*[_type == "vacancies" && (
  $serviceId in services[]._ref ||
  !defined(services)
)] | order(select($serviceId in services[]._ref => 0, 1) asc, date desc) {
  title,
  date,
  location,
  description,
  href
}`);

export async function fetchServiceVacancies(
  serviceId: string,
): Promise<ServiceVacanciesQueryResult> {
  return sanityClient.fetch(serviceVacanciesQuery, { serviceId });
}

const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0] {
  title,
  description,
  hostname,
  analytics,
  analyticsHostname
}`);

export async function fetchSiteSettings(): Promise<
  NonNullable<SiteSettingsQueryResult>
> {
  const data = await sanityClient.fetch(siteSettingsQuery);
  if (!data) throw new Error("Missing siteSettings document");
  return data;
}

const aboutPageQuery = defineQuery(`*[_type == "aboutPageType"][0]`);

export async function fetchAboutPage(): Promise<
  NonNullable<AboutPageQueryResult>
> {
  const data = await sanityClient.fetch(aboutPageQuery);
  if (!data) throw new Error("Missing aboutPage document");
  return data;
}

const pagesQuery = defineQuery(`*[_type == "page"] {
  slug,
  title,
  heroImage,
  content[]{
    ...,
    _type == "file" => {
      ...,
      asset->
    },
    _type == "internal-link" => {
      ...,
      page->{ slug }
    }
  }
}`);

export async function fetchPages(): Promise<PagesQueryResult> {
  return sanityClient.fetch(pagesQuery);
}

// A portable text block from page content, by its _type
export type PageBlock<T extends string> = Extract<
  PagesQueryResult[number]["content"][number],
  { _type: T }
>;

const servicePagesQuery = defineQuery(`*[_type == "service"] {
  _id,
  slug,
  title,
  heroImage,
  content,
  "plainContent": pt::text(content),
  citation->,
  works[]->{ title, slug, image, description },
  contact,
}`);

export async function fetchServicePages(): Promise<ServicePagesQueryResult> {
  return sanityClient.fetch(servicePagesQuery);
}

const workPagesQuery = defineQuery(`*[_type == "work"] {
  slug,
  title,
  image,
  startDate,
  endDate,
  description,
  content,
  stats,
  technologiesTitle,
  technologies,
  "plainContent": pt::text(content),
  citation->,
  services[]->{ title, slug },
  contactTwo{
    label,
    title,
    contacts[]->
  },
}`);

export async function fetchWorkPages(): Promise<WorkPagesQueryResult> {
  return sanityClient.fetch(workPagesQuery);
}

const newsPagesQuery = defineQuery(`*[_type == "news"] {
  ...,
  "plainContent": pt::text(content),
  author->{ name },
}`);

export async function fetchNewsPages(): Promise<NewsPagesQueryResult> {
  return sanityClient.fetch(newsPagesQuery);
}
