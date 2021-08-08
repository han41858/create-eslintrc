import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { Environment, ErrorLevel, Package, RuleFileType, RuleOrder } from '../../common/constants';
import { Config, TextValue } from '../../common/interfaces';
import { entriesToTextValue } from '../../common/util';
import { RuleService } from '../../services';


enum FormFieldName {
	FileType = 'fileType',
	Environment = 'env',
	ErrorLevel = 'errorLevel',
	SkipRecommended = 'skipRecommended',
	Packages = 'packages',
	RuleOrder = 'ruleOrder'
}


@Component({
	templateUrl: './config.page.html',
	styleUrls: ['./config.page.sass']
})
export class ConfigPage implements OnInit {

	FormFieldName = FormFieldName;

	formGroup!: FormGroup;

	fileTypes: TextValue<RuleFileType>[];
	envArr: TextValue<Environment>[];
	errorLevels: TextValue<ErrorLevel>[];
	packages: TextValue<Package>[];
	ruleOrders: TextValue<RuleOrder>[];


	constructor (
		private fb: FormBuilder,
		private ruleSvc: RuleService
	) {
		this.fileTypes = entriesToTextValue(Object.entries(RuleFileType));
		this.envArr = entriesToTextValue(Object.entries(Environment));
		this.errorLevels = entriesToTextValue(Object.entries(ErrorLevel));
		this.packages = entriesToTextValue(Object.entries(Package));
		this.ruleOrders = entriesToTextValue(Object.entries(RuleOrder));
	}

	ngOnInit (): void {
		this.formGroup = this.fb.group({
			[FormFieldName.FileType]: this.fb.control(RuleFileType.JSON),
			[FormFieldName.Environment]: this.fb.control([]),
			[FormFieldName.ErrorLevel]: this.fb.control(ErrorLevel.error),
			[FormFieldName.SkipRecommended]: this.fb.control(true),
			[FormFieldName.Packages]: this.fb.control([]),
			[FormFieldName.RuleOrder]: this.fb.control(RuleOrder.DocumentOrder)
		});

		this.getFormCtrl(FormFieldName.FileType)?.valueChanges
			.pipe(
				tap((newValue: RuleFileType): void => {
					this.valueChanged(FormFieldName.FileType, newValue);
				})
			)
			.subscribe();
	}

	getFormCtrl (field: FormFieldName): AbstractControl | undefined {
		let result: AbstractControl | undefined;

		const ctrl: AbstractControl | null = this.formGroup.get(field);

		if (ctrl) {
			result = ctrl;
		}

		return result;
	}

	getFormValue<T> (field: FormFieldName): T | undefined {
		let result: T | undefined;

		const ctrl: AbstractControl | undefined = this.getFormCtrl(field);

		if (ctrl) {
			result = ctrl.value;
		}

		return result;
	}

	valueChanged (field: FormFieldName.FileType, newValue: RuleFileType): void;
	valueChanged (field: FormFieldName, newValue: unknown): void {
		this.ruleSvc.setConfig({
			key: 'fileType',
			value: newValue as Config[keyof Config]
		});
	}

}
