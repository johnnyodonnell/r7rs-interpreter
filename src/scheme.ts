#!/usr/bin/node

import fs from "fs";
import readline from "readline";
const program = require("commander");

import globalEnv from "./environment/global";
import parse from "./parse";
import evaluate from "./eval";


const run = (text: string) => {
    let result;

    let astList = parse(text);
    for (let ast of astList) {
        result = evaluate(ast, globalEnv);
    }

    return result;
};

const repl = () => {
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const loop = () => {
        prompt.question("> ", (script: string) => {
            console.log(run(script));
            loop();
        });
    }

    loop();
};

program
    .option("-i, --interactive", "Open iteractive REPL")
    .arguments("[file]")
    .action((file: string) => {
        if (file && program.interactive) {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    run(data);
                    repl();
                }
            });
        } else if (file) {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    run(data);
                }
            });
        } else if (program.interactive) {
            repl();
        }
    });

program.parse(process.argv)
