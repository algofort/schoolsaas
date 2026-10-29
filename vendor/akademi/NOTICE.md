# Akademi template assets

Original author: DexignLab. Source package: Akademi v1.1 (14 August 2023).

SCSS and the Bootstrap SCSS it imports were copied from the user-provided template for this project. The compiled theme lives in `src/styles/akademi.css`. Theme icon-font and Google Font imports are removed because the application uses React SVG icons and locally bundled Poppins fonts (with a system fallback). No original jQuery runtime or bundled node_modules is included.

The original template's purchase/usage license has not been established by the local package's metadata. Confirm the actual license and applicable asset rights before commercial distribution. Do not assume this folder is covered by a future application source-code license. Retain upstream attribution and third-party notices.

See `research/AKADEMI_TEMPLATE_REVIEW.md` for the local audit. Use `npm run theme:build` to regenerate the stylesheet from the retained SCSS. Layout refinements belong in `src/app/globals.css`.
