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
    let result = 0;
    let x = 1;
    inputs.reduce((acc, cur) => {
        return acc.concat(cur.split(' '));
    }, []).forEach((e, i) => {
        const cycle = i + 1;
        if (cycle >= 20 && (cycle - 20) % 40 === 0) {
            result += x * cycle;
        }
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
