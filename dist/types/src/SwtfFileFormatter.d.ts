import { SwtfFile } from './swtfFile';
export interface SwtfFileFormatterOptions {
    useMagic?: boolean;
}
export declare class SwtfFileFormatter {
    private _file;
    private _options;
    constructor(file: SwtfFile, options?: SwtfFileFormatterOptions);
    format(): string;
}
