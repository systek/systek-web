import { defineField, defineType } from "sanity";

export const staffType = defineType({
  name: "staff",
  title: "Staff",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "position",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      options: {
        list: [
          { value: "oslo", title: "Oslo" },
          { value: "hamar", title: "Hamar" },
          { value: "grimstad", title: "Grimstad" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      type: "string",
      options: {
        list: [
          { value: "administration", title: "Administrasjon" },
          { value: "arkitektur", title: "Arkitektur" },
          { value: "analyse", title: "Data og analyse" },
          { value: "design", title: "Design" },
          { value: "plattform", title: "Plattform og sky" },
          { value: "prosjektledelse", title: "Prosjektledelse" },
          { value: "test", title: "Test" },
          { value: "utvikling", title: "Utvikling" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "position",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Position: ${subtitle}` : "No position specified",
      };
    },
  },
});
