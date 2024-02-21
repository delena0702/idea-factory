namespace Hexa2048 {
    export enum Direction {
        UP_RIGHT,
        RIGHT,
        DOWN_RIGHT,
        DOWN_LEFT,
        LEFT,
        UP_LEFT
    }

    export class Game {
        static readonly SIZE = 3;

        private board: Board;

        constructor() {
            this.board = new Board(Game.SIZE);

            this.init();
        }

        init(): void {
            this.board = new Board(Game.SIZE);
        }

        move(direction: Direction): boolean {
            if (!this.board.move(direction))
                return false;

            this.board.makeRandomCell();
            return true;
        }

        undo(): boolean {
            throw new Error(`TODO`);
        }

        reset(): void {
            throw new Error(`TODO`);
        }

        show(): void {
            this.board.show();
        }
    }

    class Board {
        static readonly INVALID_CELL = -1;
        private size: number;
        private value: number[][];

        constructor(size: number) {
            Validator.validatePositiveInteger(size);

            this.size = size;
            this.value = [[]];

            this.initBoard(size);
        }

        private initBoard(size: number): void {
            const N = this.getBoardSize();
            this.value = new Array(N).fill(0).map((_, i) =>
                new Array(N).fill(0).map((_, j) =>
                    (-size < i - j && i - j < size) ? 0 : Board.INVALID_CELL
                )
            );
            this.makeRandomCell();
        }

        public makeRandomCell(): boolean {
            try {
                const [x, y] = this.getRandomPosition();
                const cellNumber = Board.getRandomCellNumber();
                this.value[y][x] = cellNumber;

                return true;
            }
            catch (e) {
                if (e instanceof GameError)
                    return false;
                throw e;
            }
        }

        public show(): void {
            console.log(JSON.parse(JSON.stringify(this.value)));
        }

        private getRandomPosition(): [number, number] {
            const cells = this.getEmptyCells();
            cells.sort(() => Math.random() - 0.5);

            if (cells.length == 0)
                throw GameError.noEmptyCell();
            return cells[0];
        }

        private getEmptyCells(): [number, number][] {
            const N = this.getBoardSize();

            const retval = [];
            for (let i = 0; i < N; i++)
                for (let j = 0; j < N; j++)
                    if (this.value[i][j] == 0)
                        retval.push([j, i] as [number, number]);
            return retval;
        }

        private static getRandomCellNumber(): number {
            const sample = [2, 2, 2, 2, 4];
            sample.sort(() => Math.random() - 0.5);
            return sample[0];
        }

        public move(direction: Direction): boolean {
            const N = this.getBoardSize();
            let [diff, start, diffOfStarts] = Position.getNavigationVectors(direction);

            let here = start.times(N - 1);
            let isChanged = this.moveLine(here, diff);
            for (const diffOfStart of diffOfStarts) {
                while (true) {
                    const next = here.add(diffOfStart);

                    if (!this.inBoard(next))
                        break;

                    isChanged = this.moveLine(next, diff) || isChanged;
                    here = next;
                }
            }

            return isChanged;
        }

        private getBoardSize(): number {
            Validator.validatePositiveInteger(this.size);
            return 2 * this.size - 1;
        }

        private inBoard(pos: Position): boolean {
            const N = this.getBoardSize();

            if (!(0 <= pos.x && pos.x < N))
                return false;
            if (!(0 <= pos.y && pos.y < N))
                return false;
            return true;
        }

        private moveLine(start: Position, diff: Position): boolean {
            let here = start, pre = start;
            let isChanged = false;
            while (true) {
                if (!this.inBoard(here) || this.getValue(here) == Board.INVALID_CELL) {
                    isChanged = this.moveLineInSection(pre, here, diff) || isChanged;
                    pre = here.add(diff);
                }

                if (!this.inBoard(here))
                    break;

                here = here.add(diff);
            }

            return isChanged;
        }

        private moveLineInSection(start: Position, end: Position, diff: Position): boolean {
            if (start.equals(end))
                return false;

            const stack: number[] = [];
            let isChanged = false;

            let here = start;
            while (!(here.equals(end))) {
                if (stack.length && stack[stack.length - 1] == this.getValue(here)) {
                    this.setValue(here, this.getValue(here) * 2);
                    stack.pop();
                    isChanged = true;
                }

                if (this.getValue(here))
                    stack.push(this.getValue(here));

                here = here.add(diff);
            }

            here = end.add(diff.times(-1));
            while (true) {
                if (stack.length == 0)
                    stack.push(0);
                if (this.getValue(here) != stack[stack.length - 1])
                    isChanged = true;

                this.setValue(here, stack[stack.length - 1]);
                stack.pop();

                if (here.equals(start))
                    break;

                here = here.add(diff.times(-1));
            }

            return isChanged;
        }

        private getValue(pos: Position): number {
            return this.value[pos.y][pos.x];
        }

        private setValue(pos: Position, value: number): void {
            this.value[pos.y][pos.x] = value;
        }
    }

    type PairOfNumber = [number, number];

    class Position {
        public x: number;
        public y: number;

        public constructor (x: number, y: number) {
            this.x = x;
            this.y = y;
        }
        
        public equals(pos: Position): boolean {
            return (this.x == pos.x) && (this.y == pos.y);
        }

        public add(pos: Position): Position {
            return new Position(this.x + pos.x, this.y + pos.y);
        }

        public times(k: number): Position {
            return new Position(this.x * k, this.y * k);
        }

        public static getNavigationVectors(direction: Direction): [Position, Position, Position[]] {
            const darr: [PairOfNumber, PairOfNumber, PairOfNumber[]][] = [
                [[0, -1], [0, 1], [[1, 0]]],
                [[1, 0], [0, 0], [[0, 1]]],
                [[1, 1], [0, 1], [[0, -1], [1, 0]]],
                [[0, 1], [0, 0], [[1, 0]]],
                [[-1, 0], [1, 0], [[0, 1]]],
                [[-1, -1], [1, 0], [[0, 1], [-1, 0]]]
            ];

            const retval: [Position, Position, Position[]] = [
                new Position(...darr[direction][0]),
                new Position(...darr[direction][1]),
                darr[direction][2].map(x => new Position(...x))
            ];

            return retval;
        }
    }

    class Validator {
        static validatePositiveInteger(value: number): void {
            this.validateInteger(value);
            if (value <= 0)
                GameError.nonPositiveValue(value);
        }

        static validateInteger(value: number): void {
            if (Math.floor(value) != value)
                GameError.noInteger(value);
        }
    }

    class GameError extends Error {
        static noEmptyCell() {
            throw new Error("There are no empty cells on the board.");
        }

        static nonPositiveValue(value: number): never {
            throw new Error(`${value} is non-positive.`);
        }

        static noInteger(value: number): never {
            throw new Error(`${value} is no integer.`);
        }
    }
}

window.onload = () => {
    console.log(`Hello World`);

    const game = new Hexa2048.Game();
    console.log(`const game = new Hexa2048.Game();`);
    game.show();

    game.move(Hexa2048.Direction.DOWN_RIGHT);
    console.log(`game.move(Hexa2048.Direction.DOWN_RIGHT);`);
    game.show();

    game.move(Hexa2048.Direction.RIGHT);
    console.log(`game.move(Hexa2048.Direction.RIGHT);`);
    game.show();

    game.undo();
    console.log(`game.undo();`);
    game.show();

    game.reset();
    console.log(`game.reset();`);
    game.show();
};