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
    "begin": () => {},
    "print": console.log,
});

export default globalEnv;
