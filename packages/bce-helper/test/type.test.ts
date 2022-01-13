import {isNumber, isString, isArray, isObject, isBoolean, isSymbol, isFunction, isUndefined, isNull, isNill, isTrue, isFalse} from '../src/type';

test('isNumber', () => {
    expect(isNumber(1)).toBe(true)
})
test('isString', () => {
    expect(isString('1')).toBe(true)
})
test('isArray', () => {
    expect(isArray([1])).toBe(true)
})

describe('isObject', () => {
    test('包括数组', () => {
        expect(isObject([1], true)).toBe(true)
    })
    test('不包括数组', () => {
        expect(isObject([], false)).toBe(false)
    })
})
test('isBoolean', () => {
    expect(isBoolean(false)).toBe(true)
})
test('isSymbol', () => {
    expect(isSymbol(Symbol(1))).toBe(true)
})
test('isFunction', () => {
    expect(isFunction(() => {})).toBe(true)
})
test('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true)
})
test('isNull', () => {
    expect(isNull(null)).toBe(true)
})
describe('isNill', () => {
    test('undefined', () => {
        expect(isNill(undefined)).toBe(true)
    })
    test('null', () => {
        expect(isNill(null)).toBe(true)
    })
})
test('isTrue', () => {
    expect(isTrue(true)).toBe(true)
})
test('isFalse', () => {
    expect(isFalse(false)).toBe(true)
})