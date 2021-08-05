import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Prism from 'prismjs';

import { SyntaxType } from '../..//common/constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
	selector: 'app-code-viewer',
	templateUrl: './code-viewer.component.html',
	styleUrls: ['./code-viewer.component.sass']
})
export class CodeViewerComponent implements OnChanges {

	@Input() syntax?: SyntaxType;
	@Input() code?: string;

	className: string = '';
	codeInternal: SafeHtml | undefined;


	constructor (private sanitizer: DomSanitizer) {
	}

	ngOnChanges (changes: SimpleChanges): void {
		if (this.code && this.syntax) {
			this.className = 'language-' + this.syntax;

			const htmlStr: string = Prism.highlight(this.code, Prism.languages.javascript, 'javascript');
			this.codeInternal = this.sanitizer.bypassSecurityTrustHtml(htmlStr);
		}
	}

}
