import {AbtestConsructorParams, Abtest} from '../src/index';

describe('abtest-server', () => {
    const arr = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    for(let i = 0; i < arr.length; i++) {
        test(`开头${arr[i]}，流量25-75，value ${i < 4 ? 1 : 2}`, async () => {
            const val = await abFun({
                id: 'e349c24c405445eb92496481b03a8fe2',
                ruleId: `${arr[i]}888`,
                env: 'sandbox',
                defaultVersion: 1,
                callback: val => {},
            });
            expect(val).toBe(i < 4 ? 1 : 2);
        });
    }
})

export function abFun(params: AbtestConsructorParams): Promise<number> {
    return new Promise((resolve, reject) => {
        new Abtest({
            ...params,
            callback: (val, info) => {
                params.callback(val, info);
                resolve(val);
            },
            errHandler: (e) => {
                console.error('eeeee', e)
                reject();
            }
        })
    })
}