export namespace FastTextReader {
    export enum LongWordProcessMethod {
        SHOW_LONG_TIME = 0,
        SPLIT = 1,
    }

    export class Config {
        public speed: number;
        public wordMaximumLength: number;
        public longWordProcessMethod: LongWordProcessMethod;

        public constructor();
        public constructor(config: Config);
        public constructor(config?: Config) {
            if (config === undefined) {
                this.speed = 40;
                this.wordMaximumLength = 20;
                this.longWordProcessMethod = LongWordProcessMethod.SHOW_LONG_TIME;
                return;
            }

            this.speed = config.speed;
            this.wordMaximumLength = config.wordMaximumLength;
            this.longWordProcessMethod = config.longWordProcessMethod;
        }

        public static getDefault(): Config {
            return new Config();
        }
    }

    interface Configable {
        setConfig(config: Config): void;
    }

    export class TextSpliter {
        public static split(text: string, maxLength?: number): string[] {
            if (maxLength === undefined)
                return text.split(/\s+/);

            const result = text.split(/\s+/);
            const retval = [];
            for (const string of result)
                for (let i = 0; i < string.length; i += maxLength)
                    retval.push(string.substring(i, i + maxLength));
            return retval;
        }
    }

    export class TextProcessor implements Configable {
        private text: string;
        private words: string[];

        private config: Config;

        public constructor() {
            this.text = '';
            this.words = [];

            this.config = Config.getDefault();
        }

        public setText(text: typeof this.text) {
            this.text = text;
            this.process();
        }

        public setConfig(config: Config): void {
            this.config = new Config(config);
            this.process();
        }

        private process(): void {
            if (this.config.longWordProcessMethod == LongWordProcessMethod.SPLIT) {
                this.words = TextSpliter.split(this.text, this.config.wordMaximumLength);
                return;
            }

            this.words = TextSpliter.split(this.text);
        }

        public getLength(): number {
            return this.words.length;
        }

        public get(idx: number): string {
            if (!(0 <= idx && idx < this.getLength()))
                FastTextReaderError.invalidIndex();
            return this.words[idx];
        }
    }

    export class Timer implements Configable {
        private tic: number;
        private endTic: number;
        private proc: (tic: number) => void;

        private interval: number | null;

        private config: Config;

        constructor() {
            this.tic = 0;
            this.endTic = 0;
            this.proc = () => { };

            this.interval = null;

            this.config = Config.getDefault();
        }

        public setEndTic(endTic: typeof this.endTic) {
            this.endTic = endTic;
        }

        public setProc(callback: typeof this.proc) {
            this.proc = callback;
        }

        public setConfig(config: Config): void {
            this.config = new Config(config);
        }

        public start(): void {
            if (this.interval !== null)
                FastTextReaderError.invalidTimerMethodError();

            this.tic = 0;
            this.resume();
        }

        public resume(): void {
            if (this.interval !== null)
                FastTextReaderError.invalidTimerMethodError();

            const delay = Math.round(60000 / this.config.speed);
            this.runProc();
            this.interval = setInterval(() => {
                this.runProc();
            }, delay);
        }

        public stop(): void {
            this.pause();
            this.tic = 0;
        }

        public pause(): void {
            if (this.interval === null)
                FastTextReaderError.invalidTimerMethodError();

            clearInterval(this.interval);
            this.interval = null;
        }

        private runProc(): void {
            if (this.tic == this.endTic) {
                this.stop();
                return;
            }

            this.proc(this.tic);
            this.tic++;
        }

        public toggle(): void {

        }

        public skip(tic: number): void {
            if (!(0 <= tic && tic < this.endTic))
                throw FastTextReaderError.invalidTimerMethodError();
            this.tic = tic;
        }
    }

    export class FastTextReaderError extends Error {
        static invalidIndex(): never {
            throw new this(`올바르지 않은 index값 입니다.`);
        }

        static invalidTimerMethodError(): never {
            throw new this(`올바르지 않은 timer 접근입니다.`);
        }
    }
}