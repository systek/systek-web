import { SearchIcon } from "@sanity/icons";
import { defineField } from "sanity";

export const tagList = defineField({
  type: "object",
  name: "tags-list",
  title: "Stikkord",
  icon: SearchIcon,
  description: "En liste over stikkord",
  fields: [
    defineField({
      type: "array",
      name: "items",
      title: "Stikkord",
      description: "Trykk Enter for å legge til nytt stikkord",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }) {
      return {
        title: "Stikkord",
        subtitle: items.join(", "),
      };
    },
  },
});
