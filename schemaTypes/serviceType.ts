import { defineField, defineType } from "sanity";
import { contentField } from "./shared/content";
import { contactField } from "./shared/contactField";
import { CodeBlockIcon } from "@sanity/icons";

export const serviceType = defineType({
  name: "service",
  title: "Tjenester",
  type: "document",
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: "visible",
      title: "Synlig",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      validation: (rule) => rule.required().min(1).integer(),
    }),
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
        hotspot: {
          previews: [
            { title: "2:1", aspectRatio: 2 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
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
