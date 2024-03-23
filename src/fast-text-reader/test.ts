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

    export class TimerTest extends Testable {
        static async test_기본_동작() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            const answerTotalTime = 60000 * endTic / config.speed;
            const result: boolean = await new Promise((res) => {
                const tmout = setTimeout(() => {
                    res(false);
                    // timeouted
                }, answerTotalTime * 2);

                let idx = 0;
                this.assert(timer.isPlaying() == false);

                const start = new Date().getTime();
                timer.setProc((tic: number) => {
                    this.assert(0 <= tic && tic < endTic);
                    this.assert(tic == idx++);
                    this.assert(timer.isPlaying() == true);

                    if (tic == endTic - 1) {
                        const end = new Date().getTime();

                        const result = Math.abs((end - start) - answerTotalTime);
                        this.assert(result / answerTotalTime < 0.1);
                        timer.stop();
                        clearTimeout(tmout);
                        res(true);
                    }
                });

                timer.start();
            });

            this.assert(result);
            this.assert(timer.isPlaying() == false);
        }

        static async test_정지_동작() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            const answerTotalTime = 60000 * endTic / config.speed;
            const stopTic = 5;

            let idx = 0;
            await new Promise((res) => {
                setTimeout(() => {
                    res(false);
                    // timeouted
                }, answerTotalTime * 2);

                timer.setProc((tic: number) => {
                    this.assert(0 <= tic && tic <= stopTic);
                    this.assert(tic == idx++);

                    if (tic == stopTic) {
                        timer.stop();
                    }
                });

                timer.start();
            });

            this.assert(idx == stopTic + 1);
        }

        static async test_연속start_테스트() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            timer.start();
            this.assertError(() => {
                timer.start();
            });
            timer.stop();
        }

        static async test_연속stop_테스트() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            this.assertError(() => {
                timer.stop();
            });

            timer.start();
            timer.stop();
            this.assertError(() => {
                timer.stop();
            });
        }

        static async test_실행중_skip_뒤로() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            const answerTotalTime = 60000 * endTic / config.speed;

            const a = 3, b = 7;
            const result: boolean = await new Promise((res) => {
                const tmout = setTimeout(() => {
                    res(false);
                    // timeouted
                }, answerTotalTime * 2);

                let idx = 0;

                timer.setProc((tic: number) => {
                    this.assert(0 <= tic && tic < endTic);
                    this.assert(tic == idx++);

                    if (tic == a) {
                        idx = b;
                        timer.skip(b - 1);
                    }

                    if (tic == endTic - 1) {
                        clearTimeout(tmout);
                        res(true);
                    }
                });

                timer.start();
            });

            this.assert(result);
        }

        static async test_실행중_skip_앞으로() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            const answerTotalTime = 60000 * endTic / config.speed;

            const a = 7, b = 3;
            const result: boolean = await new Promise((res) => {
                const tmout = setTimeout(() => {
                    timer.stop();
                    res(true);
                    // timeouted
                }, answerTotalTime * 2);

                let idx = 0;

                timer.setProc((tic: number) => {
                    this.assert(0 <= tic && tic < endTic);
                    this.assert(tic == idx++);

                    if (tic == a) {
                        idx = b;
                        timer.skip(b - 1);
                    }
                });

                timer.start();
            });

            this.assert(result);
        }

        static async test_정지중_skip() {
            const timer = new FastTextReader.Timer();

            const config = new FastTextReader.Config();
            config.speed = 600;
            timer.setConfig(config);

            const endTic = 10;
            timer.setEndTic(endTic);

            const answerTotalTime = 60000 * endTic / config.speed;

            const a = 5;
            timer.skip(a);
            const result: boolean = await new Promise((res) => {
                const tmout = setTimeout(() => {
                    res(false);
                    // timeouted
                }, answerTotalTime * 2);

                let idx = a;

                timer.setProc((tic: number) => {
                    this.assert(0 <= tic && tic < endTic);
                    this.assert(tic == idx++);

                    if (tic == endTic - 1) {
                        clearTimeout(tmout);
                        res(true);
                    }
                });

                timer.resume();
            });

            this.assert(result);
        }
    }
}

Testable.errorClass = FastTextReader.FastTextReaderError;
Tester.run([
    FastTextReaderTest.TextSpliterTest,
    FastTextReaderTest.TextProcessorTest,
    FastTextReaderTest.TimerTest,
]);