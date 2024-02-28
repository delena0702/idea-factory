namespace WallSurviveTimerView {
    class ViewBinder {
    }

    type MarkType = 0 | 1 | 2;

    export class TimelineViewBinder extends ViewBinder {
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
        
        startTime: number
        endTime: number

        constructor(view: HTMLElement) {
            super();

            this.parent = view;
            this.domCollection = {};
            for (const key in TimelineViewBinder.KEYS)
                this.addDOM(TimelineViewBinder.KEYS[key]);

            this.startTime = 0;
            this.endTime = 0;
            this.setStartAndEndTime(this.startTime, this.endTime);
        }

        addDOM(id: string): void {
            const element = document.getElementById(id);
            if (element === null)
                throw 123123;
            this.domCollection[id] = element;
        }

        getDOM(id: string, clone?: boolean): HTMLElement {
            if (clone)
                return this.domCollection[id].cloneNode(true) as HTMLElement;
            return this.domCollection[id];
        }

        setStartAndEndTime(startTime: number, endTime: number): void {
            const { START_TIME, END_TIME } = TimelineViewBinder.KEYS;

            this.startTime = startTime;
            this.endTime = endTime;

            const startTimeDOM = this.getDOM(START_TIME);
            startTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(startTime);

            const endTimeDOM = this.getDOM(END_TIME);
            endTimeDOM.textContent = WallSurviveTimer.TimeConverter.num2str(endTime);
        }

        setTime(time: number): void {
            const { PROGRESS_BAR } = TimelineViewBinder.KEYS;


            const progressBar = this.getDOM(PROGRESS_BAR);
            progressBar.style.width = `${this.getRatio(time)}%`;
        }

        getRatio(time:number): number {
            if (this.endTime - this.startTime <= 0)
                throw 123123;
            return 100 * (time - this.startTime) / (this.endTime - this.startTime)
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
                this.getDOM(UP_MARK_BAR).appendChild(element);
            }

            else {
                const element = this.getDOM(DOWN_MARK, true);
                element.style.left = `${this.getRatio(time)}%`;
                this.getDOM(DOWN_MARK_BAR).appendChild(element);
            }
        }
    }

    export class TimePanelViewBinder extends ViewBinder {

    }

    export class ScheduleRowViewBinder extends ViewBinder {

    }
}