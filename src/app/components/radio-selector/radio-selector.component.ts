import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextValue } from '../../common/interfaces';

type OnChangeFnc = <T>(value: T) => void;


@Component({
	selector: 'app-radio-selector',
	templateUrl: './radio-selector.component.html',
	styleUrls: ['./radio-selector.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: RadioSelectorComponent,
		multi: true
	}]
})
export class RadioSelectorComponent<T> implements ControlValueAccessor {

	currentValue: T | undefined;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	@Input() enums: TextValue<T>[] | undefined;
	@Input() vertical: boolean = false;


	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValue (newValue: T): void {
		this.currentValue = newValue;

		if (typeof this.onChangeFnc === 'function') {
			this.onChangeFnc(newValue);
		}
	}
}
