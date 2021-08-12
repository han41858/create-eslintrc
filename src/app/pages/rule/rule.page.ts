import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { ObjectOption, Option, Rule, RuleSelected } from '../../common/interfaces';
import { ErrorLevel, LanguageCode, Message } from '../../common/constants';

import { ErrorLevelSelectorComponent } from 'src/app/components/error-level-selector/error-level-selector.component';


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

	constructor (
		public languageSvc: LanguageService,
		private route: ActivatedRoute,
		private ruleSvc: RuleService,
		private sanitizer: DomSanitizer,
		private fb: FormBuilder
	) {
	}

	ngOnInit (): void {
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
				tap((paramMap: ParamMap): void => {
					const ruleName: string | null = paramMap.get('rule');

					if (ruleName) {
						this.rule = this.ruleSvc.getRule(ruleName);

						this.refreshDescription();

						this.resetForm();
					}
				})
			)
			.subscribe();

		this.formGroup = this.fb.group({
			[FormFieldName.ErrorLevel]: this.fb.control(ErrorLevel.skip),
			[FormFieldName.Option]: this.fb.control({
				value: null,
				disabled: true
			}),
			[FormFieldName.AdditionalOptions]: null
		});

		this.formGroup.valueChanges
			.pipe(
				map((newValue: FormValue): RuleSelected | undefined => {
					let ruleSelected: Partial<RuleSelected> | undefined;

					if (this.rule) {
						const errorLevel: ErrorLevel = newValue[FormFieldName.ErrorLevel];

						ruleSelected = {
							package: this.rule.package,
							name: this.rule.name,

							errorLevel: errorLevel
						};


						const optionCtrl: AbstractControl | undefined = this.getFormCtrl(FormFieldName.Option);
						const additionalOptionsCtrl: AbstractControl | undefined = this.getFormCtrl(FormFieldName.AdditionalOptions);

						if (errorLevel === ErrorLevel.skip
							|| errorLevel === ErrorLevel.off) {
							if (optionCtrl && optionCtrl.enabled) {
								optionCtrl.disable();
							}

							if (additionalOptionsCtrl && additionalOptionsCtrl.enabled) {
								additionalOptionsCtrl.disable();
							}
						}
						else {
							if (optionCtrl) {
								if (optionCtrl.disabled) {
									optionCtrl.enable();
								}
								else {
									ruleSelected.option = newValue[FormFieldName.Option] || undefined;
								}
							}

							if (additionalOptionsCtrl) {
								if (additionalOptionsCtrl.disabled) {
									additionalOptionsCtrl.enable();
								}
								else {
									ruleSelected.additionalOptions = newValue[FormFieldName.AdditionalOptions] || undefined;
								}
							}
						}
					}

					return ruleSelected as RuleSelected | undefined;
				}),
				filter((newRule: RuleSelected | undefined): newRule is RuleSelected => !!newRule),
				distinctUntilChanged((a: RuleSelected, b: RuleSelected): boolean => {
					// if false, passes to next
					return a.package === b.package
						&& a.name === b.name
						&& a.errorLevel === b.errorLevel
						&& !!a.option === !!b.option
						&& JSON.stringify(a.option) === JSON.stringify(b.option)
						&& !!a.additionalOptions === !!b.additionalOptions
						&& JSON.stringify(a.additionalOptions) === JSON.stringify(b.additionalOptions);
				}),
				map((newRule: RuleSelected): void => {
					this.ruleSvc.addRule(newRule);

					// returns nothing
				})
			)
			.subscribe();
	}

	getFormCtrl (field: FormFieldName): AbstractControl | undefined {
		return this.formGroup?.get(field) || undefined;
	}

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

	private resetForm (): void {
		const defaultErrorLevel: ErrorLevel = ErrorLevel.skip;

		if (this.formGroup) {
			this.formGroup.reset({
				[FormFieldName.ErrorLevel]: defaultErrorLevel,
				[FormFieldName.Option]: null,
				[FormFieldName.AdditionalOptions]: null
			}, {
				onlySelf: true
			});


			if (this.errorLevelSelector) {
				this.errorLevelSelector.writeValue(defaultErrorLevel);
			}
		}
	}

}
