import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'src/app.ts',
        output: {
            dir: 'bin',
            format: 'cjs'
        },
        plugins: [typescript({ outDir: 'bin', declarationDir: 'bin/types' }), commonjs()]
    }
];