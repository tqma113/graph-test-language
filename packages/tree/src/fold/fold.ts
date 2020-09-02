import { NodeKind, TreeNodeKind } from '../index'
import {
  createTreeBlock,
  createActionNode,
  createIfTree,
  createSwitchTree,
  createCaseNode,
  createDefaultNode,
  createGotoNode,
  createTree,
} from '../tree'
import { LeafNodeKind, AntherNodeKind } from './index'
import type { TreeNodeRecord } from './index'
import type {
  Tree,
  TreeBlock,
  TreeNode,
  ActionNode,
  GotoNode,
  IfTree,
  SwitchTree,
  CaseNode,
  DefaultNode,
} from '../tree'

export const fold = (records: TreeNodeRecord[]): Tree => {
  const foldTree = (): Tree => {
    const record = records.find(
      (record) => record.parentId === 0 && record.kind === NodeKind.Tree
    )

    if (!record) {
      throw new Error('Canot find the root record of the document.')
    }

    const blocks = foldTreeBlocks(record.id)
    const starts = foldStarts(record.id)
    const comments = foldComments(record.id)

    return createTree(blocks, starts, comments)
  }

  const foldTreeBlocks = (parentId: number): TreeBlock[] => {
    return records
      .filter(
        (record) =>
          record.parentId === parentId && record.kind === NodeKind.TreeBlock
      )
      .sort((a, b) => a.floorId - b.floorId)
      .map((record) => foldTreeBlock(record.id))
  }

  const foldTreeBlock = (id: number): TreeBlock => {
    const name = foldName(id)
    const children = foldTreeNodes(id)
    const comments = foldComments(id)

    return createTreeBlock(name, children, comments)
  }

  const foldTreeNodes = (parentId: number): TreeNode[] => {
    return records
      .filter(
        (record) =>
          record.parentId === parentId &&
          (record.kind === NodeKind.ActionNode ||
            record.kind === NodeKind.GotoNode ||
            record.kind === NodeKind.IfTree ||
            record.kind === NodeKind.SwitchTree)
      )
      .sort((a, b) => a.floorId - b.floorId)
      .map((record) => foldTreeNode(record.id, record.kind as TreeNodeKind))
  }

  const foldTreeNode = (id: number, kind: TreeNodeKind): TreeNode => {
    switch (kind) {
      case NodeKind.ActionNode: {
        return foldActionNode(id)
      }
      case NodeKind.GotoNode: {
        return foldGotoNode(id)
      }
      case NodeKind.IfTree: {
        return foldIfTree(id)
      }
      case NodeKind.SwitchTree: {
        return foldSwitchTree(id)
      }
    }
  }

  const foldActionNode = (id: number): ActionNode => {
    const expression = foldExpression(id)
    const comments = foldComments(id)

    return createActionNode(expression, comments)
  }

  const foldGotoNode = (id: number): GotoNode => {
    const name = foldName(id)
    const comments = foldComments(id)

    return createGotoNode(name, comments)
  }

  const foldIfTree = (id: number): IfTree => {
    const condition = foldCondition(id)
    const successChildren = foldSuccessChildren(id)
    const faildChildren = foldFaildChildren(id)
    const comments = foldComments(id)

    return createIfTree(condition, successChildren, faildChildren, comments)
  }

  const foldSuccessChildren = (parentId: number): TreeNode[] => {
    const record = records.find(
      (record) =>
        record.parentId === parentId &&
        record.kind === AntherNodeKind.SuccessBlock
    )

    if (!record) {
      throw new Error(
        `Canot find the SuccessChildren record of the record: ${parentId}.`
      )
    }

    return foldTreeNodes(record.id)
  }

  const foldFaildChildren = (parentId: number): TreeNode[] => {
    const record = records.find(
      (record) =>
        record.parentId === parentId &&
        record.kind === AntherNodeKind.FaildBlock
    )

    if (!record) {
      throw new Error(
        `Canot find the FaildChildren record of the record: ${parentId}.`
      )
    }

    return foldTreeNodes(record.id)
  }

  const foldSwitchTree = (id: number): SwitchTree => {
    const condition = foldCondition(id)
    const children = foldCaseNodes(id)
    const defaultChild = foldDefaultNode(id)
    const comments = foldComments(id)

    return createSwitchTree(condition, children, defaultChild, comments)
  }

  const foldCaseNodes = (parentId: number): CaseNode[] => {
    return records
      .filter(
        (record) =>
          record.parentId === parentId && record.kind === NodeKind.CaseNode
      )
      .sort((a, b) => a.floorId - b.floorId)
      .map((record) => foldCaseNode(record.id))
  }

  const foldCaseNode = (id: number): CaseNode => {
    const expectation = foldExpectation(id)
    const children = foldTreeNodes(id)
    const comments = foldComments(id)

    return createCaseNode(expectation, children, comments)
  }

  const foldDefaultNode = (parentId: number): DefaultNode | null => {
    const record = records.find(
      (record) =>
        record.parentId === parentId && record.kind === NodeKind.DefaultNode
    )

    if (!record) {
      return null
    }

    const children = foldTreeNodes(record.id)
    const comments = foldComments(record.id)

    return createDefaultNode(children, comments)
  }

  const foldStarts = (parentId: number): string[] => {
    return records
      .filter(
        (record) =>
          record.parentId === parentId && record.kind === LeafNodeKind.Start
      )
      .sort((a, b) => a.floorId - b.floorId)
      .map((record) => record.content) as string[]
  }

  const foldComments = (parentId: number): string[] => {
    return records
      .filter(
        (record) =>
          record.parentId === parentId && record.kind === LeafNodeKind.Comment
      )
      .sort((a, b) => a.floorId - b.floorId)
      .map((record) => record.content) as string[]
  }

  const foldName = (parentId: number): string => {
    const record = records.find(
      (record) =>
        record.parentId === parentId && record.kind === LeafNodeKind.Name
    )

    if (!record) {
      throw new Error(`Canot find the name record of record: ${parentId}`)
    }

    return record.content as string
  }

  const foldExpression = (parentId: number): string => {
    const record = records.find(
      (record) =>
        record.parentId === parentId && record.kind === LeafNodeKind.Expression
    )

    if (!record) {
      throw new Error(`Canot find the expression record of record: ${parentId}`)
    }

    return record.content as string
  }

  const foldCondition = (parentId: number): string => {
    const record = records.find(
      (record) =>
        record.parentId === parentId && record.kind === LeafNodeKind.Condition
    )

    if (!record) {
      throw new Error(`Canot find the condition record of record: ${parentId}`)
    }

    return record.content as string
  }

  const foldExpectation = (parentId: number): string => {
    const record = records.find(
      (record) =>
        record.parentId === parentId && record.kind === LeafNodeKind.Expectation
    )

    if (!record) {
      throw new Error(
        `Canot find the expectation record of record: ${parentId}`
      )
    }

    return record.content as string
  }

  return foldTree()
}
