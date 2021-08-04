import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RuleViewerComponent } from './components/rule-viewer/rule-viewer.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { AdditionalOptionSelectorComponent } from './components/additional-option-selector/additional-option-selector.component';
import { CommonConfigComponent } from './components/common-config/common-config.component';
import { ResultPreviewComponent } from './components/result-preview/result-preview.component';


@NgModule({
	declarations: [
		AppComponent,

		RuleViewerComponent,
		ExampleViewerComponent,
		OptionSelectorComponent,
		AdditionalOptionSelectorComponent,
		CommonConfigComponent,
		ResultPreviewComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,

		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
