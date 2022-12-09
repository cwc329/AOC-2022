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
    const map = new Map([['1x1', {H: 1, T: 1}]]);
    let Tx = 1;
    let Ty = 1;
    let Hx = 1;
    let Hy = 1;

    function moveTail(Hx, Hy, Tx, Ty) {
        if (Math.abs(Hx - Tx) <= 1 && Math.abs(Hy - Ty) <= 1) return [Tx, Ty];
        if (Hx === Tx) {
            return Hy > Ty ? [Tx, Ty + 1] : [Tx, Ty - 1];
        }
        if (Hy === Ty) {
            return Hx > Tx ? [Tx + 1, Ty] : [Tx - 1, Ty];
        }
        return [Tx + (Hx > Tx ? 1 : -1), Ty + (Hy > Ty ? 1 : -1)];
    }

    function moveHead(Hx, Hy, dir) {
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
    moves.forEach(([dir, step]) => {
        for (let m = 0; m < step; m++) {
            const newHead = moveHead(Hx, Hy, dir);
            Hx = newHead[0];
            Hy = newHead[1];
            const newHeadLocation = map.get(`${Hx}x${Hy}`) ?? {H: 0, T: 0}
            newHeadLocation.H += 1;
            map.set(`${Hx}x${Hy}`, newHeadLocation)
            const newTail = moveTail(Hx, Hy, Tx, Ty);
            if (Tx === newTail[0] && Ty === newTail[1]) continue;
            Tx = newTail[0];
            Ty = newTail[1];
            const newTailLocation = map.get(`${Tx}x${Ty}`) ?? {H: 0, T: 0}
            newTailLocation.T += 1;
            map.set(`${Tx}x${Ty}`, newTailLocation);
        }
    });
    let result = 0;
    map.forEach((value) => {
        if (value.T > 0) result += 1;
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
