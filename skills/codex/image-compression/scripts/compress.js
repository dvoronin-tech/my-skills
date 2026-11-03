#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');

async function checkDependencies() {
    try {
        execSync('magick -version', { stdio: 'ignore' });
    } catch (e) {
        console.error('❌ Ошибка: не найдена команда "magick". Установите ImageMagick (например, brew install imagemagick).');
        process.exit(1);
    }
    try {
        execSync('pngquant --version', { stdio: 'ignore' });
    } catch (e) {
        console.error('❌ Ошибка: не найдена команда "pngquant". Установите pngquant (например, brew install pngquant).');
        process.exit(1);
    }
}

async function main() {
    await checkDependencies();

    const args = process.argv.slice(2);
    let inputPath = '';
    let outputDir = '';
    let outputExtension = '.webp';
    const exceptedFiles = [];
    const exceptedExtensions = [];

    // Basic arg parsing
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--ext') {
            outputExtension = args[++i];
            if (!outputExtension.startsWith('.')) outputExtension = '.' + outputExtension;
        } else if (args[i] === '--except-file') {
            exceptedFiles.push(args[++i]);
        } else if (args[i] === '--except-ext') {
            let ext = args[++i];
            if (!ext.startsWith('.')) ext = '.' + ext;
            exceptedExtensions.push(ext);
        } else if (!inputPath) {
            inputPath = args[i];
        } else if (!outputDir) {
            outputDir = args[i];
        }
    }

    if (!inputPath) {
        console.error('Использование: node compress.js <путь_к_файлу_или_папке> [путь_к_папке_вывода] [--ext .webp]');
        process.exit(1);
    }

    const absInput = path.resolve(inputPath);
    if (!fs.existsSync(absInput)) {
        console.error(`❌ Входной путь не существует: ${absInput}`);
        process.exit(1);
    }

    const stat = fs.statSync(absInput);
    const isDir = stat.isDirectory();
    
    if (!outputDir) {
        if (isDir) {
            outputDir = path.join(absInput, 'compressed');
        } else {
            outputDir = path.join(path.dirname(absInput), 'compressed');
        }
    }
    const absOutput = path.resolve(outputDir);

    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

    const processFile = async (filePath, outDir) => {
        const fileName = path.basename(filePath);
        if (fileName === '.DS_Store') return;

        const ext = path.extname(filePath).toLowerCase();
        
        const relativePath = path.relative(isDir ? absInput : path.dirname(absInput), filePath);
        let outFilePath = path.join(absOutput, relativePath);
        
        if (exceptedFiles.includes(fileName) || exceptedExtensions.includes(ext)) {
            // Копируем исключенные файлы без обработки
            if (validExtensions.includes(ext)) {
                fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
                fs.copyFileSync(filePath, outFilePath);
                console.log(`📑 ${fileName} скопирован (исключение)`);
            }
            return;
        }

        if (!validExtensions.includes(ext)) {
            return; // Пропускаем не-изображения
        }

        outFilePath = path.join(absOutput, relativePath.replace(new RegExp(`\\${ext}$`, 'i'), outputExtension));
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });

        const tmpPng = path.join(path.dirname(outFilePath), `tmp_${Date.now()}_${path.basename(filePath, ext)}.png`);

        try {
            console.log(`⏳ Обработка: ${filePath}`);
            
            // 1. Convert to temporary PNG
            await exec(`magick "${filePath}" "${tmpPng}"`);
            
            // 2. Compress with pngquant
            await exec(`pngquant -f "${tmpPng}" -o "${tmpPng}"`);
            
            // 3. Convert to final format
            await exec(`magick "${tmpPng}" "${outFilePath}"`);
            
            console.log(`✅ Успешно: ${outFilePath}`);
        } catch (error) {
            console.error(`❌ Ошибка обработки ${filePath}:`, error.message);
        } finally {
            if (fs.existsSync(tmpPng)) {
                fs.unlinkSync(tmpPng);
            }
        }
    };

    if (isDir) {
        const getFiles = (dir) => {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach((file) => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat && stat.isDirectory()) {
                    results = results.concat(getFiles(fullPath));
                } else {
                    results.push(fullPath);
                }
            });
            return results;
        };
        const files = getFiles(absInput);
        for (const file of files) {
            await processFile(file, absOutput);
        }
    } else {
        await processFile(absInput, absOutput);
    }
}

main().catch(console.error);
