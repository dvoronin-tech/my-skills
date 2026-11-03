---
name: batchprompt-device-images
description: Generate phone and tablet marketing images with the bundled batchpromptAlt generate.ts implementation. Use when the user provides a JSON file and one or both device background images, or points to a folder containing them. Blur backgrounds by default and disable blur only when requested.
---

# Generate Batchprompt Device Images

Use the exact bundled implementation under `runtime/`. It includes:

- `src/scripts/batchpromptAlt/generate.ts`;
- the complete `src/scripts/serviceScripts/` folder;
- `phone_in_hand.png`, `tablet_in_hands_smaller.png`, and `user_image_2.png`;
- the support files and installed packages required by those scripts.

Do not rewrite or replace the generator.

## Dynamic inputs

Resolve these from the paths or folder given by the user:

- one JSON file; prefer `form_data.json`, or use the only JSON file;
- a phone background, a tablet background, or both;
- `icon.svg` or another company logo/icon file when available.

The company icon is dynamic, not a fixed asset. The generator can work without it, but the output will have no company logo.

For folder requests, inspect files directly inside the folder. Recognize phone backgrounds from names containing `phone`, `mobile`, or `iphone`, and tablet backgrounds from names containing `tablet` or `ipad`. If a required choice is ambiguous, ask for the exact file.

## Blur

Pass `blur: true` by default. Pass `blur: false` only when the user clearly asks for no blur.

## Run the copied generator

Keep the global skill clean. Make a temporary copy of the `runtime/` folder and run the copied `generate.ts` there.

Inside the temporary runtime:

1. Create `src/data/input/job/`.
2. Copy the selected JSON to `src/data/input/job/form_data.json`.
3. Copy the phone background to `src/data/input/job/phone.webp` when supplied.
4. Copy the tablet background to `src/data/input/job/tablet.webp` when supplied.
5. Copy the logo/icon to `src/data/input/job/icon.svg` when supplied.
6. From the temporary runtime root, call the exported function with the local `tsx`:

```bash
./node_modules/.bin/tsx -e "import { generate } from './src/scripts/batchpromptAlt/generate'; generate({ generatePhoneImage: true, generateTabletImage: true, blur: true });"
```

Set each `generatePhoneImage` and `generateTabletImage` value from the supplied backgrounds. Change only `blur` when the user asks for no blur.

The copied generator writes `src/data/output/job/phone.webp` and/or `tablet.webp`. Copy them to a `generated/` folder beside the user's JSON unless the user requests another output folder. Do not overwrite existing results without approval. Remove the temporary runtime after the output files are safely copied.

## Compress all page images

After the generated files are safely copied, use the `image-compression` skill to compress every supported image asset in the page folder. Process the whole page folder, including images that were already there and were not used or created by the generator—not only the phone and tablet assets handled in this workflow. Follow the `image-compression` skill for dependency checks, output verification, source-file removal, and any required import updates.

Report the absolute output paths and show the generated images when local image display is available.
