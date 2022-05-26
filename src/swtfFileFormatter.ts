import { SwtfFile } from './swtfFile';
import { SwtfTaskFormatter } from './swtfTaskFormatter';


export class SwtfFileFormatter {
    private _file: SwtfFile;

    constructor(file: SwtfFile) {
        this._file = file;
    }

    public format(): string {
        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t));

        for (const fmt of fmts) {
            fmt.format();
        }

        return fmts.map(fmt => `${fmt}`).join('');
    }
}