import { Component, Input } from '@angular/core';

import { Option, Rule } from '../../common/interfaces';
import { OptionType } from '../../common/constants';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


type OnChangeFnc = (option: Option) => void;


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
	currentValue: string | number | undefined;


	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValueInternal (index: number, option: Option, newValue: unknown): void {
		console.log('writeValueInternal()', {
			index,
			option,
			newValue
		});
		this.selectedIndex = index;

		let newValueSanitized: unknown;

		switch (option.type) {
			case OptionType.NumberVariable:
				newValueSanitized = +(newValue as number);
				break;

			default:
				newValueSanitized = newValue;
		}

		this.writeValue(newValueSanitized);
	}

	writeValue (newValue: unknown): void {
		console.log('writeValue()', newValue);
		this.currentValue = newValue as string;

		// if (typeof this.onChangeFnc === 'function') {
		// 	this.onChangeFnc(newValue);
		// }
	}

}
