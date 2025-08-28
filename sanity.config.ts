import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { CogIcon } from "@sanity/icons";

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
              .icon(CogIcon)
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
            S.listItem()
              .title("Om oss")
              .child(
                S.document()
                  .schemaType("aboutPageType")
                  .documentId("aboutPageType")
              ),
            S.divider(),
            S.listItem()
              .title("Andre Sider")
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
                  "aboutPageType",
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
