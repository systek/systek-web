import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import studio from "@sanity/eslint-config-studio";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist", ".astro", ".sanity", "src/lib/sanity.types.ts"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    files: ["sanity.config.ts", "sanity.cli.ts", "schemaTypes/**"],
    extends: [studio],
  },
  {
    rules: {
      // Allow picking props out of a rest spread, e.g. { index, ...attrs }
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
    },
  },
  // Formatting is Prettier's job
  prettier,
]);
