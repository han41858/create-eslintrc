import { TextValue } from './interfaces';

import * as Prism from 'prismjs';


export const entriesToTextValue = <T> (entries: [string, T][]): TextValue<T>[] => {
	return entries.map(([key, value]): TextValue<T> => {
		return {
			text: key,
			value: value
		};
	});
};

export const refreshPrism = (): void => {
	Prism.highlightAll();
};
