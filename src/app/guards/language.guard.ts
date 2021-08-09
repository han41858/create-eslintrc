import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';

import { LanguageCode } from '../common/constants';
import { LanguageService } from '../services';


@Injectable({
	providedIn: 'root'
})
export class LanguageGuard implements CanActivate, CanActivateChild {

	constructor (
		private router: Router,
		private languageSvc: LanguageService
	) {
	}

	canActivate (route: ActivatedRouteSnapshot): boolean {
		return this.checkLanguageCode(route);
	}

	canActivateChild (childRoute: ActivatedRouteSnapshot): boolean {
		return this.checkLanguageCode(childRoute.parent);
	}

	private checkLanguageCode (route: ActivatedRouteSnapshot | null): boolean {
		const languageCode: string | null | undefined = route?.paramMap.get('lang');

		const isValid: boolean = !!languageCode
			&& Object.values(LanguageCode).includes(languageCode as LanguageCode);

		if (isValid) {
			this.languageSvc.set(languageCode as LanguageCode);
		}
		else {
			setTimeout(async () => {
				await this.router.navigate(['/']);
			});
		}

		return isValid;
	}

}
