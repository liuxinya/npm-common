export type NullFunc = () => (void | NullFunc);

let ID = 0;

// export interface IMergeType<T, K> {
//     id: symbol;
//     value: T | K;
//     allIndex: number;
//     singleIndex: number;
// }

export class RxObject<T> {

    private completed = false;
    private value: T;
    private index: number = 0;
    private completedHandlers: NullFunc[] = [];
    private subscribeHandlers: Array<{
        symbol: symbol;
        handler: (v: T, index: number) => void;
    }> = [];
    private onSubscribeHandlers: NullFunc[] = [];

    constructor(
        value?: T,
        private id: symbol = Symbol(ID++)
    ) {
        if (value) {
            this.next(value);
        }
    }


    // 获取当前值
    getValue() {
        return this.value;
    }
    // 获取这个流的ID值
    getId() {
        return this.id;
    }

    next(value: T) {
        this.value = value;
        this.subscribeHandlers.forEach(item => item.handler(value, this.index++));
    }

    // 这个流已经完成，需要进行一系列的销毁操作 @undo
    complete() {
        if (this.completed) {
            return;
        }
        this.completed = true;
        this.completedHandlers.forEach(handler => handler());
        this.unsubscribe();
    }

    // 节流的时间
    throttleTime(gap = 0) {
        // 最小的时间单元就是1 所以直接使用时间的话可能会因为先后的顺序导致读取的数据有问题
        if (!gap || gap <= 1) {
            return this;
        }
        const newRx = new RxObject<T>();
        let powerswitch = true; // 开关，一开始是开着
        this.onCompleted(() => newRx.complete());
        newRx.onSubscribe(() => {
            this.subscribe((v: T) => {
                if (powerswitch) {
                    newRx.next(v);
                    powerswitch = false;
                    setTimeout(() => {
                        powerswitch = true;
                    }, gap - 1);
                }
            });
        });
        return newRx;
    }
    // 防抖 在一定时间内有多个值，那么就先等待，直到下一个多于这个间隔
    debounceTime(gap = 10) {
        const newRx = new RxObject<T>();
        let lastv: T = null;
        let time: NodeJS.Timeout = null;
        this.onCompleted(() => newRx.complete());
        newRx.onSubscribe(() => {
            this.subscribe((v: T) => {
                clearTimeout(time);
                lastv = v;
                time = setTimeout(() => {
                    newRx.next(lastv);
                }, gap) as any;
            });
        });
        return newRx;
    }

    // 监听这个流 @undo
    subscribe(handler: (value: T, index: number) => void) {
        // eslint-disable-next-line symbol-description
        const symbol = Symbol();
        this.subscribeHandlers.push({
            symbol,
            handler,
        });
        this.onSubscribeHandlers.forEach(h => h());
        return () => {
            let index = -1;
            for (let i = 0; i < this.subscribeHandlers.length; i++) {
                if (this.subscribeHandlers[i].symbol === symbol) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                this.subscribeHandlers.splice(index, 1);
            }
        };
    }

    onSubscribe(handler: NullFunc, once = false) {
        let inited = false;
        this.onSubscribeHandlers.push(() => {
            if (inited && once) {
                return;
            }
            inited = true;
            handler();
        });
        return this;
    }

    // 取消某个函数对应的监听
    unsubscribe(handler?: (value: T, index: number) => void) {
        this.subscribeHandlers.reduce((lastV: number[], item: {
            handler: (value: T, index: number) => void;
            symbol: symbol;
        }, index: number) => {
            if (!handler || handler === item.handler) {
                lastV.push(index);
            }
            return lastV;
        }, []).forEach(
            // 这里注意是position - index 因为删除一个后位置变了
            (position, index) => this.subscribeHandlers.splice(position - index, 1)
        );
    }

    // 流完成了 一个流完成后需要做的事情
    onCompleted(handler: () => void) {
        this.completedHandlers.push(handler);
        return this;
    }
}
