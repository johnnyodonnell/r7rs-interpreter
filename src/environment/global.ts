import Environment from "./Environment";


const globalEnv = new Environment({
    "+": (a: number, b: number) => { return a + b; },
    "*": (a: number, b: number) => { return a * b; },
    "-": (a: number, b: number) => { return a - b; },
    "/": (a: number, b: number) => { return a / b; },
    "<": (a: number, b: number) => { return a < b; },
    ">": (a: number, b: number) => { return a > b; },
    ">=": (a: number, b: number) => { return a >= b; },
    "<=": (a: number, b: number) => { return a <= b; },
    "==": (a: number, b: number) => { return a === b; },
    "begin": (...args: any) => {
        return args[args.length - 1];
    },
    "print": console.log,
});

export default globalEnv;
