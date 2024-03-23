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

    export class FastTextReaderError extends Error {
        static invalidIndex(): never {
            throw new FastTextReaderError(`올바르지 않은 index값 입니다.`);
        }
    }
}