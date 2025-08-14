import { defineField, defineType } from "sanity";
import { imageTwo } from "./shared/imageTwo";
import { tagList } from "./shared/tagList";
import { image } from "./shared/image";
import { textBlock } from "./shared/text";

export const serviceType = defineType({
  name: "service",
  title: "Service",
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
      name: "heroImage",
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
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});
