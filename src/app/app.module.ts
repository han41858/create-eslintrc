import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RuleViewerComponent } from './components/rule-viewer/rule-viewer.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';


@NgModule({
	declarations: [
		AppComponent,

		RuleViewerComponent,
		ExampleViewerComponent
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
