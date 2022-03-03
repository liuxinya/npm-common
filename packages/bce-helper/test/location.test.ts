import {getAllParamsFromUrl, isContainInUrl, getUrlfromQuery} from '../src/location';

const url = 'https://www.developer.baidu.com/a?test=1'

Object.defineProperty(window, 'location', {
    value: {
        href: url,
        search: '?test=1&test2=false&test3=true',
        hash: '#?test=2',
        pathname: '/a'
    }
});

describe('getAllParamsFromUrl', () => {
    test('type=search', () => {
        expect(getAllParamsFromUrl().test).toBe('1');
    })
    test('type=hash', () => {
        expect(getAllParamsFromUrl('hash').test).toBe('2');
    })
    test('值为boolean字符 false', () => {
        expect(getAllParamsFromUrl().test2).toBe(false);
    })
    test('值为boolean字符 true', () => {
        expect(getAllParamsFromUrl().test3).toBe(true);
    })
    test('自定义url', () => {
        expect(getAllParamsFromUrl('search', url).test).toBe('1');
    })
})

describe('isContainInUrl', () => {
    test('使用正则', () => {
        expect(isContainInUrl('developer')).toBe(true);
    })
    test('使用字符串', () => {
        expect(isContainInUrl(/\./)).toBe(true);
    })
})

test('getUrlfromQuery', () => {
    expect(getUrlfromQuery({test: 'test', test1: 'test1'})).toBe('/a?test=test&test1=test1');
})