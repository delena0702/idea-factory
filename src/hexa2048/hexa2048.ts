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
            return this.board.move(direction);
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
                    (-size < i - j && i - j < size) ? 0 : -1
                )
            );
            this.makeRandomCell();
        }

        makeRandomCell(): boolean {
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

        static getRandomCellNumber(): number {
            const sample = [2, 2, 2, 2, 4];
            sample.sort(() => Math.random() - 0.5);
            return sample[0];
        }

        getRandomPosition(): [number, number] {
            const cells = this.getEmptyCells();
            cells.sort(() => Math.random() - 0.5);

            if (cells.length == 0)
                throw GameError.noEmptyCell();
            return cells[0];
        }

        getEmptyCells(): [number, number][] {
            const N = this.getBoardSize();

            const retval = [];
            for (let i = 0; i < N; i++)
                for (let j = 0; j < N; j++)
                    if (this.value[i][j] == 0)
                        retval.push([j, i] as [number, number]);
            return retval;
        }

        getBoardSize(): number {
            Validator.validatePositiveInteger(this.size);
            return 2 * this.size - 1;
        }

        show(): void {
            console.log(JSON.parse(JSON.stringify(this.value)));
        }

        move(direction: Direction): boolean {
            const darr: [number[], number[], number[][]][] = [
                [[0, -1], [0, 1], [[1, 0]]],
                [[1, 0], [0, 0], [[0, 1]]],
                [[1, 1], [0, 1], [[0, -1], [1, 0]]],
                [[0, 1], [0, 0], [[1, 0]]],
                [[-1, 0], [1, 0], [[0, 1]]],
                [[-1, -1], [1, 0], [[0, 1], [-1, 0]]]
            ];

            const N = this.getBoardSize();
            const [d, s, sd] = darr[direction];

            let [sx, sy] = s;
            sx *= (N - 1);
            sy *= (N - 1);
            
            const [dx, dy] = d;
            let retval = this.moveLine(sx, sy, dx, dy);
            for (const [sdx, sdy] of sd) {
                while (true) {
                    const nsx = sx + sdx, nsy = sy + sdy;
                    if (!this.inBoard(nsx, nsy))
                        break;

                    retval = retval || this.moveLine(nsx, nsy, dx, dy);
                    sx = nsx, sy = nsy;
                }
            }

            return retval;
        }

        moveLine(sx: number, sy: number, dx: number, dy: number): boolean {
            console.log(sx, sy, dx, dy);
            return false;
        }

        inBoard(nsx: number, nsy: number): boolean {
            const N = this.getBoardSize();

            if (!(0 <= nsx && nsx < N))
                return false;
            if (!(0 <= nsy && nsy < N))
                return false;
            return true;
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