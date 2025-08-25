import { defineField } from "sanity";
import { OlistIcon } from "@sanity/icons";

export const listGroup = defineField({
  type: "object",
  name: "list-group",
  title: "Listegruppe",
  icon: OlistIcon,
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
        layout: "list",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare({ title, items }) {
      return {
        title: title || "Listegruppe",
        subtitle: items ? items.join(", ") : "Ingen elementer",
      };
    },
  },
});
