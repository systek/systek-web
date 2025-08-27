import { defineField, defineType } from "sanity";

export const logoType = defineType({
  name: "logo",
  title: "Kundelogoer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Logo",
      type: "image",
      options: {
        accept: "image/svg+xml",
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});
