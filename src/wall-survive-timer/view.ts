namespace WallSurviveTimerView {
    class DOMManager {
        private parent: HTMLElement;
        private domCollection: { [key: string]: HTMLElement };

        public constructor(element: HTMLElement) {
            this.parent = element;
            this.domCollection = {};
        }

        public addDOMs(keyMapper: { [key: string]: string }): void {
            for (const key in keyMapper)
                this.addDOM(keyMapper[key]);
        }

        public addDOM(id: string): boolean {
            const element = this.parent.querySelector(`#${id}`);
            if (element === null)
                return false;

            element.id = "";
            if (id.startsWith('template'))
                element.parentElement?.removeChild(element);
            this.domCollection[id] = element as HTMLElement;
            return true;
        }

        public getDOM(id: string): HTMLElement {
            return this.domCollection[id];
        }

        public cloneDOM(id: string): HTMLElement {
            return this.domCollection[id].cloneNode(true) as HTMLElement;
        }
    }

    enum TimelineMarkType {
        WARNING,
        // PREDICT,
        BOSS,
    }

    class TimelineViewBinder {
        static readonly KEYS: { [key: string]: string } = {
            START_TIME: 'start-time',
            END_TIME: 'end-time',
            PROGRESS_BAR: 'progress-bar',
            UP_MARK_BAR: 'up-mark-bar',
            DOWN_MARK_BAR: 'down-mark-bar',
            UP_MARK: 'template-up-mark',
            DOWN_MARK: 'template-down-mark',
        };

        private parent: HTMLElement;
        private domManager: DOMManager;

        private time: number;
        private startTime: number;
        private endTime: number;

        public constructor(view: HTMLElement) {
            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;

            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(TimelineViewBinder.KEYS);

            this.syncStartEndTime(this.startTime, this.endTime);
        }

        public syncTime(time: number): void {
            const { PROGRESS_BAR } = TimelineViewBinder.KEYS;

            this.time = time;

            const progressBar = this.domManager.getDOM(PROGRESS_BAR);
            progressBar.style.width = `${this.getRatio(time)}%`;
        }

        private getRatio(time: number): number {
            if (!(this.startTime <= time && time <= this.endTime))
                WallSurviveTimerViewError.invalidTime(time, this.startTime, this.endTime);
            if (this.startTime >= this.endTime)
                WallSurviveTimerViewError.invalidTimeRange(this.startTime, this.endTime);
            return 100 * (time - this.startTime) / (this.endTime - this.startTime);
        }

        public syncStartEndTime(startTime: number, endTime: number): void {
            const { START_TIME, END_TIME } = TimelineViewBinder.KEYS;

            this.startTime = startTime;
            this.endTime = endTime;

            const startTimeElement = this.domManager.getDOM(START_TIME);
            startTimeElement.textContent = WallSurviveTimer.TimeConverter.num2str(startTime);

            const endTimeElement = this.domManager.getDOM(END_TIME);
            endTimeElement.textContent = WallSurviveTimer.TimeConverter.num2str(endTime);
        }

        public setEnemyInfo(info: [number, TimelineMarkType][]): void {
            for (const [time, markType] of info)
                this.displayMark(time, markType);
        }

        private displayMark(time: number, markType: TimelineMarkType): void {
            const { UP_MARK, DOWN_MARK, UP_MARK_BAR, DOWN_MARK_BAR } = TimelineViewBinder.KEYS;

            if (markType == TimelineMarkType.BOSS) {
                const element = this.domManager.cloneDOM(UP_MARK);
                element.style.left = `calc(${this.getRatio(time)}% - 10px)`;
                element.children[0].setAttribute('fill', '#E42D2D');
                this.domManager.getDOM(UP_MARK_BAR).appendChild(element);
            }

            else {
                const element = this.domManager.cloneDOM(DOWN_MARK);
                element.style.left = `calc(${this.getRatio(time)}% - 10px)`;
                element.children[0].setAttribute('fill', '#F6B610');
                this.domManager.getDOM(DOWN_MARK_BAR).appendChild(element);
            }
        }
    }

    export class TimePanelViewBinder {
        static readonly KEYS: { [key: string]: string } = {
            OUTPUT_TIME: "output-time",
            BTN_1: "btn-1",
            BTN_2: "btn-2",
            BTN_3: "btn-3",
            BTN_4: "btn-4",
            INPUT_TIME: "input-time",
            BTN_SKIP: "btn-skip",
        };

        private time: number;
        private startTime: number;
        private endTime: number;

        private parent: HTMLElement;
        private domManager: DOMManager;

        private updateListener: (time: number) => void;

        public constructor(view: HTMLElement) {
            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;

            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(TimePanelViewBinder.KEYS);

            this.updateListener = () => { };
            this.initListener();
        }

        private initListener(): void {
            const { BTN_1, BTN_2, BTN_3, BTN_4, BTN_SKIP } = TimePanelViewBinder.KEYS;
            const binder = this;

            this.domManager.getDOM(BTN_1).onclick = () => { binder.addTime(-10000); };
            this.domManager.getDOM(BTN_2).onclick = () => { binder.addTime(-1000); };
            this.domManager.getDOM(BTN_3).onclick = () => { binder.addTime(1000); };
            this.domManager.getDOM(BTN_4).onclick = () => { binder.addTime(10000); };
            this.domManager.getDOM(BTN_SKIP).onclick = () => { binder.setTimeWithSkip(); };
        }

        public syncTime(time: number): void {
            const { OUTPUT_TIME } = TimePanelViewBinder.KEYS;

            this.time = time;

            this.domManager.getDOM(OUTPUT_TIME).textContent = WallSurviveTimer.TimeConverter.num2str(time);
        }

        private update(): void {
            this.updateListener(this.time);
        }

        public setUpdateListener(callback: (time: number) => void): void {
            this.updateListener = callback;
        }

        public setStartEndTime(startTime: number, endTime: number): void {
            this.startTime = startTime;
            this.endTime = endTime;
        }

        private setTime(time: number): void {
            this.time = Math.max(this.startTime, Math.min(this.endTime, time));
            this.time = time;

            this.update();
        }

        private addTime(diffTime: number): void {
            this.setTime(this.time + diffTime);
        }

        private setTimeWithSkip(): void {
            const { INPUT_TIME } = TimePanelViewBinder.KEYS;

            const inputElement = (this.domManager.getDOM(INPUT_TIME) as HTMLInputElement);
            const str = inputElement.value.trim();
            const time = WallSurviveTimer.TimeConverter.str2num(str);
            inputElement.value = '';

            this.setTime(time);
        }
    }

    export enum ScheduleRowMode {
        PREDICT_NO_SELECT = 'PREDICT_NO_SELECT',
        PREDICT_SELECT = 'PREDICT_SELECT',
        BOSS_NO_SELECT = 'BOSS_NO_SELECT',
        BOSS_SELECT = 'BOSS_SELECT',
        BOSS_ONE = 'BOSS_ONE',
        WARNING = 'WARNING',
    }

    type ScheduleRowInfo = [string, string, string[]][];
    type ScheduleTime = [number, number, number];

    export class ScheduleRowViewBinder {
        static readonly KEYS = {
            PREDICT_NO_SELECT: 'template-predict-no-select',
            PREDICT_SELECT: 'template-predict-select',
            BOSS_NO_SELECT: 'template-boss-no-select',
            BOSS_SELECT: 'template-boss-select',
            BOSS_ONE: 'template-boss-one',
            WARNING: 'template-warning',
        };

        static readonly ROW_KEYS = {
            TEXT_TIME: 'text-time',
            TEXT_TIME_REMAIN: 'text-time-remain',
            TEXT_REMAIN_SUPPLY: 'text-remain-supply',
            TEXT_1_MAIN: 'text-1-main',
            TEXT_1_PREDICT: 'text-1-predict',
            TEXT_2_MAIN: 'text-2-main',
            TEXT_2_PREDICT: 'text-2-predict',
            SELECT_1: 'select-1',
            SELECT_2: 'select-2',
            SELECT_CHANGE: 'select-change',
            TAG_1_CONTAINER: 'tag-1-container',
            TAG_2_CONTAINER: 'tag-2-container',
            TAG: 'template-tag',
        };

        private time: number;
        private targetTime: ScheduleTime;
        private info: ScheduleRowInfo;

        private mode: ScheduleRowMode;
        private selected: number;
        private display: boolean;

        private parent: HTMLElement;
        private row: HTMLElement;
        private domManager: DOMManager;
        private rowDomManager: DOMManager;

        public constructor(view: HTMLElement) {
            this.info = [
                ['', '', []],
                ['', '', []],
            ];

            this.time = 0;
            this.targetTime = [0, 0, 0];

            this.mode = ScheduleRowMode.WARNING;
            this.selected = 0;

            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(ScheduleRowViewBinder.KEYS);

            this.row = this.domManager.getDOM(ScheduleRowViewBinder.KEYS.WARNING);
            this.rowDomManager = new DOMManager(this.row);
            this.rowDomManager.addDOMs(ScheduleRowViewBinder.ROW_KEYS);

            this.parent.appendChild(this.row);

            this.display = true;
            this.setDisplay(false);

            this.initListener();
        }

        private initListener(): void {
            const binder = this;

            try {
                this.rowDomManager.getDOM(ScheduleRowViewBinder.ROW_KEYS.SELECT_1).onclick = () => {
                    binder.selected = 1;
                    binder.setMode(ScheduleRowMode.PREDICT_SELECT);
                };
            } catch (e) { }

            try {
                this.rowDomManager.getDOM(ScheduleRowViewBinder.ROW_KEYS.SELECT_2).onclick = () => {
                    binder.selected = 2;
                    binder.setMode(ScheduleRowMode.PREDICT_SELECT);
                };
            } catch (e) { }

            try {
                this.rowDomManager.getDOM(ScheduleRowViewBinder.ROW_KEYS.SELECT_CHANGE).onclick = () => {
                    binder.selected = (binder.selected == 2) ? 1 : 2;
                    binder.setMode(ScheduleRowMode.PREDICT_SELECT);
                };
            } catch (e) { }
        }

        public syncTime(time: number): void {
            this.time = time;

            const { TEXT_TIME, TEXT_TIME_REMAIN, TEXT_REMAIN_SUPPLY } = ScheduleRowViewBinder.ROW_KEYS;
            const binder = this;

            this.syncDisplay();

            try {
                const element = binder.rowDomManager.getDOM(TEXT_TIME);
                element.textContent = WallSurviveTimer.TimeConverter.num2str(binder.targetTime[1]);
            } catch (e) { }

            try {
                const element = binder.rowDomManager.getDOM(TEXT_TIME_REMAIN);
                element.textContent = `(${WallSurviveTimer.TimeConverter.diffNum2str(binder.time - binder.targetTime[1])})`;
            } catch (e) { }

            try {
                const element = binder.rowDomManager.getDOM(TEXT_REMAIN_SUPPLY);
                element.textContent = `${Math.floor((binder.targetTime[1] - binder.time) / (30 * 1000))}`;
            } catch (e) { }
        }

        private syncDisplay(): void {
            if (this.time < this.targetTime[0] || this.time > this.targetTime[2]) {
                if (this.isDisplay())
                    this.setDisplay(false);
                return;
            }

            if (!this.isDisplay())
                this.setDisplay(true);

            if (this.time >= this.targetTime[1]) {
                if (this.mode == ScheduleRowMode.PREDICT_NO_SELECT)
                    this.setMode(ScheduleRowMode.BOSS_NO_SELECT);
                if (this.mode == ScheduleRowMode.PREDICT_SELECT)
                    this.setMode(ScheduleRowMode.BOSS_SELECT);
            }
            else {
                if (this.mode == ScheduleRowMode.BOSS_NO_SELECT)
                    this.setMode(ScheduleRowMode.PREDICT_NO_SELECT);
                if (this.mode == ScheduleRowMode.BOSS_SELECT)
                    this.setMode(ScheduleRowMode.PREDICT_SELECT);
            }
        }

        private isDisplay(): boolean {
            return this.display;
        }

        private setDisplay(flag: boolean): void {
            this.display = flag;

            if (flag)
                this.parent.style.display = 'block';
            else
                this.parent.style.display = 'none';
        }

        private syncInfo(): void {
            const { TEXT_1_MAIN, TEXT_1_PREDICT, TEXT_2_MAIN, TEXT_2_PREDICT, TAG_1_CONTAINER, TAG_2_CONTAINER, TAG } = ScheduleRowViewBinder.ROW_KEYS;
            const main = (this.selected != 2) ? 0 : 1, sub = (this.selected != 2) ? 1 : 0;

            try {
                const element = this.rowDomManager.getDOM(TEXT_1_MAIN);
                element.textContent = this.info[main][0];
            } catch (e) { }

            try {
                const element = this.rowDomManager.getDOM(TEXT_1_PREDICT);
                element.textContent = this.info[main][1];
            } catch (e) { }

            try {
                const element = this.rowDomManager.getDOM(TEXT_2_MAIN);
                element.textContent = this.info[sub][0];
            } catch (e) { }

            try {
                const element = this.rowDomManager.getDOM(TEXT_2_PREDICT);
                element.textContent = this.info[sub][1];
            } catch (e) { }

            try {
                const element = this.rowDomManager.getDOM(TAG_1_CONTAINER);
                
                for (const tagName of this.info[main][2]) {
                    const tagElement = this.rowDomManager.cloneDOM(TAG);
                    tagElement.textContent = tagName;
                    element.appendChild(tagElement);
                }
            } catch (e) { }

            try {
                const element = this.rowDomManager.getDOM(TAG_2_CONTAINER);
                
                for (const tagName of this.info[sub][2]) {
                    const tagElement = this.rowDomManager.cloneDOM(TAG);
                    tagElement.textContent = tagName;
                    element.appendChild(tagElement);
                }
            } catch (e) { }
        }

        public setMode(mode: ScheduleRowMode): void {
            this.mode = mode;

            this.parent.removeChild(this.row);

            this.row = this.domManager.cloneDOM(ScheduleRowViewBinder.KEYS[mode]);
            this.rowDomManager = new DOMManager(this.row);
            this.rowDomManager.addDOMs(ScheduleRowViewBinder.ROW_KEYS);

            this.parent.appendChild(this.row);

            this.syncTime(this.time);
            this.syncInfo();

            this.initListener();
        }

        public setInfo(targetTime: ScheduleTime, info: ScheduleRowInfo): void {
            this.targetTime = targetTime;
            this.info = info;

            this.syncInfo();
        }
    }

    export type ScheduleRowData = [
        WallSurviveTimer.EnemyType,
        ScheduleTime,
        ScheduleRowInfo
    ];

    class ScheduleTableViewBinder {
        static readonly KEYS = {
            SCHEDULE_ROW: 'template-schedule-row',
        };

        private time: number;

        private parent: HTMLElement;
        private domManager: DOMManager;

        private rows: ScheduleRowViewBinder[];

        public constructor(view: HTMLElement) {
            this.time = 0;
            this.rows = [];

            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(ScheduleTableViewBinder.KEYS);
        }

        public syncTime(time: number): void {
            this.time = time;

            for (const row of this.rows) {
                row.syncTime(time);
            }
        }

        public addRowFromData(data: ScheduleRowData[]) {
            const { SCHEDULE_ROW } = ScheduleTableViewBinder.KEYS;

            data.sort((a, b) => a[1][1] - b[1][1]);

            for (const [type, times, info] of data) {
                const rowElement = this.domManager.cloneDOM(SCHEDULE_ROW);
                this.parent.appendChild(rowElement);

                const rowBinder = new ScheduleRowViewBinder(rowElement);

                rowBinder.setInfo(times, info);
                if (type == WallSurviveTimer.EnemyType.WARNING)
                    rowBinder.setMode(ScheduleRowMode.WARNING);
                else if (info.length == 1)
                    rowBinder.setMode(ScheduleRowMode.BOSS_ONE);
                else
                    rowBinder.setMode(ScheduleRowMode.PREDICT_NO_SELECT);
                this.addRow(rowBinder);
            }

            this.syncTime(this.time);
        }

        private addRow(rowBinder: ScheduleRowViewBinder) {
            this.rows.push(rowBinder);
        }
    }

    export class TimerViewBinder {
        static readonly KEYS = {
            TIMELINE: 'timeline',
            TIME_PANEL: 'time-panel',
            SCHEDULE_TABLE: 'schedule-table',
        };

        private time: number;
        private startTime: number;
        private endTime: number;

        private parent: HTMLElement;
        private domManager: DOMManager;

        private timelineBinder: TimelineViewBinder;
        private timePanelBinder: TimePanelViewBinder;
        private scheduleBinder: ScheduleTableViewBinder;

        public constructor(view: HTMLElement) {
            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;

            this.parent = view
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(TimerViewBinder.KEYS);

            this.timelineBinder = new TimelineViewBinder(this.domManager.getDOM(TimerViewBinder.KEYS.TIMELINE));
            this.timePanelBinder = new TimePanelViewBinder(this.domManager.getDOM(TimerViewBinder.KEYS.TIME_PANEL));
            this.scheduleBinder = new ScheduleTableViewBinder(this.domManager.getDOM(TimerViewBinder.KEYS.SCHEDULE_TABLE));
        }

        public syncTime(time: number): void {
            this.timelineBinder.syncTime(time);
            this.timePanelBinder.syncTime(time);
            this.scheduleBinder.syncTime(time);
        }

        public setUpdateListener(callback: (time: number) => void): void {
            this.timePanelBinder.setUpdateListener(callback);
        }

        public setStartEndTime(startTime: number, endTime: number): void {
            this.startTime = startTime;
            this.endTime = endTime;

            this.timelineBinder.syncStartEndTime(startTime, endTime);
            this.timePanelBinder.setStartEndTime(startTime, endTime);
        }

        public addRowFromData(data: ScheduleRowData[]) {
            this.scheduleBinder.addRowFromData(data);

            const timelineInfo: [number, TimelineMarkType][] = [];
            for (const [type, times, _] of data) {
                if (type == WallSurviveTimer.EnemyType.WARNING)
                    timelineInfo.push([times[1], TimelineMarkType.WARNING]);
                else
                    timelineInfo.push([times[1], TimelineMarkType.BOSS]);
            }

            this.timelineBinder.setEnemyInfo(timelineInfo);
        }
    }

    class WallSurviveTimerViewError extends Error {
        static invalidTime(time: number, startTime: number, endTime: number): never {
            throw new WallSurviveTimerViewError(`TimelineViewBinder : ${time}이 구간 [${startTime} : ${endTime}]에 존재하지 않습니다.`);
        }
        static invalidTimeRange(startTime: number, endTime: number) {
            throw new WallSurviveTimerViewError(`TimelineViewBinder : 시작 시간(${startTime})이 종료 시간(${endTime})보다 큽니다.`);
        }
    }
}