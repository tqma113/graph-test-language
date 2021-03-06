/**
 * Semantic
 *
 * Analysis AST(Abstruct Syntax Tree) and check semantic error.
 */

import { SemanticError } from './SemanticError'
import { NodeKind } from '../parser/ast'
import type { Identifier } from '../lexer/index'
import type {
  Program,
  InferenceDefinition,
  ImportStatement,
  StartStatement,
  ExportStatement,
  Block,
  Module,
  StepStatement,
  IfStatement,
  SwitchStatement,
  SwitchBlock,
  CaseClause,
  DefaultClause,
  GotoStatement,
  ModuleStatement,
  ModuleItems,
  Statement,
  Node,
} from '../parser/ast'

export * from './SemanticError'

export type Inference = {
  identifier: Identifier
  definition: InferenceDefinition | ImportStatement
}

export type CheckSemanticResult = {
  semanticErrors: SemanticError[]
  table: Map<string, Inference>
}

export const analysis = (program: Program): CheckSemanticResult => {
  let inferenceTable = new Map<string, Inference>()
  let semanticErrors: SemanticError[] = []

  const record = () => {
    program.moduleStatemens.forEach((moduleStatement) => {
      switch (moduleStatement.kind) {
        case NodeKind.ImportStatement: {
          recordImport(moduleStatement)
          break
        }
        case NodeKind.InferenceDefinition: {
          recordDefinition(moduleStatement)
          break
        }
        case NodeKind.StartStatement: {
          recordStart(moduleStatement)
          break
        }
      }
    })
  }

  const recordImport = (importStatement: ImportStatement) => {
    importStatement.moduleItems.identifiers.forEach((identifier) => {
      addInference({
        identifier,
        definition: importStatement,
      })
    })
  }

  const recordDefinition = (inferenceDefinition: InferenceDefinition) => {
    addInference({
      identifier: inferenceDefinition.identifier,
      definition: inferenceDefinition,
    })
  }

  const recordStart = (startStatement: StartStatement) => {
    if (startStatement.module.definition) {
      addInference({
        identifier: startStatement.module.identifier,
        definition: startStatement.module.definition,
      })
    }
  }

  const addInference = (inference: Inference) => {
    const name = getContent(inference.identifier.word)
    if (inferenceTable.has(name)) {
      reportError(
        `Module ${name} has been declared twice`,
        inference.definition
      )
    } else {
      inferenceTable.set(name, inference)
    }
  }

  const checkProgram = (program: Program) => {
    program.moduleStatemens.forEach(checkModuleStatement)
  }

  const checkModuleStatement = (moduleStatement: ModuleStatement) => {
    switch (moduleStatement.kind) {
      case NodeKind.ImportStatement: {
        checkImportStatement(moduleStatement)
        break
      }
      case NodeKind.ExportStatement: {
        checkExportStatement(moduleStatement)
        break
      }
      case NodeKind.StartStatement: {
        checkStartStatement(moduleStatement)
        break
      }
      case NodeKind.InferenceDefinition: {
        checkInferenceDefinition(moduleStatement)
        break
      }
    }
  }

  const checkInferenceDefinition = (
    inferenceDefinition: InferenceDefinition
  ) => {
    checkBlock(inferenceDefinition.block)
  }

  const checkImportStatement = (importStatement: ImportStatement) => {
    checkModuleItems(importStatement.moduleItems)
  }

  const checkModuleItems = (moduleItems: ModuleItems) => {}

  const checkModule = (module: Module) => {
    const name = getContent(module.identifier.word)
    if (!inferenceTable.has(name)) {
      reportError(`Module ${name} has not been declared`, module)
    }
    if (module.definition) {
      checkInferenceDefinition(module.definition)
    }
  }

  const checkExportStatement = (exportStatement: ExportStatement) => {
    checkModule(exportStatement.module)
  }

  const checkStartStatement = (startStatement: StartStatement) => {
    checkModule(startStatement.module)
  }

  const checkBlock = (block: Block) => {
    block.list.forEach(checkStatement)
  }

  const checkStatement = (statement: Statement) => {
    switch (statement.kind) {
      case NodeKind.StepStatement: {
        checkStepStatement(statement)
        break
      }
      case NodeKind.IfStatement: {
        checkIfStatement(statement)
        break
      }
      case NodeKind.SwitchStatement: {
        checkSwitchStatement(statement)
        break
      }
      case NodeKind.GotoStatement: {
        checkGotoStatement(statement)
        break
      }
    }
  }

  const checkStepStatement = (stepStatement: StepStatement) => {}

  const checkIfStatement = (ifStatement: IfStatement) => {
    checkBlock(ifStatement.ifBlock)
    if (ifStatement.elseBlock) {
      checkBlock(ifStatement.elseBlock)
    }
  }

  const checkSwitchStatement = (switchStatement: SwitchStatement) => {
    checkSwitchBlock(switchStatement.switchBlock)
  }

  const checkSwitchBlock = (switchBlock: SwitchBlock) => {
    switchBlock.caseClauses.forEach(checkCaseClause)
    if (switchBlock.defaultClause) {
      checkDefaultClause(switchBlock.defaultClause)
    }
  }

  const checkCaseClause = (caseClause: CaseClause) => {
    checkBlock(caseClause.block)
  }

  const checkDefaultClause = (defaultClause: DefaultClause) => {
    checkBlock(defaultClause.block)
  }

  const checkGotoStatement = (gotoStatement: GotoStatement) => {
    const name = getContent(gotoStatement.identifier.word)
    if (!inferenceTable.has(name)) {
      reportError(`Module ${name} has not been declared`, gotoStatement)
    }
  }

  const reportError = (message: string, fragment: Node) => {
    semanticErrors.push(new SemanticError(message, fragment))
  }

  record()
  checkProgram(program)

  return {
    get semanticErrors() {
      return semanticErrors
    },
    get table() {
      return inferenceTable
    },
  }
}

const getContent = (word: string): string => {
  return word.slice(1, word.length - 1)
}
