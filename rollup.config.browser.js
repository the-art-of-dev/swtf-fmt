import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/bundle.js',
            format: 'iife',
            name: 'swtfFmt'
        },
        plugins: [typescript(), commonjs(), nodeResolve(), babel({ babelHelpers: 'bundled' })]
    }
];