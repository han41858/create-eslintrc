import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLanguage } from './common/constants';

import { LanguageGuard } from './guards';

import { StartPage } from './pages/start/start.page';
import { MainPage } from './pages/main/main.page';
import { ConfigPage } from './pages/config/config.page';
import { RulePage } from './pages/rule/rule.page';


const routes: Routes = [
	{ path: '', redirectTo: `/${ DefaultLanguage }/start`, pathMatch: 'full' },
	{
		path: ':lang', canActivate: [LanguageGuard], canActivateChild: [LanguageGuard], children: [
			{ path: '', redirectTo: 'start', pathMatch: 'full' },
			{ path: 'start', component: StartPage },

			{
				path: '', component: MainPage, children: [
					{ path: 'config', component: ConfigPage },
					{ path: ':rule', component: RulePage }
				]
			}
		]
	}
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
