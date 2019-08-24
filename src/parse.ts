import SchemeSymbol from "./scheme-types/SchemeSymbol";
import SchemeString from "./scheme-types/SchemeString";
import {AST} from "./abstract-syntax-tree";


const tokenize = (text: string) => {
    // Remove comments
    text = text.replace(/#!.+/, "");
    text = text.replace(/#;.+/, "");
    text = text.replace(/#\|.+\|#/s, "");

    // https://stackoverflow.com/questions/14912502/how-do-i-split-a-string-by-whitespace-and-ignoring-leading-and-trailing-whitespa
    return text.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
        .match(/\S+/g);
};

const atom = (token: string) => {
    if (!isNaN(Number(token))) {
        return Number(token);
    } else if (token.length
            && ((token[0] == '"') && (token[token.length - 1] == '"'))) {
        return new SchemeString(token.replace(/['"]+/g, ''));
    } else {
        return new SchemeSymbol(token);
    }
};

const readFromTokens = (tokens: string[], i = 0) => {
    let ast: AST = [];

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

    return {ast, i};
};

const parse = (text: string) => {
    let tokens: string[] | null = tokenize(text);
    if (tokens) {
        return readFromTokens(tokens).ast;
    }

    throw "No tokens provided";
};

export default parse;
