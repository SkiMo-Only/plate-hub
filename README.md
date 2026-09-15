# Plate Hub

A collection of custom keyboard plate files by **La-Versa.works**.

This repository contains plate files for various custom keyboards.

## Structure

```text
plate-hub/
├── MX/
│   └── Brand/
│       └── Keyboard/
│
└── EC/
    └── Brand/
        └── Keyboard/
```

### MX

Plates designed for MX-style mechanical switches.

[Browse MX plates](./MX)

### EC

Plates designed for electro-capacitive keyboards and related EC switch systems.

[Browse EC plates](./EC)

## File Formats

Depending on the plate, the following files may be provided:

- `.dxf` — 2D manufacturing file
- `.step` — 3D CAD file
- `.png` — plate preview

Some keyboards may include multiple plate variants within the same folder.

## Attribution

Unless otherwise stated in the README accompanying a specific plate, the plate files in this repository were designed or adapted by **La-Versa.works**.

Some EC plate designs may use modified switch-cutout geometry initially based on work by **Cipulot**.

## Catalog website

A browseable catalog lives in [`web/`](./web). It reads the `MX/` and `EC/` folders at build time and shows plate previews, variants, notes, and download links.

```text
cd web
pnpm install
pnpm dev
```

Then open the printed local URL. Production builds (`pnpm build`) copy plate files into `web/dist/files` so GitHub Pages can serve previews and CAD downloads.

GitHub Pages is deployed from `main` by [`.github/workflows/pages.yml`](./.github/workflows/pages.yml). Enable Pages with the **GitHub Actions** source in the repository settings.



## Disclaimer

The files are provided as-is.

Although they are prepared with manufacturing in mind, always verify dimensions, tolerances, material thickness, mounting points, and compatibility before ordering or manufacturing a plate.

Manufacturing results may vary depending on the material, process, and manufacturer.

## License

Unless otherwise noted, the contents of this repository are licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**.

[Read the license](./LICENSE.md)
