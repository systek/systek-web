import { defineField, defineType } from "sanity";
import { textBlock } from "../shared/text";
import { imageTwo } from "../shared/imageTwo";
import { image } from "../shared/image";
import { listGroup } from "../shared/listGroup";
import { contactTwoField } from "./contactTwoField";
import { citationField } from "../shared/citation";
import { contentField } from "../shared/content";

export const workherePageType = defineType({
  name: "workherePageType",
  title: "Jobbe her",
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
          previews: [{ title: "4:3", aspectRatio: 4 / 3 }],
        },
      },
      validation: (Rule) => Rule.required(),
      fields: [{ name: "alt", type: "string", title: "Alt tekst" }],
    }),
    {
      ...contentField,
      name: "introText",
      title: "Introduksjonstekst",
    },
    defineField({
      name: "contentTitel",
      title: "Innhold Tittel",
      type: "string",
    }),
    contentField,
    contactTwoField,
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
    }),
    {
      ...contentField,
      name: "tldrText",
      title: "TL;DR om Systek",
    },
  ],
});
