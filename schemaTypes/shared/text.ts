import { defineField } from "sanity";

export const textBlock = defineField({
  type: "block",
  name: "data",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Quote", value: "blockquote" },
    { title: "Heading", value: "h2" },
  ],
});
