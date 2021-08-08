import {
	Environment,
	ErrorLevel,
	FixableType,
	OptionType,
	Package,
	RuleCategory,
	RuleFileType,
	RuleType,
	SyntaxType
} from './constants';


export interface TypedObject<T> {
	[key: string]: T;
}

export interface TextValue<T> {
	text: string;
	value: T;
}

export interface Config {
	fileType: RuleFileType;
	syntax: SyntaxType;

	indent: '\t' | ' ' | number;

	env: Environment[];
	extends: string[];
}

export interface Rule {
	package: Package;
	name: string;
	description: string;

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

	defaultOption?: Option;
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
	value?: unknown;

	examples?: Example[];
}

export interface BooleanOption extends OptionCommon {
	type: OptionType.Boolean;
	value: boolean;
}

export interface NumberOption extends OptionCommon {
	type: OptionType.NumberFixed | OptionType.NumberVariable;
	value?: number;
}

export interface StringOption extends OptionCommon {
	type: OptionType.StringFixed | OptionType.StringVariable;
	value?: string;
}

export interface ObjectOption extends OptionCommon {
	type: OptionType;

	property: string;
	options?: Option[];
	examples?: Example[];
}

export type Option = BooleanOption | NumberOption | StringOption | ObjectOption;

export interface ResultSet {
	fileName?: string;
	fileType: RuleFileType;
	syntaxType: SyntaxType;
	code: string;
}
