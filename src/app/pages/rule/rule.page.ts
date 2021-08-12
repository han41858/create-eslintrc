import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { Rule } from '../../common/interfaces';
import { ErrorLevel, LanguageCode, Message } from '../../common/constants';
import { FormBuilder, FormGroup } from '@angular/forms';
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
			[FormFieldName.Option]: this.fb.control([null]),
			[FormFieldName.AdditionalOptions]: this.fb.array([])
		});
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
