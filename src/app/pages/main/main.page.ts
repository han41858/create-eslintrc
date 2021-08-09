import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultSet } from 'src/app/common/interfaces';
import { RuleService } from 'src/app/services';
import { tap } from 'rxjs/operators';


@Component({
	templateUrl: './main.page.html',
	styleUrls: ['./main.page.sass']
})
export class MainPage implements OnInit, OnDestroy {

	private resultSub: Subscription | undefined;
	resultSet: ResultSet | undefined;

	progressRatio: number = 0; // 0 ~ 1


	constructor (private ruleSvc: RuleService) {
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
