import { Injectable } from '@angular/core';

import { DefaultLanguage, LanguageCode, Message } from '../common/constants';
import { LanguageSet } from '../common/language';
import { TypedObject } from '../common/interfaces';


@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	// default
	private languageCode: LanguageCode = DefaultLanguage;


	// called by LanguageGuard
	set (lang: LanguageCode): void {
		this.languageCode = lang;
	}

	getMsg (msg: Message): string | undefined {
		let result: string | undefined;

		const languageSet: TypedObject<string> = LanguageSet[this.languageCode];

		if (languageSet) {
			const foundResult: unknown | undefined = Object.entries(Message)
				.find(([, value]: [string, number | string]): boolean => {
					return value === msg;
				});

			if (foundResult) {
				const [key] = foundResult as [string, number];

				result = languageSet[key];
			}
		}

		return result;
	}

}
