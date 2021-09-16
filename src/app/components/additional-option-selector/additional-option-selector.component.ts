import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { ObjectOption, Rule, TypedObject } from '../../common/interfaces';
import { newArray } from '../../common/util';


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

	@Input() rule?: Rule;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;
	disabled: boolean = false;

	currentValue: ObjectOption[] = [];

	formGroup: FormGroup | undefined;


	constructor (private fb: FormBuilder) {
	}

	ngOnChanges () {
		if (!this.rule) {
			throw new Error('no rule');
		}

		if (this.rule.additionalOptions) {
			const formConfigObj: FormConfigObj = newArray(this.rule.additionalOptions.length)
				.reduce((acc: FormConfigObj, nothing: unknown, i: number): FormConfigObj => {
					acc['' + i] = this.fb.control(false);

					return acc;
				}, {});

			this.formGroup = this.fb.group(formConfigObj);

			this.formGroup.valueChanges
				.pipe(
					tap(() => {
						if (this.formGroup) {
							const newOptions: ObjectOption[] = Object.keys(this.formGroup.value)
								.reduce((acc: ObjectOption[], indexStr: string): ObjectOption[] => {
									if (this.formGroup?.value[indexStr]) {
										if (this.rule?.additionalOptions?.[+indexStr]) {
											acc.push(this.rule.additionalOptions[+indexStr]);
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

		if (this.currentValue) {
			this.writeValue([]);
		}
	}

	writeValue (additionalOptions: ObjectOption[]): void {
		if (this.currentValue !== additionalOptions) {
			this.currentValue = additionalOptions;

			if (typeof this.onChangeFnc === 'function') {
				this.onChangeFnc(additionalOptions);
			}
		}
	}

}
