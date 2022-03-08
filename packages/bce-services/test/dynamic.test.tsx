import {Ioc} from '@baidu/ioc';
import {UDynamicService} from '../src/dynamic';

document.body.innerHTML = 
'<div id="target"' +
    'target' +
'</div>';

const dy = Ioc(UDynamicService);

function Test(props: {
    val: number;
    id?: string;
}) {
    return (
        <div className="test" id={props.id}>{props.val}</div>
    )
}
function Test2(props: {
    val: number;
    id?: string;
}) {
    return (
        <div className="test2" id={props.id}>{props.val}</div>
    )
}

async function delay(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time)
    })
}

describe('UDynamicService', () => {
    describe('open', () => {
        test('正确打开一个组件 默认挂载body最后面', () => {
            const div = dy.open({
                component: Test,
                props: {
                    val: 1,
                }
            })
            expect(div.parentElement.tagName).toBe('BODY');
        });
        test('正确打开一个组件 挂载到目标元素 target', () => {
            const targetEle: HTMLDivElement = document.querySelector('#target');
            const div = dy.open({
                component: Test,
                props: {
                    val: 1,
                    id: 'test-target'
                },
                selector: targetEle,
            })
            expect(div.parentElement.getAttribute('id')).toEqual('target');
        });
    });
    describe('destroyed', () => {
        const div1 = dy.open({
            component: Test2,
            props: {
                val: 1,
            }
        })
        const div2 = dy.open({
            component: Test2,
            props: {
                val: 2,
                id: 'test2'
            }
        })
        test('销毁一个', async () => {
            expect(document.querySelectorAll('.test2').length).toBe(2);
            dy.destroyed(div2);
            await delay(500);
            expect(document.querySelector('#test2')).toBe(null);
            expect(document.querySelectorAll('.test2').length).toBe(1);
        });
        test('销毁全部', async () => {
            const temDiv = dy.open({
                component: Test2,
                props: {
                    val: 1111,
                }
            })
            expect(document.querySelectorAll('.test2').length).toBe(2);
            console.log(123123123123);
            dy.destroyed(div1, true);
            await delay(800);
            expect(document.querySelectorAll('.test2').length).toBe(0);
        })
    });
})