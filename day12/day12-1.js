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
    const map = inputs.map((e) => e.split(''));
    const endPoint = {};
    const startPoint = {};
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'E') {
                map[y][x] = 'z';
                endPoint.x = x;
                endPoint.y = y;
            }
            if (map[y][x] === 'S') {
                map[y][x] = 'a';
                startPoint.x = x;
                startPoint.y = y;
            }
        }
    }
    let queue = [`${startPoint.x}-${startPoint.y}-0`];
    const trackMap = new Map();
    while (queue.length) {
        queue = Array.from(new Set(queue));
        const next = queue.shift();
        bfs({
            l: next,
            queue,
        });
    }

    function bfs({l, queue = [] }) {
        const [x, y, step] = l.split('-').map(Number);
        if (!trackMap.has(`${x}-${y}` || trackMap.get(`${x}-${y}`) >= step)) {
            trackMap.set(`${x}-${y}`, step);
        }

        const location = map[y][x].charCodeAt(0);

        const dir = [
            {dx: 0, dy: 1},
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 0, dy: -1},
        ];
        for (const d of dir) {
            const newX = x + d.dx;
            const newY = y + d.dy;
            if (map[newY] === undefined || map[newY][newX] === undefined) continue;
            const newLocation = map[newY][newX].charCodeAt(0);
            if (trackMap.has(`${newX}-${newY}`) && trackMap.get(`${newX}-${newY}`) < step) continue;
            if (newLocation - location > 1) continue;
            queue.push(`${newX}-${newY}-${step + 1}`);
        }
    }

    return trackMap.get(`${endPoint.x}-${endPoint.y}`);
}

processLineByLine().then((result) => console.log(result));
