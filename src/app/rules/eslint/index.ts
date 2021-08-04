import { Rule } from '../../common/interfaces';

import { ForDirectionRule } from './for-direction';
import { BlockSpacingRule } from './block-spacing';
import { IndentRule } from './indent';

export const rules: Rule[] = [
	ForDirectionRule,
	BlockSpacingRule,
	IndentRule
];
