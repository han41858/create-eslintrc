import { Rule } from '../../common/interfaces';
import { FixableType, Package, RuleCategory, RuleType, SyntaxType } from '../../common/constants';

export const ForDirectionRule: Rule = {
	package: Package.ESLint,
	name: 'for-direction',
	// description: 'enforce "for" loop update clause moving the counter in the right direction.',
	description: {},

	type: RuleType.Problem,
	category: RuleCategory.PossibleErrors,

	recommended: true,
	fixable: FixableType.Code,

	docUrl: 'https://eslint.org/docs/rules/for-direction',
	version: '4.0.0-beta.0',

	examples: [{
		correct: false,
		rule: '"error"',

		syntax: SyntaxType.JavaScript,
		code: `for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}`
	}, {
		correct: true,
		rule: '"error"',

		syntax: SyntaxType.JavaScript,
		code: `for (var i = 0; i < 10; i++) {
}`
	}]
};
