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
    solve(lines);
}

function solve(inputs) {
    function getWinner([a,b]) {
        switch (a) {
            case 'A':
                switch (b) {
                    case 'X':
                        return null;
                    case 'Y':
                        return true;
                    case 'Z':
                        return false;
                    default:
                        return null;
                }
            case 'B':
                switch (b) {
                    case 'X':
                        return false;
                    case 'Y':
                        return null;
                    case 'Z':
                        return true;
                    default:
                        return null;
                }
            case 'C':
                switch (b) {
                    case 'X':
                        return true;
                    case 'Y':
                        return false;
                    case 'Z':
                        return null;
                    default:
                        return null;
                }
        }
    }
    let strategies = inputs.map((e) => {
        return e.split(' ');
    });
    let score = 0;
    strategies.forEach((s) => {
        const [, a] = s;
        const strategyScore = a === 'X' ? 1 : a === 'Y' ? 2 : 3;
        const winner = getWinner(s);
        const winnerScore = winner === true ? 6 : winner === false ? 0 : 3;
        score += strategyScore;
        score += winnerScore;
    });
    console.log(score);
}

processLineByLine();
