import { TextValue } from './interfaces';

export const entriesToTextValue = <T> (entries: [string, T][]): TextValue<T>[] => {
	return entries.map(([key, value]): TextValue<T> => {
		return {
			text: key,
			value: value
		};
	});
};
