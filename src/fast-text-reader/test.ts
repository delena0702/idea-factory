import { Testable, Tester } from "../../test";
import { FastTextReader } from "./main";

namespace FastTextReaderTest {
    export class TextSpliterTest extends Testable {
        static test_split_기본_실행() {
            const text = `가나다라 마바사 abcd あはは`;
            const answer = text.split(' ');

            const result = FastTextReader.TextSpliter.split(text);

            this.assert(result.length == answer.length);
            for (let i = 0; i < answer.length; i++)
                this.assert(result[i] == answer[i]);
        }

        static test_split_공백이_2개_이상() {
            const text = `가나다라   마바사   abcd   \n\n    あはは`;
            const answer = [
                '가나다라',
                '마바사',
                'abcd',
                'あはは',
            ];

            const result = FastTextReader.TextSpliter.split(text);

            this.assert(result.length == answer.length);
            for (let i = 0; i < answer.length; i++)
                this.assert(result[i] == answer[i]);
        }

        static test_split_maxLength_설정() {
            const text = `1 2글 3글자 4글자입 5글자입니 6글자입니다 7글자입니다.`;
            const answer = [
                '1',
                '2글',
                '3글자',
                '4글자', '입',
                '5글자', '입니',
                '6글자', '입니다',
                '7글자', '입니다', '.',
            ];

            const result = FastTextReader.TextSpliter.split(text, 3);
            this.assert(result.length == answer.length);
            for (let i = 0; i < answer.length; i++)
                this.assert(result[i] == answer[i]);
        }
    }

    export class TextProcessorTest extends Testable {
        static test_기본_동작() {
            const text = `대충 동작하는지 확인하는 문장`;
            const config = new FastTextReader.Config();
            config.wordMaximumLength = 10;
            config.longWordProcessMethod = FastTextReader.LongWordProcessMethod.SHOW_LONG_TIME;

            const answer = text.split(' ');

            const processor = new FastTextReader.TextProcessor();
            processor.setText(text);
            processor.setConfig(config);

            this.assert(answer.length == processor.getLength());
            for (let i = 0; i < answer.length; i++)
                this.assert(answer[i] == processor.get(i));
        }

        static test_인덱스_초과() {
            const text = `0 1 2 3 4`;
            const config = new FastTextReader.Config();
            config.wordMaximumLength = 10;
            config.longWordProcessMethod = FastTextReader.LongWordProcessMethod.SHOW_LONG_TIME;

            const answer = text.split(' ');

            const processor = new FastTextReader.TextProcessor();
            processor.setText(text);
            processor.setConfig(config);

            const length = processor.getLength();

            this.assertError(() => {
                processor.get(-1);
            });

            this.assertError(() => {
                processor.get(length);
            });
        }

        static test_글씨_쪼개기() {
            const text = `글자가쪼개져야합니다`;
            const config = new FastTextReader.Config();
            config.wordMaximumLength = 5;
            config.longWordProcessMethod = FastTextReader.LongWordProcessMethod.SPLIT;

            const processor = new FastTextReader.TextProcessor();
            processor.setText(text);
            processor.setConfig(config);

            const length = processor.getLength();
            this.assert(length == 2);
        }

        static test_글씨_쪼개지면_안됨() {
            const text = `글자가안쪼개져야합니다`;
            const config = new FastTextReader.Config();
            config.wordMaximumLength = 5;
            config.longWordProcessMethod = FastTextReader.LongWordProcessMethod.SHOW_LONG_TIME;

            const processor = new FastTextReader.TextProcessor();
            processor.setText(text);
            processor.setConfig(config);

            const length = processor.getLength();
            this.assert(length == 1);
        }
    }
}

Testable.errorClass = FastTextReader.FastTextReaderError;
Tester.run([
    FastTextReaderTest.TextSpliterTest,
    FastTextReaderTest.TextProcessorTest,
]);