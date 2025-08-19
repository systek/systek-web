import { defineField, defineType } from "sanity";
import { stats } from "./shared/stats";
import { contentField } from "./shared/content";

export const workType = defineType({
  name: "work",
  title: "Arbeider",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Start dato",
      name: "startDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      title: "Slutt dato",
      name: "endDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "services",
      title: "Tjenester",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Bilde",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    contentField,
    defineField({
      type: "array",
      name: "technologies",
      title: "Brukte teknologier",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    stats,
    defineField({
      name: "citation",
      title: "Sitat",
      type: "reference",
      to: [{ type: "citation" }],
    }),
  ],
});
