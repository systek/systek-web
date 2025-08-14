import { defineField, defineType } from "sanity";
import { imageTwo } from "./shared/imageTwo";
import { tagList } from "./shared/tagList";
import { image } from "./shared/image";
import { textBlock } from "./shared/text";

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
    defineField({
      name: "content",
      title: "Innhold",
      type: "array",
      of: [
        textBlock,
        image,
        imageTwo,
        tagList,
        defineField({
          type: "object",
          name: "list-group",
          title: "Listegruppe",
          fields: [
            defineField({
              type: "string",
              name: "title",
              title: "Tittel",
              validation: (rule) => rule.required(),
            }),
            defineField({
              type: "array",
              name: "items",
              title: "Elementer",
              of: [{ type: "string" }],
              options: {
                layout: "tags",
              },
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});
