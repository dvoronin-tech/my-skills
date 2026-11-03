import * as p from 'path';

export const normalizePath = (path: string): string => {
    return p.normalize(path.split('/').join(p.sep));
};
