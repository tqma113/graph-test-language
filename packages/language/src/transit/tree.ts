export type Tree = {
  kind: NodeKind.Tree
  blocks: TreeBlock[]
  starts: string[]
  comments: string[]
}

export const createTree = (
  blocks: TreeBlock[],
  starts: string[],
  comments: string[]
): Tree => {
  return {
    kind: NodeKind.Tree,
    blocks,
    starts,
    comments,
  }
}

export type TreeBlock = {
  kind: NodeKind.TreeBlock
  name: string
  children: TreeNode[]
  comments: string[]
}

export const createTreeBlock = (
  name: string,
  children: TreeNode[],
  comments: string[]
): TreeBlock => {
  return {
    kind: NodeKind.TreeBlock,
    name,
    children,
    comments,
  }
}

export type TreeNode = ActionNode | GotoNode | SwitchTree | IfTree

export type ActionNode = {
  kind: NodeKind.ActionNode
  expression: string
  comments: string[]
}

export const createActionNode = (
  expression: string,
  comments: string[]
): ActionNode => {
  return {
    kind: NodeKind.ActionNode,
    expression,
    comments,
  }
}

export type GotoNode = {
  kind: NodeKind.GotoNode
  name: string
  comments: string[]
}

export const createGotoNode = (name: string, comments: string[]): GotoNode => {
  return {
    kind: NodeKind.GotoNode,
    name,
    comments,
  }
}

export type SwitchTree = {
  kind: NodeKind.SwitchTree
  condition: string
  children: CaseNode[]
  defaultChild: DefaultNode | null
  comments: string[]
}

export const createSwitchTree = (
  condition: string,
  children: CaseNode[],
  defaultChild: DefaultNode | null,
  comments: string[]
): SwitchTree => {
  return {
    kind: NodeKind.SwitchTree,
    condition,
    children,
    defaultChild,
    comments,
  }
}

export type CaseNode = {
  kind: NodeKind.CaseNode
  expectation: string
  children: TreeNode[]
  comments: string[]
}

export const createCaseNode = (
  expectation: string,
  children: TreeNode[],
  comments: string[]
): CaseNode => {
  return {
    kind: NodeKind.CaseNode,
    expectation,
    children,
    comments,
  }
}

export type DefaultNode = {
  kind: NodeKind.DefaultNode
  children: TreeNode[]
  comments: string[]
}

export const createDefaultNode = (
  children: TreeNode[],
  comments: string[]
): DefaultNode => {
  return {
    kind: NodeKind.DefaultNode,
    children,
    comments,
  }
}

export type IfTree = {
  kind: NodeKind.IfTree
  condition: string
  successChildren: TreeNode[]
  faildChildren: TreeNode[]
  comments: string[]
}

export const createIfTree = (
  condition: string,
  successChildren: TreeNode[],
  faildChildren: TreeNode[],
  comments: string[]
): IfTree => {
  return {
    kind: NodeKind.IfTree,
    condition,
    successChildren,
    faildChildren,
    comments,
  }
}

export enum NodeKind {
  Tree = 'Tree',
  TreeBlock = 'TreeBlock',
  ActionNode = 'ActionNode',
  GotoNode = 'GotoNode',
  SwitchTree = 'SwitchTree',
  CaseNode = 'CaseNode',
  DefaultNode = 'DefaultNode',
  IfTree = 'IfTree',
}

export enum LeafNodeKind {
  Start = 'Start',
  Comment = 'Comment',
  Expression = 'Expression',
  Condition = 'Condition',
  Name = 'Name',
  Expectation = 'Expectation',
}

export enum AntherNodeKind {
  SuccessBlock = 'SuccessBlock',
  FaildBlock = 'FaildBlock',
}

export type TreeNonLeafNodeRecord = {
  id: string
  floorId: number
  parentId: string
  kind: NodeKind | AntherNodeKind
  content: null
}

export type TreeLeafNodeRecord = {
  id: string
  floorId: number
  parentId: string
  kind: LeafNodeKind
  content: string
}

export type TreeNodeRecord = TreeNonLeafNodeRecord | TreeLeafNodeRecord

export type TreeNodeStatusRecord = {
  id: string
  path: string
  status: number
}

export type TreeNodeRecordWithDocumentId = TreeNodeRecord & {
  documentId: string
}