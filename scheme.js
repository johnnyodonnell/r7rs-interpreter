#!/usr/bin/node

const program = require("commander");
const fs = require("fs");
const readline = require("readline");


class SchemeSymbol extends String {};

class Environment {
    constructor(map = {}, parent = null) {
        this.map = map;
        this.parent = parent;
    }

    get(symbol) {
        let currEnv = this;
        while (currEnv) {
            if (currEnv.map[symbol.valueOf()]) {
                return currEnv.map[symbol.valueOf()];
            }
            currEnv = currEnv.parent;
        }
    }

    set(symbol, value) {
        this.map[symbol.valueOf()] = value;
    }
};

const globalEnv = new Environment({
    "+": (a, b) => { return a + b; },
    "*": (a, b) => { return a * b; },
    "-": (a, b) => { return a - b; },
    "/": (a, b) => { return a / b; },
    "<": (a, b) => { return a < b; },
    ">": (a, b) => { return a > b; },
    ">=": (a, b) => { return a >= b; },
    "<=": (a, b) => { return a <= b; },
    "==": (a, b) => { return a === b; },
    "begin": () => {},
    "print": console.log,
});

const eval = (expr, env) => {
    if (expr instanceof SchemeSymbol) {
        return env.get(expr);
    } else if ((typeof expr) === "number") {
        return expr;
    } else if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].valueOf() === "if")) {
        let [_, test, conseq, alt] = expr;
        if (eval(test, env)) {
            return eval(conseq, env);
        } else {
            return eval(alt, env);
        }
    } else if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].valueOf() === "define")) {
        let [_, symbol, exp] = expr;
        env.set(symbol, eval(exp, env));
    } else if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].valueOf() === "lambda")) {
        let params = expr[1];
        let body = expr[2];

        return (...args) => {
            let localEnv = new Environment({}, env);
            params.forEach((param, i) => {
                localEnv.set(param, args[i]);
            });

            return eval(body, localEnv);
        }
    } else {
        let proc = eval(expr[0], env);
        let args = expr.slice(1);
        args = args.map((arg) => { return eval(arg, env); });
        return proc(...args);
    }
};

const tokenize = (text) => {
    // Remove comments
    text = text.replace(/#!.+/, "");
    text = text.replace(/#;.+/, "");
    text = text.replace(/#\|.+\|#/s, "");

    // https://stackoverflow.com/questions/14912502/how-do-i-split-a-string-by-whitespace-and-ignoring-leading-and-trailing-whitespa
    return text.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
        .match(/\S+/g);
};

const atom = (token) => {
    if (!isNaN(token)) {
        return Number(token);
    } else if (token.length
            && ((token[0] == '"') && (token[token.length - 1] == '"'))) {
        return token.replace(/['"]+/g, '');
    } else {
        return new SchemeSymbol(token);
    }
};

const readFromTokens = (tokens, i = 0) => {
    let ast = [];

    while (i < tokens.length) {
        let token = tokens[i];

        if (token === '(') {
            let result = readFromTokens(tokens, i + 1);
            ast.push(result.ast);
            i = result.i + 1;
        } else if (token === ')') {
            return {ast, i};
        } else {
            ast.push(atom(token));
            i++;
        }
    }

    return ast;
};

const parse = (text) => {
    let tokens = tokenize(text);
    return readFromTokens(tokens);
};

const run = (text) => {
    let result;

    let astList = parse(text);
    for (let ast of astList) {
        result = eval(ast, globalEnv);
    }

    return result;
};

const repl = () => {
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const loop = () => {
        prompt.question("> ", (script) => {
            console.log(run(script));
            loop();
        });
    }

    loop();
};

program
    .option("-i, --interactive", "Open iteractive REPL")
    .arguments("[file]")
    .action((file) => {
        if (file && program.interactive) {
            fs.readFile(file, "utf8", (err, data) => {
                run(data);
                repl();
            });
        } else if (file) {
            fs.readFile(file, "utf8", (err, data) => {
                run(data);
            });
        } else if (program.interactive) {
            repl();
        }
    });

program.parse(process.argv)

