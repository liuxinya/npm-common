import {Abtest, AbtestConsructorParams} from '../src/index';

const url = 'https://qasandbox.bcetest.baidu.com/'

Object.defineProperty(window, 'location', {
    value: {
        href: url,
        search: '?test=1&test2=false&test3=true',
        hash: '#?test=2',
        pathname: '/a'
    }
});

describe('abetst', () => {
    test('开头7,50流量,value 0', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '788',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(0);
    });
    test('开头8,50流量,value 1', async () => {
        const val = await abFun({
            id: '21',
            ruleId: '888',
            env: 'dev',
            defaultVersion: 0,
            callback: val => {},
        });
        expect(val).toBe(1);
    });
    test('外界自定义规则', () => {});
    test('console环境，不传入ruleid，报错', async () => {
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