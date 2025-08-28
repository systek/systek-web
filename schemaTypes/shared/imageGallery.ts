import { defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const imageGallery = defineField({
  type: "object",
  name: "imageGallery",
  title: "Bildegalleri",
  icon: ImagesIcon,
  description: "4 bilder",
  options: {
    collapsible: true,
    collapsed: false,
  },
  preview: {
    select: {
      first: "first",
      second: "second",
      third: "third",
      fourth: "fourth",
    },
    prepare({ first, second, third, fourth }) {
      return {
        title: "Bildegalleri",
        subtitle: `${first?.alt || "Første bilde"} & ${second?.alt || "Andre bilde"} & ${third?.alt || "Tredje bilde"} & ${fourth?.alt || "Fjerde bilde"}`,
        media: first?.asset || second?.asset || third?.asset || fourth?.asset,
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
    {
      type: "image",
      name: "fourth",
      title: "Bilde 4",
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
