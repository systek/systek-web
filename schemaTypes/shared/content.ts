import { defineField } from "sanity";
import { imageTwo } from "./imageTwo";
import { tagList } from "./tagList";
import { image } from "./image";
import { textBlock } from "./text";
import { listGroup } from "./listGroup";
import { imageGallery } from "./imageGallery";
import { imagesThree } from "./imagesThree";

export const contentField = defineField({
  name: "content",
  title: "Innhold",
  type: "array",
  of: [
    textBlock,
    image,
    imageTwo,
    imageGallery,
    imagesThree,
    tagList,
    listGroup,
  ],
  validation: (rule) => rule.required(),
});
