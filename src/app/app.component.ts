import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Rule } from './common/interfaces';
import { RuleService } from './services';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

	ruleSub: Subscription | undefined;
	rules: Rule[] | undefined;


	constructor (private ruleSvc: RuleService) {
	}

	ngOnInit (): void {
		this.ruleSub = this.ruleSvc.rules$
			.pipe(
				tap((rules: Rule[]): void => {
					this.rules = rules;
				})
			)
			.subscribe();

		// this.rules = this.ruleSvc.allRules;
	}

	ngOnDestroy (): void {
		this.ruleSub?.unsubscribe();
	}

}
