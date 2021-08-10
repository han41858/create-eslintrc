import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


type OnChangeFnc = (value: boolean) => void;


@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: CheckboxComponent,
		multi: true
	}]
})
export class CheckboxComponent implements ControlValueAccessor {

	value: boolean = false;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;


	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValue (newValue: boolean | null): void {
		const newBooleanValue: boolean = !!newValue;

		if (this.value !== newBooleanValue) {
			this.value = newBooleanValue;

			if (typeof this.onChangeFnc === 'function') {
				this.onChangeFnc(newBooleanValue);
			}
		}
	}

	toggleValue (): void {
		this.writeValue(!this.value);
	}

}
