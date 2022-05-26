import { SwtfTask, SwtfTaskAttribute } from 'swtf-parser';

export class SwtfTaskFormatter {
    private _task: SwtfTask;

    constructor(task: SwtfTask) {
        this._task = task;
    }

    private _normalizeTaskLevel(task: SwtfTask, parentLevel: number): SwtfTask {
        const newTask = { ...task };
        newTask.level = parentLevel + 1;
        newTask.subTasks = newTask.subTasks.map(st => this._normalizeTaskLevel(st, newTask.level));
        return newTask;
    }

    private _attributeToString(attribute: SwtfTaskAttribute): string {
        return `[${attribute.name ? attribute.name + ': ' : ''}${attribute.value}]`;
    }

    private _taskToString(task: SwtfTask): string {
        const attrCmp = (a1: SwtfTaskAttribute, a2: SwtfTaskAttribute) => a1.index > a2.index ? 1 : -1;
        const attributesRaw = task.attributes.length ? ` ${task.attributes.sort(attrCmp).map(a => this._attributeToString(a)).join('')}` : '';
        const subTasksRaw = task.subTasks.map(t => this._taskToString(t)).join('');
        return `${'    '.repeat(task.level)}- ${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
    }

    public normalizeLevel(): void {
        this._task = this._normalizeTaskLevel(this._task, -1);
    }


    public format(): void {
        this.normalizeLevel();
    }

    public toString = (): string => {
        return this._taskToString(this._task);
    };
}