import { ActivityIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const activityType = defineType({
  name: "activity",
  title: "Aktiviteter",
  type: "document",
  icon: ActivityIcon,
  fieldsets: [
    {
      name: "links",
      title: "Lenke",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Dato",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasjon",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internal",
      title: "Intern",
      type: "boolean",
      validation: (rule) => rule.required(),
      fieldset: "links",
    }),
    defineField({
      name: "registrationUrl",
      title: "Lenke for påmelding eller mer informasjon",
      type: "url",
      description: "Tilgjengelig for eksterne aktiviteter",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto"] }),
      fieldset: "links",
    }),
    defineField({
      name: "isRegistrationUrl",
      title: "Er påmeldingslenke",
      type: "boolean",
      initialValue: false,
      description:
        "Marker denne hvis lenken over er en påmeldingslenke. Hvis ikke, antas det at lenken er for mer informasjon.",
      validation: (rule) => rule.required(),
      fieldset: "links",
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      internal: "internal",
    },
    prepare({ title, date, internal }) {
      const dateObj = date ? new Date(date) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleDateString("no-NO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "Ukjent dato";
      return {
        title,
        subtitle: `${formattedDate} ${internal ? "(Intern)" : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Dato, nyeste først",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Dato, eldste først",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
});
