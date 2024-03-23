export class Testable {
    static errorClass: Function = Error;

    static async run(): Promise<[number, number]> {
        const cls: { [key: string]: any } = this;

        let cnt: [number, number] = [0, 0];
        for (const key of Object.getOwnPropertyNames(cls)) {
            if (typeof cls[key] != 'function')
                continue;
            if (!key.startsWith('test'))
                continue;

            cnt[1]++;
            try {
                await cls[key]();
                console.log(`${cls.name}.${key} Success!`);
                cnt[0]++;
            } catch (e) {
                console.error(`${cls.name}.${key} Failed!`);
                console.error(e);
            }
        }

        return cnt;
    }

    static assert(check: boolean): void {
        if (!(check))
            this.failed();
    }

    static assertError(callback: () => void) {
        try {
            callback();
            this.failed();
        } catch (e) {
            if (!(e instanceof this.errorClass))
                this.failed();
        }
    }

    static failed(): never {
        throw new Error('Test Failed!');
    }
}

export class Tester {
    static async run(classes: typeof Testable[]): Promise<void> {
        const total_result = [0, 0];
        for (const cls of classes) {
            console.group(`${cls.name} ${'='.repeat(50)}`);
            const result = await cls.run();

            total_result[0] += result[0];
            total_result[1] += result[1];

            console.groupEnd();
        }

        console.log(`\nTest Result : ${total_result[0]} / ${total_result[1]}`);
    }
}