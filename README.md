# SWTF Formatter

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/swtf-fmt)](https://www.npmjs.com/package/swtf-fmt)
![npm type definitions](https://img.shields.io/npm/types/swtf-fmt)
[![swtf](https://img.shields.io/badge/support-SWTF-brightgreen)](https://github.com/the-art-of-dev/swtf)

*SWTF formatting tool*

> ⚠️ This project is created to meet the needs of our development team. Our main focus currently won't be on maintainig this project.

[![asciicast](https://asciinema.org/a/h7lIldGtDB8ZpVMeskOrtcgyK.svg)](https://asciinema.org/a/h7lIldGtDB8ZpVMeskOrtcgyK)

## Content
- [SWTF Formatter](#swtf-formatter)
  - [Content](#content)
  - [Installation](#installation)
  - [Usage](#usage)

## Installation

Install `swtf-parser` via npm:

```
npm i swtf-fmt
```

Install `swtf-parser` globally:

```
npm i -g swtf-fmt
```

Using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/swtf-fmt@latest/dist/bundle.min.js"></script>
```
or
```html
<script src="https://unpkg.com/swtf-fmt@latest/dist/bundle.min.js"></script>
```

## Usage

Let's create simple example:
```js
const { formatSwtf } = require('swtf-fmt');

const rawSwtf = `
- Daily tasks 😐:

    -    store: [borring]
            - food
        - coffee
    - work: [borring]
          - include e2e testing mechanism      [p: high]
        - improve load testing    [p: medium]
    - write today's tasks in SWTF [cool]
`;


console.log(formatSwtf(rawSwtf));
```

Code above will output:
```
- Daily tasks 😐:
    - store: [borring]
        - food
        - coffee
    - work: [borring]
        - include e2e testing mechanism [p: high]
        - improve load testing [p: medium]
    - write today's tasks in SWTF [cool]
```