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
        constructor () {

        }

        init(): void {

        }

        move(direction: Direction): void {

        }

        undo(): boolean {
            return false;
        }

        reset(): void {

        }
    }
}

window.onload = () => {
    console.log(`Hello World`);

    const game = new Hexa2048.Game();
    game.init();
    game.move(Hexa2048.Direction.DOWN_RIGHT);
    game.undo();
    game.reset();
};