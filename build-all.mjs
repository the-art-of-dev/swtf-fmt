#!/usr/bin/env zx

import { rm } from 'fs/promises';
import { existsSync } from 'fs';

if (existsSync('./dist')) await rm('./dist', { recursive: true });

await $`npm run test:build`;
await $`npm run test:build-coverage`;
await $`npm run build`;
await $`npm run build:browser`;
await $`npm run build:cli`;