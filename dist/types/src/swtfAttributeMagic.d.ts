import { SwtfTaskAttribute } from 'swtf-parser';
export interface SwtfAttributeMagic {
    name: string;
    applyMagic: (attribute: SwtfTaskAttribute) => SwtfTaskAttribute;
}
export declare class SwtfAttributeMagicRegistry {
    private _magicAttributes;
    constructor();
    registerMagic(magic: SwtfAttributeMagic): void;
    applyMagic(attribute: SwtfTaskAttribute): SwtfTaskAttribute;
}
export declare const TodaySAM: SwtfAttributeMagic;
export declare const AfterSAM: SwtfAttributeMagic;
export declare const StatusSAM: SwtfAttributeMagic;
