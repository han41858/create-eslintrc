import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LanguageService } from '../../services';
import { TextValue } from '../../common/interfaces';
import { LanguageCode, Message } from '../../common/constants';


@Component({
	selector: 'app-language-selector',
	templateUrl: './language-selector.component.html',
	styleUrls: ['./language-selector.component.sass']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

	Message = Message;

	private languageCodeSub: Subscription | undefined;
	currentLanguageCode: LanguageCode | undefined;

	options: TextValue<LanguageCode>[] = Object.entries(LanguageCode).map(([key, value]): TextValue<LanguageCode> => {
		return {
			text: key,
			value: value
		};
	});

	@Input() primaryColor: boolean = false;

	selectShown: boolean = false;
	@ViewChild('focusAnchor') focusAnchor: ElementRef<HTMLAnchorElement> | undefined;


	constructor (public languageSvc: LanguageService) {
	}

	ngOnInit (): void {
		this.languageCodeSub = this.languageSvc.languageCode$
			.pipe(
				tap((languageCode: LanguageCode) => {
					this.currentLanguageCode = languageCode;
				})
			)
			.subscribe();
	}

	ngOnDestroy (): void {
		this.languageCodeSub?.unsubscribe();
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
		if (this.currentLanguageCode !== newValue) {
			this.languageSvc.set(newValue);
		}
	}

}
