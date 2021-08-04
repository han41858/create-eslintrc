import { Component, Input } from '@angular/core';

import { Example } from '../../common/interfaces';


@Component({
	selector: 'app-example-viewer',
	templateUrl: './example-viewer.component.html',
	styleUrls: ['./example-viewer.component.sass']
})
export class ExampleViewerComponent {

	@Input() example?: Example;

}
