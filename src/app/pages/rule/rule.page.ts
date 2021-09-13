import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { debounceTime, filter, map, tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { ObjectOption, Option, Rule, RuleSelected } from '../../common/interfaces';
import { ErrorLevel, LanguageCode, Message } from '../../common/constants';

import { ErrorLevelSelectorComponent } from '../../components/error-level-selector/error-level-selector.component';
import { OptionSelectorComponent } from '../../components/option-selector/option-selector.component';


enum FormFieldName {
	ErrorLevel = 'ErrorLevel',
	Option = 'Option',
	AdditionalOptions = 'AdditionalOptions'
}

interface FormValue {
	[FormFieldName.ErrorLevel]: ErrorLevel;
	[FormFieldName.Option]: Option | undefined;
	[FormFieldName.AdditionalOptions]: ObjectOption[] | undefined;
}


@Component({
	templateUrl: './rule.page.html',
	styleUrls: ['./rule.page.sass']
})
export class RulePage implements OnInit {

	Message = Message;
	FormFieldName = FormFieldName;

	languageCode!: LanguageCode; // checked in LanguageGuard

	rule: Rule | undefined;

	descriptionSanitized: SafeHtml | undefined;

	formGroup: FormGroup | undefined;
	@ViewChild(ErrorLevelSelectorComponent) errorLevelSelector: ErrorLevelSelectorComponent | undefined;
	@ViewChild(OptionSelectorComponent) optionSelector: OptionSelectorComponent | undefined;

	constructor (
		public languageSvc: LanguageService,
		private route: ActivatedRoute,
		private ruleSvc: RuleService,
		private sanitizer: DomSanitizer,
		private fb: FormBuilder
	) {
	}

	ngOnInit (): void {
		this.formGroup = this.fb.group({
			[FormFieldName.ErrorLevel]: this.fb.control(null),
			[FormFieldName.Option]: this.fb.control({
				value: null,
				disabled: true
			}),
			[FormFieldName.AdditionalOptions]: null
		});

		this.route.parent?.paramMap
			.pipe(
				tap((paramMap: ParamMap): void => {
					this.languageCode = paramMap.get('lang') as LanguageCode;

					this.refreshDescription();
				})
			)
			.subscribe();

		this.route.paramMap
			.pipe(
				map((paramMap: ParamMap): string | undefined => {
					const ruleName: string | undefined = paramMap.get('rule') || undefined;

					if (ruleName) {
						this.rule = this.ruleSvc.getRule(ruleName);

						this.refreshDescription();
						this.resetForm(ruleName);

						this.refreshFormDisableState();
					}

					return ruleName;
				})
			)
			.subscribe();

		this.formGroup.valueChanges
			.pipe(
				tap(() => {
					this.refreshFormDisableState();
				}),
				debounceTime(10), // wait additional value changing
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
	}

	getFormCtrl (field: FormFieldName): AbstractControl | undefined {
		return this.formGroup?.get(field) || undefined;
	}

	getFormValue<T> (field: FormFieldName.ErrorLevel): ErrorLevel; // always exists
	getFormValue<T> (field: FormFieldName.Option): Option | undefined;
	getFormValue<T> (field: FormFieldName.AdditionalOptions): ObjectOption[] | undefined;
	getFormValue<T> (field: FormFieldName): T | undefined {
		let result: T | undefined;

		const ctrl: AbstractControl | undefined = this.formGroup?.get(field) || undefined;

		if (ctrl) {
			result = ctrl.value;
		}

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

	private resetForm (ruleName: string): void {
		const ruleSelected: RuleSelected | undefined = this.ruleSvc.getRuleSelected(ruleName);

		if (this.formGroup) {
			const defaultErrorLevel: ErrorLevel = ErrorLevel.skip;

			const newValue = {
				[FormFieldName.ErrorLevel]: ruleSelected?.errorLevel || defaultErrorLevel,
				[FormFieldName.Option]: ruleSelected?.option || null,
				[FormFieldName.AdditionalOptions]: ruleSelected?.additionalOptions || null
			};

			this.formGroup.reset(newValue, {
				emitEvent: false
			});


			this.errorLevelSelector?.writeValue(newValue[FormFieldName.ErrorLevel]);
			this.optionSelector?.writeValue(newValue[FormFieldName.Option] || undefined);
		}
	}

	private refreshFormDisableState (): void {
		const errorLevelCtrl: AbstractControl | undefined = this.getFormCtrl(FormFieldName.ErrorLevel);
		const optionCtrl: AbstractControl | undefined = this.getFormCtrl(FormFieldName.Option);
		const additionalOptionsCtrl: AbstractControl | undefined = this.getFormCtrl(FormFieldName.AdditionalOptions);

		if (errorLevelCtrl) {
			const errorLevel: ErrorLevel = errorLevelCtrl.value;

			if (errorLevel === ErrorLevel.skip
				|| errorLevel === ErrorLevel.off) {
				if (optionCtrl && optionCtrl.enabled) {
					optionCtrl.disable();

					optionCtrl.setValue(null);
				}

				if (additionalOptionsCtrl && additionalOptionsCtrl.enabled) {
					additionalOptionsCtrl.disable();
				}
			}
			else {
				if (optionCtrl) {
					if (optionCtrl.disabled) {
						optionCtrl.enable();

						// set default option
						if (this.rule?.options?.[0]) {
							optionCtrl.setValue(this.rule.options[0]);
						}
					}
				}

				if (additionalOptionsCtrl) {
					if (additionalOptionsCtrl.disabled) {
						additionalOptionsCtrl.enable();
					}
				}
			}
		}
	}

}
