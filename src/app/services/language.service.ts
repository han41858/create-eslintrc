import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { DefaultLanguage, LanguageCode, Message, StorageKey } from '../common/constants';
import { LanguageSet } from '../common/language';
import { TypedObject } from '../common/interfaces';
import { getStorage, setStorage } from '../common/util';


@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	private languageCode: LanguageCode;

	// for reaction
	languageCode$: BehaviorSubject<LanguageCode>;


	constructor () {
		this.languageCode = getStorage(StorageKey.Language) || DefaultLanguage;
		this.languageCode$ = new BehaviorSubject<LanguageCode>(this.languageCode);
	}

	// called by LanguageGuard
	set (languageCode: LanguageCode): void {
		this.languageCode = languageCode;
		this.languageCode$.next(this.languageCode);

		setStorage(StorageKey.Language, this.languageCode);
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
