import * as path from 'path';
import { normalizePath } from './normalizePath';
import { PathOptions } from '@type/path.types';

export const getRootDir = () => {
    return process.cwd();
}

export const getSrcDir = () => {
    return path.join(getRootDir(), 'src');
}

export const getAssetsDir = () => {
    return path.join(getSrcDir(), 'assets');
}

export const getDataDir = () => {
    return path.join(getSrcDir(), 'data');
}

export const getInputDir = () => {
    return path.join(getDataDir(), 'input');
}

export const getOutputDir = () => {
    return path.join(getDataDir(), 'output');
}

export const getSupportDir = () => {
    return path.join(getDataDir(), 'support');
}

export const getFromToPath = ({from, to}: PathOptions = {}) => {
    const fromPath = from && path.join(getDataDir(), normalizePath(from)) || getInputDir();
    const toPath = to && path.join(getDataDir(), normalizePath(to)) || getOutputDir();

    return {
        from: fromPath,
        to: toPath
    }
}