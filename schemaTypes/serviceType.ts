import { defineField, defineType } from "sanity";
import { contentField } from "./shared/content";
import { contactField } from "./pages/contactField";

export const serviceType = defineType({
  name: "service",
  title: "Tjenester",
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
      title: "Slug",
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
      name: "heroImage",
      title: "Hovedbilde",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    contentField,
    contactField,
    defineField({
      name: "citation",
      title: "Sitat",
      type: "reference",
      to: [{ type: "citation" }],
    }),
    defineField({
      name: "works",
      title: "Arbeider",
      type: "array",
      of: [{ type: "reference", to: [{ type: "work" }] }],
      validation: (rule) => rule.unique().max(2),
    }),
  ],
});
