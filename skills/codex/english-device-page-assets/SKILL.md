---
name: english-device-page-assets
description: Generate English AboutCourse phone and tablet assets for Butlerapp branchen or software pages from output/*.en.json, save them in each page's en folder, and update the matching English TypeScript imports. Use only for this Butlerapp repository asset layout.
---

# English Device Page Assets

Use the existing [batchprompt-device-images](../batchprompt-device-images/SKILL.md) skill for image generation. Read it completely before running the generator, and use its bundled runtime exactly as instructed. Do not copy or rewrite that generator into this skill.

## Map the requested pages

The JSON input root is `<repo>/output/`. When the user points to that folder, process every file ending in `.en.json`; otherwise process only the files they place in scope. For each JSON filename, strip only the final `.en.json` to get the case-sensitive page name.

Choose the page kind from the request. If it is not explicit, use exact folder matches. Ask only when a page name matches both kinds or the correct kind cannot be determined.

| Page kind | Asset root | English data root | Import prefix |
| --- | --- | --- | --- |
| `branchen` | `apps/website/src/assets/branchen` | `apps/website/src/data/localized/en/features/branchen` | `@assets/branchen` |
| `software` | `apps/website/src/assets/software` | `apps/website/src/data/localized/en/features/softwares` | `@assets/software` |

For page name `<page>`, require these existing inputs:

- `<asset-root>/<page>/01_Icon.svg`
- `<asset-root>/<page>/de/03_AboutCourse.webp` for the phone background
- `<asset-root>/<page>/de/04_AboutCourse.webp` for the tablet background
- `<data-root>/<page>-data.ts` for the later import update

The final assets are:

- `<asset-root>/<page>/en/03_AboutCourse.webp` for phone
- `<asset-root>/<page>/en/04_AboutCourse.webp` for tablet

## Preflight the full batch

Before writing anything:

1. List the selected JSON files in sorted order and validate that each is valid JSON.
2. Confirm every exact page folder and all four required inputs above exist. Do not guess a similar page name.
3. Inspect the visible UI strings in every `.en.json`; the filename alone does not prove that its content is English. If non-English UI text remains, report the exact files and values. Do not edit source JSON unless the user asks for that correction.
4. Check whether either final asset already exists. Do not overwrite it unless the current request explicitly authorizes replacement or regeneration.
5. Finish the complete preflight before generation so a missing page cannot leave a half-finished batch.

## Generate the images

Use one temporary copy of the `batchprompt-device-images` runtime for the batch. For each page, clear only the temporary `job` input and output directories, then copy:

- the selected JSON to `src/data/input/job/form_data.json`
- `de/03_AboutCourse.webp` to `src/data/input/job/phone.webp`
- `de/04_AboutCourse.webp` to `src/data/input/job/tablet.webp`
- `01_Icon.svg` to `src/data/input/job/icon.svg`

Run from the temporary runtime root with its local `tsx`:

```bash
./node_modules/.bin/tsx -e "import { generate } from './src/scripts/batchpromptAlt/generate'; generate({ generatePhoneImage: true, generateTabletImage: true, blur: false });"
```

For this repository flow, use `blur: false` unless the current user explicitly requests blur. After each successful job:

1. Confirm `src/data/output/job/phone.webp` and `tablet.webp` are non-empty.
2. Create `<asset-root>/<page>/en/` when needed.
3. Copy `phone.webp` to `03_AboutCourse.webp` and `tablet.webp` to `04_AboutCourse.webp`.

Never change the German source assets. Remove the temporary runtime only after all completed outputs are safely copied.

## Update the TypeScript imports

In `<data-root>/<page>-data.ts`, change only the two AboutCourse asset paths for that page:

```typescript
import AboutCourseFirst from '<import-prefix>/<page>/en/03_AboutCourse.webp?aboutCourse';
import AboutCourseSecond from '<import-prefix>/<page>/en/04_AboutCourse.webp?aboutCourse';
```

Replace `/de/` with `/en/` while preserving import names, query suffixes, formatting, and all unrelated user changes. If an import is already correct, leave it unchanged. Use a focused patch rather than formatting or rewriting the data files.

## Verify and report

- Confirm there are exactly two non-empty generated assets per selected JSON and that ImageMagick can read them as `1024x768` images.
- Confirm each matching English data file has both `/en/` AboutCourse imports, no targeted `/de/` AboutCourse import remains, and every imported asset exists.
- Run `git diff --check`.
- Run `pnpm --filter @butlerapp/website build` when dependencies are available. Report warnings separately from failures.
- Visually inspect at least one generated phone image and one tablet image to confirm English text, correct icon use, and no obvious rendering problem.
- Report the page kind, page count, image count, changed import count, build result, and absolute asset root. Show the inspected phone and tablet samples when local image display is available.
