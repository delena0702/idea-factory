import { Testable, Tester } from "../../test";
import { FastTextReader } from "./main";

namespace FastTextReaderTest {
    export class TextSpliterTest extends Testable {
        static test_split_기본_실행(): void {
            const text = `가나다라 마바사 abcd あはは`;
            const answer = text.split(' ');

            const result = FastTextReader.TextSpliter.split(text);

            this.assert(result.length == answer.length);
            for (let i = 0; i < answer.length; i++)
                this.assert(result[i] == answer[i]);
        }

        static test_split_공백이_2개_이상(): void {
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

        static test_split_maxLength_설정(): void {
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

    export class TextDataTest extends Testable {
        static test_기본_실행(): void {
            const reader = new FastTextReader.TextData();
            const text = `가나다라 마바사 abcd あはは`;
            const answer = text.split(' ');

            reader.setText(text);
            while (!reader.isEnd()) {
                const result = reader.get();
                reader.next();

                this.assert(result == answer.shift());
            }
        }

        static test_텍스트가_설정되지_않음(): void {
            const reader = new FastTextReader.TextData();

            this.assertError(() => { reader.get(); });
            this.assertError(() => { reader.isEnd(); });
            this.assertError(() => { reader.next(); });
            this.assertError(() => { reader.move(0); });
        }

        static test_기본_config_적용1(): void {
            const config = new FastTextReader.Config();
            config.wordMaximumLength = 3;
            config.longWordProcessMethod = FastTextReader.LongWordProcessMethod.SPLIT;

            const reader = new FastTextReader.TextData();
            reader.setConfig(config);

            const text = `가나다라 마바사 abcd あはは`;
            const answer = `가나다 라 마바사 abc d あはは`.split(' ');
            reader.setText(text);
            while (!reader.isEnd()) {
                const result = reader.get();
                reader.next();

                this.assert(result == answer.shift());
            }
        }

        static test_move_적용(): void {
            const reader = new FastTextReader.TextData();

            const text = `0 1 2 3 4 5 6`;
            reader.setText(text);

            for (let i = 0; i < 7; i++) {
                reader.move(i);
                this.assert(reader.get() == i.toString());
            }

            reader.move(7);
            this.assert(reader.isEnd() === true);
        }

        static test_인덱스_에러들(): void {
            const reader = new FastTextReader.TextData();

            const text = `0 1 2 3 4 5 6`;
            reader.setText(text);

            this.assertError(() => { reader.move(-1); });
            this.assertError(() => { reader.move(8); });

            reader.move(7);
            this.assertError(() => { reader.get(); });
        }
    }
}

Testable.errorClass = Error;
Tester.run([
    FastTextReaderTest.TextSpliterTest,
    FastTextReaderTest.TextDataTest,
]);