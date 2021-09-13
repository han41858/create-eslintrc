import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
	Config,
	ObjectOption,
	PackageSelected,
	ResultSet,
	Rule,
	RuleSelected,
	TypedObject
} from '../common/interfaces';
import { Environment, ErrorLevel, RuleFileType, RuleOrder, StorageKey, SyntaxType } from '../common//constants';

import { rules } from '../rules/eslint';
import { getStorage, setStorage } from '../common/util';


interface CreateRuleParam {
	config: Config;
	rulesSelected: RuleSelected[];
}


@Injectable({
	providedIn: 'root'
})
export class RuleService {

	config: Config;

	private allRules: Rule[] = rules;
	private rulesForStream!: Rule[];
	rulesSelected: RuleSelected[] = [];

	// create with default option
	private resultSet: ResultSet;


	rules$!: BehaviorSubject<Rule[]>;
	result$: BehaviorSubject<ResultSet>;


	constructor () {
		const configInStorage: Config | undefined = getStorage(StorageKey.Config);

		this.config = {
			fileType: configInStorage?.fileType || RuleFileType.JSON,
			syntax: configInStorage?.syntax || SyntaxType.JSON,

			indent: configInStorage?.indent || '\t',

			env: configInStorage?.env || [],
			packages: configInStorage?.packages || [{ packageName: 'eslint', skipRecommended: true }],

			ruleOrder: configInStorage?.ruleOrder || RuleOrder.DocumentOrder
		};

		setStorage(StorageKey.Config, this.config);

		const ruleNames: string[] | undefined = getStorage(StorageKey.RuleNames);
		this.refreshRuleList(ruleNames);

		this.rulesSelected = getStorage(StorageKey.RulesSelected) || [];

		this.resultSet = this.createResultSet();
		this.result$ = new BehaviorSubject<ResultSet>(this.resultSet);
	}

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

	private emitResultSet (): void {
		this.result$.next(this.createResultSet());
	}

	private createResultSet (): ResultSet {
		const param: CreateRuleParam = {
			config: this.config,
			rulesSelected: this.rulesSelected
		};

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
		const codeObj: TypedObject<unknown> = {};

		if (param.config.env && param.config.env.length > 0) {
			codeObj['env'] = param.config.env;
		}

		// if (param.config.extends && param.config.extends.length > 0) {
		// 	codeObj['extends'] = param.config.extends;
		// }

		codeObj['rules'] = param.rulesSelected.reduce((acc: TypedObject<unknown>, rule: RuleSelected): TypedObject<unknown> => {
			if (rule.errorLevel === ErrorLevel.skip) {
				throw new Error('skip rule');
			}

			if (rule.errorLevel === ErrorLevel.off) {
				acc[rule.name] = ErrorLevel.off;
			}
			else {
				if (!rule.option) {
					acc[rule.name] = [rule.errorLevel];
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
			}

			return acc;
		}, {});

		return JSON.stringify(codeObj, undefined, param.config.indent);
	}

	private static createJSRuleCode (param: CreateRuleParam): string {
		let codeObj: TypedObject<unknown> = {};

		if (param.config.env && param.config.env.length > 0) {
			codeObj['env'] = param.config.env;
		}

		// if (param.config.extends && param.config.extends.length > 0) {
		// 	codeObj['extends'] = param.config.extends;
		// }

		codeObj['rules'] = {};

		return 'module.exports = ' + JSON.stringify(codeObj, undefined, param.config.indent);
	}

	private static createYAMLRuleCode (param: CreateRuleParam): string {
		let indent: string;

		if (typeof param.config.indent === 'number') {
			indent = ' '.repeat(param.config.indent);
		}
		else {
			indent = param.config.indent;
		}


		let resultCode: string = '';

		if (param.config.env && param.config.env.length > 0) {
			resultCode += 'env:';

			param.config.env.forEach((env: Environment): void => {
				resultCode += `\n${ indent }${ env }: true`;
			});

			resultCode += '\n';
		}

		// if (param.config.extends && param.config.extends.length > 0) {
		// 	resultCode += '\nextends:';
		// 	param.config.extends.forEach((one: string): void => {
		// 		resultCode += `\n${ indent }-${ one }`;
		// 	});
		//
		// 	resultCode += '\n';
		// }

		return resultCode;
	}

	setConfig (param: {
		key: keyof Config,
		value: Config[keyof Config]
	}): void {
		this.config = Object.assign(this.config, {
			[param.key]: param.value
		});

		switch (param.key) {
			case 'fileType': {
				const { syntaxType } = RuleService.sanitizeType(this.config);

				this.config.syntax = syntaxType;
				break;
			}

			case 'packages':
			case 'ruleOrder':
				this.refreshRuleList();
				break;
		}

		setStorage(StorageKey.Config, this.config);

		this.emitResultSet();
	}

	refreshRuleList (ruleNames?: string[]): void {
		this.rulesForStream = this.getRules(ruleNames);

		setStorage(StorageKey.RuleNames, this.rulesForStream.map((rule: Rule): string => rule.name));

		if (!this.rules$) {
			this.rules$ = new BehaviorSubject<Rule[]>(this.rulesForStream);
		}
		else {
			this.rules$.next(this.rulesForStream);
		}
	}

	selectRule (param: RuleSelected): void {
		if (param.errorLevel === ErrorLevel.skip) {
			// remove
			this.rulesSelected = this.rulesSelected.filter((rule: RuleSelected): boolean => {
				return !(param.package === rule.package
					&& param.name === rule.name);
			});
		}
		else {
			const target: RuleSelected | undefined = this.rulesSelected.find((rule: RuleSelected): boolean => {
				return param.package === rule.package
					&& param.name === rule.name;
			});

			if (target) {
				// modify
				target.errorLevel = param.errorLevel;
				target.option = param.option;
			}
			else {
				// add
				this.rulesSelected.push({
					package: param.package,
					name: param.name,
					errorLevel: param.errorLevel,

					option: param.option
				});
			}
		}

		// sort in create

		setStorage(StorageKey.RulesSelected, this.rulesSelected);

		this.emitResultSet();
	}

	private getRules (ruleNames?: string[]): Rule[] {
		let rules: Rule[];

		if (ruleNames) {
			rules = ruleNames
				.map((ruleName: string): Rule | undefined => {
					return this.allRules.find((refRule: Rule): boolean => refRule.name === ruleName);
				})
				.filter((rule: Rule | undefined): rule is Rule => {
					return !!rule;
				});
		}
		else {
			rules = this.allRules
				.filter((rule: Rule): boolean => {
					return this.config.packages.some((targetPackage: PackageSelected): boolean => {
						return targetPackage.packageName === rule.package
						&& targetPackage.skipRecommended
							? !rule.recommended
							: true;
					});
				})
				.sort((a: Rule, b: Rule): number => {
					let result: number = 0;

					switch (this.config.ruleOrder) {
						case RuleOrder.DocumentOrder:
							result = 0; // not sort
							break;

						case RuleOrder.Alphabetical:
							result = a.name < b.name
								? -1
								: 1;
							break;

						case RuleOrder.FromOlderVersion: {
							const [majorA, minorA, patchA] = a.version.split('.').map((value: string): number => parseInt(value));
							const valueA: number = majorA * 10000 + minorA * 100 + patchA;

							const [majorB, minorB, patchB] = b.version.split('.').map((value: string): number => parseInt(value));
							const valueB: number = majorB * 10000 + minorB * 100 + patchB;

							result = valueA - valueB;
							break;
						}

						case RuleOrder.FromNewerVersion: {
							const [majorA, minorA, patchA] = a.version.split('.').map((value: string): number => parseInt(value));
							const valueA: number = majorA * 10000 + minorA * 100 + patchA;

							const [majorB, minorB, patchB] = b.version.split('.').map((value: string): number => parseInt(value));
							const valueB: number = majorB * 10000 + minorB * 100 + patchB;

							result = valueB - valueA;
							break;
						}

						case RuleOrder.Random:
							result = Math.random() - .5;
							break;
					}

					return result;
				});
		}

		return rules;
	}

	getRule (name: string): Rule | undefined {
		return this.allRules.find((rule: Rule): boolean => {
			return rule.name === name;
		});
	}

	getRuleSelected (name: string): RuleSelected | undefined {
		return this.rulesSelected.find((rule: RuleSelected): boolean => {
			return rule.name === name;
		});
	}

}
