import { defineField } from "sanity";

export const workHereField = defineField({
  name: "workHere",
  title: "Jobbe her",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Liten tittel",
      type: "string",
      initialValue: "Jobbe her",
      validation: (Rule) => Rule.required(),
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
      name: "points",
      title: "Punkter",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "list",
      },
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt tekst",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
