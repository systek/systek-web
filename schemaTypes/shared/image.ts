import { defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const image = defineField({
  type: "image",
  name: "image",
  title: "Bilde",
  icon: ImageIcon,
  description: "Et enkelt bilde med tilleggsinformasjon",
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
