import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { DefaultLanguage, LanguageCode, Message } from '../common/constants';
import { LanguageSet } from '../common/language';
import { TypedObject } from '../common/interfaces';


@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	// for internal usage
	private languageCode: LanguageCode = DefaultLanguage;

	// for reaction
	languageCode$: BehaviorSubject<LanguageCode> = new BehaviorSubject<LanguageCode>(this.languageCode);


	// called by LanguageGuard
	set (languageCode: LanguageCode): void {
		this.languageCode = languageCode;
		this.languageCode$.next(languageCode);
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
				// key2 for enum value
				const [key1, key2] = foundResult as [string, number];

				result = languageSet[key1] || languageSet[key2];
			}
		}

		return result;
	}

}
