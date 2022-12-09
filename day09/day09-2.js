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
    const moves = inputs.map((i) => i.split(' ')).map(([dir, step]) => [dir, Number(step)]);
    const tailTrace = new Map();
    let rope = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ]
    function follow([Hx, Hy], [Tx, Ty]) {
        if (Math.abs(Hx - Tx) <= 1 && Math.abs(Hy - Ty) <= 1) return [Tx, Ty];
        if (Hx === Tx) {
            return Hy > Ty ? [Tx, Ty + 1] : [Tx, Ty - 1];
        }
        if (Hy === Ty) {
            return Hx > Tx ? [Tx + 1, Ty] : [Tx - 1, Ty];
        }
        return [Tx + (Hx > Tx ? 1 : -1), Ty + (Hy > Ty ? 1 : -1)];
    }

    function moveHead([Hx, Hy], dir) {
        switch (dir) {
            case 'U':
                return [Hx, Hy + 1];
            case 'D':
                return [Hx, Hy - 1];
            case 'R':
                return [Hx + 1, Hy];
            case 'L':
                return [Hx - 1, Hy];
            default:
                return [Hx, Hy];
        }
    }
    function moveRope(rope, dir) {
        const newRope = [moveHead(rope[0], dir)];
        for (let i = 1; i < rope.length; i++) {
            newRope.push(follow(newRope[i - 1], rope[i]));
        }
        return newRope;
    }
    moves.forEach(([dir, step]) => {
        for (let i = 0; i < step; i++) {
            rope = moveRope(rope, dir);
            const [Tx, Ty] = rope[rope.length - 1];
            tailTrace.set(`${Tx}x${Ty}`, 1);
        }
    });
    return tailTrace.size;
}

processLineByLine().then((result) => console.log(result));
