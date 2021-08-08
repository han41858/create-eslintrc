import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import * as Prism from 'prismjs';

import { SyntaxType } from '../..//common/constants';


@Component({
	selector: 'app-code-viewer',
	templateUrl: './code-viewer.component.html',
	styleUrls: ['./code-viewer.component.sass']
})
export class CodeViewerComponent implements OnChanges {

	@Input() syntax?: SyntaxType;
	@Input() code?: string;

	className: string = '';
	codeSanitized: SafeHtml | undefined;


	constructor (private sanitizer: DomSanitizer) {
	}

	ngOnChanges (changes: SimpleChanges): void {
		if (this.code !== undefined && this.syntax) {
			this.className = 'language-' + this.syntax;

			const htmlStr: string = Prism.highlight(this.code, Prism.languages.javascript, 'javascript');

			// need 1 cycle
			setTimeout(() => {
				this.codeSanitized = this.sanitizer.bypassSecurityTrustHtml(htmlStr);
			});
		}
	}

}
