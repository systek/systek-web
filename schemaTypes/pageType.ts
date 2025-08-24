import { defineField, defineType } from "sanity";
import { image } from "./shared/image";
import { imageTwo } from "./shared/imageTwo";

export const pageType = defineType({
  name: "page",
  title: "Sider",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Brukes til URL, systek.no/[slug]",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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
      ],
    }),
    defineField({
      name: "content",
      title: "Innhold",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Tittel", value: "h2" },
          ],
        },
        image,
        imageTwo,
        {
          type: "file",
          name: "file",
          title: "Fil",
          options: {
            accept: "application/pdf",
          },
          fields: [
            {
              name: "title",
              title: "Tittel",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        {
          title: "Intern lenke",
          name: "internal-link",
          type: "object",
          fields: [
            {
              name: "page",
              title: "Side",
              type: "reference",
              to: [{ type: "page" }],
            },
            {
              name: "text",
              title: "Tekst",
              type: "string",
            },
          ],
        },
        {
          title: "Ekstern lenke",
          name: "external-link",
          type: "object",
          fields: [
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({ scheme: ["http", "https", "mailto"] }),
            },
            {
              name: "text",
              title: "Tekst",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
