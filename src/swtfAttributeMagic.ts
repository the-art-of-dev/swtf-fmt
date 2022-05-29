import { SwtfTaskAttribute } from 'swtf-parser';

const getMagicDate = (date: Date): [string, string, string] => {
    const year = date.getFullYear() + '';
    const month = ('0' + date.getMonth()).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return [year, month, day];
};

const getToday = (): [string, string, string] => {
    const today = new Date();
    return getMagicDate(today);
};

const getAfter = (days: number): [string, string, string] => {
    const dateAfter = new Date();
    dateAfter.setDate(dateAfter.getDate() + days);
    return getMagicDate(dateAfter);
};

export interface SwtfAttributeMagic {
    name: string;
    applyMagic: (attribute: SwtfTaskAttribute) => SwtfTaskAttribute;
}

export class SwtfAttributeMagicRegistry {
    private _magicAttributes: SwtfAttributeMagic[];

    constructor() {
        this._magicAttributes = [];
    }

    public registerMagic(magic: SwtfAttributeMagic): void {
        this._magicAttributes.push(magic);
    }

    public applyMagic(attribute: SwtfTaskAttribute): SwtfTaskAttribute {
        let magicAttribute = { ...attribute };
        for (const magic of this._magicAttributes) {
            magicAttribute = magic.applyMagic(magicAttribute);
        }
        return magicAttribute;
    }
}

export const TodaySAM: SwtfAttributeMagic = {
    name: 'today',
    applyMagic: (attr: SwtfTaskAttribute) => {
        const magicAttr = { ...attr };
        if (magicAttr.value == 'today') {
            const [y, m, d] = getToday();
            magicAttr.value = `${d}.${m}.${y}.`;
        }
        return magicAttr;
    }
};

export const AfterSAM: SwtfAttributeMagic = {
    name: 'after',
    applyMagic: (attr: SwtfTaskAttribute) => {
        const magicAttr = { ...attr };
        if (magicAttr.name == 'after' && !Number.isNaN(magicAttr.value.toString())) {
            const [y, m, d] = getAfter(parseInt(magicAttr.value.toString()));
            magicAttr.value = `${d}.${m}.${y}.`;
            magicAttr.name = null;
        }
        return magicAttr;
    }
};