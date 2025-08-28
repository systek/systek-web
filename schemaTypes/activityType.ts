import { ActivityIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const activityType = defineType({
  name: "activity",
  title: "Aktiviteter",
  type: "document",
  icon: ActivityIcon,
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
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internal",
      title: "Intern",
      type: "boolean",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
  ],
});
