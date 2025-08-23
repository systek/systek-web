import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Systek-web",

  projectId: "s9j0sgbs",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Emne")
          .items([
            S.listItem()
              .title("Oppsett")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Arbeider")
              .child(
                S.document()
                  .schemaType("workerPageType")
                  .documentId("workerPageType")
              ),
            S.listItem()
              .title("Tjenester")
              .child(
                S.document()
                  .schemaType("servicesPageType")
                  .documentId("servicesPageType")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                ["siteSettings", "workerPageType", "servicesPageType"].includes(
                  item.getId() || ""
                ) === false
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
