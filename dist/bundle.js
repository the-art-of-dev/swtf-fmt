var swtfFmt = (function (exports) {
    'use strict';

    var dist = {};

    Object.defineProperty(dist, '__esModule', {
      value: true
    });
    const BEGIN_TASK_TOKEN = '- ';
    const BEGIN_SUBTASK_TOKENS = ['\t', ' '];
    const TASK_ATTRS_REGEX = / (\[[^\[\]]*\])+\n$/;
    const ATTR_REGEX = /\[[^\[\]]*\]/g;
    const END_TASK_TOKEN = '\n';
    const ATTR_NAME_REGEX = /^[^\[\]]*: /;

    function parseAttributes(rawAttrs) {
      rawAttrs = rawAttrs.trim();
      const attrs = rawAttrs.match(ATTR_REGEX);
      return attrs.map((v, i) => {
        let t = v.slice(1, v.length - 1);
        const nameMatch = t.match(ATTR_NAME_REGEX);
        let name = null;

        if (nameMatch) {
          name = nameMatch[0].slice(0, nameMatch[0].length - 2);
          t = t.slice(name.length + 2);
        }

        return {
          name: name,
          index: i,
          value: t.includes(',') ? t.split(',') : t
        };
      });
    }

    function parseTask(rawTask) {
      let taskLevel = 0;
      const subTaskToken = BEGIN_SUBTASK_TOKENS.find(t => rawTask.startsWith(t));
      const taskLevelRegExp = new RegExp(`^${subTaskToken}+`);

      if (subTaskToken) {
        taskLevel = rawTask.match(taskLevelRegExp).pop().length;
      }

      rawTask = `${rawTask.trim()}\n`;
      if (!rawTask.startsWith(BEGIN_TASK_TOKEN)) return null;
      const task = {
        text: '',
        attributes: [],
        subTasks: [],
        level: taskLevel
      };
      const rawAttrs = rawTask.match(TASK_ATTRS_REGEX) ? rawTask.match(TASK_ATTRS_REGEX)[0].trim() : null;

      if (rawAttrs) {
        task.attributes = parseAttributes(rawAttrs);
      }

      const sliceIndex = rawAttrs ? TASK_ATTRS_REGEX.exec(rawTask).index : rawTask.length - 1;
      task.text = rawTask.slice(0, sliceIndex).slice(BEGIN_TASK_TOKEN.length);
      return task;
    }

    function parseSwtf(raw) {
      const tasks = [];
      const stack = [];
      raw.split(END_TASK_TOKEN).forEach(rt => {
        const task = parseTask(`${rt}\n`);
        if (!task) return;
        let parent = stack.pop();

        while (parent && parent.level >= task.level) {
          parent = stack.pop();
        }

        if (parent) {
          parent.subTasks.push(task);
          stack.push(parent);
        } else {
          task.level = 0;
          tasks.push(task);
        }

        stack.push(task);
      });
      return tasks;
    }

    dist.parseAttributes = parseAttributes;
    var parseSwtf_1 = dist.parseSwtf = parseSwtf;
    dist.parseTask = parseTask;

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
        return tasksToSwtf(parseSwtf_1(rawSwtf).map(t => normalizeTaskLevel(t, -1)));
    }

    exports.attributeToSwtf = attributeToSwtf;
    exports.formatSwtf = formatSwtf;
    exports.taskToSwtf = taskToSwtf;
    exports.tasksToSwtf = tasksToSwtf;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
