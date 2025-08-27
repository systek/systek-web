import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Globalt Oppsett",
  type: "document",
  fieldsets: [
    {
      name: "analytics",
      title: "Analytics",
      options: {
        collapsed: true,
      },
    },
    {
      name: "danger",
      title: "Danger Zone",
      options: {
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "analytics",
      title: "Enable Plausible Analytics",
      type: "boolean",
      description: "Enable Plausible Analytics",
      initialValue: false,
      fieldset: "analytics",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "analyticsHostname",
      title: "Plausible Hostname",
      type: "string",
      fieldset: "analytics",
      validation: (Rule) =>
        Rule.valueOfField("analytics")
          ? Rule.required()
          : Rule.custom(() => true),
    }),
    defineField({
      name: "hostname",
      title: "Hostname",
      type: "string",
      description: "The main site hostname, e.g. systek.no (no http)",
      fieldset: "danger",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
