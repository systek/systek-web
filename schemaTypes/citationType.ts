import { defineField, defineType } from "sanity";

export const citationType = defineType({
  name: "citation",
  title: "Sitat",
  type: "document",
  icon: () => "❝",
  fields: [
    defineField({
      name: "text",
      title: "Stitat",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      title: "Tjeneste",
      type: "reference",
      to: [{ type: "service" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Navn",
      description: "Navn på personen som har gitt sitatet",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      title: "Stilling og selskap",
      description: "Stilling og selskap til personen som har gitt sitatet",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "picture",
      title: "Bilde",
      description: "Bilde av personen som har gitt sitatet",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "1:1", aspectRatio: 1 / 1 }],
        },
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "text",
      media: "picture",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media: media?.asset,
      };
    },
  },
});
