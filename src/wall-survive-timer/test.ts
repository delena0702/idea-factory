import { Testable, Tester } from '../../test';
import { WallSurviveTimer } from './main';

class TimeConverterTest extends Testable {
    static test_str2num_정상동작(): void {
        const timeString = `1:02:03`;
        const answer = (1 * 3600 + 2 * 60 + 3) * 1000;

        const result = WallSurviveTimer.TimeConverter.str2num(timeString);

        this.assert(answer == result);
    }

    static test_str2num_정상동작_0(): void {
        const timeString = `0:00:00`;
        const answer = 0;

        const result = WallSurviveTimer.TimeConverter.str2num(timeString);

        this.assert(answer == result);
    }

    static test_str2num_정상동작_시간_단위가_없음(): void {
        const timeString = `01:02`;
        const answer = (1 * 60 + 2) * 1000;

        const result = WallSurviveTimer.TimeConverter.str2num(timeString);

        this.assert(answer == result);
    }

    static test_str2num_숫자가_아닌_것이_존재(): void {
        const timeString = `01:as:34`;

        this.assertError(() => {
            WallSurviveTimer.TimeConverter.str2num(timeString);
        });
    }

    static test_str2num_빈_문자열(): void {
        const timeString = ``;

        this.assertError(() => {
            WallSurviveTimer.TimeConverter.str2num(timeString);
        });
    }

    static test_str2num_연속된_구분자(): void {
        const timeString = `1::2`;

        this.assertError(() => {
            WallSurviveTimer.TimeConverter.str2num(timeString);
        });
    }

    static test_num2str_3자리(): void {
        const num = (1 * 3600 + 2 * 60 + 3) * 1000;
        const answer = '1:02:03';
        
        this.assert(WallSurviveTimer.TimeConverter.num2str(num) == answer);
    }

    static test_num2str_2자리_경계(): void {
        const num = (59 * 60 + 59) * 1000;
        const answer = '59:59';

        this.assert(WallSurviveTimer.TimeConverter.num2str(num) == answer);
    }

    static test_num2str_3자리_경계(): void {
        const num = (1 * 3600) * 1000;
        const answer = '1:00:00';

        this.assert(WallSurviveTimer.TimeConverter.num2str(num) == answer);
    }
}

Testable.errorClass = WallSurviveTimer.TimerError;
Tester.run([
    TimeConverterTest,
]);