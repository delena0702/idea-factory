export namespace FastTextReader {
    export enum LongWordProcessMethod {
        SHOW_LONG_TIME = 0,
        SPLIT = 1,
    }

    export class Config {
        public speed: number;
        public wordMaximumLength: number;
        public longWordProcessMethod: LongWordProcessMethod;

        public constructor() {
            this.speed = 40;
            this.wordMaximumLength = 20;
            this.longWordProcessMethod = LongWordProcessMethod.SHOW_LONG_TIME;
        }

        public static getDefault(): Config {
            return new Config();
        }
    }

    interface Configable {
        setConfig(config: Config): void;
    }

    export class TextReader implements Configable {
        private textData: TextData;
        private config: Config;

        public constructor() {
            this.config = Config.getDefault();

            this.textData = new TextData();

            this.setConfig(this.config);
        }

        public setText(text: string): void {
            this.textData.setText(text);
            console.log(`<= ${this.textData} (setText)`);
        }

        public setConfig(config: Config): void {
            this.textData.setConfig(config);
        }

        public start(): void {
            console.log(`<= (start)`);
        }

        public restart(): void {
            console.log(`<= (restart)`);
        }

        public pause(): void {
            console.log(`<= (pause)`);
        }

        public skip(time: number): void {
            this.textData.move(time);
            console.log(`<= ${time} (skip)`);
        }

        public proc(): void {
            this.textData.next();
        }

        private displayWord(word: string): void {
            const text: string = this.textData.get();
            console.log(word, 'TextReader.displayWord');
        }
    }

    export class TextSpliter {
        static split(text: string, maxLength?: number): string[] {
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

    export class TextData implements Configable {
        private text: string | null;
        private config: Config;

        private processResult: string[] | null;
        private cursor: number;

        public constructor() {
            this.text = null;
            this.config = Config.getDefault();

            this.processResult = [];
            this.cursor = 0;
        }

        public setText(text: string): void {
            this.text = text;
            this.process();
        }

        public setConfig(config: Config): void {
            this.config = config;
            this.process();
        }

        private process(): void {
            if (this.text === null)
                return;

            if (this.config.longWordProcessMethod == LongWordProcessMethod.SPLIT)
                this.processResult = TextSpliter.split(this.text, this.config.wordMaximumLength);
            else
                this.processResult = TextSpliter.split(this.text);
        }

        public isEnd(): boolean {
            if (this.processResult === null)
                TextData.noTextSet();
            return !(this.cursor < this.processResult.length);
        }

        public get(): string {
            if (this.processResult === null)
                TextData.noTextSet();
            if (this.isEnd())
                TextData.endOfData();
            return this.processResult[this.cursor];
        }

        public next(): void {
            if (this.processResult === null)
                TextData.noTextSet();
            this.cursor = Math.min(this.cursor + 1, this.processResult.length);
        }

        public move(idx: number): void {
            if (this.processResult === null)
                TextData.noTextSet();
            if (!(0 <= idx && idx <= this.processResult.length))
                TextData.invalidIndex(idx, this.processResult.length);
            this.cursor = idx;
        }

        public static noTextSet(): never {
            throw new Error(`${this.name} : 텍스트가 설정되지 않았습니다.`);
        }

        public static endOfData(): never {
            throw new Error(`${this.name} : 데이터의 끝을 읽고 있습니다.`);
        }

        public static invalidIndex(idx: number, length: number): never {
            throw new Error(`${this.name} : ${idx}값이 구간 [0, ${length}]에 존재하지 않습니다.`);
        }
    }
}