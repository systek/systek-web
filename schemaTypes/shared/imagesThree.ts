import { defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const imagesThree = defineField({
  type: "object",
  name: "imagesThree",
  title: "3 bilder",
  icon: ImagesIcon,
  preview: {
    select: {
      first: "first",
      second: "second",
      third: "third",
    },
    prepare({ first, second, third }) {
      return {
        title: "Bildegalleri",
        subtitle: `${first?.alt || "Første bilde"} & ${second?.alt || "Andre bilde"} & ${third?.alt || "Tredje bilde"}`,
        media: first?.asset || second?.asset || third?.asset,
      };
    },
  },
  fields: [
    {
      type: "image",
      name: "first",
      title: "Bilde 1",
      options: { hotspot: true },
      fields: [
        {
          type: "string",
          name: "alt",
        },
      ],
      validation: (rule) => rule.required(),
    },
    {
      type: "image",
      name: "second",
      title: "Bilde 2",
      options: { hotspot: true },
      fields: [
        {
          type: "string",
          name: "alt",
        },
      ],
      validation: (rule) => rule.required(),
    },
    {
      type: "image",
      name: "third",
      title: "Bilde 3",
      options: { hotspot: true },
      fields: [
        {
          type: "string",
          name: "alt",
        },
      ],
      validation: (rule) => rule.required(),
    },
  ],
});
