/**
 * language server
 * https://microsoft.github.io/language-server-protocol/
 */

import { createParser, checkSemantic } from 'graph-language'
import type { Inference, LexicalError, SyntaxError, SemanticError } from 'graph-language'

const createServer = (input: string = '') => {
  let definations: Map<string, Inference> = new Map()

  let lexicalErrors: LexicalError[] = []
  let syntaxErrors: SyntaxError[] = []
  let semanticErrors: SemanticError[] = []

  const didChange = (_input: string) => {
    input = _input
    analyze()
  }

  const analyze = () => {
    const parser = createParser(input)
    parser.parse()
    lexicalErrors = parser.lexcialErrors
    if (parser.program) {
      const { semanticErrors: _semanticErrors, table } = checkSemantic(parser.program)
      semanticErrors = _semanticErrors
      definations = table
    } else {
      semanticErrors = []
      definations = new Map()
    }
  }

  analyze()

  return {
    didChange,

    get input() {
      return input
    },
    get definations() {
      return definations
    },
    get lexicalErrors() {
      return lexicalErrors
    },
    get syntaxErrors() {
      return syntaxErrors
    },
    get semanticErrors() {
      return semanticErrors
    }
  }
}

const languageServer = createServer()

export default languageServer