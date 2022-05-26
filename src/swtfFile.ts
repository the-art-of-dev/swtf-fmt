import path from 'path';
import fs from 'fs-extra';
import { parseSwtf, SwtfTask } from 'swtf-parser';

export interface SwtfFileOptions {
    content?: string;
    absolutePath?: string;
}

export class SwtfFile {
    private _absolutePath: string;
    private _content: string;

    constructor(options: SwtfFileOptions) {
        this._absolutePath = options.absolutePath;
        this._content = options.content;
    }


    //Getters and Setters

    public get content(): string {
        return this._content;
    }

    public set content(v: string) {
        this._content = v;
    }


    public get absolutePath(): string {
        return this._absolutePath;
    }


    public get name(): string {
        return path.basename(this._absolutePath);
    }


    public get tasks(): SwtfTask[] {
        return parseSwtf(this._content);
    }


    //Methods

    public async load(): Promise<void> {
        this._content = (await fs.readFile(this._absolutePath)).toString();
    }

    public async update(): Promise<void> {
        await fs.writeFile(this._absolutePath, this.content);
    }
}
