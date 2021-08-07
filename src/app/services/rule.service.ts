import { EventEmitter, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ResultSet, Rule } from '../common/interfaces';
import { RuleFileType, SyntaxType } from '../common//constants';

import { rules } from '../rules/eslint';


@Injectable({
	providedIn: 'root'
})
export class RuleService {

	private allRules: Rule[] = rules;

	private resultSet: ResultSet = {
		fileName: undefined,
		fileType: undefined,
		syntaxFileType: undefined,
		code: undefined
	} as Partial<ResultSet> as ResultSet;


	rules$: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>(this.allRules); // rules filtered
	result$: EventEmitter<ResultSet> = new EventEmitter<ResultSet>();


	setFileType (fileType: RuleFileType): void {
		switch (fileType) {
			case RuleFileType.JavaScript:
			case RuleFileType.ESM:
				this.resultSet.fileType = RuleFileType.JavaScript;
				this.resultSet.syntaxFileType = SyntaxType.JavaScript;
				break;

			case RuleFileType.YML:
			case RuleFileType.YAML:
				this.resultSet.fileType = RuleFileType.YML;
				this.resultSet.syntaxFileType = SyntaxType.YAML;
				break;

			case RuleFileType.JSON:
			case RuleFileType['in package.json']:
				this.resultSet.fileType = RuleFileType.JSON;
				this.resultSet.syntaxFileType = SyntaxType.JSON;
				break;
		}

		if (fileType !== RuleFileType['in package.json']) {
			this.resultSet.fileName = '.eslintrc.' + fileType;
		}


		// TODO: dev
		switch (this.resultSet.syntaxFileType) {
			case SyntaxType.JavaScript:
				this.resultSet.code = `function () {
	return 'hello';
}`;
				break;

			case SyntaxType.YAML:
				this.resultSet.code = `env:
    browser: true
rules:
    # Override default settings
    eqeqeq: "warn"
    strict: "off"
    value: 999`;
				break;

			case SyntaxType.JSON:
				this.resultSet.code = `{
	"key": "value"
}`;
				break;
		}

		this.result$.emit(this.resultSet);
	}

	// TODO
	// setRuleFilter(): void;

}
