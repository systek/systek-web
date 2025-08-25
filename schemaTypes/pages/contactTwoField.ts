import { defineField } from "sanity";

export const contactTwoField = defineField({
  name: "contactTwo",
  title: "Kontakt med 2 bilder",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Liten tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Tekst",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactOne",
      title: "Kontakt person 1",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "1:1", aspectRatio: 1 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [
        { name: "alt", type: "string", title: "Alt tekst" },
        { name: "name", type: "string", title: "Navn" },
        { name: "position", type: "string", title: "Posisjon" },
        { name: "email", type: "string", title: "E-post" },
        { name: "phone", type: "string", title: "Telefon" },
      ],
    }),
    defineField({
      name: "contactTwo",
      title: "Kontakt person 2",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "1:1", aspectRatio: 1 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [
        { name: "alt", type: "string", title: "Alt tekst" },
        { name: "name", type: "string", title: "Navn" },
        { name: "position", type: "string", title: "Posisjon" },
        { name: "email", type: "string", title: "E-post" },
        { name: "phone", type: "string", title: "Telefon" },
      ],
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
