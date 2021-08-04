import { Component } from '@angular/core';

import { RuleFileType } from '../../common/constants';


@Component({
	selector: 'app-result-preview',
	templateUrl: './result-preview.component.html',
	styleUrls: ['./result-preview.component.sass']
})
export class ResultPreviewComponent {

	fileType: RuleFileType = RuleFileType.JSON;
	fileName: string = '.eslintrc.json';
	result: string = `{
\t"rules": {
\t\t"indent": "off",
\t\t"@typescript-eslint/indent": [
\t\t\t"warn",
\t\t\t"tab",
\t\t\t{
\t\t\t\t"ignoreComments": true,
\t\t\t\t"SwitchCase": 1,
\t\t\t\t"ignoredNodes": [
\t\t\t\t\t"CallExpression *",
\t\t\t\t\t"ExpressionStatement *",
\t\t\t\t\t"NewExpression *"
\t\t\t\t]
\t\t\t}
\t\t],
\t\t"linebreak-style": [
\t\t\t"warn",
\t\t\t"windows"
\t\t],
\t\t"arrow-parens": "warn",
\t\t"quotes": [
\t\t\t"warn",
\t\t\t"single"
\t\t],
\t\t"semi": [
\t\t\t"warn",
\t\t\t"always"
\t\t],
\t\t"@typescript-eslint/member-delimiter-style": [
\t\t\t"warn",
\t\t\t{
\t\t\t\t"multiline": {
\t\t\t\t\t"delimiter": "comma",
\t\t\t\t\t"requireLast": false
\t\t\t\t},
\t\t\t\t"singleline": {
\t\t\t\t\t"delimiter": "comma",
\t\t\t\t\t"requireLast": false
\t\t\t\t},
\t\t\t\t"overrides": {
\t\t\t\t\t"interface": {
\t\t\t\t\t\t"multiline": {
\t\t\t\t\t\t\t"delimiter": "semi",
\t\t\t\t\t\t\t"requireLast": true
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t],
\t\t"no-shadow": "off",
\t\t"@typescript-eslint/no-shadow": "warn",
\t\t"no-trailing-spaces": "warn",
\t\t"no-var": "warn",
\t\t"prefer-const": "warn",
\t\t"space-before-function-paren": "warn",
\t\t"brace-style": [
\t\t\t"warn",
\t\t\t"stroustrup"
\t\t],
\t\t"key-spacing": [
\t\t\t"warn",
\t\t\t{
\t\t\t\t"beforeColon": false,
\t\t\t\t"afterColon": true
\t\t\t}
\t\t],
\t\t"@typescript-eslint/type-annotation-spacing": [
\t\t\t"warn",
\t\t\t{
\t\t\t\t"before": false,
\t\t\t\t"after": true,
\t\t\t\t"overrides": {
\t\t\t\t\t"arrow": {
\t\t\t\t\t\t"before": true,
\t\t\t\t\t\t"after": true
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t],
\t\t"@typescript-eslint/explicit-function-return-type": "warn",
\t\t"@typescript-eslint/no-inferrable-types": "off",
\t\t"@typescript-eslint/no-non-null-assertion": "warn",
\t\t"@typescript-eslint/no-empty-function": "warn",
\t\t"@typescript-eslint/no-unused-vars": "warn",
\t\t"@typescript-eslint/explicit-module-boundary-types": "warn",
\t\t"operator-linebreak": [
\t\t\t"warn",
\t\t\t"before"
\t\t],
\t\t"no-param-reassign": "warn"
\t}
}
`;

}
