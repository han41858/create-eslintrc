import { Component, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TextValue } from '../../common/interfaces';
import { ErrorLevel } from '../../common/constants';
import { entriesToTextValue } from '../../common/util';


type OnChangeFnc = (value: ErrorLevel) => void;


@Component({
	selector: 'app-error-level-selector',
	templateUrl: './error-level-selector.component.html',
	styleUrls: ['./error-level-selector.component.sass'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: ErrorLevelSelectorComponent,
		multi: true
	}]
})
export class ErrorLevelSelectorComponent implements ControlValueAccessor {

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	ErrorLevel = ErrorLevel;
	errorLevels: TextValue<ErrorLevel>[];

	formControl: FormControl = new FormControl(ErrorLevel.skip);
	@Output() change: EventEmitter<ErrorLevel> = new EventEmitter<ErrorLevel>();


	constructor () {
		this.errorLevels = entriesToTextValue(Object.entries(ErrorLevel));
	}

	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValue (newValue: ErrorLevel): void {
		if (this.formControl) {
			this.formControl.setValue(newValue);
		}

		if (typeof this.onChangeFnc === 'function') {
			this.onChangeFnc(newValue);
		}
	}

}
