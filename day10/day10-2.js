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
    let result = '';
    let x = 1;
    function draw(x, cycle) {
        if (cycle % 40 >= x && cycle % 40 <= x + 2) return '#';
        return '.';
    }
    inputs.reduce((acc, cur) => {
        return acc.concat(cur.split(' '));
    }, []).forEach((e, i) => {
        const cycle = i + 1;
        if (cycle > 40 && cycle % 40 === 1) {
            result += '\n';
        }
        result += draw(x, cycle);
        switch (e) {
            case 'noop':
            case 'addx':
                return;
            default:
                x += Number(e);
                return;
        }
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
