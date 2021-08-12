import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
	Config,
	ObjectOption,
	Option,
	PackageSelected,
	ResultSet,
	Rule,
	RuleSelected,
	TypedObject
} from '../common/interfaces';
import { Environment, ErrorLevel, Package, RuleFileType, RuleOrder, SyntaxType } from '../common//constants';

import { rules } from '../rules/eslint';


interface CreateRuleParam {
	config: Config;
	rulesSelected: RuleSelected[];
}


@Injectable({
	providedIn: 'root'
})
export class RuleService {

	private config: Config = {
		fileType: RuleFileType.JSON,
		syntax: SyntaxType.JSON,
		indent: '\t'
	};

	private targetPackages: PackageSelected[] = [{
		packageName: Package.ESLint,
		skipRecommended: true
	}];

	private ruleOrder: RuleOrder = RuleOrder.DocumentOrder;


	private allRules: Rule[] = rules;
	rulesSelected: RuleSelected[] = [];

	// create with default option
	private resultSet: ResultSet = this.createResultSet();


	rules$: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>(this.getRules());
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
		key: 'fileType' | 'env',
		value: Config[keyof Config]
	}): void {
		this.config = Object.assign(this.config, {
			[param.key]: param.value
		});

		this.emitResultSet();
	}

	setPackages (packages: PackageSelected[]): void {
		this.targetPackages = packages;

		this.rules$.next(this.getRules());
	}

	setRuleOrder (ruleOrder: RuleOrder): void {
		this.ruleOrder = ruleOrder;

		this.rules$.next(this.getRules());
	}

	addRule (param: {
		rule: Rule,
		errorLevel: ErrorLevel,
		option?: Option
	}): void {
		if (param.errorLevel === ErrorLevel.skip) {
			// remove
			this.rulesSelected = this.rulesSelected.filter((rule: RuleSelected): boolean => {
				return !(param.rule.package === rule.package
					&& param.rule.name === rule.name);
			});
		}
		else {
			const target: RuleSelected | undefined = this.rulesSelected.find((rule: RuleSelected): boolean => {
				return param.rule.package === rule.package
					&& param.rule.name === rule.name;
			});

			if (target) {
				// modify
				target.errorLevel = param.errorLevel;
				target.option = param.option;
			}
			else {
				// add
				this.rulesSelected.push({
					package: param.rule.package,
					name: param.rule.name,
					errorLevel: param.errorLevel,

					option: param.option
				});
			}
		}

		// sort in create

		this.emitResultSet();
	}

	private getRules (): Rule[] {
		return this.allRules
			.filter((rule: Rule): boolean => {
				return this.targetPackages.some((targetPackage: PackageSelected): boolean => {
					return targetPackage.packageName === rule.package
					&& targetPackage.skipRecommended
						? !rule.recommended
						: true;
				});
			})
			.sort((a: Rule, b: Rule): number => {
				let result: number = 0;

				switch (this.ruleOrder) {
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

	getRule (name: string): Rule | undefined {
		return this.allRules.find((rule: Rule): boolean => {
			return rule.name === name;
		});
	}

}
