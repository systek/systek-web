import { defineField } from "sanity";

export const citationField = defineField({
  name: "citation",
  title: "Sitat",
  type: "reference",
  to: [{ type: "citation" }],
});
