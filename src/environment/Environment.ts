import SchemeType from "../scheme-types/SchemeType"
import SchemeSymbol from "../scheme-types/SchemeSymbol"


class Environment {
    map: {[key: string]: SchemeType};
    parent: Environment | null;

    constructor(map = {}, parent: Environment | null = null) {
        this.map = map;
        this.parent = parent;
    }

    get(symbol: SchemeSymbol) {
        let currEnv: Environment | null = this;

        while (currEnv) {
            if (currEnv.map[symbol.toString()]) {
                return currEnv.map[symbol.toString()];
            }
            currEnv = currEnv.parent;
        }

        throw "Symbol not found in environment";
    }

    set(symbol: SchemeSymbol, value: SchemeType) {
        this.map[symbol.toString()] = value;
    }
};

export default Environment;
