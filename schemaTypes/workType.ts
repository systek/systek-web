import { defineField, defineType } from "sanity";
import { stats } from "./shared/stats";
import { contentField } from "./shared/content";
import { citationField } from "./shared/citation";
import { CaseIcon } from "@sanity/icons";

export const workType = defineType({
  name: "work",
  title: "Arbeider",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      description: "Laveste tall vises først",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Start dato",
      name: "startDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      title: "Slutt dato",
      name: "endDate",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "services",
      title: "Tjenester",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Bilde",
      options: {
        hotspot: {
          previews: [
            { title: "2:1", aspectRatio: 2 / 1 },
            { title: "4:3", aspectRatio: 4 / 3 },
          ],
        },
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    contentField,
    defineField({
      name: "technologiesTitle",
      title: "Brukte teknologier tittel",
      type: "string",
      description: "Tittel over brukte teknologier",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "array",
      name: "technologies",
      title: "Brukte teknologier",
      description: "Trykk Enter for å legge til ny teknologi",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    stats,
    citationField,
    defineField({
      name: "contactTwo",
      title: "Kontakter",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Liten tittel",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "title",
          title: "Tittel",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "contacts",
          title: "Kontakt personer",
          type: "array",
          of: [
            defineField({
              name: "contact",
              title: "Kontakt person",
              type: "reference",
              to: [{ type: "staff" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          validation: (Rule) => Rule.required().min(1).max(2),
        }),
      ],
      preview: {
        select: {
          title: "title",
          media: "image",
        },
        prepare(selection) {
          const { title, media } = selection;
          return {
            title: title,
            media: media,
          };
        },
      },
    }),
  ],
});
