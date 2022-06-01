import { SwtfFile } from './swtfFile';
export declare enum SwtfSortingOrder {
    ASC = "asc",
    DESC = "desc"
}
export interface SwtfFileFormatterSortingOptions {
    sortBy?: string;
    order: SwtfSortingOrder;
}
export interface SwtfFileFormatterOptions {
    useMagic?: boolean;
    sort?: SwtfFileFormatterSortingOptions;
}
export declare class SwtfFileFormatter {
    private _file;
    private _options;
    private _magicRegistry;
    constructor(file: SwtfFile, options?: SwtfFileFormatterOptions);
    private _initRegistry;
    format(): string;
}
