import { defineField, defineType } from "sanity";
import { contactField } from "./contactField";
import { imageGallery } from "../shared/imageGallery";

export const staffPageType = defineType({
  name: "staffPageType",
  title: "Folka",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
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
      name: "galleryText",
      title: "Galleritekst",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    imageGallery,
    contactField,
  ],
});
