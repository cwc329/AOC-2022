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
    const source = '500,0';
    const rockLines = inputs.map((i) => i.split(' -> '));
    let map = [];
    rockLines.forEach((rl) => {
        rl.forEach((r, i, a) => {
            if (i === a.length - 1) return;
            const [x1, y1] = r.split(',').map(Number);
            const [x2, y2] = a[i + 1].split(',').map(Number);
            if (x1 === x2) {
                for (let y = (y1 > y2 ? y2 : y1); y <= (y1 > y2 ? y1 : y2); y++) {
                    if (!map[y]) map[y] = [];
                    map[y][x1] = '#';
                }
            } else if (y1 === y2) {
                if (!map[y1]) map[y1] = [];
                for (let x = (x1 > x2 ? x2 : x1); x <= (x1 > x2 ? x1 : x2); x++) {
                    map[y1][x] = '#';
                }
            }
        });
    });
    for (let i = 0; i < map.length; i++) {
        if (!map[i]) map[i] = [];
    }
    let result = 0;
    let [startX, startY] = source.split(',').map(Number);
    let x = startX;
    let y = startY;
    while (true) {
        const {x: newX, y: newY} = sandDrop(x, y);
        if (newX === undefined && newY === undefined) {
            return result;
        }
        if (x === newX && y === newY) {
            result ++;
            map[y][x] = '#';
            x = startX;
            y = startY;
        } else {
            x = newX;
            y = newY;
        }
    }

    function sandDrop(x, y) {
        if (map[y + 1] === undefined) return {x: undefined, y: undefined};
        if (map[y + 1][x] === undefined) {
            return {x, y: y + 1};
        }
        if (map[y + 1][x - 1] === undefined) {
            return {x: x - 1, y: y + 1};
        }
        if (map[y + 1][x + 1] === undefined) {
            return {x: x + 1, y: y + 1}
        }
        return {x, y};
    }
}

processLineByLine().then((result) => console.log(result));
