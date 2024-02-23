namespace WallSurviveTimer {
    type Time = number;

    enum EnemyType {
        WARNING = 0,
        PREDICTOR = 1,
        BOSS = 2,
    }

    class EnemyData {
        static readonly data = [
            [EnemyType.PREDICTOR, '5:00', '공생충 => 촉수형제/식충 => 군단숙주', 1],
            [EnemyType.PREDICTOR, '9:00', '자가라의 헤비좀비 => 자가라/질럿 + 메딕 => 감염된 탱크', 2],
            [EnemyType.BOSS, '12:50', '촉수형제 or 군단숙주', 1],
            [EnemyType.WARNING, '19:00', '대공경보', 0],
            [EnemyType.BOSS, '30:00', '자가라 or 감염된 탱크', 2],
            [EnemyType.PREDICTOR, '31:00', '군단충 + 방사능 미친개 => 살모사/피갈리스크 => 오메가리스크', 3],
            [EnemyType.WARNING, '39:00', '공중 유닛 증가', 0],
            [EnemyType.PREDICTOR, '45:00', '변종뮤탈 + 감염된 벤시 => ??/수호군주 => ??', 4],
            [EnemyType.BOSS, '46:40', '살모사 or 오메가리스크', 3],
            [EnemyType.BOSS, '1:03:20', '감염된 토르 or 거대괴수', 4],
            [EnemyType.BOSS, '01:13:30', '브루탈리스크', 5],
        ];
    }

    export class Timer {
        speed: number;

        startTime: Time | null;
        passedTime: Time;

        intervalValue: number | null;

        constructor();
        constructor(speed: number);
        constructor(speed?: number) {
            this.speed = 1.44;
            if (speed !== undefined)
                this.speed = speed;
            
            this.startTime = null;
            this.passedTime = 0;

            this.intervalValue = null;
        }

        start(): void {
            this.startTime = new Date().getTime();
            this.passedTime = 0;
            this.startProc();
        }

        isRunningProc(): boolean {
            return this.intervalValue !== null;
        }

        startProc(): void {
            this.intervalValue = setInterval(this.proc.bind(this), 100);
        }

        stopProc(): void {
            if (this.intervalValue === null)
                TimerError.noRunningTimer();
            clearInterval(this.intervalValue);
            this.intervalValue = null;
        }

        proc(): void {
            if (this.startTime === null)
                TimerError.startTimeIsNull();

            this.passedTime = new Date().getTime() - this.startTime;

            // DO SOMETHING
            // console.log(this.startTime, this.passedTime);
        }

        pause(): void {
            if (this.startTime === null)
                TimerError.startTimeIsNull();

            this.passedTime = new Date().getTime() - this.startTime;
            this.startTime = null;

            this.stopProc();
        }

        restart(): void {
            this.startTime = new Date().getTime() - this.passedTime;
            this.startProc();
        }

        stop(): void {
            this.startTime = null;
            this.passedTime = 0;
            this.stopProc();
        }

        skip(time: Time): void {
            this.startTime = new Date().getTime() - time;
            this.passedTime = time;
        }
    }

    class TimerError extends Error {
        static noRunningTimer(): never {
            throw new TimerError("타이머가 실행중이지 않습니다.");
        }

        static startTimeIsNull(): never {
            throw new TimerError(`startTime이 null인 상태로 기능을 수행할 수 없습니다.`);
        }
    }
}