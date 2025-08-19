import { defineField } from "sanity";

export const listGroup = defineField({
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
});
