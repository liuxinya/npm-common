import {Abtest, AbtestConsructorParams} from '../src/index';

describe('abetst', () => {
    beforeAll(() => {
        const url = 'https://qasandbox.bcetest.baidu.com/'
        Object.defineProperty(window, 'location', {
            value: {
                href: url,
                search: '?test=1&test2=false&test3=true',
                hash: '#?test=2',
                pathname: '/a'
            }
        });
    })
    // const arr = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    // for(let i = 0; i < arr.length - 1; i++) {
    //     test(`开头${arr[i]}，流量25-75，value ${i < 4 ? 0 : 1}`, async () => {
    //         const val = await abFun({
    //             id: '504576fe54b54a5b967624432d4e091d',
    //             ruleId: `${arr[i]}888`,
    //             env: 'sandbox',
    //             defaultVersion: 0,
    //             callback: val => {},
    //         });
    //         expect(val).toBe(i < 4 ? 0 : 1);
    //     });
    // }
    test('开头7,50流量,value 0', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '7888',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(0);
    });
    test('开头8,50流量,value 1', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '8888',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(1);
    });
    test('外界自定义规则，value 1', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '888',
            env: 'dev',
            rule: () => 1,
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(1);
    });
    test('开头8, 但是在值为0组的白名单内的，value 0', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '888',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(0);
    });
    test('开头7, 但是在值为1组的白名单内的，value 1', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '788',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(1);
    });
    test('abtestid 999,实验已结束，走默认version 1', async () => {
        const val = await abFun({
            id: '999',
            ruleId: '788',
            env: 'dev',
            defaultVersion: 1,
            callback: val => {},
        });
        expect(val).toBe(1);
    });
    test('abtestid abc,实验已结束，走默认version 0', async () => {
        const val = await abFun({
            id: 'abc',
            ruleId: '788',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(0);
    });
    test('console环境，不传入ruleId，报错', async () => {
        let testVal = 0;
        try {
            const val = await abFun({
                id: '21',
                // ruleId: '888',
                env: 'dev',
                defaultVersion: 0,
                callback: val => {
                    testVal = 1;
                },
            })
        } catch(e) {
            testVal = 2;
        }
        expect(testVal).toBe(2);
    })
})


function abFun(params: AbtestConsructorParams): Promise<number> {
    return new Promise((resolve, reject) => {
        new Abtest({
            ...params,
            callback: (val, info) => {
                params.callback(val, info);
                resolve(val);
            },
            errHandler: () => {
                reject();
            }
        })
    })
}