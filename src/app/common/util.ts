import { ElementRef } from '@angular/core';

import * as Prism from 'prismjs';

import { TextValue } from './interfaces';


export const entriesToTextValue = <T> (entries: [string, T][]): TextValue<T>[] => {
	return entries.map(([key, value]): TextValue<T> => {
		return {
			text: key,
			value: value
		};
	});
};

export const refreshPrism = (ele: ElementRef<HTMLElement>): void => {
	Prism.highlightElement(ele.nativeElement);
};
