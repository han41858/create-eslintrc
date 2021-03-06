import { Component, Input } from '@angular/core';
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

	disabled: boolean = false;
	value: boolean = false;

	@Input() label?: string;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;


	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	setDisabledState (isDisabled: boolean): void {
		this.disabled = isDisabled;

		if (this.value) {
			this.writeValue(false);
		}
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
		if (!this.disabled) {
			this.writeValue(!this.value);
		}
	}

}
