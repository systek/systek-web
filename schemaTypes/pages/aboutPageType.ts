import { defineField, defineType } from "sanity";
import { contentField } from "../shared/content";
import { workHereField } from "../shared/workHereField";

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
      name: "works",
      title: "Arbeider",
      type: "array",
      of: [{ type: "reference", to: [{ type: "work" }] }],
      validation: (Rule) => Rule.required().length(3),
    }),
    defineField({
      name: "contentTitle",
      title: "Innholdstittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    contentField,
    workHereField,
  ],
});
