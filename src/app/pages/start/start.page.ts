import { Component } from '@angular/core';
import { SyntaxType } from 'src/app/common/constants';


@Component({
	templateUrl: './start.page.html',
	styleUrls: ['./start.page.sass']
})
export class StartPage {

	exampleSyntax: SyntaxType = SyntaxType.JSON;
	exampleCode: string = '{}';

}
