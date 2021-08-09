import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';

import { Language } from '../common/constants';


@Injectable({
	providedIn: 'root'
})
export class LanguageGuard implements CanActivate, CanActivateChild {

	constructor (private router: Router) {
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
			&& Object.values(Language).includes(languageCode as Language);

		if (!isValid) {
			setTimeout(async () => {
				await this.router.navigate(['/']);
			});
		}

		return isValid;
	}

}
