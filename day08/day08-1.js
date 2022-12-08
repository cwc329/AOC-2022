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
    function getVisibility(x, y, height, forest, map) {
        const tree = {
            left: true,
            right: true,
            top: true,
            bottom: true,
        };
        for (let i = x - 1; i >= 0; i--) {
            if (tree.left === false) break;
            tree.left = height > forest[y][i];
        }
        for (let i = x + 1; i < forest[y].length; i++) {
            if (tree.right === false) break;
            tree.right = height > forest[y][i];
        }
        for (let j = y + 1; j < forest.length; j++) {
            if (tree.bottom === false) break;
            tree.bottom = height > forest[j][x];
        }
        for (let j = y - 1; j >= 0; j--) {
            if (tree.top === false) break;
            tree.top = height > forest[j][x];
        }
        map.set(`${x}-${y}`, tree);
        return map;
    }
    const forest = inputs.map((i) => i.split('').map(Number));
    let treeMap = new Map();
    for (let y = 0; y < forest.length; y ++) {
        for (let x = 0; x < forest[y].length; x ++) {
            treeMap = getVisibility(x, y, forest[y][x], forest, treeMap)
        }
    }
    let result = 0;
    treeMap.forEach((value) => {
        if (Object.values(value).includes(true)) result += 1;
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
