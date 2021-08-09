import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { tap } from 'rxjs/operators';

import { RuleService } from '../../services';

import { Rule } from '../../common/interfaces';
import { LanguageCode } from '../../common/constants';


@Component({
	templateUrl: './rule.page.html',
	styleUrls: ['./rule.page.sass']
})
export class RulePage implements OnInit {

	language!: LanguageCode; // checked in LanguageGuard
	rule: Rule | undefined;

	constructor (
		private route: ActivatedRoute,
		private ruleSvc: RuleService
	) {
	}

	ngOnInit (): void {
		this.language = this.route.parent?.snapshot?.paramMap.get('lang') as LanguageCode;

		this.route.paramMap
			.pipe(
				tap((paramMap: ParamMap): void => {
					const ruleName: string | null = paramMap.get('rule');

					if (ruleName) {
						this.rule = this.ruleSvc.getRule(ruleName);
					}
				})
			)
			.subscribe();
	}

}
