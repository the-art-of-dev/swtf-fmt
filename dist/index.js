'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs-extra');
var swtfParser = require('swtf-parser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

class SwtfTaskFormatter {
    constructor(task) {
        this.toString = () => {
            return this._taskToString(this._task);
        };
        this._task = task;
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
        return `${'    '.repeat(task.level)}- ${task.text.trim()}${attributesRaw}\n${subTasksRaw}`;
    }
    normalizeLevel() {
        this._task = this._normalizeTaskLevel(this._task, -1);
    }
    format() {
        this.normalizeLevel();
    }
}

class SwtfFileFormatter {
    constructor(file) {
        this._file = file;
    }
    format() {
        const fmts = this._file.tasks.map(t => new SwtfTaskFormatter(t));
        for (const fmt of fmts) {
            fmt.format();
        }
        return fmts.map(fmt => `${fmt}`).join('');
    }
}

function formatSwtf(rawSwtf) {
    const swtfFile = new SwtfFile({ content: rawSwtf });
    const fmt = new SwtfFileFormatter(swtfFile);
    return fmt.format();
}

exports.SwtfFile = SwtfFile;
exports.SwtfFileFormatter = SwtfFileFormatter;
exports.formatSwtf = formatSwtf;
