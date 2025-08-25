import { defineField } from "sanity";
import { imageTwo } from "./imageTwo";
import { tagList } from "./tagList";
import { image } from "./image";
import { textBlock } from "./text";
import { listGroup } from "./listGroup";
import { imageGallery } from "./imageGallery";

export const contentField = defineField({
  name: "content",
  title: "Innhold",
  type: "array",
  of: [textBlock, image, imageTwo, imageGallery, tagList, listGroup],
  validation: (rule) => rule.required(),
});
