import { defineField, defineType } from "sanity";
import { AddUserIcon } from "@sanity/icons";

export const vacanciesType = defineType({
  name: "vacancies",
  title: "Ledige stillinger",
  type: "document",
  icon: AddUserIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Kort beskrivelse",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Lokasjon",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Dato",
      type: "date",
      options: {
        dateFormat: "DD.MM.YYYY",
      },
    }),
    defineField({
      name: "href",
      title: "Lenke",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "services",
      title: "Tilknyttede tjenester",
      description: "Brukes for å vise relaterte stillinger på tjenestesider",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "service" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
    },
    prepare({ title, location }) {
      return {
        title,
        subtitle: location,
      };
    },
  },
});
