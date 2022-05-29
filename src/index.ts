import { SwtfFile } from './swtfFile';
import { SwtfFileFormatter, SwtfFileFormatterOptions } from './SwtfFileFormatter';

export function formatSwtf(rawSwtf: string, options?: SwtfFileFormatterOptions): string {
    const swtfFile = new SwtfFile({ content: rawSwtf });
    const fmt = new SwtfFileFormatter(swtfFile, options);
    return fmt.format();
}

export { SwtfFile } from './swtfFile';
export { SwtfFileFormatter } from './SwtfFileFormatter';
