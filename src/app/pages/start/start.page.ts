import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LanguageService } from '../../services';

import { DefaultLanguage, LanguageCode, Message, SyntaxType } from '../../common/constants';


@Component({
	templateUrl: './start.page.html',
	styleUrls: ['./start.page.sass']
})
export class StartPage implements OnInit {

	Message = Message;

	exampleSyntax: SyntaxType = SyntaxType.JSON;
	exampleCode: string = '{}';

	language: LanguageCode | undefined;


	constructor (
		public languageSvc: LanguageService,
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit (): void {
		const language: string | null = this.route.snapshot.paramMap.get('lang');

		if (!language || !Object.values(LanguageCode).includes(language as LanguageCode)) {
			setTimeout(async () => {
				await this.router.navigate(['/', DefaultLanguage]);
			});
		}
		else {
			this.language = language as LanguageCode;
		}
	}

}
