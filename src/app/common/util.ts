import { ElementRef } from '@angular/core';

import * as Prism from 'prismjs';

import { Config, RuleSelected, StorageRootObj, TextValue } from './interfaces';
import { StorageKey, StorageRootKey } from './constants';


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


const _getStorageRootObj = (): StorageRootObj => {
	let rootObj: StorageRootObj;

	const rootObjStr: string | null = localStorage.getItem(StorageRootKey);

	if (rootObjStr) {
		rootObj = JSON.parse(rootObjStr);
	}
	else {
		rootObj = {} as StorageRootObj;
	}

	return rootObj;
};

const _setStorageRootObj = (rootObj: StorageRootObj): void => {
	localStorage.setItem(StorageRootKey, JSON.stringify(rootObj));
};

export function setStorage (key: StorageKey.Config, opj: Config): void;
export function setStorage (key: StorageKey.RulesSelected, obj: RuleSelected[]): void;
export function setStorage (key: StorageKey.RuleNames, obj: string[]): void;
export function setStorage (key: keyof StorageRootObj, obj: unknown): void {
	const rootObj: StorageRootObj = _getStorageRootObj();

	switch (key) {
		case StorageKey.Config:
			rootObj[StorageKey.Config] = obj as Config;
			break;

		case StorageKey.RuleNames:
			rootObj[StorageKey.RuleNames] = obj as string[];
			break;

		case StorageKey.RulesSelected:
			rootObj[StorageKey.RulesSelected] = obj as RuleSelected[];
			break;
	}

	_setStorageRootObj(rootObj);
}


export function getStorage (key: StorageKey.Config): Config | undefined;
export function getStorage (key: StorageKey.RulesSelected): RuleSelected[] | undefined;
export function getStorage (key: StorageKey.RuleNames): string[] | undefined;
export function getStorage (key: StorageKey): unknown | undefined {
	const rootObj: StorageRootObj = _getStorageRootObj();

	return rootObj[key];
}
