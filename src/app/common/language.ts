import { LanguageCode } from './constants';

export const LanguageSet: {
	[languageCode: string]: {
		[msg: string]: string
	};
} = {
	[LanguageCode.en]: {
		StartTitle: 'Create Your Own',
		Start: 'Start',

		ConfigFileType: 'Config File Type',
		Environment: 'Environment',
		DefaultErrorLevel: 'Default Error Level',
		TargetPackages: 'Target Packages',
		RuleOrder: 'Rule Order',

		Options: 'Options',
		AdditionalOptions: 'Additional Options'
	},

	[LanguageCode['kr-ko']]: {
		StartTitle: 'eslint 설정파일을 만들어 보세요.',
		Start: '시작하기',

		ConfigFileType: '설정파일 종류',
		Environment: '적용환경',
		DefaultErrorLevel: '기본 에러 레벨',
		TargetPackages: '대상 패키지',
		RuleOrder: '룰 순서',

		Options: '옵션',
		AdditionalOptions: '추가 옵션'
	}
};
