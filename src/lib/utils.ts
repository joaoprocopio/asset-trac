export function array(length: number) {
  return Array.from({ length: length })
}

export function isNil(value: unknown) {
  return value == null
}

export function isNumber(value: unknown) {
  return Number.isFinite(parseInt(value as string))
}
