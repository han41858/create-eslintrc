import { Component, Input } from '@angular/core';

import { Rule } from '../../common/interfaces';
import { OptionType } from '../../common/constants';


@Component({
	selector: 'app-option-selector',
	templateUrl: './option-selector.component.html',
	styleUrls: ['./option-selector.component.sass']
})
export class OptionSelectorComponent {

	OptionType = OptionType;

	@Input() rule?: Rule;

}
