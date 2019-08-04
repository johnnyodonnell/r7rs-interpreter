import SchemeType from "./scheme-types/SchemeType";

type ASTNode = SchemeType | AST;
interface AST extends Array<ASTNode> {};

export {ASTNode, AST};
