import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { Environment, ErrorLevel, Message, Package, RuleFileType, RuleOrder } from '../../common/constants';
import { Config, TextValue } from '../../common/interfaces';
import { entriesToTextValue, refreshPrism } from '../../common/util';
import { LanguageService, RuleService } from '../../services';


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

	Message = Message;

	FormFieldName = FormFieldName;

	formGroup!: FormGroup;

	fileTypes: TextValue<RuleFileType>[];
	envArr: TextValue<Environment>[];
	errorLevels: TextValue<ErrorLevel>[];
	packages: TextValue<Package>[];
	ruleOrders: TextValue<RuleOrder>[];


	constructor (
		public languageSvc: LanguageService,
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
			[FormFieldName.Packages]: this.fb.control([Package.ESLint]),
			[FormFieldName.RuleOrder]: this.fb.control(RuleOrder.DocumentOrder)
		});

		this.getFormCtrl(FormFieldName.FileType)?.valueChanges
			.pipe(
				tap((newValue: RuleFileType): void => {
					this.valueChanged(FormFieldName.FileType, newValue);
				})
			)
			.subscribe();

		this.getFormCtrl(FormFieldName.Environment)?.valueChanges
			.pipe(
				tap((newValue: Environment[]): void => {
					this.valueChanged(FormFieldName.Environment, newValue);
				})
			)
			.subscribe();

		this.getFormCtrl(FormFieldName.Packages)?.valueChanges
			.pipe(
				tap((newValue: Package[]): void => {
					this.valueChanged(FormFieldName.Packages, newValue);
				})
			)
			.subscribe();


		refreshPrism();
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
	valueChanged (field: FormFieldName.Environment, newValue: Environment[]): void;
	valueChanged (field: FormFieldName.Packages, newValue: Package[]): void;
	valueChanged (field: FormFieldName, newValue: unknown): void {
		switch (field) {
			case FormFieldName.FileType:
				this.ruleSvc.setConfig({
					key: 'fileType',
					value: newValue as Config[keyof Config]
				});
				break;

			case FormFieldName.Environment:
				this.ruleSvc.setConfig({
					key: 'env',
					value: newValue as Config[keyof Config]
				});
				break;

			case FormFieldName.Packages:
				this.ruleSvc.setPackages(newValue as Package[]);
				break;
		}
	}

}
