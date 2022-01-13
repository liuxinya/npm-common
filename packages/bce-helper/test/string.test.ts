import {replaceOfString, getByteLen, checkChinese, checkFullWidth, checkHalfWidth} from '../src/string';

test('replaceOfString article/:id => article/123', () => {
    expect(replaceOfString('article/:id', {':id': '123'})).toBe('article/123');
});

test('getByteLen', () => {
    expect(getByteLen('test1我')).toBe(7);
})

describe('checkChinese', ()=> {
    test('非中文', () => {
        expect(checkChinese('test1')).toBe(false);
    })
    test('中文', () => {
        expect(checkChinese('我')).toBe(true);
    })
})

describe('半全角', () => {
    describe('全角', () => {
        test('checkFullWidth', () => {
            expect(checkFullWidth('，')).toBe(true);
        })
        test('checkFullWidth', () => {
            expect(checkFullWidth(',')).toBe(false);
        })
    })
    describe('半角', () => {
        test('checkHalfWidth', () => {
            expect(checkHalfWidth(',')).toBe(true);
        })
        test('checkHalfWidth', () => {
            expect(checkHalfWidth('，')).toBe(false);
        })
    })
})
