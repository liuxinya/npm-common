import {isIos, isMobile, isPc, isAndroid, isWeChat, isRetina} from '../src/device';

Object.defineProperty(window, 'navigator', {
    value: {
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Mobile Safari/537.36',
    },
    writable: true,
});

describe('isMobile', () => {
    test('值为true', () => {
        expect(isMobile()).toBe(true)
    })
    test('值为false', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36';
        expect(isMobile()).toBe(false)
    })
})

describe('isPc', () => {
    test('值为true', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36';
        expect(isPc()).toBe(true)
    })
    test('值为false', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Mobile Safari/537.36';
        expect(isPc()).toBe(false)
    })
})


describe('isIos', () => {
    test('值为true', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
        expect(isIos()).toBe(true)
    })
    test('值为false', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36';
        expect(isIos()).toBe(false)
    })
})

describe('isAndroid', () => {
    test('值为true', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36';
        expect(isAndroid()).toBe(true)
    })
    test('值为false', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
        expect(isAndroid()).toBe(false)
    })
})

describe('isWeChat', () => {
    test('值为true', () => {
        (window.navigator as any).userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1 wechatdevtools/1.05.2107221 MicroMessenger/8.0.5 Language/zh_CN webview/16466439291441824 webdebugger port/29000 token/de8d83205681aba85d398c767734b9a2";
        expect(isWeChat()).toBe(true)
    })
    test('值为false', () => {
        (window.navigator as any).userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
        expect(isWeChat()).toBe(false)
    })
})

describe('isRetina', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
        value: 3,
        writable: true,
    });
    test('值为true', () => {
        expect(isRetina()).toBe(true)
    })
    test('值为false', () => {
        (window as any).devicePixelRatio = 1;
        expect(isRetina()).toBe(false)
    })
})