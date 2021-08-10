import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

import { merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { TextValue, TypedObject } from '../../common/interfaces';


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
export class CheckboxGroupComponent<T> implements OnInit, ControlValueAccessor, OnDestroy {

	private currentValue: T[] = [];

	formGroup: FormGroup | undefined;

	private onChangeFnc: OnChangeFnc | undefined;
	private onTouchedFnc: OnChangeFnc | undefined;

	@Input() enums: TextValue<T>[] | undefined;
	@Input() vertical: boolean = false;

	@ContentChild('customTemplate') headerTemplateRef: TemplateRef<unknown> | undefined;

	private valueChangeSub: Subscription | undefined;


	constructor (private fb: FormBuilder) {
	}

	ngOnInit (): void {
		if (this.enums && this.enums.length > 0) {
			this.formGroup = this.fb.group(this.enums.reduce((acc: TypedObject<FormControl>, one: TextValue<T>, i: number): TypedObject<FormControl> => {
				acc[i] = this.fb.control(null);

				return acc;
			}, {}));

			this.valueChangeSub = merge(
				...this.enums.map((one: TextValue<T>, i: number): AbstractControl | undefined => {
						return this.formGroup?.get('' + i) || undefined;
					})
					.filter((ctrl: AbstractControl | undefined): ctrl is AbstractControl => {
						return !!ctrl;
					})
					.map((ctrl: AbstractControl, i: number): Observable<void> => {
						return ctrl.valueChanges
							.pipe(
								distinctUntilChanged(),
								map((): void => {
									const enumValue: T = this.enums![i].value;

									this.toggleValue(enumValue);
								})
							);
					})
			)
				.subscribe();
		}
	}

	ngOnDestroy (): void {
		this.valueChangeSub?.unsubscribe();
	}

	registerOnChange (fn: OnChangeFnc): void {
		this.onChangeFnc = fn;
	}

	registerOnTouched (fn: OnChangeFnc): void {
		this.onTouchedFnc = fn;
	}

	writeValue (newValue: T[]): void {
		// check by array
		if (
			this.currentValue.length !== newValue.length
			|| this.currentValue.some((cur: T, i: number) => {
				return cur !== newValue[i];
			})
		) {
			this.currentValue = newValue;

			if (typeof this.onChangeFnc === 'function') {
				this.onChangeFnc(newValue);
			}
		}
	}

	isIncluded (value: T): boolean {
		return this.currentValue.includes(value);
	}

	toggleValue (value: T): void {
		let newValueArr: T[];

		if (!this.isIncluded(value)) {
			newValueArr = [...this.currentValue, value];
		}
		else {
			newValueArr = this.currentValue.filter((one: T): boolean => {
				return one !== value;
			});
		}

		this.writeValue(newValueArr);
	}
}
