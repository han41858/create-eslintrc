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
	JSON = 'json',
	JavaScript = 'js',
	// ESM = 'cjs', // not support
	YAML = 'yaml',
	YML = 'yml',
	'in package.json' = 'package.json'
}

export enum SyntaxType {
	JavaScript = 'js',
	// ESM = 'esm', // not support
	JSON = 'json',
	YAML = 'yaml'
}

export enum Environment {
	Node = 'node',
	Browser = 'browser'
}

// same with related Message key
export enum RuleOrder {
	DocumentOrder = 'DocumentOrder',
	Alphabetical = 'Alphabetical',
	FromOlderVersion = 'FromOlderVersion',
	FromNewerVersion = 'FromNewerVersion',
	Random = 'Random'
}


export enum LanguageCode {
	'en' = 'en',
	'ko-kr' = 'ko-kr'
}

export const DefaultLanguage: LanguageCode = LanguageCode.en;

export enum Message {
	Language,

	StartTitle,
	Start,

	ConfigFileType,
	Environment,
	DefaultErrorLevel,

	TargetPackages,
	Category,
	NpmPackage,
	Select,
	SkipRecommended,

	RuleOrder,

	DocumentOrder,
	Alphabetical,
	FromOlderVersion,
	FromNewerVersion,
	Random,

	Previous,
	Next,

	Options,
	AdditionalOptions,

	Result
}
