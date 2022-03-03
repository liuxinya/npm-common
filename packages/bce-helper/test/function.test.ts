import {compose, composePromise} from '../src/function';

function add(preRes: number) {
    return preRes + 1;
}

function add2(preRes: number) {
    return preRes + 2;
}

function promiseAdd(res: number) {
    return new Promise(resolve => {
        resolve(res + 1)
    })
}
function promiseAdd2(res: number) {
    return new Promise(resolve => {
        resolve(res + 2)
    })
}

test('compose', () => {
    expect(compose(add, add2)(1)).toBe(4);
})

test('composePromise', async () => {
    expect(await composePromise(promiseAdd, promiseAdd2)(1)).toBe(4);
})