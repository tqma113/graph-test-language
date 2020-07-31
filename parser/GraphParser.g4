parser grammar GraphParser;

options {
    tokenVocab=JavaScriptLexer;
}


program
    : HashBangLine? module? EOF
    ;

module
    : moduleStatement*
    ;

moduleStatement
    : inferenceDeclaration
    | importStatement
    | exportStatement
    | startStatement
    ;

identifier
    : Identifier
    ;

statement
    | stepStatement
    | ifStatement
    | switchStatement
    | gotoStatement
    ;

statementList
    : statement+
    ;


inferenceDeclaration
    : identifier '=' block
    ;

block
    : '{' statementList? '}'
    ;


importStatement
    : Import moduleItems From StringLiteral
    ;

moduleItems
    : '{' (identifier ',')* (identifier ','?)? '}'
    ;

exportStatement
    : Export (identifier | inferenceDeclaration) eos    # ExportDeclaration
    ;

stepStatement
    : Action
    ;

ifStatement
    : If expresssion '->' block (Else block)?
    ;

expresssion
    : Action
    ;


switchStatement
    : Switch expresssion switchBlock
    ;

switchBlock
    : '{' caseClauses? (defaultClause caseClauses?)? '}'
    ;

caseClauses
    : caseClause+
    ;

caseClause
    : Case expression '->' block?
    ;

defaultClause
    : Default '->' block?
    ;

gotoStatement
    : Goto identifier
    ;

startStatement
    : Start (identifier | inferenceDeclaration)
    ;