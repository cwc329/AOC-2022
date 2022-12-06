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
    const chunks = [];
    while(inputs.length) {
        const chunk = inputs.splice(0, 3);
        chunks.push(chunk);
    }
    function getScore(s) {
        const charCode = s.charCodeAt(0);
        if (charCode >= 97) return charCode - 96;
        return charCode - 38;
    }
    function toChunkMap(string) {
        const map = new Map();
        for (ele of string) {
            const score = getScore(ele);
            map.set(ele, score);
        }
        return map;
    }
    let result = 0;
    chunks.forEach((c) => {
        const secondMap = toChunkMap(c[1]);
        const thirdMap = toChunkMap(c[2]);
        const firstString = c[0];
        for (ele of firstString) {
            if (secondMap.get(ele) && thirdMap.get(ele)) {
                result += getScore(ele);
                return;
            }
        }
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
