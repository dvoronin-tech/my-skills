import * as fs from 'fs';
import * as path from 'path';
import fg from 'fast-glob';
import { execSync } from 'child_process';
import { getFromToPath } from '@utils/getPath';
import { getAssetsDir, getSrcDir } from '@utils/getPath';
import { PathOptions } from '@type/path.types';

interface GenerateBaseOptions {
    generatePhoneImage: boolean;
    generateTabletImage: boolean;
    phoneBgFileName?: `${string}.${string}`;
    tabletBgFileName?: `${string}.${string}`;
    blur?: boolean;
}

type GenerateFunc = (options: GenerateBaseOptions, pathOptions: PathOptions) => void;

export const generate: GenerateFunc = (
    {
        generatePhoneImage,
        generateTabletImage,
        phoneBgFileName = 'phone.webp',
        tabletBgFileName = 'tablet.webp',
        blur = true,
    },
    pathOptions?: PathOptions,
) => {
    const { from, to } = getFromToPath(pathOptions);

    fs.mkdirSync(to, { recursive: true });
    const formDataFiles = fg.sync(['**/*.json'], { cwd: from, absolute: false });

    for (const formDataFile of formDataFiles) {
        const folder = path.dirname(formDataFile);
        fs.mkdirSync(path.join(to, folder), { recursive: true });
        if (generatePhoneImage) {
            generatePhone({ folder, phoneBgFileName, blur }, { from, to });
        }
        if (generateTabletImage) {
            generateTablet({ folder, tabletBgFileName, blur }, { from, to });
        }
    }
};

interface GenerateTabletOptions {
    folder: string;
    tabletBgFileName?: `${string}.${string}`;
    blur: boolean;
}

const generateTablet = (
    { folder, tabletBgFileName = 'tablet.webp', blur }: GenerateTabletOptions,
    { from, to }: { from: string; to: string },
) => {
    if (!fs.existsSync(path.join(from, folder, tabletBgFileName))) {
        console.log('tablet image not found for ' + folder + ' ❌');
    }

    const inputTabletBgPath = path.join(from, folder, tabletBgFileName);
    const outputTabletBgPath = path.join(to, folder, 'tablet.webp');
    const formDataPath = path.join(from, folder, 'form_data.json');
    const iconPath = path.join(from, folder, 'icon.svg');
    const userImagePath = path.join(getAssetsDir(), 'user_image_2.png');
    const outputTabletTmpPath = path.join(to, folder, 'tablet.tmp.png');
    const tabletScriptPath = path.join(getSrcDir(), 'scripts', 'serviceScripts', 'tablet.ts');

    execSync(
        `magick '${inputTabletBgPath}' -resize 1024x768^ ${blur ? '-blur 10x10' : ''} -gravity center -extent 1024x768 \\( src/assets/tablet_in_hands_smaller.png -resize 55% \\) -gravity center -composite ${outputTabletBgPath}`,
    );

    execSync(
        `npx tsx ${tabletScriptPath} '${outputTabletBgPath}' '${formDataPath}' '${iconPath}' '${userImagePath}' '${outputTabletTmpPath}' && mv '${outputTabletTmpPath}' '${outputTabletBgPath}'`,
    );

    console.log('tablet image generated for ' + folder + ' ✅');
};

interface GeneratePhoneOptions {
    folder: string;
    phoneBgFileName?: `${string}.${string}`;
    blur: boolean;
}

const generatePhone = (
    { folder, phoneBgFileName = 'phone.webp', blur }: GeneratePhoneOptions,
    { from, to }: { from: string; to: string },
) => {
    if (!fs.existsSync(path.join(from, folder, phoneBgFileName))) {
        console.log('phone image not found for ' + folder + ' ❌');
    }

    const inputPhoneBgPath = path.join(from, folder, phoneBgFileName);
    const outputPhoneBgPath = path.join(to, folder, 'phone.webp');
    const formDataPath = path.join(from, folder, 'form_data.json');
    const iconPath = path.join(from, folder, 'icon.svg');
    const phoneScriptPath = path.join(getSrcDir(), 'scripts', 'serviceScripts', 'mobile.ts');
    const outputPhoneTmpPath = path.join(to, folder, 'phone.tmp.png');

    execSync(
        `magick '${inputPhoneBgPath}' -resize 1024x768^ ${blur ? '-blur 10x10' : ''} -gravity center -extent 1024x768 \\( src/assets/phone_in_hand.png -resize 101% \\) -gravity center -composite ${outputPhoneBgPath}`,
    );

    execSync(
        `npx tsx ${phoneScriptPath} '${outputPhoneBgPath}' '${formDataPath}' '${iconPath}' '${outputPhoneTmpPath}' --scale 1 --scale-content 1.6 --scale-logo 1.5 --supersample 8 && mv '${outputPhoneTmpPath}' '${outputPhoneBgPath}'`,
    );

    console.log('phone image generated for ' + folder + ' ✅');
};

export default generate;
