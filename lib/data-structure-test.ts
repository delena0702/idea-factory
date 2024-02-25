import { Testable, Tester } from '../test';
import { DataStructure } from './data-structure';

class HeapTest extends Testable {
    static test_heap_기본(): void {
        const pq = new DataStructure.Heap<number, number>();

        pq.push(3, 3);
        pq.push(5, 5);
        pq.push(1, 1);
        pq.push(2, 2);
        pq.push(4, 4);

        for (let i = 1; i <= 5; i++) {
            this.assert(pq.topKey() == i);
            this.assert(pq.pop() === true);
        }

        this.assert(pq.pop() === false);
    }
}

Tester.run([
    HeapTest
]);