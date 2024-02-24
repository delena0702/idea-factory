export namespace WallSurviveTimer {
    type Time = number;

    type RawEventData = [string, string];
    type EventData = [number, string];

    type GameTime = number;

    export enum EnemyType {
        WARNING = 0,
        BOSS = 1,
    }

    class EventDataStorage {
        static readonly data: [EnemyType, RawEventData[]][] = [
            [EnemyType.BOSS, [['5:00', '공생충 => 촉수형제/식충 => 군단숙주'], ['12:50', '촉수형제 or 군단숙주']]],
            [EnemyType.BOSS, [['9:00', '자가라의 헤비좀비 => 자가라/질럿 + 메딕 => 감염된 탱크'], ['30:00', '자가라 or 감염된 탱크']]],
            [EnemyType.BOSS, [['31:00', '군단충 + 방사능 미친개 => 살모사/피갈리스크 => 오메가리스크'], ['46:40', '살모사 or 오메가리스크']]],
            [EnemyType.BOSS, [['45:00', '변종뮤탈 + 감염된 벤시 => ??/수호군주 => ??'], ['1:03:20', '감염된 토르 or 거대괴수']]],
            [EnemyType.BOSS, [['01:13:30', '브루탈리스크']]],

            [EnemyType.WARNING, [['19:00', '대공경보']]],
            [EnemyType.WARNING, [['39:00', '공중 유닛 증가']]],
        ];
    }

    export class TimerTask {
        type: EnemyType;
        timeline: EventData[];

        constructor(type: EnemyType, timeline: RawEventData[]) {
            this.type = type;
            this.timeline = timeline.map((x) => TimerTask.convertToEventData(x));

            this.timeline.sort((a, b) => a[0] - b[0]);
        }

        private static convertToEventData(raw: RawEventData): EventData {
            return [TimeConverter.str2num(raw[0]), raw[1]];
        }

        getEventTime(): GameTime | null {
            if (!(0 < this.timeline.length))
                return null;
            return this.timeline[0][0];
        }

        getEventName(): string | null {
            if (!(0 < this.timeline.length))
                return null;
            return this.timeline[0][1];
        }

        getNextEventTime(): GameTime | null {
            if (!(1 < this.timeline.length))
                return null;
            return this.timeline[1][0];
        }

        getNextEventName(): string | null {
            if (!(1 < this.timeline.length))
                return null;
            return this.timeline[1][1];
        }
    }

    export class TimeConverter {
        public static str2num(str: string): GameTime {
            try {
                const result = str.split(':').reduce((a, x) => a * 60 + parseInt(x), 0);
                if (isNaN(result))
                    return TimerError.InvalidTimeString(str);
                return result;
            } catch (e) {
                TimerError.InvalidTimeString(str);
            }
        }

        public static num2str(num: GameTime): string {
            const arr = [0, 0, 0];
            arr[2] = num % 60;
            arr[1] = Math.floor(num % 3600 / 60);
            arr[0] = Math.floor(num / 3600);

            if (arr[0])
                return `${arr[0]}:${this.padSize(arr[1])}:${this.padSize(arr[2])}`;
            return `${arr[1]}:${this.padSize(arr[2])}`;
        }

        private static padSize(num: number): string {
            return num.toString().padStart(2, '0');
        }
    }

    export class Timer {
        private speed: number;

        private startTime: Time | null;
        private passedTime: Time;

        private intervalValue: number | null;

        public constructor();
        public constructor(speed: number);
        public constructor(speed?: number) {
            this.speed = 1.44;
            if (speed !== undefined)
                this.speed = speed;
            
            this.startTime = null;
            this.passedTime = 0;

            this.intervalValue = null;
        }

        public start(): void {
            this.startTime = new Date().getTime();
            this.passedTime = 0;
            this.startProc();
        }

        private isRunningProc(): boolean {
            return this.intervalValue !== null;
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
            this.run(this.passedTime);
        }

        private run(passedTime: Time): void {
            // Do Something;
        }

        public pause(): void {
            if (this.startTime === null)
                TimerError.startTimeIsNull();

            this.passedTime = new Date().getTime() - this.startTime;
            this.startTime = null;

            this.stopProc();
        }

        public restart(): void {
            this.startTime = new Date().getTime() - this.passedTime;
            this.startProc();
        }

        public stop(): void {
            this.startTime = null;
            this.passedTime = 0;
            this.stopProc();
        }

        public skip(time: Time): void {
            this.startTime = new Date().getTime() - time;
            this.passedTime = time;
        }
    }

    export class TimerError extends Error {
        static InvalidTimeString(str: string): never {
            throw new TimerError(`${str}은 시간을 나타내는 문자열이 아닙니다.`);
        }

        static noRunningTimer(): never {
            throw new TimerError("타이머가 실행중이지 않습니다.");
        }

        static startTimeIsNull(): never {
            throw new TimerError(`startTime이 null인 상태로 기능을 수행할 수 없습니다.`);
        }
    }
}