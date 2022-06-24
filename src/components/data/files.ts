import { fileURLToPath } from 'node:url';
// @ts-ignore
import fileArr, { filenames } from '../../migrations/v*/*.sql';

const files: {
    [version: string]: {
        [name: string]: string
    },
} = {};

(filenames as string[]).forEach((filename, i) => {
    const [ v, file ] = filename.slice(18).split('/');
    if(!(v in files)) files[v] = {};
    const filePath = fileURLToPath(new URL(fileArr[i].default, import.meta.url));
    files[v][file] = filePath;
});

const sorted: [name: string, path: string][][] = [];

for(const version in files){
    sorted[(version as any) - 1] = Object.keys(files[version]).sort().map(name => [name, files[version][name]]);
}

export default sorted;
