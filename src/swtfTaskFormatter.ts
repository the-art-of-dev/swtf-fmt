import { SwtfTask, SwtfTaskAttribute } from 'swtf-parser';
import { SwtfAttributeMagicRegistry } from './swtfAttributeMagic';

export class SwtfTaskFormatter {
    private _task: SwtfTask;
    private _attributeMagicRegistry: SwtfAttributeMagicRegistry;

    constructor(task: SwtfTask, attributeMagicRegistry: SwtfAttributeMagicRegistry) {
        this._task = task;
        this._attributeMagicRegistry = attributeMagicRegistry;
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
        return `${'    '.repeat(task.level)}-${task.text ? ' ' : ''}${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
    }

    private _applyMagicAttributesToTask(task: SwtfTask): SwtfTask {
        const newTask = { ...task };
        newTask.attributes = newTask.attributes.map(ma => this._attributeMagicRegistry.applyMagic(ma));
        newTask.subTasks = newTask.subTasks.map(st => this._applyMagicAttributesToTask(st));
        return newTask;
    }

    public applyMagicToAttributes(): void {
        this._task = this._applyMagicAttributesToTask(this._task);
    }

    public normalizeLevel(): void {
        this._task = this._normalizeTaskLevel(this._task, -1);
    }

    public format(): void {
        this.normalizeLevel();
        this.applyMagicToAttributes();
    }

    public toString = (): string => {
        return this._taskToString(this._task);
    };


    public get task(): SwtfTask {
        return this._task;
    }

}