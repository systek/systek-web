import { defineField } from "sanity";

export const contactTwoField = defineField({
  name: "contactTwo",
  title: "Kontakt med 2 bilder",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
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
      name: "contacts",
      title: "Kontakt personer",
      type: "array",
      of: [
        defineField({
          name: "contact",
          title: "Kontakt person",
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
      validation: (Rule) => Rule.required().min(1).max(2),
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
