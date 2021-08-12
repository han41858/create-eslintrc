import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { ObjectOption, Option, Rule } from '../../common/interfaces';
import { ErrorLevel, LanguageCode, Message } from '../../common/constants';

import { ErrorLevelSelectorComponent } from 'src/app/components/error-level-selector/error-level-selector.component';


enum FormFieldName {
	ErrorLevel = 'ErrorLevel',
	Option = 'Option',
	AdditionalOptions = 'AdditionalOptions'
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
			[FormFieldName.Option]: this.fb.control(null),
			[FormFieldName.AdditionalOptions]: this.fb.array([])
		});

		this.formGroup.valueChanges
			.pipe(
				tap((newValue: {
					[FormFieldName.ErrorLevel]: ErrorLevel;
					[FormFieldName.Option]: Option | undefined;
					[FormFieldName.AdditionalOptions]: ObjectOption[]
				}): void => {
					const errorLevel: ErrorLevel = newValue[FormFieldName.ErrorLevel];
					const option: Option | undefined = newValue[FormFieldName.Option];
					// TODO
					// const additionalOptions: ObjectOption[] = newValue[FormFieldName.AdditionalOptions];

					if (this.rule) {
						this.ruleSvc.addRule({
							rule: this.rule,
							errorLevel: errorLevel,
							option: option
						});
					}
				})
			)
			.subscribe();
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
