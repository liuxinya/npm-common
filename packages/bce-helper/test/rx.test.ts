import {RxObject} from '../src/rx';


const rx = new RxObject<number>(1);

async function delay(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time)
    })
}

describe('rx', () => {
    test('next、get', () => {
        expect(rx.getValue()).toBe(1);
        rx.next(2);
        expect(rx.getValue()).toBe(2);
    })
    describe('onSubscribe, subscribe', () => {
        test('onSubscribe多次执行', () => {
            let test1 = 1;
            let test2 = 1;
            let n = 0;
            rx.onSubscribe(() => {
                ++n;
            }).subscribe((v) => {
                test1 = v;
            });
            rx.subscribe((v) => {
                test2 = v;
            })
            expect(n).toBe(2);
            rx.next(3)
            expect(test1).toBe(3);
            expect(test2).toBe(3);
        })
        test('onSubscribe只执行一次', () => {
            let test1 = 1;
            let test2 = 1;
            let n = 0;
            rx.onSubscribe(() => {
                ++n;
            }, true).subscribe((v) => {
                test1 = v;
            });
            rx.subscribe((v) => {
                test2 = v;
            })
            expect(n).toBe(1);
            rx.next(3)
            expect(test1).toBe(3);
            expect(test2).toBe(3);
        })
    });
    test('unsubscribe', () => {
        let a = 1;
        function test(val: number) {
            a = val;
        }
        rx.subscribe(test);
        rx.next(2)
        expect(a).toBe(2);
        rx.unsubscribe(test);
        rx.next(3);
        expect(a).toBe(2);
    })
    describe('debounceTime', () => {
        test('正常防抖', async () => {
            let a = 1;
            rx.debounceTime(100).subscribe(() => {
                ++a;
            })
            // 只要两次操作之间时间间隔小于100 就只执行一系列操作的最后一次
            rx.next(1);
            rx.next(2);
            await delay(50);
            rx.next(3);
            expect(a).toBe(1);
            await delay(60);
            expect(a).toBe(1);
            await delay(100);
            expect(a).toBe(2);
        })
        test('默认时间是10ms', async () => {
            let a = 1;
            rx.debounceTime().subscribe(() => {
                ++a;
            })
            rx.next(1);
            rx.next(2);
            await delay(10);
            expect(a).toBe(2);
        });
        test('每次防抖都是新一个流', async () => {
            let a = 1;
            const test1 = rx.debounceTime(100);
            const test2 = rx.debounceTime(100);
            expect(test1.getId() !== test2.getId()).toBe(true);
        })
    })
    describe('throttleTime', () => {
        test('时间大于1 正常节流', async () => {
            let a = 1;
            rx.throttleTime(100).subscribe(() => {
                ++a;
            })
            // 只有一系列操作之间时间间隔小于100 就只执行一次 时间跨度大于100后再执行
            rx.next(1);
            rx.next(2);
            await delay(50);
            rx.next(3);
            expect(a).toBe(2);
            await delay(60);
            rx.next(4);
            expect(a).toBe(3);
    
        })
        test('时间小于1 节流失败', () => {
            let a = 1;
            rx.throttleTime().subscribe(() => {
                ++a;
            })
            // 节流失败
            rx.next(1);
            rx.next(2);
            expect(a).toBe(3);
        })
    });
    test('subscribe 自销毁', () => {
        let a = 0;
        function test(val: number) {
            a = val;
        }
        const destroy = rx.subscribe(test);
        rx.next(2);
        destroy()
        rx.next(3);
        expect(a).toBe(2);
    })
    test('complete 手动结束当前流', () => {
        let a = 0;
        let b = 0;
        function test1(val: number) {
            a = val;
        }
        function test2(val: number) {
            b = val;
        }
        rx.subscribe(test1);
        rx.subscribe(test2);
        rx.next(1)
        expect(a).toBe(1);
        expect(b).toBe(1);
        rx.complete();
        rx.complete();
        rx.next(2)
        expect(a).toBe(1);
        expect(b).toBe(1);
    })
    test('onCompleted 监听一个流的结束', () => {
        const rx = new RxObject<number>();
        let end = false;
        let a = 1;
        rx.onCompleted(() => {
            end = true;
        }).subscribe((val: number) => {
            a = val;
        });
        rx.next(3);
        expect(a).toBe(3);
        rx.complete();
        expect(end).toBe(true);
    })
})