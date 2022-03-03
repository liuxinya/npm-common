import {utcToBJ} from '../src/time';


describe('utcToBJ', () => {
    test('默认格式', () => {
        expect(utcToBJ('2022-03-01T08:57:56Z')).toBe('2022.03.01 16:57')
    })
    test('自定义格式', () => {
        expect(utcToBJ('2022-03-01T08:57:56Z', 'YYYY.MM.DD hh:mm')).toBe('2022.03.01 04:57')
    })
})