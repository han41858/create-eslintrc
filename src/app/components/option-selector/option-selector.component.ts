import { Component, Input } from '@angular/core';

import { Option, Rule } from '../../common/interfaces';
import { OptionType } from '../../common/constants';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


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
export class OptionSelectorComponent implements ControlValueAccessor {

	OptionType = OptionType;

	@Input() rule?: Rule;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	selectedIndex: number | undefined;
	currentValue: Option | undefined;
	disabled: boolean = false;


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
		this.currentValue = option;

		if (!option) {
			// clear
			this.selectedIndex = undefined;
		}

		if (typeof this.onChangeFnc === 'function') {
			this.onChangeFnc(option);
		}
	}

}
