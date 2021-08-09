import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';

import { Rule } from '../../common/interfaces';
import { LanguageCode, Message } from '../../common/constants';


@Component({
	templateUrl: './rule.page.html',
	styleUrls: ['./rule.page.sass']
})
export class RulePage implements OnInit {

	Message = Message;

	languageCode!: LanguageCode; // checked in LanguageGuard
	rule: Rule | undefined;

	descriptionSanitized: SafeHtml | undefined;

	constructor (
		public languageSvc: LanguageService,
		private route: ActivatedRoute,
		private ruleSvc: RuleService,
		private sanitizer: DomSanitizer
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
					}
				})
			)
			.subscribe();
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
