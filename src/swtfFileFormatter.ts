import { SwtfTaskAttribute } from 'swtf-parser';
import { isNumeric } from './helpers';
import { AfterSAM, PrioritySAM, StatusSAM, SwtfAttributeMagicRegistry, TodaySAM } from './swtfAttributeMagic';
import { SwtfFile } from './swtfFile';
import { SwtfTaskFormatter } from './swtfTaskFormatter';

export enum SwtfSortingOrder {
    ASC = 'asc', DESC = 'desc'
}

export interface SwtfFileFormatterSortingOptions {
    sortBy?: string;
    order: SwtfSortingOrder;
}

export interface SwtfFileFormatterOptions {
    useMagic?: boolean;
    sort?: SwtfFileFormatterSortingOptions;
}


const createTaskFormatterComparer = (sortBy: string, sortOrder: SwtfSortingOrder) => {
    const sortByFilter = (a: SwtfTaskAttribute) => a.name == sortBy;

    const taskComparer = (x: SwtfTaskFormatter, y: SwtfTaskFormatter) => {
        const xAttr = x.task.attributes.find(sortByFilter);
        const yAttr = y.task.attributes.find(sortByFilter);

        if (!xAttr && !yAttr) return 0;
        if (!xAttr && yAttr) return 1;
        if (xAttr && !yAttr) return -1;

        const order = sortOrder == SwtfSortingOrder.ASC ? 1 : -1;
        let diff = xAttr.value.toString().localeCompare(yAttr.value.toString());

        if (isNumeric(xAttr.value.toString()) && isNumeric(yAttr.value.toString()))
            diff = parseInt(xAttr.value.toString()) - parseInt(yAttr.value.toString());

        return diff * order;
    };

    return taskComparer;
};

export class SwtfFileFormatter {
    private _file: SwtfFile;
    private _options: SwtfFileFormatterOptions;
    private _magicRegistry: SwtfAttributeMagicRegistry;

    constructor(file: SwtfFile, options?: SwtfFileFormatterOptions) {
        this._file = file;
        this._options = options;
        this._initRegistry();
    }

    private _initRegistry() {
        this._magicRegistry = new SwtfAttributeMagicRegistry();
        if (!this._options?.useMagic) return;

        this._magicRegistry.registerMagic(TodaySAM);
        this._magicRegistry.registerMagic(AfterSAM);
        this._magicRegistry.registerMagic(StatusSAM);
        this._magicRegistry.registerMagic(PrioritySAM);
    }

    public format(): string {
        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t, this._magicRegistry));

        for (const fmt of fmts) {
            fmt.format();
        }

        if (this._options?.sort?.sortBy) {
            this._options.sort.order = this._options.sort.order ?? SwtfSortingOrder.ASC;
            fmts.sort(createTaskFormatterComparer(this._options.sort.sortBy, this._options.sort.order));
        }

        return fmts.map(fmt => `${fmt}`).join('');
    }
}