export namespace FastTextReader {
    enum LongWordProcessMethod {

    }

    export class TextReader {
        public constructor() {

        }

        public setText(text: string): void {
            console.log(`<= ${text} (setText)`);
        }

        public setWordMaximumLength(length: number): void {
            console.log(`<= ${length} (setWordMaximumLength)`);
        }

        public setLongWordProcessMethod(mode: LongWordProcessMethod): void {
            console.log(`<= ${mode} (setLongWordProcessMethod)`);
        }

        public setSpeed(speed: number): void {
            console.log(`<= ${speed} (setSpeed)`);
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
            console.log(`<= ${time} (skip)`);
        }

        private displayWord(word: string): void {
            console.log(word, 'TextReader.displayWord');
        }
    }
}