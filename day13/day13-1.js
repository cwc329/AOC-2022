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
    const { lists } = inputs.reduce((acc, cur, i, a) => {
        const {lists, list = []} = acc;
        if (!cur) {
            lists.push(list);
            return {lists};
        }
        list.push(JSON.parse(cur));
        if (i === a.length - 1) {
            lists.push(list)
        }
        return {lists, list};
    }, {lists: [], list: []});
    let result = 0;
    lists.forEach((e, i) => {
        if (compare(e)) {
            result += (i + 1);
        }
    });
    return result;
}

processLineByLine().then((result) => console.log(result));
