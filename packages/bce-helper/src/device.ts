/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable max-len */

export function isMobile() {
    return Boolean(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
}

export function isPc() {
    return !isMobile() && !isIos() && !isAndroid();
}

export function isIos(): boolean {
    const u = navigator.userAgent;
    return Boolean(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
}

export function isAndroid(): boolean {
    const u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}


export function isWeChat() {
   return /MicroMessenger/i.test(window.navigator.userAgent); 
}

export function isRetina(): boolean {
    return window.devicePixelRatio >= 2;
}