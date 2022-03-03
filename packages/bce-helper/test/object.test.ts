import {mergeObj} from '../src/object';
test('object mergeObj', () => {
    expect(mergeObj({a: 1}, {b: 2})).toEqual({a: 1, b: 2});
})
