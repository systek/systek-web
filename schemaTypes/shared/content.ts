import { defineField } from "sanity";
import { imageTwo } from "./imageTwo";
import { tagList } from "./tagList";
import { image } from "./image";
import { textBlock } from "./text";
import { listGroup } from "./listGroup";

export const contentField = defineField({
  name: "content",
  title: "Innhold",
  type: "array",
  of: [textBlock, image, imageTwo, tagList, listGroup],
  validation: (rule) => rule.required(),
});
