import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';
import { ResultSet, Rule } from '../../common/interfaces';
import { Message } from '../../common/constants';


@Component({
	templateUrl: './main.page.html',
	styleUrls: ['./main.page.sass']
})
export class MainPage implements OnInit, OnDestroy {

	Message = Message;

	rules: Rule[] | undefined;
	previousLink: string | undefined;
	nextLink: string | undefined;

	private streamsSub: Subscription | undefined;
	resultSet: ResultSet | undefined;

	currentIndex: number | undefined;


	constructor (
		public languageSvc: LanguageService,
		private ruleSvc: RuleService,
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit (): void {
		this.streamsSub = merge(
			this.router.events
				.pipe(
					filter((event: unknown): event is NavigationEnd => {
						return event instanceof NavigationEnd;
					}),
					map((): void => {
						// returns nothing
					})
				),
			this.ruleSvc.rules$
				.pipe(
					tap((rules: Rule[]): void => {
						this.rules = rules;
					})
				)
		)
			.pipe(
				tap((): void => {
					this.currentIndex = this.getCurrentRuleIndex();

					this.refreshButtonLinks();
				})
			)
			.subscribe();


		this.streamsSub = this.ruleSvc.result$
			.pipe(
				tap((resultSet: ResultSet): void => {
					this.resultSet = resultSet;
				})
			)
			.subscribe();
	}

	ngOnDestroy (): void {
		this.streamsSub?.unsubscribe();
	}

	private getCurrentRuleIndex (): number {
		let result: number | undefined;

		if (this.rules && this.rules.length > 0) {
			const currentRuleName: string | null = this.route.children[0].snapshot.paramMap.get('rule');

			if (currentRuleName) {
				const currentRule: Rule | undefined = this.rules.find((rule: Rule): boolean => {
					return rule.name === currentRuleName;
				});

				if (currentRule) {
					result = this.rules.indexOf(currentRule);
				}
			}
		}

		return result !== undefined
			? result // include 0
			: -1;
	}

	refreshButtonLinks (): void {
		if (this.rules && this.rules.length > 0) {
			const currentRuleName: string | null = this.route.children[0].snapshot.paramMap.get('rule');

			if (!currentRuleName) {
				// config page
				this.previousLink = '/start';
				this.nextLink = this.rules[0].name;
			}
			else {
				const currentRuleIndex: number = this.getCurrentRuleIndex();

				if (currentRuleIndex === 0) {
					this.previousLink = 'config';
				}
				else {
					this.previousLink = this.rules[currentRuleIndex - 1].name;
				}

				const nextRule: Rule | undefined = this.rules[currentRuleIndex + 1];

				if (nextRule) {
					this.nextLink = nextRule.name;
				}
				else {
					this.nextLink = undefined; // TODO: final result
				}
			}
		}
		else {
			this.previousLink = undefined;
			this.nextLink = undefined;
		}
	}

}
