#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs-extra');
var swtfParser = require('swtf-parser');
var fs$1 = require('fs');
var process$1 = require('process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var fs__default$1 = /*#__PURE__*/_interopDefaultLegacy(fs$1);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class SwtfFile {
    constructor(options) {
        this._absolutePath = options.absolutePath;
        this._content = options.content;
    }
    //Getters and Setters
    get content() {
        return this._content;
    }
    set content(v) {
        this._content = v;
    }
    get absolutePath() {
        return this._absolutePath;
    }
    get name() {
        return path__default["default"].basename(this._absolutePath);
    }
    get tasks() {
        return swtfParser.parseSwtf(this._content);
    }
    //Methods
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this._content = (yield fs__default["default"].readFile(this._absolutePath)).toString();
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs__default["default"].writeFile(this._absolutePath, this.content);
        });
    }
}

const isNumeric = (x) => {
    return /^-?\d+$/.test(x);
};

const getMagicDate = (date) => {
    const year = date.getFullYear() + '';
    const month = ('0' + date.getMonth()).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [year, month, day];
};
const getToday = () => {
    const today = new Date();
    return getMagicDate(today);
};
const getAfter = (days) => {
    const dateAfter = new Date();
    dateAfter.setDate(dateAfter.getDate() + days);
    return getMagicDate(dateAfter);
};
class SwtfAttributeMagicRegistry {
    constructor() {
        this._magicAttributes = [];
    }
    registerMagic(magic) {
        this._magicAttributes.push(magic);
    }
    applyMagic(attribute) {
        let magicAttribute = Object.assign({}, attribute);
        for (const magic of this._magicAttributes) {
            magicAttribute = magic.applyMagic(magicAttribute);
        }
        return magicAttribute;
    }
}
const TodaySAM = {
    name: 'today',
    applyMagic: (attr) => {
        const magicAttr = Object.assign({}, attr);
        if (magicAttr.value == 'today') {
            const [y, m, d] = getToday();
            magicAttr.value = `${d}.${m}.${y}.`;
        }
        return magicAttr;
    }
};
const AfterSAM = {
    name: 'after',
    applyMagic: (attr) => {
        const magicAttr = Object.assign({}, attr);
        if (magicAttr.name == 'after' && !Number.isNaN(magicAttr.value.toString())) {
            const [y, m, d] = getAfter(parseInt(magicAttr.value.toString()));
            magicAttr.value = `${d}.${m}.${y}.`;
            magicAttr.name = null;
        }
        return magicAttr;
    }
};
const StatusSAM = {
    name: 'status',
    applyMagic: (attr) => {
        const magicAttr = Object.assign({}, attr);
        const statuses = ['ready', 'in_progress', 'blocked', 'done'];
        if (!attr.name && statuses.includes(attr.value.toString())) {
            magicAttr.name = 'status';
        }
        return magicAttr;
    }
};
const PrioritySAM = {
    name: 'status',
    applyMagic: (attr) => {
        const magicAttr = Object.assign({}, attr);
        const valueParts = magicAttr.value.toString().split('p');
        if (valueParts.length != 2)
            return magicAttr;
        const [indicator, value] = valueParts;
        if (!attr.name && indicator === '' && isNumeric(value)) {
            magicAttr.name = 'priority';
            magicAttr.value = value;
        }
        return magicAttr;
    }
};

class SwtfTaskFormatter {
    constructor(task, attributeMagicRegistry) {
        this.toString = () => {
            return this._taskToString(this._task);
        };
        this._task = task;
        this._attributeMagicRegistry = attributeMagicRegistry;
    }
    _normalizeTaskLevel(task, parentLevel) {
        const newTask = Object.assign({}, task);
        newTask.level = parentLevel + 1;
        newTask.subTasks = newTask.subTasks.map(st => this._normalizeTaskLevel(st, newTask.level));
        return newTask;
    }
    _attributeToString(attribute) {
        return `[${attribute.name ? attribute.name + ': ' : ''}${attribute.value}]`;
    }
    _taskToString(task) {
        const attrCmp = (a1, a2) => a1.index > a2.index ? 1 : -1;
        const attributesRaw = task.attributes.length ? ` ${task.attributes.sort(attrCmp).map(a => this._attributeToString(a)).join('')}` : '';
        const subTasksRaw = task.subTasks.map(t => this._taskToString(t)).join('');
        return `${'    '.repeat(task.level)}-${task.text ? ' ' : ''}${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
    }
    _applyMagicAttributesToTask(task) {
        const newTask = Object.assign({}, task);
        newTask.attributes = newTask.attributes.map(ma => this._attributeMagicRegistry.applyMagic(ma));
        newTask.subTasks = newTask.subTasks.map(st => this._applyMagicAttributesToTask(st));
        return newTask;
    }
    applyMagicToAttributes() {
        this._task = this._applyMagicAttributesToTask(this._task);
    }
    normalizeLevel() {
        this._task = this._normalizeTaskLevel(this._task, -1);
    }
    format() {
        this.normalizeLevel();
        this.applyMagicToAttributes();
    }
    get task() {
        return this._task;
    }
}

var SwtfSortingOrder;
(function (SwtfSortingOrder) {
    SwtfSortingOrder["ASC"] = "asc";
    SwtfSortingOrder["DESC"] = "desc";
})(SwtfSortingOrder || (SwtfSortingOrder = {}));
const createTaskFormatterComparer = (sortBy, sortOrder) => {
    const sortByFilter = (a) => a.name == sortBy;
    const taskComparer = (x, y) => {
        const xAttr = x.task.attributes.find(sortByFilter);
        const yAttr = y.task.attributes.find(sortByFilter);
        if (!xAttr && !yAttr)
            return 0;
        if (!xAttr && yAttr)
            return 1;
        if (xAttr && !yAttr)
            return -1;
        const order = sortOrder == SwtfSortingOrder.ASC ? 1 : -1;
        let diff = xAttr.value.toString().localeCompare(yAttr.value.toString());
        if (isNumeric(xAttr.value.toString()) && isNumeric(yAttr.value.toString()))
            diff = parseInt(xAttr.value.toString()) - parseInt(yAttr.value.toString());
        return diff * order;
    };
    return taskComparer;
};
class SwtfFileFormatter {
    constructor(file, options) {
        this._file = file;
        this._options = options;
        this._initRegistry();
    }
    _initRegistry() {
        var _a;
        this._magicRegistry = new SwtfAttributeMagicRegistry();
        if (!((_a = this._options) === null || _a === void 0 ? void 0 : _a.useMagic))
            return;
        this._magicRegistry.registerMagic(TodaySAM);
        this._magicRegistry.registerMagic(AfterSAM);
        this._magicRegistry.registerMagic(StatusSAM);
        this._magicRegistry.registerMagic(PrioritySAM);
    }
    format() {
        var _a, _b, _c;
        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t, this._magicRegistry));
        for (const fmt of fmts) {
            fmt.format();
        }
        if ((_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.sortBy) {
            this._options.sort.order = (_c = this._options.sort.order) !== null && _c !== void 0 ? _c : SwtfSortingOrder.ASC;
            fmts.sort(createTaskFormatterComparer(this._options.sort.sortBy, this._options.sort.order));
        }
        return fmts.map(fmt => `${fmt}`).join('');
    }
}

function formatSwtf(rawSwtf, options) {
    const swtfFile = new SwtfFile({ content: rawSwtf });
    const fmt = new SwtfFileFormatter(swtfFile, options);
    return fmt.format();
}

if (process.argv[0] == 'swtf-fmt' && process.argv.length < 2) {
    console.log('Usage: swtf-fmt <input_file_name>');
    process$1.exit(1);
}
if (process.argv[0].endsWith('node') && process.argv.length < 3) {
    console.log('Usage: node ./bin/app.js <input_file_name>');
    process$1.exit(1);
}
const inputFilePath = process.argv[0] == 'swtf-fmt' ? process.argv[1] : process.argv[2];
if (!fs__default$1["default"].existsSync(inputFilePath)) {
    console.log(`Input file: ${inputFilePath} doesn't exist`);
    process$1.exit(1);
}
process.stdout.write(formatSwtf(fs__default$1["default"].readFileSync(inputFilePath).toString()));
