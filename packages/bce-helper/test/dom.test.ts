import {DomHelper} from '../src/dom';

function createTestDom() {
    document.body.innerHTML = 
    '<div id="test" class="test" style="font-size: 13px;">' +
        'test' +
    '</div>';
}

createTestDom();

const dom = document.querySelector('#test');
const domHelper = new DomHelper(dom);

let testValue:number = 0;
const handlerTest = () => {
    testValue = 2;
}

describe('DomHelper', () => {
    test('获取全部css值 allProperty', () => {
        expect(domHelper.getAllProperty().fontSize).toEqual('13px');
    })
    test('获取dom getDom', () => {
        expect(domHelper.getDom()).toBe(dom);
    });
    test('获取css属性 getCssProperty', () => {
        expect(domHelper.getCssProperty('fontSize')).toBe('13px');
        expect((domHelper.getCssProperty(null) as any)['fontSize']).toBe('13px');
    })
    test('获取dom属性 getAttribute', () => {
        expect(domHelper.getAttribute('class')).toBe('test');
    })
    test('设置style setStyle getStyle', () => {
        domHelper.setStyle('color', 'red');
        expect(domHelper.getStyle('color')).toBe('red');
        expect(domHelper.getStyle().color).toBe('red');
    })
    test('移除style removeStyle', () => {
        domHelper.removeStyle('color');
        expect(domHelper.getStyle('color')).toBe('');
    })
    test('设置背景颜色 setBackgroundColor', () => {
        domHelper.setBackgroundColor('blue');
        expect(domHelper.getStyle('backgroundColor')).toBe('blue');
    })
    test('设置字体颜色 setColor', () => {
        domHelper.setColor('blue');
        expect(domHelper.getStyle('color')).toBe('blue');
        expect(domHelper.getCssProperty('color')).toBe('blue');
    })
    test('注册事件 listen', () => {
        domHelper.listen('click', handlerTest);
        (domHelper.getDom() as any).click();
        expect(testValue).toBe(2);
    });
    test('解绑事件 listen', () => {
        testValue = 0;
        domHelper.unlisten('click', handlerTest);
        (domHelper.getDom() as any).click();
        expect(testValue).toBe(0);
    });
    test('自我销毁 remove', () => {
        domHelper.remove();
        const domtest = document.querySelector('#test');
        expect(domtest).toBe(null);
    });
    test('自我销毁 parentnode remove', () => {
        createTestDom();
        const dom = document.querySelector('#test');
        const domHelper = new DomHelper(dom);
        Object.defineProperty(dom, 'remove', {
            value: null,
        })
        domHelper.remove();
        expect(document.querySelector('#test')).toBe(null);
    });
});
