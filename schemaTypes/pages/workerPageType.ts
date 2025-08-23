import { defineField, defineType } from "sanity";
import { contactType } from "./contactType";

export const workerPageType = defineType({
  name: "workerPageType",
  title: "Arbeider Oppsett",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Arbeider Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    defineField({
      name: "heroImage",
      title: "Hovedbilde",
      type: "image",
      options: { hotspot: true },
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
    contactType,
    defineField({
      name: "workCount",
      title: "Antall Arbeider",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
