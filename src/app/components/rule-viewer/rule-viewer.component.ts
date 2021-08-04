import { Component, Input } from '@angular/core';

import { Rule } from '../../common/interfaces';
import { OptionType } from '../../common/constants';


@Component({
	selector: 'app-rule-viewer',
	templateUrl: './rule-viewer.component.html',
	styleUrls: ['./rule-viewer.component.sass']
})
export class RuleViewerComponent {

	OptionType = OptionType;

	@Input() rule: Rule | undefined;

}
