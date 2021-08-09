import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Rule } from '../../common/interfaces';
import { LanguageCode } from '../../common/constants';


@Component({
	selector: 'app-rule-viewer',
	templateUrl: './rule-viewer.component.html',
	styleUrls: ['./rule-viewer.component.sass']
})
export class RuleViewerComponent implements OnInit {

	@Input() rule: Rule | undefined;
	@Input() language!: LanguageCode;
	descriptionSanitized: SafeHtml | undefined;

	constructor (private sanitizer: DomSanitizer) {
	}

	ngOnInit (): void {
		let description: string | undefined = this.rule?.description[this.language];

		if (description) {
			// add code style
			description = description.replace(/<code>/g, '<code class="language-html">');

			this.descriptionSanitized = this.sanitizer.bypassSecurityTrustHtml(description);
		}
	}

}
