import { SwtfTask } from 'swtf-parser';
import { SwtfAttributeMagicRegistry } from './swtfAttributeMagic';
export declare class SwtfTaskFormatter {
    private _task;
    private _attributeMagicRegistry;
    constructor(task: SwtfTask, attributeMagicRegistry: SwtfAttributeMagicRegistry);
    private _normalizeTaskLevel;
    private _attributeToString;
    private _taskToString;
    private _applyMagicAttributesToTask;
    applyMagicToAttributes(): void;
    normalizeLevel(): void;
    format(): void;
    toString: () => string;
    get task(): SwtfTask;
}
