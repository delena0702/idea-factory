namespace WallSurviveTimerView {
    interface TimeSyncable {
        syncTime(time: number): void;
        setStartEndTime(startTime: number, endTime: number): void;
    }

    type MarkType = 0 | 1 | 2;

    export class TimelineViewBinder implements TimeSyncable {
        static readonly WARNING = 0;
        static readonly PREDICT = 1;
        static readonly BOSS = 2;

        static readonly KEYS: { [key: string]: string } = {
            START_TIME: 'start-time',
            END_TIME: 'end-time',
            PROGRESS_BAR: 'progress-bar',
            UP_MARK_BAR: 'up-mark-bar',
            DOWN_MARK_BAR: 'down-mark-bar',

            UP_MARK: 'template-up-mark',
            DOWN_MARK: 'template-down-mark',
        };

        parent: HTMLElement;
        domCollection: { [key: string]: HTMLElement };
        
        time: number;
        startTime: number;
        endTime: number;

        constructor(view: HTMLElement) {
            this.parent = view;
            this.domCollection = {};
            for (const key in TimelineViewBinder.KEYS)
                this.addDOM(TimelineViewBinder.KEYS[key]);

            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;
            this.setStartEndTime(this.startTime, this.endTime);
        }

        addDOM(id: string): void {
            const element = this.parent.querySelector(`#${id}`);
            if (element === null)
                throw `ERROR : id가 ${id}인 Element가 없습니다.`;
            element.id = "";
            if (id.startsWith('template'))
                element.parentElement?.removeChild(element);
            this.domCollection[id] = element as HTMLElement;
        }

        getDOM(id: string, clone?: boolean): HTMLElement {
            if (clone)
                return this.domCollection[id].cloneNode(true) as HTMLElement;
            return this.domCollection[id];
        }

        syncTime(time: number): void {
            this.setTime(time);
        }

        setTime(time: number): void {
            const { PROGRESS_BAR } = TimelineViewBinder.KEYS;

            this.time = time;
            const progressBar = this.getDOM(PROGRESS_BAR);
            progressBar.style.width = `${this.getRatio(time)}%`;
        }

        getRatio(time:number): number {
            if (!(this.startTime <= time && time <= this.endTime))
                throw `ERROR : ${time}이 구간 [${this.startTime} : ${this.endTime}]에 존재하지 않습니다.`;
            return 100 * (time - this.startTime) / (this.endTime - this.startTime)
        }

        setStartEndTime(startTime: number, endTime: number): void {
            const { START_TIME, END_TIME } = TimelineViewBinder.KEYS;

            this.startTime = startTime;
            this.endTime = endTime;

            const startTimeDOM = this.getDOM(START_TIME);
            startTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(startTime);

            const endTimeDOM = this.getDOM(END_TIME);
            endTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(endTime);
        }

        setEnemyInfo(info: [number, MarkType][]): void {
            for (const [time, markType] of info)
                this.setMark(time, markType);
        }

        setMark(time: number, markType: MarkType): void {
            const { UP_MARK, DOWN_MARK, UP_MARK_BAR, DOWN_MARK_BAR } = TimelineViewBinder.KEYS;

            if (markType == TimelineViewBinder.PREDICT) {
                const element = this.getDOM(UP_MARK, true);
                element.style.left = `${this.getRatio(time)}%`;
                element.children[0].setAttribute('fill', '#4BE3BF');
                this.getDOM(UP_MARK_BAR).appendChild(element);
            }

            else {
                const element = this.getDOM(DOWN_MARK, true);
                element.style.left = `${this.getRatio(time)}%`;
                if (markType == TimelineViewBinder.WARNING)
                    element.children[0].setAttribute('fill', '#F6B610');
                else
                    element.children[0].setAttribute('fill', '#E42D2D');
                this.getDOM(DOWN_MARK_BAR).appendChild(element);
            }
        }
    }

    export class TimePanelViewBinder implements TimeSyncable {
        static readonly KEYS: { [key: string]: string } = {
            OUTPUT_TIME: "output-time",
            BTN_1: "btn-1",
            BTN_2: "btn-2",
            BTN_3: "btn-3",
            BTN_4: "btn-4",
            INPUT_TIME: "input-time",
            BTN_SKIP: "btn-skip",
        };

        parent: HTMLElement;
        domCollection: { [key: string]: HTMLElement };
        
        updateListener: (time: number) => void;

        time: number;
        startTime: number;
        endTime: number;

        constructor(view: HTMLElement) {
            this.parent = view;
            this.domCollection = {};
            for (const key in TimePanelViewBinder.KEYS)
                this.addDOM(TimePanelViewBinder.KEYS[key]);

            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;

            this.updateListener = () => { };

            this.initListener();
        }

        addDOM(id: string): void {
            const element = this.parent.querySelector(`#${id}`);
            if (element === null)
                throw `ERROR : id가 ${id}인 Element가 없습니다.`;
            element.id = "";
            this.domCollection[id] = element as HTMLElement;
        }

        getDOM(id: string, clone?: boolean): HTMLElement {
            if (clone)
                return this.domCollection[id].cloneNode(true) as HTMLElement;
            return this.domCollection[id];
        }

        initListener(): void {
            const { BTN_1, BTN_2, BTN_3, BTN_4, BTN_SKIP } = TimePanelViewBinder.KEYS;

            this.getDOM(BTN_1).onclick = () => { this.addTime(-10000); };
            this.getDOM(BTN_2).onclick = () => { this.addTime(-1000); };
            this.getDOM(BTN_3).onclick = () => { this.addTime(1000); };
            this.getDOM(BTN_4).onclick = () => { this.addTime(10000); };

            const binder = this;
            this.getDOM(BTN_SKIP).onclick = () => {
                binder.setTimeWithSkip();
            };
        }

        syncTime(time: number): void {
            const { OUTPUT_TIME } = TimePanelViewBinder.KEYS;

            this.time = time;

            this.getDOM(OUTPUT_TIME).textContent = WallSurviveTimer.TimeConverter.num2str(time);
        }

        update(): void {
            this.updateListener(this.time);
        }

        setUpdateListener(callback: (time: number) => void): void {
            this.updateListener = callback;
        }

        setStartEndTime(startTime: number, endTime: number): void {
            this.startTime = startTime;
            this.endTime = endTime;
        }

        setTime(time: number): void {
            if (!(this.startTime <= time && time <= this.endTime))
                throw `ERROR : ${time}이 구간 [${this.startTime} : ${this.endTime}]에 존재하지 않습니다.`;

            this.time = time;
            
            this.update();
        }

        addTime(diffTime: number): void {
            this.time += diffTime;
            this.time = Math.max(this.startTime, Math.min(this.endTime, this.time));

            this.update();
        }

        setTimeWithSkip(): void {
            const { INPUT_TIME } = TimePanelViewBinder.KEYS;

            const str = (this.getDOM(INPUT_TIME) as HTMLInputElement).value.trim();
            const time = WallSurviveTimer.TimeConverter.str2num(str);
            this.setTime(time);
        }
    }

    export class ScheduleRowViewBinder {

    }
}