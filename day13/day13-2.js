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
    function compare(list) {
        const [left, right] = list;
        if (typeof left === 'number' && typeof right === 'number') {
            return left === right ? undefined : left < right;
        } else if (Array.isArray(left) && Array.isArray(right)) {
            let re;
            for (let i = 0; i < left.length; i++) {
                re = compare([left[i], right[i]]);
                if (re !== undefined) return re;
            }
            if (left.length === right.length) return;
            return left.length < right.length;
        } else if (typeof left === 'number') {
            return compare([[left], right]);
        } else if (typeof right === 'number') {
            return compare([left, [right]]);
        }
    }

    const packets = inputs.reduce((acc, cur) => {
        if (cur) acc.push(JSON.parse(cur));
        return acc;
    }, [[[2]], [[6]]]).sort((a, b) => compare([a,b]) ? -1 : 1);
    const entries = [];
    for (let i = 0; i < packets.length; i++) {
        entries.push([JSON.stringify(packets[i]), i + 1]);
    }
    const map = new Map(entries);
    return map.get(JSON.stringify([[2]])) * map.get(JSON.stringify([[6]]));
}

processLineByLine().then((result) => console.log(result));
