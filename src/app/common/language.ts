import { LanguageCode } from './constants';

export const LanguageSet: {
	[languageCode: string]: {
		[msg: string]: string
	};
} = {
	[LanguageCode.en]: {
		Language: 'Language',

		StartTitle: 'Create Your Own',
		Start: 'Start',

		ConfigFileType: 'Config File Type',
		Environment: 'Environment',

		TargetPackages: 'Target Packages',
		Category: 'Category',
		NpmPackage: 'npm package',
		Select: 'Select',
		SkipRecommended: 'skip recommended',

		RuleOrder: 'Rule Order',

		DocumentOrder: 'Document order',
		Alphabetical: 'by Alphabetical',
		FromOlderVersion: 'from older version',
		FromNewerVersion: 'from newer version',
		Random: 'Random',

		Previous: 'Previous',
		Next: 'Next',

		Version: 'Version',

		ErrorLevel: 'Error Level',
		Options: 'Options',
		AdditionalOptions: 'Additional Options',

		Result: 'Result',
		Download: 'Download'
	},

	[LanguageCode['ko-kr']]: {
		Language: '언어',

		StartTitle: 'eslint 설정파일을 만들어 보세요.',
		Start: '시작하기',

		ConfigFileType: '설정파일 종류',
		Environment: '적용환경',

		TargetPackages: '대상 패키지',
		Category: '분류',
		NpmPackage: 'npm 패키지',
		Select: '선택',
		SkipRecommended: '추천 규칙 건너뛰기',

		RuleOrder: '룰 순서',

		DocumentOrder: '문서 순서',
		Alphabetical: '알파벳 순서',
		FromOlderVersion: '오래된 버전부터',
		FromNewerVersion: '최신 버전부터',
		Random: '랜덤',

		Version: '버전',

		Previous: '이전',
		Next: '다음',

		ErrorLevel: '에러 레벨',
		Options: '옵션',
		AdditionalOptions: '추가 옵션',

		Result: '결과',
		Download: '다운로드'
	}
};
