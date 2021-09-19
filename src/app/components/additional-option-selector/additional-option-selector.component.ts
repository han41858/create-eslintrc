import { Component, Input, OnChanges } from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ValidatorFn,
	Validators
} from '@angular/forms';

import { debounceTime, filter, tap } from 'rxjs/operators';

import { IntegerOption, ObjectOption, Option, Rule, TypedObject } from '../../common/interfaces';
import { newArray } from '../../common/util';
import { OptionType } from '../../common/constants';


type OnChangeFnc = (option: ObjectOption[] | undefined) => void;

type FormConfigObj = TypedObject<AbstractControl>;


@Component({
	selector: 'app-additional-option-selector',
	templateUrl: './additional-option-selector.component.html',
	styleUrls: ['./additional-option-selector.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: AdditionalOptionSelectorComponent,
		multi: true
	}]
})
export class AdditionalOptionSelectorComponent implements OnChanges, ControlValueAccessor {

	OptionType = OptionType;

	@Input() rule?: Rule;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;
	disabled: boolean = false;

	currentValue: ObjectOption[] = [];

	formGroup: FormGroup | undefined;
	private freezeFormReaction: boolean = false;


	constructor (private fb: FormBuilder) {
	}

	ngOnChanges () {
		if (!this.rule) {
			throw new Error('no rule');
		}

		if (this.rule.additionalOptions) {
			const additionalOptionsLength: number = this.rule.additionalOptions.length;

			const formConfigObj: FormConfigObj = newArray(additionalOptionsLength, (i: number): ObjectOption | undefined => {
				return this.rule?.additionalOptions?.[i];
			})
				.filter((option: ObjectOption | undefined): option is ObjectOption => !!option)
				.reduce((acc: FormConfigObj, option: ObjectOption, i: number): FormConfigObj => {
					acc['' + i] = this.fb.control(false); // TODO: from rule selected

					let validators: ValidatorFn[] | undefined;

					switch (option.type) {
						case OptionType.IntegerVariable:
							validators = [
								Validators.required,
								'min' in option && option.min !== undefined ? Validators.min(option.min) : undefined,
								Validators.pattern(/^[0-9]*$/)
							].filter((validator: ValidatorFn | undefined): validator is ValidatorFn => {
								return validator !== undefined;
							});
							break;

						case OptionType.StringVariable:
							validators = [Validators.required];
							break;

						// TODO
						// case OptionType.StringArray:
						// 	break;
					}

					if (validators) {
						acc['' + i + '_value'] = this.fb.control({
							value: option.value,
							disabled: true
						}, validators);
					}

					return acc;
				}, {});

			this.formGroup = this.fb.group(formConfigObj);

			newArray(additionalOptionsLength, (i: number): AbstractControl | undefined => {
				return this.getFormCtrl('' + i);
			})
				.filter((ctrl: AbstractControl | undefined): ctrl is AbstractControl => {
					return !!ctrl;
				})
				.forEach((ctrl: AbstractControl, i: number): void => {
					ctrl.valueChanges
						.pipe(
							tap((checked: boolean): void => {
								const inputCtrl: AbstractControl | undefined = this.getFormCtrl('' + i + '_value');

								if (inputCtrl) {
									if (checked) {
										inputCtrl.enable();
									}
									else {
										const targetOption: ObjectOption | undefined = this.rule?.additionalOptions?.[i];

										if (targetOption) {
											inputCtrl.setValue(targetOption.value);
										}

										inputCtrl.disable();
									}
								}
							})
						)
						.subscribe();
				});


			this.formGroup.valueChanges
				.pipe(
					filter(() => !this.freezeFormReaction),
					debounceTime(10), // wait disable state change
					tap(() => {
						if (this.formGroup) {
							const newOptions: ObjectOption[] = Object.keys(this.formGroup.value)
								.reduce((acc: ObjectOption[], indexStr: string): ObjectOption[] => {
									const optionChecked: boolean = this.formGroup?.value[indexStr] || undefined;

									if (optionChecked) {
										const targetOption: ObjectOption | undefined = this.rule?.additionalOptions?.[+indexStr];

										if (targetOption) {
											switch (targetOption.type) {
												case OptionType.IntegerVariable:
												case OptionType.StringVariable:
												case OptionType.StringArray: {
													const targetCtrl: AbstractControl | undefined = this.formGroup?.get(indexStr + '_value') || undefined;

													if (targetOption && targetCtrl?.valid) {
														acc.push({
															property: targetOption.property,
															type: targetOption.type,
															value: targetCtrl.value
														});
													}
													break;
												}

												default:
													acc.push({
														property: targetOption.property,
														type: targetOption.type,
														value: targetOption.value
													} as ObjectOption);
											}
										}
									}

									return acc;
								}, []);

							this.writeValue(newOptions);
						}
					})
				)
				.subscribe();
		}
	}

	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	setDisabledState (isDisabled: boolean) {
		this.disabled = isDisabled;

		if (this.disabled) {
			if (this.currentValue?.length > 0) {
				this.writeValue([]);
			}

			this.formGroup?.disable();
		}
		else {
			this.formGroup?.enable();
		}
	}

	writeValue (additionalOptions: ObjectOption[] | null): void {
		// console.log('writeValue()', additionalOptions);

		if (this.currentValue !== additionalOptions) {
			this.currentValue = additionalOptions || [];

			// const allValues: unknown[] = additionalOptions?.map(option => option.value) || [];
			//
			// console.warn(this.formGroup?.value);
			//
			// const valueObj: TypedObject<boolean | unknown> | undefined = this.rule?.additionalOptions?.reduce((valueObj: TypedObject<boolean | unknown>, option: ObjectOption, i: number) => {
			// 	valueObj['' + i] = allValues.includes(option.value);
			//
			// 	return valueObj;
			// }, {});
			//
			// if (valueObj) {
			// 	this.freezeFormReaction = true;
			// 	this.formGroup?.patchValue(valueObj);
			// 	this.freezeFormReaction = false;
			// }

			if (typeof this.onChangeFnc === 'function') {
				this.onChangeFnc(additionalOptions || []);
			}
		}
	}

	getFormCtrl (name: string): AbstractControl | undefined {
		return this.formGroup?.get(name) || undefined;
	}

	integerGuard (option: Option): option is IntegerOption {
		return option.type === OptionType.IntegerFixed
			|| option.type === OptionType.IntegerVariable;
	}

}
