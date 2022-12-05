const fs = require('fs');
const readline = require('readline');
const lines = [];

async function processLineByLine() {
    const fileStream = fs.createReadStream('input.txt');

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
    inputs.forEach((e, i) => {
        const ranges = e.split(',').map((e) => e.split('-').map(Number)).sort((a, b) => {
            return a[0] - b[0] === 0 ? b[1] - a[1] : a[0] - b[0];
        });
        if (ranges[0][0] <= ranges[1][0] && ranges[0][1] >= ranges[1][1]){
            result += 1;
        }
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
