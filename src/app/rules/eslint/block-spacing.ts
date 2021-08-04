import { Rule } from '../../common/interfaces';
import { FixableType, OptionType, Package, RuleCategory, RuleType } from '../../common/constants';

export const BlockSpacingRule: Rule = {
	package: Package.ESLint,
	name: 'block-spacing',
	description: 'disallow or enforce spaces inside of blocks after opening block and before closing block',

	type: RuleType.Layout,
	category: RuleCategory.StylisticIssues,

	recommended: false,
	fixable: FixableType.Whitespace,

	docUrl: 'https://eslint.org/docs/rules/block-spacing',
	version: '1.2.0',

	defaultOption: {
		type: OptionType.StringFixed,
		value: 'always'
	},
	options: [{
		type: OptionType.StringFixed,
		value: 'always',

		examples: [{
			correct: true,
			rule: '"error"',
			code: `function foo() { return true; }
if (foo) { bar = 0; }`
		}, {
			correct: false,
			rule: '"error"',
			code: `function foo() {return true;}
if (foo) { bar = 0;}
function baz() {let i = 0;
    return i;
}`
		}]
	}, {
		type: OptionType.StringFixed,
		value: 'never',

		examples: [{
			correct: true,
			rule: '["error", "never"]',
			code: `function foo() {return true;}
if (foo) {bar = 0;}`
		}, {
			correct: false,
			rule: '["error", "never"]',
			code: `function foo() { return true; }
if (foo) { bar = 0;}`
		}]
	}]
};
