import { defineField, defineType } from "sanity";
import { contactField } from "./contactField";

export const workerPageType = defineType({
  name: "workerPageType",
  title: "Arbeider Oppsett",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
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
    }),
    defineField({
      name: "logoTitle",
      title: "Logo Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listTitle",
      title: "Liste Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "servicesTitle",
      title: "Tjenester Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    contactField,
    defineField({
      name: "workCount",
      title: "Antall Arbeider",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
