import {Testable, Tester} from "../../test";
import { Hexa2048 } from "./hexa2048";

namespace Hexa2048Test {
    export class PositionTest extends Testable {
        static test_더하기(): void {
            const a = new Hexa2048.Position(1, 2);
            const b = new Hexa2048.Position(3, 4);
    
            const result = a.add(b);
    
            this.assert(result.x == 4);
            this.assert(result.y == 6);
        }
    
        static test_같은_경우(): void {
            const a = new Hexa2048.Position(1, 2);
            const b = new Hexa2048.Position(1, 2);
    
            const result = a.equals(b);
    
            this.assert(result == true);
        }
    
        static test_다른_경우(): void {
            const a = new Hexa2048.Position(1, 2);
            const b = new Hexa2048.Position(1, 3);
    
            const result = a.equals(b);
    
            this.assert(result == false);
        }
    
        static test_배수_연산(): void {
            const a = new Hexa2048.Position(1, 2);
            const k = 10;
    
            const result = a.times(k);
    
            this.assert(result.x == 10);
            this.assert(result.y == 20);
        }
    }
    
    export class BoardTest extends Testable {
        static test_생성(): void {
            // TODO
        }
    }
}

Testable.errorClass = Hexa2048.GameError;
Tester.run([
    Hexa2048Test.PositionTest,
    Hexa2048Test.BoardTest,
]); 