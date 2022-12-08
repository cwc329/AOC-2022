const fs = require('fs');
const readline = require('readline');
const lines = [];

async function processLineByLine() {
    const fileStream = fs.createReadStream(`${__dirname}/input.txt`);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        lines.push(line);
    }
    return solve(lines);
}

function solve(inputs) {
    const logs = inputs.map((e) => e.split(' '));

    const commandReg = new RegExp(/^\$/);
    const dirReg = new RegExp(/^dir/);
    const fileReg = new RegExp(/^\d+/);
    class Dir {
        constructor(name, children = [], parent = undefined) {
            this.name = name;
            this._parent = parent;
            this._children = children;
            this.files = [];
            this._size = 0
        }

        get size() {
            if (this._size) return this._size;
            this._size = this.children.reduce((acc, cur) => {
                return acc + cur.size;
            }, 0);
            return this._size;
        }

        set children(node) {
            this._children = this._children.concat([node])
        }

        get children() {
            return this._children;
        }
    }

    class File {
        constructor(name, size = 0, parent = undefined) {
            this.name = name;
            this._size = size;
            this._parent = parent;
        }

        get size() {
            return this._size;
        }
    }
    const map = new Map();
    const pathHistory = [];
    logs.forEach((l) => {
        const [start, ...rest] = l;
        if (commandReg.test(start)) {
            const [command, dest] = rest;
            if (command === 'cd') {
                if (dest === '..') {
                    pathHistory.pop();
                } else {
                    pathHistory.push(dest);
                }
            }
        } else {
            const [name] = rest;
            if (dirReg.test(start)) {
                map.set(`${pathHistory.join('/')}/${name}`, new Dir(name, [], pathHistory.join('/')))
            } else if (fileReg.test(start)) {
                map.set(`${pathHistory.join('/')}/${name}`, new File(name, Number(start), pathHistory.join('/')))
            }
        }
    });
    map.forEach((value, key, map) => {
        const {parent} = value;
        const parentNode = map.get(parent);
        if (!parentNode) return;
        parentNode.children = value;
    });
    let result = 0;
    map.forEach((value) => {
        if (!value.children) return;
        if (value.size <= 100000) result += value.size;
    });

    return result;
}

processLineByLine().then((result) => console.log(result));
