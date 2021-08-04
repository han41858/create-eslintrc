import { Component, Input } from '@angular/core';

import { Rule } from '../../common/interfaces';


@Component({
	selector: 'app-rule-viewer',
	templateUrl: './rule-viewer.component.html',
	styleUrls: ['./rule-viewer.component.sass']
})
export class RuleViewerComponent {

	@Input() rule: Rule | undefined;

}
