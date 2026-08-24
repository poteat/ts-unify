/**
 * TS signature kinds whose return annotation recast reads as `typeAnnotation`.
 */
export const RETURN_AS_TYPE_ANNOTATION: ReadonlySet<string> = new Set([
  'TSFunctionType',
  'TSConstructorType',
  'TSCallSignatureDeclaration',
  'TSConstructSignatureDeclaration',
  'TSMethodSignature',
])
