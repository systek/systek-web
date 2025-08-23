import { defineField } from "sanity";

export const contactType = defineField({
  name: "contact",
  title: "Kontakt",
  type: "object",
  fields: [
    defineField({
      name: "contactPerson",
      title: "Kontaktperson",
      type: "reference",
      to: [{ type: "staff" }],
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
      options: { hotspot: true },
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
