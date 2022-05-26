import { SwtfTask } from 'swtf-parser';
export interface SwtfFileOptions {
    content?: string;
    absolutePath?: string;
}
export declare class SwtfFile {
    private _absolutePath;
    private _content;
    constructor(options: SwtfFileOptions);
    get content(): string;
    set content(v: string);
    get absolutePath(): string;
    get name(): string;
    get tasks(): SwtfTask[];
    load(): Promise<void>;
    update(): Promise<void>;
}
