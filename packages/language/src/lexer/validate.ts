import { KeywordEnum, OperatorEnum } from './token'

const keywords = Object.values(KeywordEnum)
export const isKeyword = (word: string): word is KeywordEnum => {
  return keywords.includes(word as any)
}

const operators = Object.values(OperatorEnum)
export const isOperator = (word: string): word is OperatorEnum => {
  return operators.includes(word as any)
}

export const isValidActionStr = (word: string) => {
  // [xxx]
  return /\[([^\[\]\s]+)\]/.test(word)
}

export const isValidPathStr = (word: string) => {
  // "xxx"
  return /\"([^\"\s]+)\"/g.test(word)
}

export const isValidIdentifierStr = (word: string) => {
  // <xxx>
  return /<([^\<\>\s]+)>/g.test(word)
}

export const isValidContentChar = (char: string) => {
  return /[^\s]/g.test(char)
}

export const isValidActionChar = (word: string) => {
  // [xxx]
  return /[^\[\]\s]/.test(word)
}

export const isValidPathChar = (word: string) => {
  // "xxx"
  return /[^\"\s]/g.test(word)
}

export const isValidIdentifierChar = (word: string) => {
  // <xxx>
  return /[^\<\>\s]/g.test(word)
}

export const isWhitespace = (char: string) => {
  return /\s/.test(char) && char.length === 1
}

export const isNewLineChar = (char: string) => {
  return /[\r\n]+/.test(char)
}

export const isDigit = (char: string) => {
  return /\d/.test(char) && char.length === 1
}

export const isLetter = (char: string) => {
  return /[a-zA-Z]/.test(char) && char.length === 1
}
