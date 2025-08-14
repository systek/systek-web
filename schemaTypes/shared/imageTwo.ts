import { defineField } from "sanity";

export const imageTwo = defineField({
  type: "object",
  name: "imageTwo",
  title: "Bildepar",
  preview: {
    select: {
      first: "first",
      second: "second",
    },
    prepare({ first, second }) {
      return {
        title: "Bildepar",
        subtitle: `${first?.alt || "Første bilde"} & ${second?.alt || "Andre bilde"}`,
      };
    },
  },
  fields: [
    {
      type: "image",
      name: "first",
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: "string",
          name: "alt",
        },
        {
          type: "string",
          name: "caption",
        },
      ],
      validation: (rule) => rule.required(),
    },
    {
      type: "image",
      name: "second",
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: "string",
          name: "alt",
        },
        {
          type: "string",
          name: "caption",
        },
      ],
      validation: (rule) => rule.required(),
    },
  ],
});
