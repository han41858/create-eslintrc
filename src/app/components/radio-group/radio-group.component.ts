import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextValue, TypedObject } from '../../common/interfaces';

type OnChangeFnc = <T>(value: T) => void;


@Component({
	selector: 'app-radio-group',
	templateUrl: './radio-group.component.html',
	styleUrls: ['./radio-group.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: RadioGroupComponent,
		multi: true
	}]
})
export class RadioGroupComponent<T> implements ControlValueAccessor {

	currentValue: T | undefined;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	@Input() enums: TextValue<T>[] | undefined;

	@Input() vertical: boolean = false;
	@Input() radioTopMargin: string | undefined; // default center

	@ContentChild('customTemplate') headerTemplateRef: TemplateRef<unknown> | undefined;
	@Input() customEnums: unknown[] | undefined;


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

	getRadioButtonStyle (): TypedObject<string> {
		const styleObj: TypedObject<string> = {};

		if (this.radioTopMargin) {
			styleObj['margin-top'] = this.radioTopMargin;
		}
		else {
			styleObj['align-items'] = 'center';
		}

		return styleObj;
	}

}
