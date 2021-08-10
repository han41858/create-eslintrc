import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { LanguageService } from '../../services';
import { TextValue } from '../../common/interfaces';
import { LanguageCode, Message } from '../../common/constants';
import { Router } from '@angular/router';


@Component({
	selector: 'app-language-selector',
	templateUrl: './language-selector.component.html',
	styleUrls: ['./language-selector.component.sass']
})
export class LanguageSelectorComponent implements OnInit {

	Message = Message;

	options: TextValue<LanguageCode>[] = Object.entries(LanguageCode).map(([key, value]): TextValue<LanguageCode> => {
		return {
			text: key,
			value: value
		};
	});

	@Input() primaryColor: boolean = false;

	selectShown: boolean = false;
	currentLanguageCode: LanguageCode | undefined;

	@ViewChild('focusAnchor') focusAnchor: ElementRef<HTMLAnchorElement> | undefined;


	constructor (
		public languageSvc: LanguageService,
		private router: Router
	) {
	}

	ngOnInit (): void {
		this.currentLanguageCode = this.languageSvc.languageCode;
	}

	show (show: boolean, event: Event): void {
		if (show) {
			this.selectShown = true;
			this.focusAnchor?.nativeElement.focus();
		}
		else {
			// need 1 cycle to select option
			setTimeout(() => {
				this.selectShown = false;
			});
		}
	}

	languageChanged (newValue: LanguageCode): void {
		const [, , ruleName]: string[] = this.router.url.split('/');

		setTimeout(async () => {
			await this.router.navigate(['/', newValue, ruleName]);

			this.currentLanguageCode = this.languageSvc.languageCode;
		});
	}

}
