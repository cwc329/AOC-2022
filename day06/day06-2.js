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
    const string = inputs[0];
    let result = 13;
    let letters = new Map();
    while (letters.size < 14) {
        letters.clear();
        for (let i = result; i >= result - 13; i--) {
            letters.set(string[i], result);
        }
        result += 1;
    }
    return result;
}

processLineByLine().then((result) => console.log(result));
