import { SwtfFile } from './swtfFile';
import { SwtfFileFormatter } from './SwtfFileFormatter';

export function formatSwtf(rawSwtf: string): string {
    const swtfFile = new SwtfFile({ content: rawSwtf });
    const fmt = new SwtfFileFormatter(swtfFile);
    return fmt.format();
}

export { SwtfFile } from './swtfFile';
export { SwtfFileFormatter } from './SwtfFileFormatter';
