import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LanguageService, RuleService } from '../../services';
import { ResultSet } from '../../common/interfaces';
import { Message } from '../../common/constants';


@Component({
	templateUrl: './main.page.html',
	styleUrls: ['./main.page.sass']
})
export class MainPage implements OnInit, OnDestroy {

	Message = Message;

	private resultSub: Subscription | undefined;
	resultSet: ResultSet | undefined;

	progressRatio: number = 0; // 0 ~ 1


	constructor (
		public languageSvc: LanguageService,
		private ruleSvc: RuleService
	) {
	}

	ngOnInit (): void {
		this.resultSub = this.ruleSvc.result$
			.pipe(
				tap((resultSet: ResultSet): void => {
					this.resultSet = resultSet;
				})
			)
			.subscribe();
	}


	ngOnDestroy (): void {
		this.resultSub?.unsubscribe();
	}

}
