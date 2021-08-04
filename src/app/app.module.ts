import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RuleViewerComponent } from './components/rule-viewer/rule-viewer.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { AdditionalOptionSelectorComponent } from './components/additional-option-selector/additional-option-selector.component';


@NgModule({
	declarations: [
		AppComponent,

		RuleViewerComponent,
		ExampleViewerComponent,
		OptionSelectorComponent,
		AdditionalOptionSelectorComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
