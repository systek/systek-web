import { defineField, defineType } from "sanity";
import { contactTwoField } from "../shared/contactTwoField";
import { contentField } from "../shared/content";

export const workherePageType = defineType({
  name: "workherePageType",
  title: "Jobbe her",
  type: "document",
  fieldsets: [
    { name: "top", title: "Topp seksjon" },
    { name: "faq", title: "Ofte stilte spørsmål" },
    { name: "tldr", title: "TL;DR" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "top",
    }),
    defineField({
      name: "heroImage",
      title: "Hovedbilde",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "4:3", aspectRatio: 4 / 3 }],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
      fieldset: "top",
    }),
    defineField({
      name: "topLabel",
      title: "Topp label",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "top",
    }),
    {
      ...contentField,
      name: "introText",
      title: "Introduksjonstekst",
    },
    defineField({
      name: "vacanciesTitle",
      title: "Åpne roller Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentTitel",
      title: "Innhold Tittel",
      type: "string",
    }),
    contentField,
    contactTwoField,
    defineField({
      name: "faqTitle",
      title: "Ofte stilte spørsmål Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "faq",
    }),
    defineField({
      name: "faqLabel",
      title: "Ofte stilte spørsmål Label",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "faq",
    }),
    defineField({
      name: "faqList",
      title: "Ofte stilte spørsmål",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Tittel",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "text",
              title: "Beskrivelse",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title };
            },
          },
        },
      ],
      fieldset: "faq",
    }),
    defineField({
      name: "tldrTitle",
      title: "TL;DR Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "tldr",
    }),
    {
      ...contentField,
      name: "tldrText",
      title: "TL;DR om Systek",
      fieldset: "tldr",
    },
  ],
});
