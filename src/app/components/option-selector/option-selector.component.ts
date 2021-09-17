import { Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ValidatorFn,
	Validators
} from '@angular/forms';

import { IntegerOption, Option, Rule, TypedObject } from '../../common/interfaces';
import { OptionType } from '../../common/constants';
import { newArray, refreshPrism } from '../../common/util';


type OnChangeFnc = (option: Option | null) => void;

type FormConfigObj = TypedObject<AbstractControl | undefined>;


@Component({
	selector: 'app-option-selector',
	templateUrl: './option-selector.component.html',
	styleUrls: ['./option-selector.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: OptionSelectorComponent,
		multi: true
	}]
})
export class OptionSelectorComponent implements ControlValueAccessor, OnChanges {

	OptionType = OptionType;

	@Input() rule?: Rule;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	selectedIndex: number | undefined;
	currentValue: Option | undefined;
	disabled: boolean = false;

	formGroup: FormGroup | undefined;

	@ViewChildren('code') codeElements: QueryList<ElementRef> | undefined;


	constructor (private fb: FormBuilder) {
	}

	ngOnChanges (changes: SimpleChanges): void {
		if (!this.rule) {
			throw new Error('no rule');
		}

		if (this.rule.options) {
			const formConfigObj: FormConfigObj = newArray(this.rule.options.length, (i: number) => {
				return this.rule?.options?.[i];
			})
				.reduce((acc: FormConfigObj, option: Option | undefined, i: number): FormConfigObj => {
					if (option && option.type === OptionType.IntegerVariable) {
						acc['' + i] = this.fb.control(option.value, [
							Validators.required,
							'min' in option && option.min !== undefined ? Validators.min(option.min) : undefined,
							Validators.pattern(/^[0-9]*$/)
						].filter((validator: ValidatorFn | undefined): validator is ValidatorFn => {
							return validator !== undefined;
						}));
					}

					return acc;
				}, {});

			this.formGroup = this.fb.group(formConfigObj);
		}


		// wait 1 cycle to binding
		setTimeout(() => {
			this.codeElements?.forEach((one: ElementRef): void => {
				refreshPrism(one);
			});
		});
	}

	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	setDisabledState (isDisabled: boolean) {
		this.disabled = isDisabled;

		if (this.currentValue) {
			this.writeValue(null);
		}
	}

	writeValueInternal (index: number, option: Option, newValue: unknown): void {
		if (!this.disabled) {
			this.selectedIndex = index;

			let newOption: Option;

			switch (option.type) {
				case OptionType.IntegerVariable:
					newOption = {
						type: OptionType.IntegerVariable,
						value: +(newValue as string)
					};
					break;

				case OptionType.StringFixed:
					newOption = {
						type: OptionType.StringFixed,
						value: newValue as string
					};
					break;

				case OptionType.StringVariable:
					newOption = {
						type: OptionType.StringVariable,
						value: newValue as string
					};
					break;

				default:
					newOption = option;
			}

			this.writeValue(newOption);
		}
	}

	writeValue (option: Option | null): void {
		if (this.formGroup?.valid) {
			if (this.currentValue?.type !== option?.type
				|| this.currentValue?.value !== option?.value) {
				this.currentValue = option || undefined;

				if (this.rule && this.rule.options && option) {
					const target: Option | undefined = this.rule.options.find((refOption: Option): boolean => {
						return refOption.type === option.type;
					});

					if (target) {
						this.selectedIndex = this.rule.options.indexOf(target);
					}
					else {
						this.selectedIndex = undefined;
					}
				}
				else {
					this.selectedIndex = undefined;
				}


				if (typeof this.onChangeFnc === 'function') {
					this.onChangeFnc(option);
				}
			}
		}
	}

	integerGuard (option: Option): option is IntegerOption {
		return option.type === OptionType.IntegerFixed
			|| option.type === OptionType.IntegerVariable;
	}

	getFormCtrl (i: number): AbstractControl | undefined {
		return this.formGroup?.get('' + i) || undefined;
	}
}
