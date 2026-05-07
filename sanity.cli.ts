import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "s9j0sgbs",
    dataset: "production",
  },
  deployment: {
    appId: "yibbyuzsah7ywgznzui0xvgt",
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});
