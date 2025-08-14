import { defineField } from "sanity";

export const image = defineField({
  type: "image",
  name: "image",
  title: "Bilde",
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
});
