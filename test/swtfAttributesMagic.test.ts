import { formatSwtf } from '../src/index';

describe('Simple tests', () => {
    it('today', () => {
        const today = new Date();
        const year = today.getFullYear() + '';
        const month = ('0' + today.getMonth()).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const date = `${day}.${month}.${year}.`;
        expect(formatSwtf('- Create formatter for SWTF [today]\n', { useMagic: true })).toBe(`- Create formatter for SWTF [${date}]\n`,);
    });

    it('after', () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const year = date.getFullYear() + '';
        const month = ('0' + date.getMonth()).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const output = `${day}.${month}.${year}.`;
        expect(formatSwtf('- Create formatter for SWTF [after: 3]\n', { useMagic: true })).toBe(`- Create formatter for SWTF [${output}]\n`);
    });

    it('statuses', () => {
        expect(formatSwtf('- [ready][in_progress][blocked][done]\n', { useMagic: true })).toBe('- [status: ready][status: in_progress][status: blocked][status: done]\n');
    });

    it('priority', () => {
        expect(formatSwtf('- [p1][p2][pp2][epe2][priority: 5]\n', { useMagic: true })).toBe('- [priority: 1][priority: 2][pp2][epe2][priority: 5]\n');
    });
});