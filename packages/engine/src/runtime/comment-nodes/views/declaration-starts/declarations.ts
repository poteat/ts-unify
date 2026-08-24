/**
 * Node kinds a comment documents when it sits right before one.
 */
export const DECLARATIONS: ReadonlySet<string> = new Set([
  'FunctionDeclaration',
  'TSDeclareFunction',
  'ClassDeclaration',
  'ClassExpression',
  'VariableDeclaration',
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
  'TSEnumDeclaration',
  'TSEnumMember',
  'TSModuleDeclaration',
  'MethodDefinition',
  'TSAbstractMethodDefinition',
  'PropertyDefinition',
  'TSAbstractPropertyDefinition',
  'TSPropertySignature',
  'TSMethodSignature',
  'Property',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
])
