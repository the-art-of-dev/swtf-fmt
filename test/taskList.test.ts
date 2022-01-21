import { formatSwtf } from '../src/index';

describe('Simple task list', () => {
    it('white spaces task list', () => {
        const rawTasks = `
        - Create formatter for SWTF [p: high]
            - Init repository [done]
            - Create formatter [in_progress]
            - Create README [ready]
        `;

        const expectedOutput = [
            '- Create formatter for SWTF [p: high]\n',
            `${' '.repeat(4)}- Init repository [done]\n`,
            `${' '.repeat(4)}- Create formatter [in_progress]\n`,
            `${' '.repeat(4)}- Create README [ready]\n`
        ].join('');
        expect(formatSwtf(rawTasks)).toBe(expectedOutput);
    });
});