import { formatSwtf } from '../src/index';

describe('Simple tests', () => {
    it('simple task', () => {
        expect(formatSwtf('- Create formatter for SWTF [p: high]\n')).toBe('- Create formatter for SWTF [p: high]\n');
    });

    it('fake task', () => {
        expect(formatSwtf('Create formatter for SWTF [p: high]\n')).toBe('');
    });

    it('white spaces task', () => {
        expect(formatSwtf('-      Create formatter for SWTF [p: high]\n')).toBe('- Create formatter for SWTF [p: high]\n');
    });

    it('fake level task', () => {
        expect(formatSwtf('    - Create formatter for SWTF [p: high]\n')).toBe('- Create formatter for SWTF [p: high]\n');
    });
});