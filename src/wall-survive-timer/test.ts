import { Testable, Tester } from '../../test';
import { WallSurviveTimer, DataStructure } from './main';

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

    static test_pop(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:02', '1'],
                ['1:03', '2'],
            ]
        );

        this.assert(task.pop() === true);
        this.assert(task.getEventName() == '2');
    }

    static test_pop_실패(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
            ]
        );

        this.assert(task.pop() === false);
    }

    static test_clear(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:02:03', '3'],
                ['1:02', '1'],
                ['1:03', '2'],
            ]
        );

        task.pop();
        task.pop();
        task.clear();

        this.assert(task.getEventName() == '1');
    }

    static test_sync(): void {
        const task = new WallSurviveTimer.TimerTask(
            WallSurviveTimer.EnemyType.BOSS,
            [
                ['1:04', '3'],
                ['1:02', '1'],
                ['1:03', '2'],
            ]
        );

        task.sync(WallSurviveTimer.TimeConverter.str2num('1:03'));

        this.assert(task.getEventName() == '2');
    }
}

class HeapTest extends Testable {
    static test_(): void {
        const pq = new DataStructure.Heap<number, number>();

        pq.push(3, 3);
        pq.push(5, 5);
        pq.push(1, 1);
        pq.push(2, 2);
        pq.push(4, 4);

        for (let i = 1; i <= 5; i++) {
            this.assert(pq.topKey() == i);
            this.assert(pq.pop() === true);
        }

        this.assert(pq.pop() === false);
    }
}

Testable.errorClass = WallSurviveTimer.TimerError;
Tester.run([
    TimerTest,
    TimeConverterTest,
    TimerTaskTest,
    HeapTest, 
]);