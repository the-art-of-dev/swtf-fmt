import { AfterSAM, SwtfAttributeMagicRegistry, TodaySAM } from './swtfAttributeMagic';
import { SwtfFile } from './swtfFile';
import { SwtfTaskFormatter } from './swtfTaskFormatter';


export class SwtfFileFormatter {
    private _file: SwtfFile;

    constructor(file: SwtfFile) {
        this._file = file;
    }

    public format(): string {
        const registry = new SwtfAttributeMagicRegistry();

        registry.registerMagic(TodaySAM);
        registry.registerMagic(AfterSAM);

        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t, registry));

        for (const fmt of fmts) {
            fmt.format();
        }

        return fmts.map(fmt => `${fmt}`).join('');
    }
}