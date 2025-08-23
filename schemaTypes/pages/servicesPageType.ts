import { defineField, defineType } from "sanity";
import { contactType } from "./contactType";

export const servicesPageType = defineType({
  name: "servicesPageType",
  title: "Tjenester Oppsett",
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
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryImage",
      title: "Sekundært Bilde",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    defineField({
      name: "citations",
      title: "Sitat",
      type: "reference",
      to: [{ type: "citation" }],
    }),
    contactType,
  ],
});
