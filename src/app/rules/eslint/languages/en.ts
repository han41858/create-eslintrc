import { Language } from 'src/app/common/constants';

import { ForDirectionRule } from 'src/app/rules/eslint/for-direction';
import { BlockSpacingRule } from 'src/app/rules/eslint/block-spacing';
import { IndentRule } from 'src/app/rules/eslint/indent';


ForDirectionRule.description[Language.en] = 'A <code>for</code> loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, will run infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as <code>while</code> loops. More typically, an infinite for loop is a bug.';
BlockSpacingRule.description[Language.en] = 'This rule enforces consistent spacing inside an open block token and the next token on the same line.<br>This rule also enforces consistent spacing inside a close block token and previous token on the same line.';
IndentRule.description[Language.en] = 'This rule enforces a consistent indentation style. The default style is 4 spaces.';
