import { defineField } from "sanity";

export const contactField = defineField({
  name: "contact",
  title: "Kontakt",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "1:1", aspectRatio: 1 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-tekst",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title,
        media: media,
      };
    },
  },
});
