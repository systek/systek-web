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
            S.divider(),
            S.listItem()
              .title("Forside")
              .child(
                S.document()
                  .schemaType("frontPageType")
                  .documentId("frontPageType")
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
            S.listItem()
              .title("Folka")
              .child(
                S.document()
                  .schemaType("staffPageType")
                  .documentId("staffPageType")
              ),
            S.listItem()
              .title("Jobbe her")
              .child(
                S.document()
                  .schemaType("workherePageType")
                  .documentId("workherePageType")
              ),
            S.divider(),
            S.listItem()
              .title("Sider")
              .child(S.documentTypeList("page").title("Sider")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                [
                  "siteSettings",
                  "frontPageType",
                  "workerPageType",
                  "servicesPageType",
                  "staffPageType",
                  "workherePageType",
                  "page",
                ].includes(item.getId() || "") === false
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
