"use strict";
var WallSurviveTimer;
(function (WallSurviveTimer) {
    let EnemyType;
    (function (EnemyType) {
        EnemyType[EnemyType["WARNING"] = 0] = "WARNING";
        EnemyType[EnemyType["BOSS"] = 1] = "BOSS";
    })(EnemyType = WallSurviveTimer.EnemyType || (WallSurviveTimer.EnemyType = {}));
    class TimeConverter {
        static str2num(str) {
            try {
                const result = str.split(':').reduce((a, x) => a * 60 + parseInt(x), 0);
                if (isNaN(result))
                    return TimerError.InvalidTimeString(str);
                return result * 1000;
            }
            catch (e) {
                TimerError.InvalidTimeString(str);
            }
        }
        static num2str(num) {
            const arr = [0, 0, 0];
            num = Math.floor(num / 1000);
            arr[2] = num % 60;
            arr[1] = Math.floor(num % 3600 / 60);
            arr[0] = Math.floor(num / 3600);
            if (arr[0])
                return `${arr[0]}:${this.padZero(arr[1])}:${this.padZero(arr[2])}`;
            return `${arr[1]}:${this.padZero(arr[2])}`;
        }
        static diffNum2str(num) {
            if (num >= 0)
                return `+${this.num2str(num)}`;
            return `-${this.num2str(-num)}`;
        }
        static padZero(num) {
            return num.toString().padStart(2, '0');
        }
    }
    WallSurviveTimer.TimeConverter = TimeConverter;
    class EventDataStorage {
        static getRowData() {
            const retval = [];
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
    EventDataStorage.data = [
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
    class Timer {
        constructor(speed) {
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
            this.binder.setUpdateListener((time) => {
                timer.syncTime(time);
            });
            this.binder.setToggleListener(() => {
                if (timer.isPlay())
                    timer.pause();
                else
                    timer.restart();
            });
            this.syncTime(0);
        }
        start() {
            this.skip(0);
            this.startProc();
        }
        startProc() {
            this.intervalValue = setInterval(this.proc.bind(this), 100);
        }
        stopProc() {
            if (this.intervalValue === null)
                TimerError.noRunningTimer();
            clearInterval(this.intervalValue);
            this.intervalValue = null;
        }
        proc() {
            if (this.startTime === null)
                TimerError.startTimeIsNull();
            this.passedTime = new Date().getTime() - this.startTime;
            if (this.passedTime * this.speed >= Timer.endTime)
                this.pause();
            this.update();
        }
        update() {
            this.syncTime(this.passedTime * this.speed);
        }
        isPlay() {
            return this.intervalValue !== null;
        }
        pause() {
            if (this.startTime === null)
                TimerError.startTimeIsNull();
            this.stopProc();
            this.passedTime = Math.min(Timer.endTime / this.speed, new Date().getTime() - this.startTime);
            this.startTime = null;
            this.update();
        }
        restart() {
            this.skip(this.passedTime);
            this.startProc();
        }
        stop() {
            this.stopProc();
            this.startTime = null;
            this.passedTime = 0;
            this.update();
        }
        skip(time) {
            this.passedTime = time;
            this.update();
        }
        syncTime(time) {
            const realTime = time / this.speed;
            this.startTime = new Date().getTime() - realTime;
            this.passedTime = realTime;
            this.binder.syncTime(time);
        }
    }
    Timer.endTime = (1 * 3600 + 13 * 60 + 30) * 1000;
    WallSurviveTimer.Timer = Timer;
    class TimerError extends Error {
        static InvalidTimeString(str) {
            throw new TimerError(`${str}은 시간을 나타내는 문자열이 아닙니다.`);
        }
        static noRunningTimer() {
            throw new TimerError("타이머가 실행중이지 않습니다.");
        }
        static startTimeIsNull() {
            throw new TimerError(`startTime이 null인 상태로 기능을 수행할 수 없습니다.`);
        }
    }
    WallSurviveTimer.TimerError = TimerError;
})(WallSurviveTimer || (WallSurviveTimer = {}));
