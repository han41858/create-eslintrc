import { Rule } from 'src/app/common/interfaces';
import { FixableType, Package, RuleCategory, RuleType } from 'src/app/common/constants';

const rule: Rule = {
	package: Package.ESLint,
	name: 'for-direction',
	description: 'enforce "for" loop update clause moving the counter in the right direction.',

	type: RuleType.Problem,
	category: RuleCategory.PossibleErrors,

	recommended: true,
	fixable: FixableType.Code,

	docUrl: 'https://eslint.org/docs/rules/for-direction',
	version: '4.0.0-beta.0',

	examples: [{
		correct: false,
		rule: '"error"',
		code: `for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}`
	}, {
		correct: true,
		rule: '"error"',
		code: `for (var i = 0; i < 10; i++) {
}`
	}]
};

export default rule;
