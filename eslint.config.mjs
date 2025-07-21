import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Relax TypeScript rules for production build
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      
      // Relax React rules
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      
      // Relax Next.js rules
      "@next/next/no-img-element": "warn",
      
      // Keep important rules as errors
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
