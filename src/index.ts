import { parseSwtf, SwtfTask, SwtfTaskAttribute } from 'swtf-parser';

export function attributeToSwtf(attribute: SwtfTaskAttribute): string {
    return `[${attribute.name ? attribute.name + ': ' : ''}${attribute.value}]`;
}

export function taskToSwtf(task: SwtfTask): string {
    const attrCmp = (a1: SwtfTaskAttribute, a2: SwtfTaskAttribute) => a1.index > a2.index ? 1 : -1;
    const attributesRaw = task.attributes.length ? ` ${task.attributes.sort(attrCmp).map(a => attributeToSwtf(a)).join('')}` : '';
    const subTasksRaw = task.subTasks.map(t => taskToSwtf(t)).join('');
    return `${'    '.repeat(task.level)}- ${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
}

export function tasksToSwtf(tasks: SwtfTask[]): string {
    return tasks.map(t => taskToSwtf(t)).join('');
}

function normalizeTaskLevel(task: SwtfTask, parentLevel: number): SwtfTask {
    const newTask = { ...task };
    newTask.level = parentLevel + 1;
    newTask.subTasks = newTask.subTasks.map(st => normalizeTaskLevel(st, newTask.level));
    return newTask;
}

export function formatSwtf(rawSwtf: string): string {
    return tasksToSwtf(parseSwtf(rawSwtf).map(t => normalizeTaskLevel(t, -1)));
}