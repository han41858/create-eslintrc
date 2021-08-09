import { LanguageCode } from 'src/app/common/constants';

import { ForDirectionRule } from 'src/app/rules/eslint/for-direction';
import { BlockSpacingRule } from 'src/app/rules/eslint/block-spacing';
import { IndentRule } from 'src/app/rules/eslint/indent';


ForDirectionRule.description[LanguageCode['ko-kr']] = '<code>for</code> 루프 안에서 카운터가 잘못된 방향으로 증가하면 루프 실행이 멈추지 않습니다. 의도적으로 이렇게 사용하는 경우라면 <codefor</code> 루프가 아니라 <code>while</code> 루프를 사용해야 합니다. 일반적으로 무한히 실행되는 <code>for</code> 루프는 버그로 판단됩니다.';
BlockSpacingRule.description[LanguageCode['ko-kr']] = '이 규칙을 적용하면 블록 안쪽 공백문자의 일관성을 강제합니다.<br>블록 시작과 블록 끝이 같은 줄에 있어도 적용됩니다.';
IndentRule.description[LanguageCode['ko-kr']] = '들여쓰기 규칙을 설정합니다. 기본값은 공백 4문자입니다.';
