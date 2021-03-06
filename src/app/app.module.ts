import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StartPage } from './pages/start/start.page';
import { MainPage } from './pages/main/main.page';
import { ConfigPage } from './pages/config/config.page';
import { RulePage } from './pages/rule/rule.page';

import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { ErrorLevelSelectorComponent } from './components/error-level-selector/error-level-selector.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { AdditionalOptionSelectorComponent } from './components/additional-option-selector/additional-option-selector.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';


@NgModule({
	declarations: [
		AppComponent,

		StartPage,
		MainPage,
		ConfigPage,
		RulePage,

		CheckboxComponent,
		CheckboxGroupComponent,
		RadioGroupComponent,
		ErrorLevelSelectorComponent,
		LanguageSelectorComponent,

		OptionSelectorComponent,
		AdditionalOptionSelectorComponent,
		CodeViewerComponent,
		ExampleViewerComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,

		FormsModule,
		ReactiveFormsModule
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
}
