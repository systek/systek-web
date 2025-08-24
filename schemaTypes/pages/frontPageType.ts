import { defineField, defineType } from "sanity";
import { contactField } from "./contactField";

export const frontPageType = defineType({
  name: "frontPageType",
  title: "Forside Oppsett",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topDescription",
      title: "Topp Beskrivelse",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hovedbilde",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "2:1", aspectRatio: 2 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    defineField({
      name: "servicesTitle",
      title: "Tjenester Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workTitle",
      title: "Arbeider Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "selectedWorks",
      title: "Valgte Arbeider",
      type: "array",
      of: [{ type: "reference", to: [{ type: "work" }] }],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    defineField({
      name: "activityTitle",
      title: "Aktivitet Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "activityImage",
      title: "Activitets Bilde",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "2:1", aspectRatio: 2 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    defineField({
      name: "vacanciesTitle",
      title: "Jobbe her tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "vacanciesImage",
      title: "Jobbe her bilde",
      type: "image",
      options: {
        hotspot: {
          previews: [
            { title: "2:1", aspectRatio: 2 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    defineField({
      name: "vacanciesPoints",
      title: "Jobbe her punkter",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Tittel",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "string",
              title: "Beskrivelse",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(5),
    }),
    contactField,
  ],
});
