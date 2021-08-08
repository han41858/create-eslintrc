import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Config, ObjectOption, ResultSet, Rule, RuleSelected, TypedObject } from '../common/interfaces';
import { RuleFileType, SyntaxType } from '../common//constants';

import { rules } from '../rules/eslint';


interface CreateRuleParam {
	config: Config;
	rulesSelected: RuleSelected[];
}

const defaultConfig: Config = {
	fileType: RuleFileType.JSON,
	syntax: SyntaxType.JSON,
	env: [],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	indent: '\t'
};


@Injectable({
	providedIn: 'root'
})
export class RuleService {

	private allRules: Rule[] = rules;
	rulesSelected: RuleSelected[] = [];

	// create with default option
	private resultSet: ResultSet = this.createResultSet({
		config: defaultConfig,
		rulesSelected: []
	});


	rules$: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>(this.allRules); // rules filtered
	result$: BehaviorSubject<ResultSet> = new BehaviorSubject<ResultSet>(this.resultSet);


	private static sanitizeType (config: Config): {
		fileType: RuleFileType;
		syntaxType: SyntaxType;
		fileName: string | undefined;
	} {
		let fileType: RuleFileType;
		let syntaxType: SyntaxType;
		let fileName: string | undefined;

		switch (config.fileType) {
			case RuleFileType.JavaScript:
				fileType = RuleFileType.JavaScript;
				syntaxType = SyntaxType.JavaScript;
				break;

			case RuleFileType.YML:
			case RuleFileType.YAML:
				fileType = RuleFileType.YML;
				syntaxType = SyntaxType.YAML;
				break;

			case RuleFileType.JSON:
			case RuleFileType['in package.json']:
				fileType = RuleFileType.JSON;
				syntaxType = SyntaxType.JSON;
				break;
		}

		if (config.fileType !== RuleFileType['in package.json']) {
			fileName = '.eslintrc.' + config.fileType;
		}

		return {
			fileType: fileType,
			syntaxType: syntaxType,
			fileName: fileName
		};
	}

	private createResultSet (param: CreateRuleParam): ResultSet {
		const { fileType, syntaxType, fileName } = RuleService.sanitizeType(param.config);

		let code: string;

		switch (syntaxType) {
			case SyntaxType.JSON:
				code = RuleService.createJSONRuleCode(param);
				break;

			case SyntaxType.JavaScript:
				code = RuleService.createJSRuleCode(param);
				break;

			case SyntaxType.YAML:
				code = RuleService.createYAMLRuleCode(param);
				break;
		}

		// this.result$.emit(this.resultSet);

		return {
			fileType: fileType,
			syntaxType: syntaxType,
			fileName: fileName,
			code: code
		};
	}

	private static createJSONRuleCode (param: CreateRuleParam): string {
		let codeObj: TypedObject<unknown> = {
			extends: param.config.extends,
			rules: param.rulesSelected.reduce((acc: TypedObject<unknown>, rule: RuleSelected): TypedObject<unknown> => {
				if (!rule.option) {
					acc[rule.name] = rule.errorLevel;
				}
				else if (!rule.additionalOptions) {
					acc[rule.name] = [rule.errorLevel, rule.option.value];
				}
				else {
					acc[rule.name] = [
						rule.errorLevel,
						rule.option.value,
						rule.additionalOptions
							.reduce((additionalAcc: TypedObject<unknown>, option: ObjectOption): TypedObject<unknown> => {
								additionalAcc[option.property] = option.value;

								return additionalAcc;
							}, {})
					];
				}

				return acc;
			}, {})
		};

		return JSON.stringify(codeObj, undefined, param.config.indent);
	}

	private static createJSRuleCode (param: CreateRuleParam): string {
		return `function () {
	return 'hello';
}`;
	}

	private static createESMRuleCode (param: CreateRuleParam): string {
		return `function () {
	return 'hello';
}`;
	}

	private static createYAMLRuleCode (param: CreateRuleParam): string {
		return `env:
    browser: true
rules:
    # Override default settings
    eqeqeq: "warn"
    strict: "off"
    value: 999`;
	}

	setConfig (param: {
		key: 'fileType' | 'env',
		value: Config[keyof Config]
	}): void {
		const newResultSet: ResultSet = this.createResultSet({
			config: Object.assign(defaultConfig, {
				[param.key]: param.value
			}),
			rulesSelected: this.rulesSelected
		});

		this.result$.next(newResultSet);
	}

}
