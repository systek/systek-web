import { defineField, defineType } from "sanity";
import { contentField } from "../shared/content";
import { workHereField } from "../shared/workHereField";
import { imageGallery } from "../shared/imageGallery";

export const aboutPageType = defineType({
  name: "aboutPageType",
  title: "Om Oss",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentTitle",
      title: "Innholdstittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    contentField,
    defineField({
      name: "summaryLabel",
      title: "Merkelapp",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summaryTitle",
      title: "Overskrift",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    imageGallery,
    workHereField,
  ],
});
