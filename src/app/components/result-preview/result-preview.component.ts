import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RuleService } from '../../services';
import { ResultSet } from '../../common/interfaces';


@Component({
	selector: 'app-result-preview',
	templateUrl: './result-preview.component.html',
	styleUrls: ['./result-preview.component.sass']
})
export class ResultPreviewComponent implements OnInit, OnDestroy {

	private resultSub: Subscription | undefined;
	resultSet: ResultSet | undefined;


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
