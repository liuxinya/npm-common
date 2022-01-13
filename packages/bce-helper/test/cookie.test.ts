import {setCookie, getCookie, delCookie, clearCookie} from '../src/cookie';

describe('setCookie', () => {
    test('key val', () => {
        setCookie('name', '1')
        const name = getCookie('name')
        expect(name).toEqual('1')
    })
    test('expires', () => {
        setCookie('age', 1, 1)
        const name = getCookie('age')
        expect(name).toEqual('1')
    })
    test('encode', () => {
        setCookie('test', {test: 1}, 1, true)
        expect(JSON.parse(getCookie('test') as string)).toEqual({test: 1})
    })
    test('no encode', () => {
        setCookie('test', '我', 1, false)
        expect(getCookie('test') as string).toEqual('我')
    })
})
test('delCookie', () => {
    delCookie('age')
    const name = getCookie('age')
    expect(name).toEqual(undefined)
})

test('getCookie', () => {
    clearCookie();
    setCookie('name', '1')
    setCookie('age', '2')
    const cookie = getCookie();
    console.log(cookie);
    expect(cookie).toEqual({name: '1', age: '2'})
})
