import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    plugins: {
      js,
      react: pluginReact,
    },

    extends: [
      "js/recommended",
      pluginReact.configs.flat.recommended,
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,

        // Laravel Ziggy
        route: "readonly",
      },

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // React 17+ JSX transform
      "react/react-in-jsx-scope": "off",

      // Disable PropTypes requirement
      "react/prop-types": "off",

      // Allow apostrophes in text
      "react/no-unescaped-entities": "off",
    },
  },
]);