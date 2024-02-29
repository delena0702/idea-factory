namespace WallSurviveTimerView {
    interface TimeSyncable {
        syncTime(time: number): void;
        setStartEndTime(startTime: number, endTime: number): void;
    }

    class DOMManager {
        private parent: HTMLElement;
        private domCollection: { [key: string]: HTMLElement };

        constructor (element: HTMLElement) {
            this.parent = element;
            this.domCollection = {};
        }

        addDOMs(keyMapper: { [key: string]: string }): void {
            for (const key in keyMapper)
                this.addDOM(keyMapper[key]);
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

        getDOM(id: string): HTMLElement {
            return this.domCollection[id];
        }

        cloneDOM(id: string): HTMLElement {
            return this.domCollection[id].cloneNode(true) as HTMLElement;
        }
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
        domManager: DOMManager;
        
        time: number;
        startTime: number;
        endTime: number;

        constructor(view: HTMLElement) {
            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(TimelineViewBinder.KEYS);

            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;
            this.setStartEndTime(this.startTime, this.endTime);
        }

        syncTime(time: number): void {
            this.setTime(time);
        }

        setTime(time: number): void {
            const { PROGRESS_BAR } = TimelineViewBinder.KEYS;

            this.time = time;
            const progressBar = this.domManager.getDOM(PROGRESS_BAR);
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

            const startTimeDOM = this.domManager.getDOM(START_TIME);
            startTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(startTime);

            const endTimeDOM = this.domManager.getDOM(END_TIME);
            endTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(endTime);
        }

        setEnemyInfo(info: [number, MarkType][]): void {
            for (const [time, markType] of info)
                this.setMark(time, markType);
        }

        setMark(time: number, markType: MarkType): void {
            const { UP_MARK, DOWN_MARK, UP_MARK_BAR, DOWN_MARK_BAR } = TimelineViewBinder.KEYS;

            if (markType == TimelineViewBinder.PREDICT) {
                const element = this.domManager.cloneDOM(UP_MARK);
                element.style.left = `${this.getRatio(time)}%`;
                element.children[0].setAttribute('fill', '#4BE3BF');
                this.domManager.getDOM(UP_MARK_BAR).appendChild(element);
            }

            else {
                const element = this.domManager.cloneDOM(DOWN_MARK);
                element.style.left = `${this.getRatio(time)}%`;
                if (markType == TimelineViewBinder.WARNING)
                    element.children[0].setAttribute('fill', '#F6B610');
                else
                    element.children[0].setAttribute('fill', '#E42D2D');
                this.domManager.getDOM(DOWN_MARK_BAR).appendChild(element);
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
        domManager: DOMManager;
        
        updateListener: (time: number) => void;

        time: number;
        startTime: number;
        endTime: number;

        constructor(view: HTMLElement) {
            this.parent = view;
            this.domManager = new DOMManager(view);
            this.domManager.addDOMs(TimePanelViewBinder.KEYS);

            this.time = 0;
            this.startTime = 0;
            this.endTime = 0;

            this.updateListener = () => { };

            this.initListener();
        }

        initListener(): void {
            const { BTN_1, BTN_2, BTN_3, BTN_4, BTN_SKIP } = TimePanelViewBinder.KEYS;

            this.domManager.getDOM(BTN_1).onclick = () => { this.addTime(-10000); };
            this.domManager.getDOM(BTN_2).onclick = () => { this.addTime(-1000); };
            this.domManager.getDOM(BTN_3).onclick = () => { this.addTime(1000); };
            this.domManager.getDOM(BTN_4).onclick = () => { this.addTime(10000); };

            const binder = this;
            this.domManager.getDOM(BTN_SKIP).onclick = () => {
                binder.setTimeWithSkip();
            };
        }

        syncTime(time: number): void {
            const { OUTPUT_TIME } = TimePanelViewBinder.KEYS;

            this.time = time;

            this.domManager.getDOM(OUTPUT_TIME).textContent = WallSurviveTimer.TimeConverter.num2str(time);
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

            const inputElement = (this.domManager.getDOM(INPUT_TIME) as HTMLInputElement);
            const str = inputElement.value.trim();
            const time = WallSurviveTimer.TimeConverter.str2num(str);
            this.setTime(time);
            inputElement.value = '';
        }
    }

    export class ScheduleRowViewBinder {

    }
}