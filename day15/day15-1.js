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
    const row = 2000000;
    return solve(lines, row);
}

function solve(inputs, row) {
    const inputReg = new RegExp(/^Sensor at x=([\-0-9]+), y=([\-0-9]+)[\s\w:]+x=([\-0-9]+), y=([\-0-9]+)/)
    const coordinate = inputs.map((i) => {
        const match = i.match(inputReg);
        const beacon = {
            x: Number(match[3]),
            y: Number(match[4]),
        }
        const sensor = {
            x: Number(match[1]),
            y: Number(match[2]),
        };
        sensor.shortestDis = Math.abs(beacon.x - sensor.x) + Math.abs(beacon.y - sensor.y);
        return {
            sensor,
            beacon,
        };
    });

    function scan(coordinate, row) {
        const spots = [];
        const beaconXs = [];
        for (const {sensor, beacon} of coordinate) {
            const n = sensor.shortestDis - Math.abs(sensor.y - row);
            if (n < 0) continue;
            const maxX = sensor.x + n;
            const minX = sensor.x - n;
            spots.push({action: 'start', value: minX});
            spots.push({action: 'end', value: maxX});
            if (beacon.y === row) beaconXs.push(beacon.x);
        }
        spots.sort((a, b) => {
            if (a.value !== b.value) {
                return a.value - b.value;
            }
            if (a.action > b.action) return -1;
            if (b.action > a.action) return 1;
            return 0;
        });
        let range = [];
        let ranges = [];
        let flag = 0;
        for (const {action, value} of spots) {
            if (flag === 0) {
                range.push(value);
            }
            if (action === 'start') {
                flag += 1;
            } else {
                flag -= 1;
            }
            if (flag === 0) {
                range.push(value);
                ranges.push(range);
                range = [];
            }
        }
        const rangeLength = ranges.length;
        ranges = ranges.reduce((acc, cur) => {
            if (!acc.length) return [cur];
            const lastOne = acc[acc.length - 1];
            if (cur[0] - lastOne[1] > 1) return [...acc, cur];
            lastOne[1] = cur[1];
            return acc;
        }, []);
        const occupied = ranges.reduce((acc, cur) => acc + (cur[1] - cur[0] + 1), 0) - new Set(beaconXs).size
        return({occupied, ranges, rangeLength})
    }

    return scan(coordinate, 2000000).occupied;
}

processLineByLine().then((result) => console.log(result));
