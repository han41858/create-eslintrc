import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { tap } from 'rxjs/operators';


@Component({
	templateUrl: './rule.page.html',
	styleUrls: ['./rule.page.sass']
})
export class RulePage implements OnInit {

	constructor (private route: ActivatedRoute) {
	}

	ngOnInit (): void {
		this.route.paramMap
			.pipe(
				tap((paramMap: ParamMap): void => {
					console.log(paramMap.get('rule'));
				})
			)
			.subscribe();
	}

}
