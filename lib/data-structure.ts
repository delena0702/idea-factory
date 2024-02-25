export namespace DataStructure {
    export class Heap<Key, Data> {
        private value: [Key, Data][];

        public constructor() {
            this.value = [];
        }

        public topKey(): Key | null {
            if (!(0 < this.value.length))
                return null;
            return this.value[0][0];
        }

        public topData(): Data | null {
            if (!(0 < this.value.length))
                return null;
            return this.value[0][1];
        }

        public push(key: Key, data: Data): void {
            let here = this.value.length;

            this.value.push([key, data]);
            while (true) {
                this.swapMinimum(here);
                if (here == 0)
                    break;
                here = Math.floor((here - 1) / 2);
            }
        }

        public pop(): boolean {
            if (this.value.length == 0)
                return false;

            if (this.value.length == 1) {
                this.value.pop();
                return true;
            }

            this.value[0] = this.value.pop()!;
            let here = 0, pre = 0;
            while (true) {
                here = this.swapMinimum(here);
                if (here == pre)
                    break;
                pre = here;
            }
            return true;
        }

        private swapMinimum(here: number): number {
            let retval = here;

            for (const idx of [2 * here + 1, 2 * here + 2]) {
                if (idx < this.value.length && this.value[here][0] > this.value[idx][0]) {
                    this.swap(here, idx);
                    retval = idx;
                }
            }

            return retval;
        }

        private swap(a: number, b: number): void {
            const temp = this.value[a];
            this.value[a] = this.value[b];
            this.value[b] = temp;
        }
    }
}