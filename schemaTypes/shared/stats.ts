import { defineField, defineArrayMember } from "sanity";

export const stats = defineField({
  name: "stats",
  title: "Statisikk",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "array",
      name: "items",
      options: {
        layout: "grid",
      },
      of: [
        defineArrayMember({
          type: "object",
          name: "statItem",
          title: "Stat Item",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: subtitle ? `Value: ${subtitle}` : "No value provided",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(3),
    }),
  ],
});
