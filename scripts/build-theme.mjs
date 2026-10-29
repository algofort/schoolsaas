import { compile } from "sass";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const result = compile(fileURLToPath(new URL("vendor/akademi/scss/main.scss", root)), {
  style: "compressed",
  silenceDeprecations: [
    "legacy-js-api",
    "import",
    "global-builtin",
    "color-functions",
    "slash-div",
    "mixed-decls",
    "if-function",
  ],
  quietDeps: true,
  logger: { warn() {}, debug() {} },
});
// Icon fonts are replaced by React SVG icons. Keep the theme independent of Google Fonts at runtime.
const css = result.css
  .replace(/@import\s*(?:url\([^)]*\)|"[^"]*"|'[^']*')[^;]*;/g, "")
  .replace(/(?:\.\/)?\.\.\/images\//g, "/vendor/akademi/images/")
  .replace(/url\((['"]?)(\/vendor\/akademi\/images\/[^)'"\s]+)\1\)/g, (value, _quote, asset) =>
    existsSync(new URL(`public${asset}`, root)) ? value : "none",
  );
await mkdir(new URL("src/styles/", root), { recursive: true });
await writeFile(new URL("src/styles/akademi.css", root), css);
console.log("Akademi stylesheet rebuilt. Review browser layouts after changing upstream SCSS.");
