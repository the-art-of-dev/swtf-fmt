'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var swtfParser = require('swtf-parser');

function attributeToSwtf(attribute) {
    return `[${attribute.name ? attribute.name + ': ' : ''}${attribute.value}]`;
}
function taskToSwtf(task) {
    const attrCmp = (a1, a2) => a1.index > a2.index ? 1 : -1;
    const attributesRaw = task.attributes.length ? ` ${task.attributes.sort(attrCmp).map(a => attributeToSwtf(a)).join('')}` : '';
    const subTasksRaw = task.subTasks.map(t => taskToSwtf(t)).join('');
    return `${'    '.repeat(task.level)}- ${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
}
function tasksToSwtf(tasks) {
    return tasks.map(t => taskToSwtf(t)).join('');
}
function normalizeTaskLevel(task, parentLevel) {
    const newTask = Object.assign({}, task);
    newTask.level = parentLevel + 1;
    newTask.subTasks = newTask.subTasks.map(st => normalizeTaskLevel(st, newTask.level));
    return newTask;
}
function formatSwtf(rawSwtf) {
    return tasksToSwtf(swtfParser.parseSwtf(rawSwtf).map(t => normalizeTaskLevel(t, -1)));
}

exports.attributeToSwtf = attributeToSwtf;
exports.formatSwtf = formatSwtf;
exports.taskToSwtf = taskToSwtf;
exports.tasksToSwtf = tasksToSwtf;
