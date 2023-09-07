/**
 * 一个组件的服务
 * 作用： 可以快速在你想要的位置打开一个组件，减少组件show: true false这种写法
 */


import {Injectable} from '@baidu/ioc';
import {removeFromArrayByCondition} from '@baidu/bce-helper';
import * as ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import * as React from 'react';

const version = Number(React?.version?.slice(0, 2)) || 18;
const is17 = version < 18;
console.info(`react环境-${version}`)

@Injectable()
export class UDynamicService {

    private readonly nameDivMap: Map<string, Element[]> = new Map();
    private readonly divNameMap: Map<Element, string> = new Map();

    open<CP>(options: DynamicHelperOptions<CP>) {
        const Component = options.component;
        const name = Component.name;
        const div = document.createElement('div');
        if (is17) {
            ReactDOM.render((
                <Component id={div} {...options.props} />
            ), div);
        } else {
            createRoot(
                div
            ).render(<Component id={div} {...options.props} />);
        }
        if (options.selector) {
            options.selector.appendChild(div);
        } else {
            document.body.appendChild(div);
        }
        const arrDiv: Element[] = (this.nameDivMap.get(name) || []);
        arrDiv.push(div);
        this.nameDivMap.set(name, arrDiv);
        this.divNameMap.set(div, name);
        return div;
    }
    private destroyedEleAndCom(ele: Element) {
        if (is17) {
            ReactDOM.unmountComponentAtNode(ele);
        }
        ele.remove();
    }
    private removeDivFormMap(name: string, ele: Element) {
        this.divNameMap.delete(ele);
        const divArr = this.nameDivMap.get(name) || [];
        if (divArr.length > 0) {
            removeFromArrayByCondition(divArr, (item: Element) => {
                return item === ele;
            });
        }
    }
    destroyed(ele: Element, isDeleteOtherSameCom?: boolean) {
        setTimeout(() => {
            const name = this.divNameMap.get(ele);
            if (isDeleteOtherSameCom) {
                const divArr = this.nameDivMap.has(name) ? this.nameDivMap.get(name) : [];
                while (divArr.length > 0) {
                    this.destroyedEleAndCom(divArr[0]);
                    this.removeDivFormMap(name, divArr[0]);
                }
            } else {
                this.destroyedEleAndCom(ele);
                this.removeDivFormMap(name, ele);
            }
        }, 300);
    }
}

interface DynamicHelperOptions<CP> {
    // 默认id为 displayName， 但是有种很特殊的情况， 一个组件要打开两次
    // id?: any,
    // eslint-disable-next-line no-undef
    component: (props: CP) => JSX.Element; // 要打开的组件
    props?: CP;
    selector?: HTMLDivElement; // 在哪打开它
    isDeleteOtherSameCom?: boolean; // 要删除已经打开的相同的displayName的组件吗
}
