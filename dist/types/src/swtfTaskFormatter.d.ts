import { SwtfTask } from 'swtf-parser';
export declare class SwtfTaskFormatter {
    private _task;
    constructor(task: SwtfTask);
    private _normalizeTaskLevel;
    private _attributeToString;
    private _taskToString;
    normalizeLevel(): void;
    format(): void;
    toString: () => string;
}
