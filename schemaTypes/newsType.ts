import { defineField, defineType } from "sanity";
import { contentField } from "./shared/content";
import { SparklesIcon } from "@sanity/icons";

export const newsType = defineType({
  name: "news",
  title: "Nyheter",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Forfatter",
      type: "reference",
      to: [{ type: "staff" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Publisert",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Trykk på enter for å legge til flere",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    contentField,
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      authorName: "author.name",
    },
    prepare({ title, publishedAt, authorName }) {
      const dateObj = publishedAt ? new Date(publishedAt) : null;
      const formattedDate = dateObj
        ? dateObj.toLocaleDateString("no-NO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "Ukjent dato";
      return {
        title,
        subtitle: `${formattedDate} ${authorName ? `- ${authorName}` : ""}`,
      };
    },
  },
});
