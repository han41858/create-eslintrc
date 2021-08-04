import { Component, Input } from '@angular/core';

import { Rule } from '../../common/interfaces';


@Component({
	selector: 'app-additional-option-selector',
	templateUrl: './additional-option-selector.component.html',
	styleUrls: ['./additional-option-selector.component.sass']
})
export class AdditionalOptionSelectorComponent {

	@Input() rule?: Rule;

}
