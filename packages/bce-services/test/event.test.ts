import {Ioc} from '@baidu/ioc';
import {UEventEmitter} from '../src/event';

// const event = Ioc(UEventEmitter);

describe('UEventEmitter', () => {
    test('on emit isMultiple=true', () => {
        const event = new UEventEmitter();
        let a = 1;
        let b = 1;
        function test(val: number) {
            a = val;
        }
        function test2(val: number) {
            b = val;
        }
        event.on('test', test);
        event.on('test', test2);
        event.emit('test', 2)
        expect(a).toBe(2);
        expect(b).toBe(2);
    })
    test('on emit isMultiple=false', () => {
        const event = new UEventEmitter();
        let a = 1;
        let b = 1;
        function test(val: number) {
            a = val;
        }
        function test2(val: number) {
            b = val;
        }
        event.on('test', test, false);
        event.on('test', test2, false);
        event.emit('test', 2)
        expect(a).toBe(2);
        expect(b).toBe(1);
    })
    test('once 只执行一次', () => {
        const event = new UEventEmitter();
        let n = 0;
        event.once('test', () => {
            ++n;
        })
        event.emit('test');
        event.emit('test');
        expect(n).toBe(1);
    });
    test('delete', () => {
        const event = new UEventEmitter();
        let n = 0;
        event.on('test', () => {
            ++n;
        })
        event.delete('test');
        event.emit('test');
        expect(n).toBe(0);
    });
    test('destroy', () => {
        const event = new UEventEmitter();
        let n = 0;
        event.on('test', () => {
            ++n;
        })
        event.on('test1', () => {
            ++n;
        })
        event.destroy();
        event.emit('test');
        event.emit('test1');
        expect(n).toBe(0);
    });
});