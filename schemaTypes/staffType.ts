import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const staffType = defineType({
  name: "staff",
  title: "Folka",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      // Can not start with space
      validation: (rule) => rule.required().regex(/^\S.*$/, "no leading space"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "reference",
      to: [{ type: "location" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "serviceType",
      type: "reference",
      to: [{ type: "service" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-post",
      description: "Brukes på arbeider-siden",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Hovedbilde",
      options: {
        hotspot: {
          previews: [{ title: "1:1", aspectRatio: 1 / 1 }],
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageSecondary",
      type: "image",
      title: "Sekundærbilde",
      options: {
        hotspot: {
          previews: [{ title: "1:1", aspectRatio: 1 / 1 }],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "position",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Position: ${subtitle}` : "No position specified",
      };
    },
  },
});
