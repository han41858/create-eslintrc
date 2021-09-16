import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { debounceTime, delay, filter, map, tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { ObjectOption, Option, Rule, RuleSelected } from '../../common/interfaces';
import { DefaultErrorLevel, ErrorLevel, LanguageCode, Message } from '../../common/constants';

import { ErrorLevelSelectorComponent } from '../../components/error-level-selector/error-level-selector.component';
import { OptionSelectorComponent } from '../../components/option-selector/option-selector.component';


enum FormFieldName {
	ErrorLevel = 'ErrorLevel',
	Option = 'Option',
	AdditionalOptions = 'AdditionalOptions'
}

interface FormValue {
	[FormFieldName.ErrorLevel]: ErrorLevel;
	[FormFieldName.Option]: Option | null;
	[FormFieldName.AdditionalOptions]: ObjectOption[] | null;
}


@Component({
	templateUrl: './rule.page.html',
	styleUrls: ['./rule.page.sass']
})
export class RulePage implements OnInit {

	Message = Message;
	FormFieldName = FormFieldName;

	languageCode: LanguageCode | undefined;

	rule: Rule | undefined;

	descriptionSanitized: SafeHtml | undefined;

	formGroup: FormGroup;
	freezeFormReaction: boolean = false;
	freezeSave: boolean = false;

	@ViewChild(ErrorLevelSelectorComponent) errorLevelSelector: ErrorLevelSelectorComponent | undefined;
	@ViewChild(OptionSelectorComponent) optionSelector: OptionSelectorComponent | undefined;


	constructor (
		public languageSvc: LanguageService,
		private route: ActivatedRoute,
		private ruleSvc: RuleService,
		private sanitizer: DomSanitizer,
		private fb: FormBuilder
	) {
		this.formGroup = this.fb.group({
			[FormFieldName.ErrorLevel]: this.fb.control(null),
			[FormFieldName.Option]: this.fb.control({
				value: null,
				disabled: true
			}),
			[FormFieldName.AdditionalOptions]: null
		});
	}

	ngOnInit (): void {
		// rule changed
		this.route.paramMap
			.pipe(
				map((paramMap: ParamMap): string | undefined => {
					return paramMap.get('rule') || undefined;
				}),
				filter((ruleName: string | undefined): ruleName is string => !!ruleName),
				map((ruleName: string): string => {
					this.freezeFormReaction = true;
					this.freezeSave = true;

					this.rule = this.ruleSvc.getRule(ruleName);

					if (this.rule) {
						const optionCtrl: AbstractControl = this.getFormCtrl(FormFieldName.Option);

						if (this.rule.options) {
							if (optionCtrl.disabled) {
								optionCtrl.enable();
							}
						}
						else {
							if (optionCtrl.enabled) {
								optionCtrl.disable();
							}
						}

						const additionalOptionCtrl: AbstractControl = this.getFormCtrl(FormFieldName.AdditionalOptions);

						if (this.rule.additionalOptions) {
							if (additionalOptionCtrl.disabled) {
								additionalOptionCtrl.enable();
							}
						}
						else {
							if (additionalOptionCtrl.enabled) {
								additionalOptionCtrl.disable();
							}
						}
					}

					return ruleName;
				}),
				delay(0), // wait 1 cycle to enable/disable form control
				tap((ruleName: string): void => {
					const ruleSelected: RuleSelected | undefined = this.ruleSvc.getRuleSelected(ruleName);

					this.formGroup.reset({
						[FormFieldName.ErrorLevel]: ruleSelected?.errorLevel || DefaultErrorLevel,
						[FormFieldName.Option]: ruleSelected?.option,
						[FormFieldName.AdditionalOptions]: ruleSelected?.additionalOptions
					});

					this.freezeFormReaction = false;
					this.freezeSave = false;
				})
			)
			.subscribe();

		// error level changed
		this.getFormCtrl(FormFieldName.ErrorLevel).valueChanges
			.pipe(
				filter(() => !this.freezeFormReaction),
				map((newValue: ErrorLevel) => {
					const optionCtrl: AbstractControl = this.getFormCtrl(FormFieldName.Option);

					let optionEnabled: boolean = false;

					if (newValue === ErrorLevel.skip
						|| newValue === ErrorLevel.off) {
						if (optionCtrl.enabled) {
							optionCtrl.disable();
						}
					}
					else {
						if (optionCtrl.disabled) {
							optionCtrl.enable();

							optionEnabled = true;
						}
					}

					return {
						optionEnabled
						// additionalOptionEnabled
					};
				}),
				delay(0), // wait 1 cycle to enable/disable form control
				tap((param): void => {
					if (param.optionEnabled) {
						this.getFormCtrl(FormFieldName.Option).setValue(this.rule?.options?.[0]);
					}
				})
			)
			.subscribe();

		this.formGroup.valueChanges
			.pipe(
				filter(() => !this.freezeSave),
				debounceTime(10), // wait additional form value changing
				map((): RuleSelected | undefined => {
					let ruleSelected: RuleSelected | undefined;

					if (this.rule) {
						ruleSelected = {
							package: this.rule.package,
							name: this.rule.name,

							errorLevel: this.getFormValue(FormFieldName.ErrorLevel),

							option: this.getFormValue(FormFieldName.Option),
							additionalOptions: this.getFormValue(FormFieldName.AdditionalOptions)
						};
					}

					return ruleSelected as RuleSelected | undefined;
				}),
				filter((newRule: RuleSelected | undefined): newRule is RuleSelected => !!newRule),
				map((newRule: RuleSelected): void => {
					this.ruleSvc.selectRule(newRule);

					// returns nothing
				})
			)
			.subscribe();

		this.languageSvc.languageCode$
			.pipe(
				tap((languageCode: LanguageCode): void => {
					this.languageCode = languageCode;

					this.refreshDescription();
				})
			)
			.subscribe();
	}

	getFormCtrl (field: FormFieldName): AbstractControl {
		return this.formGroup.get(field) as AbstractControl;
	}

	getFormValue<T> (field: FormFieldName.ErrorLevel): ErrorLevel; // always exists
	getFormValue<T> (field: FormFieldName.Option): Option | undefined;
	getFormValue<T> (field: FormFieldName.AdditionalOptions): ObjectOption[] | undefined;
	getFormValue<T> (field: FormFieldName): T | undefined {
		let result: T | undefined;

		const ctrl: AbstractControl = this.getFormCtrl(field);
		result = ctrl.value || undefined;

		return result;
	}

	private refreshDescription (): void {
		if (this.rule && this.languageCode) {
			let description: string | undefined = this.rule?.description[this.languageCode];

			if (description) {
				// add code style
				description = description.replace(/<code>/g, '<code class="language-html">');

				this.descriptionSanitized = this.sanitizer.bypassSecurityTrustHtml(description);
			}
		}
	}

}
