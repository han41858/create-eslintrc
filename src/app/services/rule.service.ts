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
import { Environment, Package, RuleFileType, SyntaxType } from '../common//constants';

import { rules } from '../rules/eslint';


interface CreateRuleParam {
	config: Config;
	rulesSelected: RuleSelected[];
}

const defaultConfig: Config = {
	fileType: RuleFileType.JSON,
	syntax: SyntaxType.JSON,
	indent: '\t'
};


@Injectable({
	providedIn: 'root'
})
export class RuleService {

	private targetPackages: PackageSelected[] = [{
		packageName: Package.ESLint,
		skipRecommended: true
	}];

	private allRules: Rule[] = rules;
	rulesSelected: RuleSelected[] = [];

	// create with default option
	private resultSet: ResultSet = this.createResultSet({
		config: defaultConfig,
		rulesSelected: []
	});


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
		const codeObj: TypedObject<unknown> = {};

		if (param.config.env && param.config.env.length > 0) {
			codeObj['env'] = param.config.env;
		}

		// if (param.config.extends && param.config.extends.length > 0) {
		// 	codeObj['extends'] = param.config.extends;
		// }

		codeObj['rules'] = param.rulesSelected.reduce((acc: TypedObject<unknown>, rule: RuleSelected): TypedObject<unknown> => {
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
		const newResultSet: ResultSet = this.createResultSet({
			config: Object.assign(defaultConfig, {
				[param.key]: param.value
			}),
			rulesSelected: this.rulesSelected
		});

		this.result$.next(newResultSet);
	}

	setPackages (packages: PackageSelected[]): void {
		this.targetPackages = packages;

		this.rules$.next(this.getRules());
	}

	private getRules (): Rule[] {
		return this.allRules.filter((rule: Rule): boolean => {
			return this.targetPackages.some((targetPackage: PackageSelected): boolean => {
				return targetPackage.packageName === rule.package
				&& targetPackage.skipRecommended
					? !rule.recommended
					: true;
			});
		});
		// TODO: sort
	}

	getRule (name: string): Rule | undefined {
		return this.allRules.find((rule: Rule): boolean => {
			return rule.name === name;
		});
	}

}
