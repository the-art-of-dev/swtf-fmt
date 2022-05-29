import { AfterSAM, StatusSAM, SwtfAttributeMagicRegistry, TodaySAM } from './swtfAttributeMagic';
import { SwtfFile } from './swtfFile';
import { SwtfTaskFormatter } from './swtfTaskFormatter';


export interface SwtfFileFormatterOptions {
    useMagic?: boolean;
}

export class SwtfFileFormatter {
    private _file: SwtfFile;
    private _options: SwtfFileFormatterOptions;

    constructor(file: SwtfFile, options?: SwtfFileFormatterOptions) {
        this._file = file;
        this._options = options;
    }

    public format(): string {
        const registry = new SwtfAttributeMagicRegistry();

        if (this._options?.useMagic) {
            registry.registerMagic(TodaySAM);
            registry.registerMagic(AfterSAM);
            registry.registerMagic(StatusSAM);
        }

        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t, registry));

        for (const fmt of fmts) {
            fmt.format();
        }

        return fmts.map(fmt => `${fmt}`).join('');
    }
}