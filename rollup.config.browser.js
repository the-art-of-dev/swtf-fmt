import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/bundle.js',
            format: 'iife',
            name: 'swtfFmt'
        },
        plugins: [
            typescript(),
            commonjs(),
            nodeResolve(),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/bundle.min.js',
            format: 'iife',
            name: 'swtfFmt'
        },
        plugins: [
            typescript(),
            commonjs(),
            nodeResolve(),
            babel({ babelHelpers: 'bundled' }),
            terser()
        ]
    }
];