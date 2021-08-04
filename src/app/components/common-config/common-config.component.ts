import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Environment, ErrorLevel, Package, RuleFileType, RuleOrder } from '../../common/constants';
import { TextValue } from '../../common/interfaces';
import { entriesToTextValue } from '../../common/util';


enum FormFieldName {
	FileType = 'fileType',
	Environment = 'env',
	ErrorLevel = 'errorLevel',
	SkipRecommended = 'skipRecommended',
	Packages = 'packages',
	RuleOrder = 'ruleOrder',

	// inner fields
	Node = 'node',
	Browser = 'browser',

	ESLint = 'eslint',
	TypeScript = '@typescript-eslint',
	Angular = '@angular-eslint/eslint-plugin',
	React = 'eslint-plugin-react',
	Vue = 'eslint-plugin-vue'
}


@Component({
	selector: 'app-config-form',
	templateUrl: './common-config.component.html',
	styleUrls: ['./common-config.component.sass']
})
export class CommonConfigComponent implements OnInit {

	RuleFileType = RuleFileType;
	ErrorLevel = ErrorLevel;

	FormFieldName = FormFieldName;

	formGroup!: FormGroup;

	fileTypes: TextValue<RuleFileType>[];
	envArr: TextValue<Environment>[];
	errorLevels: TextValue<ErrorLevel>[];
	packages: TextValue<Package>[];
	ruleOrders: TextValue<RuleOrder>[];

	constructor (private fb: FormBuilder) {
		this.fileTypes = entriesToTextValue(Object.entries(RuleFileType));
		this.envArr = entriesToTextValue(Object.entries(Environment));
		this.errorLevels = entriesToTextValue(Object.entries(ErrorLevel));
		this.packages = entriesToTextValue(Object.entries(Package));
		this.ruleOrders = entriesToTextValue(Object.entries(RuleOrder));
	}

	ngOnInit (): void {
		this.formGroup = this.fb.group({
			[FormFieldName.FileType]: this.fb.control(RuleFileType.JSON),
			[FormFieldName.Environment]: this.fb.group({
				[FormFieldName.Node]: this.fb.control(false),
				[FormFieldName.Browser]: this.fb.control(false)
			}),
			[FormFieldName.ErrorLevel]: this.fb.control(ErrorLevel.error),
			[FormFieldName.SkipRecommended]: this.fb.control(true),
			[FormFieldName.Packages]: this.fb.group({
				[FormFieldName.ESLint]: this.fb.control(true),
				[FormFieldName.TypeScript]: this.fb.control(false),
				[FormFieldName.Angular]: this.fb.control(false),
				[FormFieldName.React]: this.fb.control(false),
				[FormFieldName.Vue]: this.fb.control(false)
			}),
			[FormFieldName.RuleOrder]: this.fb.control(RuleOrder.DocumentOrder)
		});
	}

}
