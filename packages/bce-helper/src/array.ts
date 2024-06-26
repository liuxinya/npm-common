// 向Arr里面添加新项
export function addToArrayByIndex<T = any[]>(arr: T[], index: number, value: any, setValue = (arr2: T[], i: number, val: any) => {
    arr2[i] = val;
}) {
    const len = arr.length;
    // eslint-disable-next-line no-param-reassign
    index = index < 0 ? 0 : (index >= len ? len : index);
    for (let i = len; i > index; i--) {
        setValue(arr, i, arr[i - 1]);
    }
    setValue(arr, index, value);
    return arr;
}

// 通过某个条件移出某些项
export function removeFromArrayByCondition<T = any[]>(arr: T[], condition: any, setValue = (arr3: T[], ii: number, vv: any) => {
    arr3[ii] = vv;
}) {
    // 设置默认的condition
    // eslint-disable-next-line no-param-reassign
    condition = (!condition || typeof condition !== 'function') ? () => false : condition;
    let count = 0;
    // 移除指定条件的数组，这里应当需要遍历所有
    for (let i = 0; i < arr.length; i++) {
        if (condition(arr[i], i)) {
            // 需要移除，计个数
            count++;
        } else {
            // 不需要移除，那么需要前移
            count > 0 && (setValue(arr, i - count, arr[i]));
        }
    }
    for (let i = 0; i < count; i++) {
        arr.pop();
    }
    return arr;
}


// 通过索引交换位置
export function changePositionByIndex<T = any[]>(arr: T[], index1: number, index2: number): T[] {
    const tem = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = tem;
    return arr;
}
