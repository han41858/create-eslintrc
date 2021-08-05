export enum Package {
	ESLint = 'eslint',
	TypeScript = '@typescript-eslint',
	Angular = '@angular-eslint/eslint-plugin',
	React = 'eslint-plugin-react',
	Vue = 'eslint-plugin-vue'
}

export enum RuleType {
	Problem,
	Suggestion,
	Layout
}

export enum RuleCategory {
	PossibleErrors,
	BestPractices,
	StrictMode,
	Variables,
	StylisticIssues,
	ECMAScript6
}

export enum FixableType {
	Code,
	Whitespace
}

export enum ErrorLevel {
	skip = 'skip',
	off = 'off',
	warn = 'warn',
	error = 'error'
}

export enum OptionType {
	Boolean = 'boolean',
	NumberFixed = 'numberFixed',
	NumberVariable = 'numberVariable',
	StringFixed = 'stringFixed',
	StringVariable = 'stringVariable',
	StringArray = 'stringArray',
	Object = 'object'
}

// value is extension
export enum RuleFileType {
	JavaScript = 'js',
	ESM = 'cjs',
	YAML = 'yaml',
	YML = 'yml',
	JSON = 'json',
	InPackageJson = 'package.json'
}

export enum SyntaxType {
	JavaScript = 'js',
	JSON = 'json',
	YAML = 'yaml'
}

export enum Environment {
	Node = 'node',
	Browser = 'browser'
}

export enum RuleOrder {
	DocumentOrder = 'document order',
	Alphabetical = 'by alphabetical',
	FromOlderVersion = 'from older version',
	FromNewerVersion = 'from newer version',
	Random = 'by random'
}
