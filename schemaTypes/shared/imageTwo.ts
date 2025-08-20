import { defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const imageTwo = defineField({
  type: "object",
  name: "imageTwo",
  title: "Bildepar",
  icon: ImagesIcon,
  description: "To bilder med tilleggsinformasjon",
  preview: {
    select: {
      first: "first",
      second: "second",
    },
    prepare({ first, second }) {
      return {
        title: "Bildepar",
        subtitle: `${first?.alt || "Første bilde"} & ${second?.alt || "Andre bilde"}`,
        media: first?.asset || second?.asset,
      };
    },
  },
  fields: [
    {
      type: "image",
      name: "first",
      title: "Første bilde",
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: "string",
          name: "alt",
        },
        {
          type: "string",
          name: "caption",
        },
      ],
      validation: (rule) => rule.required(),
    },
    {
      type: "image",
      name: "second",
      title: "Andre bilde",
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: "string",
          name: "alt",
        },
        {
          type: "string",
          name: "caption",
        },
      ],
      validation: (rule) => rule.required(),
    },
  ],
});
