import { Component } from '@angular/core';

import { Rule } from './common/interfaces';
import { rules } from './rules/eslint';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass']
})
export class AppComponent {

	rules: Rule[] = rules;

}
