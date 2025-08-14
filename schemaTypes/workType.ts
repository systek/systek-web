import { defineField, defineType } from "sanity";
import { textBlock } from "./shared/text";
import { image } from "./shared/image";
import { imageTwo } from "./shared/imageTwo";
import { stats } from "./shared/stats";

export const workType = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
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
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Start date",
      name: "startDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      title: "End date",
      name: "endDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "array",
      of: [textBlock, image, imageTwo],
      validation: (rule) => rule.required(),
    }),
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
  ],
});
