import { Rule } from '../../common/interfaces';
import { FixableType, OptionType, Package, RuleCategory, RuleType, SyntaxType } from '../../common/constants';

export const IndentRule: Rule = {
	package: Package.ESLint,
	name: 'indent',
	// description: 'enforce consistent indentation',
	description: {},

	type: RuleType.Layout,
	category: RuleCategory.StylisticIssues,

	recommended: false,
	fixable: FixableType.Whitespace,

	docUrl: 'https://eslint.org/docs/rules/indent#enforce-consistent-indentation-indent',
	version: '0.14.0',

	defaultOption: {
		type: OptionType.NumberVariable,
		value: 4
	},
	options: [{
		type: OptionType.NumberVariable,
		value: 4
	}, {
		type: OptionType.StringFixed,
		value: 'tab',

		examples: [{
			correct: false,
			rule: '["error", "tab"]',

			syntax: SyntaxType.JavaScript,
			code: `if (a) {
     b=c;
function foo(d) {
           e=f;
 }
}`
		}, {
			correct: true,
			rule: '["error", "tab"]',

			syntax: SyntaxType.JavaScript,
			code: `if (a) {
/*tab*/b=c;
/*tab*/function foo(d) {
/*tab*//*tab*/e=f;
/*tab*/}
}`
		}]
	}],
	additionalOptions: [{
		type: OptionType.StringArray,

		property: 'ignoredNodes',

		examples: [{
			correct: true,
			rule: '["error", 4, { "ignoredNodes": ["ConditionalExpression"] }]',

			syntax: SyntaxType.JavaScript,
			code: `var a = foo
      ? bar
      : baz;

var a = foo
                ? bar
: baz;`
		}, {
			correct: true,
			rule: '["error", 4, { "ignoredNodes": ["CallExpression > FunctionExpression.callee > BlockStatement.body"] }]',

			syntax: SyntaxType.JavaScript,
			code: `(function() {

foo();
bar();

})`
		}]
	}, {
		property: 'SwitchCase',
		type: OptionType.NumberVariable,

		examples: [{
			correct: false,
			rule: '["error", 2, { "SwitchCase": 1 }]',

			syntax: SyntaxType.JavaScript,
			code: `switch(a){
case "a":
    break;
case "b":
    break;
}`
		}, {
			correct: true,
			rule: '["error", 2, { "SwitchCase": 1 }]',

			syntax: SyntaxType.JavaScript,
			code: `switch(a){
  case "a":
    break;
  case "b":
    break;
}`
		}]
	}, {
		property: 'VariableDeclarator',
		type: OptionType.NumberVariable,

		examples: [{
			correct: false,
			rule: '["error", 2, { "VariableDeclarator": 1 }]',

			syntax: SyntaxType.JavaScript,
			code: `var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
    b = 2,
    c = 3;`
		}, {
			correct: true,
			rule: '["error", 2, { "VariableDeclarator": 1 }]',

			syntax: SyntaxType.JavaScript,
			code: `var a,
  b,
  c;
let a,
  b,
  c;
const a = 1,
  b = 2,
  c = 3;`
		}, {
			correct: false,
			rule: '["error", 2, { "VariableDeclarator": "first" }]',

			syntax: SyntaxType.JavaScript,
			code: `var a,
  b,
  c;
let a,
  b,
  c;
const a = 1,
  b = 2,
  c = 3;`
		}, {
			correct: true,
			rule: '["error", 2, { "VariableDeclarator": "first" }]',

			syntax: SyntaxType.JavaScript,
			code: `var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
      b = 2,
      c = 3;`
		}, {
			correct: true,
			rule: '["error", 2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }]',

			syntax: SyntaxType.JavaScript,
			code: `var a,
    b,
    c;
let a,
    b,
    c;
const a = 1,
      b = 2,
      c = 3;`
		}]
	}]
	// TODO: and more
};
