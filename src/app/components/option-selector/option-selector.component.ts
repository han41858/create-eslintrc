import { Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Option, Rule } from '../../common/interfaces';
import { OptionType } from '../../common/constants';
import { refreshPrism } from '../../common/util';


type OnChangeFnc = (option: Option | undefined) => void;


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

	@ViewChildren('code') codeElements: QueryList<ElementRef> | undefined;


	ngOnChanges (changes: SimpleChanges): void {
		if (this.rule) {
			// wait 1 cycle to binding
			setTimeout(() => {
				this.codeElements?.forEach((one: ElementRef): void => {
					refreshPrism(one);
				});
			});
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
			this.writeValue(undefined);
		}
	}

	writeValueInternal (index: number, option: Option, newValue: unknown): void {
		if (!this.disabled) {
			this.selectedIndex = index;

			let newOption: Option;

			switch (option.type) {
				case OptionType.NumberVariable:
					newOption = {
						type: OptionType.NumberVariable,
						value: +(newValue as number)
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

	writeValue (option: Option | undefined): void {
		if (this.currentValue?.value !== option?.value) {
			this.currentValue = option;

			if (this.rule && this.rule.options && option) {
				const target: Option | undefined = this.rule.options.find((refOption): boolean => {
					return refOption.value === option.value;
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
