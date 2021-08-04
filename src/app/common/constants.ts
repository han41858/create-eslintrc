export enum Package {
	ESLint = 'eslint'
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
	Off,
	Warn,
	Error
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
