import {addToArrayByIndex, removeFromArrayByCondition, changePositionByIndex} from '../src/array';

describe('addToArrayByIndex', () => {
    it('index 大于-1 小于len', () => {
        expect(addToArrayByIndex([1, 3], 1, 2)).toEqual([1, 2, 3]);
    });
    test('index 大于len', () => {
        expect(addToArrayByIndex([1, 3], 5, 2)).toEqual([1, 3, 2]);
    });

    test('index 小于len', () => {
        expect(addToArrayByIndex([1, 3], -1, 2)).toEqual([2, 1, 3]);
    });
})


describe('removeFromArrayByCondition', () => {
    test('传入方法条件', () => {
        expect(
            removeFromArrayByCondition([1, 3], (item: number) => item === 1)
        ).toEqual([3]);
    });
    test('传非方法条件', () => {
        expect(
            removeFromArrayByCondition([1], true)
        ).toEqual([1]);
    });
})


// 通过索引交换位置
test('changePositionByIndex [1, 3] => [3,1]', () => {
    const arr = [1, 3];
    expect(changePositionByIndex(arr, 0, 1)).toEqual([3, 1]);
});
