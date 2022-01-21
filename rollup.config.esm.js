import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

export default [
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist',
            format: 'esm'
        },
        plugins: [typescript(), babel({ babelHelpers: 'bundled' })]
    }
];