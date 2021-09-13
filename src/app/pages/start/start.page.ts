import { Component } from '@angular/core';

import { LanguageService } from '../../services';

import { Message, SyntaxType } from '../../common/constants';


@Component({
	templateUrl: './start.page.html',
	styleUrls: ['./start.page.sass']
})
export class StartPage {

	Message = Message;

	exampleSyntax: SyntaxType = SyntaxType.JSON;
	exampleCode: string = '{}';


	constructor (public languageSvc: LanguageService) {
	}

}
