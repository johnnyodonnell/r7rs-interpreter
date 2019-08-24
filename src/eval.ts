import Environment from "./environment/Environment";
import SchemeType from "./scheme-types/SchemeType";
import SchemeSymbol from "./scheme-types/SchemeSymbol";
import {AST, ASTNode} from "./abstract-syntax-tree";
import SchemeString from "./scheme-types/SchemeString";


const evaluate: (expr: AST | ASTNode, env: Environment) => SchemeType = (expr, env) => {
    if (expr instanceof SchemeSymbol) {
        return env.get(expr);
    } else if ((typeof expr) === "number") {
        return expr;
    } else if (expr instanceof SchemeString) {
        return expr.toString();
    }

    if (!("length" in expr)) {
        throw  "Error during evalution. expr does not have a handling case.";
    }

    if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].toString() === "if")) {
        let test = expr[1];
        let conseq = expr[2];
        let alt = expr[3];

        if (evaluate(test, env)) {
            return evaluate(conseq, env);
        } else {
            return evaluate(alt, env);
        }
    } else if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].toString() === "define")) {
        let symbol = expr[1];
        let exp = expr[2];

        if (!(symbol instanceof SchemeSymbol)) {
            throw "Defining symbol is invalid.";
        }

        env.set(symbol, evaluate(exp, env));
    } else if ((expr[0] instanceof SchemeSymbol)
            && (expr[0].toString() === "lambda")) {
        let params = expr[1] as SchemeSymbol[];
        let body = expr[2];

        return (...args: SchemeSymbol[]) => {
            let localEnv = new Environment({}, env);
            params.forEach((param, i) => {
                localEnv.set(param, args[i]);
            });

            return evaluate(body, localEnv);
        }
    } else {
        let proc = evaluate(expr[0], env);
        let args = expr.slice(1);

        if (!(proc instanceof Function)) {
            throw "Procedure is not callable.";
        }

        args = args.map((arg) => { return evaluate(arg, env); });
        return proc(...args);
    }
};

export default evaluate;
