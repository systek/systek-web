import { defineField, defineType } from "sanity";
import { MarkerIcon } from "@sanity/icons";

export const locationType = defineType({
  name: "location",
  title: "Lokasjon",
  type: "document",
  icon: MarkerIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Brukes for filter på folka-siden",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      validation: (rule) => rule.required().min(1).integer(),
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address2",
      title: "Addresse linje 2",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Epost",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapLink",
      title: "Kartlink (Google Maps)",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
      fields: [
        {
          name: "alt",
          title: "Alt tekst",
          type: "string",
          description: "Beskriv bildet for synshemmede og SEO",
          validation: (rule) => rule.required(),
        },
      ],
    }),
  ],
});
