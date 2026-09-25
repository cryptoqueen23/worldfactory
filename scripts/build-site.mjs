import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const output = resolve(root, 'site-dist');

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'experience'), { recursive: true });
await cp(resolve(root, 'website'), output, { recursive: true });
await cp(resolve(root, 'dist'), resolve(output, 'experience'), { recursive: true });

console.log('Built World Factory website at / and IWSDK experience at /experience/.');
