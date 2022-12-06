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
    const stacks = [];
    let moves = [];
    let isStack = true;
    for (const ele of inputs) {
        if (!ele) {
            isStack = false;
            continue;
        }
        if (isStack) {
            stacks.push(ele);
        } else {
            moves.push(ele);
        }
    }
    const stackNumber = stacks.pop();
    const stackMap = new Map(stackNumber.replaceAll(/ */g, '').split('').map((e) => [Number(e), []]));
    for (const stack of stacks) {
        for (let i = 1; i < stack.length; i += 4) {
            if (stack[i] !== ' ') {
                const stackNo = ((i - 1) / 4) + 1;
                const ele = stackMap.get(stackNo);
                ele.push(stack[i])
                stackMap.set(stackNo, ele)
            }
        }
    }
    moves = moves.map((move) => move.replaceAll(/[a-z]/g, '').trim().split(/\s+/).map(Number));
    moves.forEach((move) => {
        const [units, from, to] = move;
        const fromStack = stackMap.get(from);
        const toStack = stackMap.get(to);
        const movingPieces = fromStack.splice(0, units).reverse();
        toStack.unshift(...movingPieces);
        stackMap.set(from, fromStack);
        stackMap.set(to, toStack);
    });
    let result = '';
    stackMap.forEach((value, key, map) => {
        result += value[0];
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
