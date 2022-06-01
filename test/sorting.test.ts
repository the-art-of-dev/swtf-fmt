import { SwtfSortingOrder } from '../src/SwtfFileFormatter';
import { formatSwtf } from '../src/index';

describe('Sorting tests', () => {
    it('asc', () => {
        const tasks = [
            '- This is line 4 [p4]\n',
            '- This is line 3 [p3]\n',
            '- This is line 1 [p1]\n',
            '- This is line 2 [p2]\n',
        ].join('');

        const sortedTasks = [
            '- This is line 1 [priority: 1]\n',
            '- This is line 2 [priority: 2]\n',
            '- This is line 3 [priority: 3]\n',
            '- This is line 4 [priority: 4]\n',
        ].join('');

        expect(formatSwtf(tasks, {
            useMagic: true,
            sort: {
                sortBy: 'priority',
                order: SwtfSortingOrder.ASC
            }
        })).toBe(sortedTasks);
    });

    it('desc', () => {
        const tasks = [
            '- This is line 4 [p4]\n',
            '- This is line 3 [p3]\n',
            '- This is line 1 [p1]\n',
            '- This is line 2 [p2]\n',
        ].join('');

        const sortedTasks = [
            '- This is line 4 [priority: 4]\n',
            '- This is line 3 [priority: 3]\n',
            '- This is line 2 [priority: 2]\n',
            '- This is line 1 [priority: 1]\n',
        ].join('');

        expect(formatSwtf(tasks, {
            useMagic: true,
            sort: {
                sortBy: 'priority',
                order: SwtfSortingOrder.DESC
            }
        })).toBe(sortedTasks);
    });
});