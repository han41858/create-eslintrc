import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextValue } from '../../common/interfaces';


type OnChangeFnc = <T>(values: T[]) => void;


@Component({
	selector: 'app-checkbox-group',
	templateUrl: './checkbox-group.component.html',
	styleUrls: ['./checkbox-group.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: CheckboxGroupComponent,
		multi: true
	}]
})
export class CheckboxGroupComponent<T> implements ControlValueAccessor {

	private currentValue: T[] = [];

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	@Input() enums: TextValue<T>[] | undefined;
	@Input() vertical: boolean = false;

	@ContentChild('customTemplate') headerTemplateRef: TemplateRef<unknown> | undefined;


	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValue (newValue: T[]): void {
		this.currentValue = newValue;

		if (typeof this.onChangeFnc === 'function') {
			this.onChangeFnc(newValue);
		}
	}

	isIncluded (value: T): boolean {
		return this.currentValue.includes(value);
	}

	toggleValue (value: T): void {
		let newValueArr: T[];

		if (this.isIncluded(value)) {
			newValueArr = this.currentValue.filter(one => one !== value);
		}
		else {
			newValueArr = [...this.currentValue, value];
		}

		this.writeValue(newValueArr);
	}

}
