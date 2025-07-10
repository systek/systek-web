import { defineField, defineType } from "sanity";

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
        defineField({
          type: "block",
          name: "data",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Quote", value: "blockquote" },
            { title: "Heading", value: "h2" },
          ],
        }),
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
        defineField({
          type: "image",
          name: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              type: "text",
              name: "alt",
            },
            {
              type: "text",
              name: "caption",
            },
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "array",
      name: "tags",
      title: "Stikkord",
      of: [{ type: "string" }],
    }),
  ],
});
