
/*
This class is needed because of a bug in TypeScript.

See:
https://github.com/microsoft/TypeScript/issues/27602
https://stackoverflow.com/questions/57344053/extending-a-class-in-typescript-and-compiling-to-es5
*/
class ES5String {
    str: string;

    constructor(str: string) {
        this.str = str;
    }

    toString: () => string = () => {
        return this.str;
    }
};

export default ES5String;
