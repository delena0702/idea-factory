import { Testable, Tester } from '../../test';
import { WallSurviveTimer } from './main';

class TimerTest extends Testable {
    static test_시작하지_않고_일시정지_에러(): void {
        const timer = new WallSurviveTimer.Timer();
        TimerTest.assertError(() => {
            timer.pause();
        });
    }

    static test_시작하지_않고_정지_에러(): void {
        const timer = new WallSurviveTimer.Timer();
        TimerTest.assertError(() => {
            timer.stop();
        });
    }
}

class TimeConverterTest extends Testable {
    static test_str2num_정상동작(): void {
        const timeString = `1:02:03`;
        const answer = 1 * 3600 + 2 * 60 + 3;

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
        const answer = 1 * 60 + 2;

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
}

class TimerTaskTest extends Testable {
    static test_1번째_정보_조회(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:02', 'first_task']
            ]
        );

        this.assert(task.getEventTime() == 1 * 60 + 2);
        this.assert(task.getEventName() == 'first_task');
    }

    static test_1번째_정보_조회_없음(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
            ]
        );

        this.assert(task.getEventTime() === null);
        this.assert(task.getEventName() === null);
    }

    static test_2번째_정보_조회(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:02:03', 'second_task'],
                ['1:02', 'first_task']
            ]
        );

        this.assert(task.getNextEventTime() == 1 * 3600 + 2 * 60 + 3);
        this.assert(task.getNextEventName() == 'second_task');
    }

    static test_2번째_정보_조회_없음(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:02', 'first_task']
            ]
        );

        this.assert(task.getNextEventTime() === null);
        this.assert(task.getNextEventName() === null);
    }
}

Testable.errorClass = WallSurviveTimer.TimerError;
Tester.run([
    TimerTest,
    TimeConverterTest,
    TimerTaskTest,
]);