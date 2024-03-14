namespace WallSurviveTimer {
    type RealTime = number;

    export enum EnemyType {
        WARNING = 0,
        BOSS = 1,
    }

    export class TimeConverter {
        public static str2num(str: string): RealTime {
            try {
                const result = str.split(':').reduce((a, x) => a * 60 + parseInt(x), 0);
                if (isNaN(result))
                    return TimerError.InvalidTimeString(str);
                return result * 1000;
            } catch (e) {
                TimerError.InvalidTimeString(str);
            }
        }

        public static num2str(num: RealTime): string {
            const arr = [0, 0, 0];

            num = Math.floor(num / 1000);
            arr[2] = num % 60;
            arr[1] = Math.floor(num % 3600 / 60);
            arr[0] = Math.floor(num / 3600);

            if (arr[0])
                return `${arr[0]}:${this.padZero(arr[1])}:${this.padZero(arr[2])}`;
            return `${arr[1]}:${this.padZero(arr[2])}`;
        }

        public static diffNum2str(num: RealTime): string {
            if (num >= 0)
                return `+${this.num2str(num)}`;
            return `-${this.num2str(-num)}`;
        }

        private static padZero(num: number): string {
            return num.toString().padStart(2, '0');
        }
    }

    class EventDataStorage {
        static readonly data: [EnemyType, string[], [string, string, string[]][]][] = [
            [
                EnemyType.BOSS, ['5:00', '12:50'], [
                    ['촉수형제', '공생충', ['', '']],
                    ['식충', '군단숙주', ['', '']],
                ]
            ],
            [
                EnemyType.BOSS, ['9:00', '30:00'], [
                    ['자가라', '자가라의 헤비좀비', ['', '']],
                    ['감염된 탱크', '질럿 + 메딕', ['', '']],
                ]
            ],
            [
                EnemyType.BOSS, ['31:00', '46:40'], [
                    ['살모사', '군단충 + 방사능 미친개', ['', '']],
                    ['오메가리스크', '피갈리스크', ['', '']],
                ]
            ],
            [
                EnemyType.BOSS, ['45:00', '1:03:20'], [
                    ['감염된 토르', '변종뮤탈 + 감염된 벤시', ['', '']],
                    ['거대괴수', '수호군주', ['', '']],
                ]
            ],
            [
                EnemyType.BOSS, ['01:03:30', '01:13:30'], [
                    ['브루탈리스크', '', ['', '']],
                ]
            ],

            [
                EnemyType.WARNING, ['9:00', '19:00'], [
                    ['대공경보', '', []],
                ]
            ],
            [
                EnemyType.WARNING, ['29:00', '39:00'], [
                    ['공중 유닛 증가', '', []],
                ]
            ],
        ];

        static getRowData(): WallSurviveTimerView.ScheduleRowData[] {
            const retval: WallSurviveTimerView.ScheduleRowData[] = [];
            
            for (const row of this.data) {
                const timeStrings = row[1];
                retval.push([row[0], [
                    TimeConverter.str2num(timeStrings[0]),
                    TimeConverter.str2num(timeStrings[1]),
                    TimeConverter.str2num(timeStrings[1]) + 60 * 1000
                ], row[2]]);
            }

            return retval;
        }
    }

    export class Timer {
        private speed: number;
        private static readonly endTime = (1 * 3600 + 13 * 60 + 30) * 1000;

        private startTime: RealTime | null;
        private passedTime: RealTime;

        private intervalValue: number | null;

        private binder: WallSurviveTimerView.TimerViewBinder;

        public constructor();
        public constructor(speed: number);
        public constructor(speed?: number) {
            this.speed = 1.44;
            if (speed !== undefined)
                this.speed = speed;

            this.startTime = null;
            this.passedTime = 0;

            this.intervalValue = null;

            this.binder = new WallSurviveTimerView.TimerViewBinder(document.body);
            this.binder.setStartEndTime(0, Timer.endTime);
            this.binder.addRowFromData(EventDataStorage.getRowData());

            const timer = this;
            this.binder.setUpdateListener((time: number) => {
                timer.syncTime(time);
            });
            this.syncTime(0);
        }

        public start(): void {
            this.skip(0);
            this.startProc();
        }

        private startProc(): void {
            this.intervalValue = setInterval(this.proc.bind(this), 100);
        }

        private stopProc(): void {
            if (this.intervalValue === null)
                TimerError.noRunningTimer();
            clearInterval(this.intervalValue);
            this.intervalValue = null;
        }

        private proc(): void {
            if (this.startTime === null)
                TimerError.startTimeIsNull();

            this.passedTime = new Date().getTime() - this.startTime; 

            if (this.passedTime * this.speed >= Timer.endTime)
                this.pause();

            this.update();
        }

        private update(): void {
            this.syncTime(this.passedTime * this.speed);
        }

        public pause(): void {
            if (this.startTime === null)
                TimerError.startTimeIsNull();

            this.passedTime = Math.min(Timer.endTime / this.speed, new Date().getTime() - this.startTime);
            this.startTime = null;

            this.stopProc();
            this.update();
        }

        public restart(): void {
            this.skip(this.passedTime);
            this.startProc();
        }

        public stop(): void {
            this.startTime = null;
            this.passedTime = 0;

            this.stopProc();
            this.update();
        }

        public skip(time: RealTime): void {
            this.passedTime = time;

            this.update();
        }

        public syncTime(time: number): void {
            const realTime: RealTime = time / this.speed;

            this.startTime = new Date().getTime() - realTime;
            this.passedTime = realTime;

            this.binder.syncTime(time);
        }
    }

    export class TimerError extends Error {
        public static InvalidTimeString(str: string): never {
            throw new TimerError(`${str}은 시간을 나타내는 문자열이 아닙니다.`);
        }

        public static noRunningTimer(): never {
            throw new TimerError("타이머가 실행중이지 않습니다.");
        }

        public static startTimeIsNull(): never {
            throw new TimerError(`startTime이 null인 상태로 기능을 수행할 수 없습니다.`);
        }
    }
}