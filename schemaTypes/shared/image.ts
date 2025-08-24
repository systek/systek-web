import { defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const image = defineField({
  type: "image",
  name: "image",
  title: "Bilde",
  icon: ImageIcon,
  description: "Et enkelt bilde med tilleggsinformasjon",
  options: {
    hotspot: {
      previews: [
        { title: "2:1", aspectRatio: 2 / 1 },
        { title: "3:2", aspectRatio: 3 / 2 },
        { title: "4:3", aspectRatio: 4 / 3 },
        { title: "1:1", aspectRatio: 1 / 1 },
        { title: "4:5", aspectRatio: 4 / 5 },
      ],
    },
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
