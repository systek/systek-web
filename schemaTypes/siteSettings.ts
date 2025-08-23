import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Globalt Oppsett",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
    }),
    defineField({
      name: "showStaff",
      title: "Vis Ansatte Seksjon",
      type: "boolean",
      description: "Vis eller skjul ansatte seksjonen på hjemmesiden",
      initialValue: true,
    }),
  ],
});
