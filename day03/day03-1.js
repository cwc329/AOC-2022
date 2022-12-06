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
    function getScore(s) {
        const charCode = s.charCodeAt(0);
        if (charCode >= 97) return charCode - 96;
        return charCode - 38;
    }
    let result = 0;
    inputs.forEach((e) => {
        const firstHalf = e.slice(0, (e.length/2));
        const secondHalf = e.slice(e.length/2);
        const firstMap = new Map();
        for (const element of firstHalf) {
            const score = getScore(element);
            firstMap.set(score, score);
        }
        for (const element of secondHalf) {
            const score = firstMap.get(getScore(element));
            if (score) {
                result += score;
                return;
            }
        }
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
