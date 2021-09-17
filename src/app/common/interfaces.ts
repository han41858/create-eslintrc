import {
	Environment,
	ErrorLevel,
	FixableType,
	LanguageCode,
	OptionType,
	Package,
	RuleCategory,
	RuleFileType,
	RuleOrder,
	RuleType,
	StorageKey,
	SyntaxType
} from './constants';


export interface TypedObject<T> {
	[key: string]: T;
}

export interface TextValue<T> {
	text: string;
	value: T;
}

export interface StorageRootObj {
	[StorageKey.Language]?: LanguageCode;
	[StorageKey.Config]?: Config;
	[StorageKey.RuleNames]?: string[];
	[StorageKey.RulesSelected]?: RuleSelected[];
}

export interface Config {
	fileType: RuleFileType;
	syntax: SyntaxType;

	indent: '\t' | ' ' | number;

	env: Environment[];

	packages: PackageSelected[];
	ruleOrder: RuleOrder;

	extends?: string[];
}

export interface Rule {
	package: Package;
	name: string;
	description: TypedObject<string>; // key is Language

	type: RuleType;
	category: RuleCategory;

	recommended: boolean;
	fixable: FixableType;

	docUrl: string;
	version: string;
	deprecated?: {
		version: string;
		alternative?: string;
	};

	options?: Option[]; // radio button
	additionalOptions?: ObjectOption[]; // check box

	// root level on/off example
	examples?: Example[];
}

export interface RuleSelected {
	package: Package;
	name: string;
	errorLevel: ErrorLevel;

	option?: Option;
	additionalOptions?: ObjectOption[];
}

export interface Example {
	correct: boolean;
	rule: string;

	syntax: SyntaxType;
	code: string;
}

interface OptionCommon {
	type: OptionType;
	value: unknown;

	examples?: Example[];
}

export interface BooleanOption extends OptionCommon {
	type: OptionType.Boolean;
	value: boolean;
}

export interface IntegerOption extends OptionCommon {
	type: OptionType.IntegerFixed | OptionType.IntegerVariable;
	value: number;
	suffix?: string;

	min?: number;
}

export interface StringOption extends OptionCommon {
	type: OptionType.StringFixed | OptionType.StringVariable;
	value: string;
}

export interface ObjectOption extends OptionCommon {
	type: OptionType;

	property: string;
	options?: Option[];
	examples?: Example[];
}

export type Option = BooleanOption | IntegerOption | StringOption | StringArrayOption;
export type ObjectOption = Option & {
	property: string;
}

export interface ResultSet {
	fileName?: string;
	fileType: RuleFileType;
	syntaxType: SyntaxType;
	code: string;
}

export interface PackageSelected {
	packageName: string;
	skipRecommended: boolean;
}

export interface AppState {
	config: Config;
	rulesSelected: RuleSelected[];
	ruleNames: string[];
}
