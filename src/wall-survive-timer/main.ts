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

    export class TimerTask {
        private type: EnemyType;

        private timeline: EventData[];
        private idx: number;

        public constructor(type: EnemyType, timeline: RawEventData[]) {
            this.type = type;

            this.timeline = timeline.map((x) => TimerTask.convertToEventData(x));
            this.timeline.sort((a, b) => a[0] - b[0]);

            this.idx = 0;
        }

        private static convertToEventData(raw: RawEventData): EventData {
            return [TimeConverter.str2num(raw[0]), raw[1]];
        }

        public getEnemyType(): EnemyType {
            return this.type;
        }

        public getEventTime(): GameTime | null {
            if (!(this.idx < this.timeline.length))
                return null;
            return this.timeline[this.idx][0];
        }

        public getEventName(): string | null {
            if (!(this.idx < this.timeline.length))
                return null;
            return this.timeline[this.idx][1];
        }

        public getNextEventTime(): GameTime | null {
            if (!(this.idx + 1 < this.timeline.length))
                return null;
            return this.timeline[this.idx + 1][0];
        }

        public getNextEventName(): string | null {
            if (!(this.idx + 1 < this.timeline.length))
                return null;
            return this.timeline[this.idx + 1][1];
        }

        public pop(): boolean {
            if (!(this.idx < this.timeline.length))
                return false;

            this.idx++;
            return true;
        }

        public clear(): void {
            this.idx = 0;
        }

        public sync(time: GameTime): void {
            this.clear();

            let s = 0, e = this.timeline.length, m = 0;
            while (s < e) {
                m = Math.floor((s + e) / 2);

                if (this.timeline[m][0] < time)
                    s = m + 1;
                else
                    e = m;
            }

            this.idx = e;
        }
    }

    export class TimerTaskManager {
        // TODO : TimerTask 들의 순서를 관리하고, 출력을 위탁하는 형태로 구성 
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

export namespace DataStructure {
    export class Heap<Key, Data> {
        private value: [Key, Data][];

        public constructor() {
            this.value = [];
        }

        public topKey(): Key | null {
            if (!(0 < this.value.length))
                return null;
            return this.value[0][0];
        }

        public topData(): Data | null {
            if (!(0 < this.value.length))
                return null;
            return this.value[0][1];
        }

        public push(key: Key, data: Data): void {
            let here = this.value.length;

            this.value.push([key, data]);
            while (true) {
                this.swapMinimum(here);
                if (here == 0)
                    break;
                here = Math.floor((here - 1) / 2);
            }
        }

        public pop(): boolean {
            if (this.value.length == 0)
                return false;

            if (this.value.length == 1) {
                this.value.pop();
                return true;
            }

            this.value[0] = this.value.pop()!;
            let here = 0, pre = 0;
            while (true) {
                here = this.swapMinimum(here);
                if (here == pre)
                    break;
                pre = here;
            }
            return true;
        }

        private swapMinimum(here: number): number {
            let retval = here;

            for (const idx of [2 * here + 1, 2 * here + 2]) {
                if (idx < this.value.length && this.value[here][0] > this.value[idx][0]) {
                    this.swap(here, idx);
                    retval = idx;
                }
            }

            return retval;
        }

        private swap(a: number, b: number): void {
            const temp = this.value[a];
            this.value[a] = this.value[b];
            this.value[b] = temp;
        }
    }
}