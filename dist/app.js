'use strict';

var swtfParser = require('swtf-parser');
var fs = require('fs');
var process$1 = require('process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

if (process.argv.length < 2) {
    console.log('Usage: swtf-fmt <input_file_name>');
    process$1.exit(1);
}
if (!fs__default["default"].existsSync(process.argv[1])) {
    console.log(`Input file: ${process.argv[1]} doesn't exist`);
    process$1.exit(1);
}
console.log(formatSwtf(fs__default["default"].readFileSync(process.argv[1]).toString()));
