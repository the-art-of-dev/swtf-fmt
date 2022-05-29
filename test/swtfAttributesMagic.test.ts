import { formatSwtf } from '../src/index';

describe('Simple tests', () => {
    it('today', () => {
        const today = new Date();
        const year = today.getFullYear() + '';
        const month = ('0' + today.getMonth()).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const date = `${day}.${month}.${year}.`;
        expect(formatSwtf('- Create formatter for SWTF [today]\n')).toBe(`- Create formatter for SWTF [${date}]\n`);
    });

    it('after', () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const year = date.getFullYear() + '';
        const month = ('0' + date.getMonth()).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const output = `${day}.${month}.${year}.`;
        expect(formatSwtf('- Create formatter for SWTF [after: 3]\n')).toBe(`- Create formatter for SWTF [${output}]\n`);
    });

    it('statuses', () => {
        expect(formatSwtf('- [ready][in_progress][blocked][done]\n')).toBe('- [status: ready][status: in_progress][status: blocked][status: done]\n');
    });
});