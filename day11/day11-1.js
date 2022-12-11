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
    class Monkey {
        items;
        operation;
        tester;
        ifTrue;
        ifFalse;
        constructor({items, operation, tester, ifTrue, ifFalse}) {
            this.items = items ?? [];
            this.operation = operation ?? '';
            this.ifFalse = ifFalse ?? 0;
            this.tester = tester ?? 1;
            this.ifTrue = ifTrue ?? 0;
            this.examineTimes = 0;
        }
        operate() {
            if (!this.items) return;
            const old = this.items.shift();
            return eval(this.operation);
        }

        inspect() {
            while (this.items.length) {
                const item = Math.floor(this.operate() / 3);
                this.throw(item % this.tester === 0, item);
                this.examineTimes += 1;
            }
        }

        receive(item) {
            this.items.push(item);
        }
        throw(bool, item) {
            if (bool) {
                monkeys[this.ifTrue].receive(item);
            } else {
                monkeys[this.ifFalse].receive(item);
            }
        }
    }
    let monkeys = [];
    let monkey;
    const monkeyReg = new RegExp(/^Monkey (?<monkey>\d):$/);
    const itemsReg = new RegExp(/^\s+Starting items: (?<items>[\d ,]+)$/);
    const operationReg = new RegExp(/^\s+Operation: new = (?<operation>.+)$/);
    const testerReg = new RegExp(/^\s+Test: divisible by (?<tester>\d+)$/);
    const ifTrueReg = new RegExp(/^\s+If true: throw to monkey (?<monkey>\d)$/);
    const ifFalseReg = new RegExp(/^\s+If false: throw to monkey (?<monkey>\d)$/);
    inputs.forEach((e) => {
        if (e.match(monkeyReg)) {
            monkey = Number(e.match(monkeyReg).groups.monkey);
            monkeys[monkey] = new Monkey({});
        } else if (e.match(itemsReg)) {
            monkeys[monkey].items = e.match(itemsReg).groups.items.split(', ').map(Number);
        } else if (e.match(operationReg)) {
            monkeys[monkey].operation = e.match(operationReg).groups.operation;
        } else if (e.match(testerReg)) {
            monkeys[monkey].tester = e.match(testerReg).groups.tester;
        } else if (e.match(ifTrueReg)) {
            monkeys[monkey].ifTrue = Number(e.match(ifTrueReg).groups.monkey);
        } else if (e.match(ifFalseReg)) {
            monkeys[monkey].ifFalse = Number(e.match(ifFalseReg).groups.monkey);
        }
    });
    for (let i = 0; i < 20; i++) {
        monkeys.forEach(m => m.inspect());
    }
    monkeys.sort((a, b) => b.examineTimes - a.examineTimes);
    return monkeys[1].examineTimes * monkeys[0].examineTimes;
}


processLineByLine().then((result) => console.log(result));
