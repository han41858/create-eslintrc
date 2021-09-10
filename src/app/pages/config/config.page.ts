import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { Environment, Message, Package, RuleFileType, RuleOrder } from '../../common/constants';
import { Config, PackageSelected, TextValue, TypedObject } from '../../common/interfaces';
import { entriesToTextValue } from '../../common/util';
import { LanguageService, RuleService } from '../../services';


enum FormFieldName {
	FileType = 'fileType',
	Environment = 'env',
	Packages = 'packages',
	RuleOrder = 'ruleOrder',
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
	packages: TextValue<Package>[];
	ruleOrders: TextValue<RuleOrder>[] | undefined;


	constructor (
		public languageSvc: LanguageService,
		private fb: FormBuilder,
		private ruleSvc: RuleService
	) {
		this.fileTypes = entriesToTextValue(Object.entries(RuleFileType));
		this.envArr = entriesToTextValue(Object.entries(Environment));
		this.packages = entriesToTextValue(Object.entries(Package));
	}

	ngOnInit (): void {
		const config: Config = this.ruleSvc.config;

		this.formGroup = this.fb.group({
			[FormFieldName.FileType]: this.fb.control(config.fileType),
			[FormFieldName.Environment]: this.fb.control(config.env),
			[FormFieldName.Packages]: this.fb.group(
				this.packages.reduce((acc: TypedObject<FormArray>, one: TextValue<Package>): TypedObject<FormArray> => {
					const target: PackageSelected | undefined = config.packages?.find((_package: PackageSelected): boolean => {
						return _package.packageName === one.value;
					});

					const selected: boolean = !!target;
					const skipRecommended: boolean = !!target?.skipRecommended;

					acc[one.text] = this.fb.array(
						[
							selected,
							selected
								? skipRecommended
								: {
									value: false,
									disabled: true
								}
						]
					);

					return acc;
				}, {})
			),
			[FormFieldName.RuleOrder]: this.fb.control(config.ruleOrder)
		});

		this.languageSvc.languageCode$
			.pipe(
				tap((): void => {
					this.ruleOrders = Object.keys(RuleOrder).map((key: string): TextValue<RuleOrder> => {
						return {
							text: this.languageSvc.getMsg(key as unknown as Message) as string,
							value: (RuleOrder as TypedObject<RuleOrder>)[key]
						};
					});
				})
			)
			.subscribe();

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
				map((newValue: {
					[key: string]: [boolean, boolean];
				}): PackageSelected[] => {
					return this.packages.reduce((acc: PackageSelected[], packageObj: TextValue<Package>): PackageSelected[] => {
						const [selected, skipRecommended]: [boolean, boolean] = newValue[packageObj.text];

						if (selected) {
							acc.push({
								packageName: packageObj.value,
								skipRecommended: skipRecommended || false // disabled controller value : undefined
							});
						}

						const packageFormGroup: AbstractControl | undefined = this.getFormCtrl(FormFieldName.Packages)?.get(packageObj.text) || undefined;

						if (packageFormGroup) {
							const recommendedCheckbox: AbstractControl | undefined = packageFormGroup.get('1') || undefined;

							if (selected) {
								if (recommendedCheckbox && recommendedCheckbox.disabled) {
									recommendedCheckbox.enable({
										emitEvent: false
									});
								}
							}
							else {
								if (recommendedCheckbox && recommendedCheckbox.enabled) {
									recommendedCheckbox.disable({
										emitEvent: false
									});
								}
							}
						}

						return acc;
					}, []);
				}),
				distinctUntilChanged((x: PackageSelected[], y: PackageSelected[]): boolean => {
					return x.length === y.length
						&& x.every((one: PackageSelected, i: number): boolean => {
							return one.packageName === y[i].packageName
								&& one.skipRecommended === y[i].skipRecommended;
						});
				}),
				tap((packagesSelected: PackageSelected[]) => {
					this.valueChanged(FormFieldName.Packages, packagesSelected);
				})
			)
			.subscribe();

		this.getFormCtrl(FormFieldName.RuleOrder)?.valueChanges
			.pipe(
				tap((newValue: RuleOrder): void => {
					this.valueChanged(FormFieldName.RuleOrder, newValue);
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
	valueChanged (field: FormFieldName.Environment, newValue: Environment[]): void;
	valueChanged (field: FormFieldName.Packages, newValue: PackageSelected[]): void;
	valueChanged (field: FormFieldName.RuleOrder, newValue: RuleOrder): void;
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
				this.ruleSvc.setConfig({
					key: 'packages',
					value: newValue as Config[keyof Config]
				});
				break;

			case FormFieldName.RuleOrder:
				this.ruleSvc.setConfig({
					key: 'ruleOrder',
					value: newValue as RuleOrder
				});
				break;
		}
	}

}
