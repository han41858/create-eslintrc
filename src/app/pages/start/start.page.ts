import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DefaultLanguage, Language, SyntaxType } from '../../common/constants';


@Component({
	templateUrl: './start.page.html',
	styleUrls: ['./start.page.sass']
})
export class StartPage implements OnInit {

	exampleSyntax: SyntaxType = SyntaxType.JSON;
	exampleCode: string = '{}';

	language: Language | undefined;


	constructor (
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit (): void {
		const language: string | null = this.route.snapshot.paramMap.get('lang');

		if (!language || !Object.values(Language).includes(language as Language)) {
			setTimeout(async () => {
				await this.router.navigate(['/', DefaultLanguage]);
			});
		}
		else {
			this.language = language as Language;
		}
	}

}
