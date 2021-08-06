import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StartPage } from './pages/start/start.page';
import { PageAndPreviewPage } from './pages/page-and-preview/page-and-preview.page';
import { ConfigPage } from './pages/config/config.page';
import { RulePage } from './pages/rule/rule.page';


import { RuleViewerComponent } from './components/rule-viewer/rule-viewer.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { OptionSelectorComponent } from './components/option-selector/option-selector.component';
import { AdditionalOptionSelectorComponent } from './components/additional-option-selector/additional-option-selector.component';

import { ResultPreviewComponent } from './components/result-preview/result-preview.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';


@NgModule({
	declarations: [
		AppComponent,

		StartPage,
		PageAndPreviewPage,
		ConfigPage,
		RulePage,

		RuleViewerComponent,
		ExampleViewerComponent,
		OptionSelectorComponent,
		AdditionalOptionSelectorComponent,
		ResultPreviewComponent,
		CodeViewerComponent
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
