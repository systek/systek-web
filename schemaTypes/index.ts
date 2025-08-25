import { siteSettings } from "./siteSettings";
import { workerPageType } from "./pages/workerPageType";
import { servicesPageType } from "./pages/servicesPageType";
import { frontPageType } from "./pages/frontPageType";
import { staffPageType } from "./pages/staffPageType";
import { workherePageType } from "./pages/workherePageType";

import { activityType } from "./activityType";
import { blogType } from "./blogType";
import { logoType } from "./logoType";
import { newsType } from "./newsType";
import { serviceType } from "./serviceType";
import { workType } from "./workType";
import { staffType } from "./staffType";
import { citationType } from "./citationType";
import { pageType } from "./pageType";
import { vacanciesType } from "./vacanciesType";

export const schemaTypes = [
  siteSettings,
  frontPageType,
  workerPageType,
  servicesPageType,
  staffPageType,
  workherePageType,
  serviceType,
  newsType,
  logoType,
  workType,
  activityType,
  blogType,
  staffType,
  citationType,
  pageType,
  vacanciesType,
];
