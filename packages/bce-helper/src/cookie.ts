/**
 * @file 操作cookie
 */

import {isObject} from './type';

/**
 * 获取cookie
 * @param key 只获取某个key对应的value
 */
export function getCookie(key?: string) {
    const cookie = getCookieToObj();
    return key ? cookie[key] : cookie;
}

export function setCookie<T>(key: string, value: T, days: number = 0, isEncode = true, host = location.host) {
    let valueStr: string = isObject(value) ? JSON.stringify(value) : String(value);
    valueStr = isEncode ? encodeURIComponent(valueStr) : valueStr;
    let expires: string = '';
    if (days > 0) {
        const d = new Date();
        const offset = 8;
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const nd = utc + (3600000 * offset);
        const exp = new Date(nd);
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `expires=${exp.toUTCString()};`;
    }
    document.cookie = `${key}=${valueStr};path=/;${expires};domain=${host}`;
}

export function delCookie(key: string, host: string = location.host) {
    const preVal = getCookie(key);
    if(preVal) {
        document.cookie = `${key}=${preVal};domain=${host};expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}

export function clearCookie(host: string = location.host) {
    Object.keys(getCookie()).forEach(key => delCookie(key, host))
}

function getCookieToObj() {
    const cookie: string = document.cookie;
    const cookieArr: string[] = cookie.split(';');
    const res: cookieObj = {};
    cookieArr.forEach((item: string) => {
        const temArr = item.split('=');
        res[temArr[0].trim()] = decodeURIComponent(temArr[1]);
    });
    return res;
}

interface cookieObj {
    [props: string]: string;
}
