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

Testable.errorClass = WallSurviveTimer.TimerError;
Tester.run([
    TimerTest
]);