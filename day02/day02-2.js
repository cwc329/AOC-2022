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
    function getStrategy([a,b]) {
        switch (a) {
            case 'A':
                switch (b) {
                    case 'X':
                        return 'Z';
                    case 'Y':
                        return 'X';
                    case 'Z':
                        return 'Y';
                    default:
                        return null;
                }
            case 'B':
                switch (b) {
                    case 'X':
                        return 'X';
                    case 'Y':
                        return 'Y';
                    case 'Z':
                        return 'Z';
                    default:
                        return null;
                }
            case 'C':
                switch (b) {
                    case 'X':
                        return 'Y';
                    case 'Y':
                        return 'Z';
                    case 'Z':
                        return 'X';
                    default:
                        return null;
                }
        }
    }
    let strategies = inputs.map((e) => {
        return e.split(' ');
    });
    let result = 0;
    strategies.forEach((s) => {
        const [, a] = s;
        const strategy = getStrategy(s);
        const strategyScore = strategy === 'X' ? 1 : strategy === 'Y' ? 2 : 3;
        const winnerScore = a === 'Z' ? 6 : a === 'X' ? 0 : 3;
        result += strategyScore;
        result += winnerScore;
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
