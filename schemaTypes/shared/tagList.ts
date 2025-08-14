import { defineField } from "sanity";

export const tagList = defineField({
  type: "object",
  name: "tags-list",
  title: "Stikkord",
  fields: [
    defineField({
      type: "array",
      name: "items",
      title: "Stikkord",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
