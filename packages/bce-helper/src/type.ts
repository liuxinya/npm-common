export function isNumber(val: any) {
    return typeof val === 'number' && !isNaN(val);
}
export function isString(val: any) {
    return typeof val === 'string';
}
export function isArray(val: any) {
    return Array.isArray(val);
}
export function isObject(val: any, includeArray: boolean = true) {
    return includeArray
    ? (Object.prototype.toString.call(val) === '[object Object]' || isArray(val))
    : Object.prototype.toString.call(val) === '[object Object]'
}
export function isBoolean(val: any) {
    return typeof val === 'boolean';
}
export function isSymbol(val: any) {
    return typeof val === 'symbol';
}
export function isFunction(val: any) {
    return typeof val === 'function';
}
export function isUndefined(val: any) {
    return Object.prototype.toString.call(val) === '[object Undefined]';
}
export function isNull(val: any) {
    return val === null;
}
export function isNill(val: any) {
    return isUndefined(val) || isNull(val);
}
export function isTrue(val: any) {
    return isBoolean(val) && val === true;
}
export function isFalse(val: any) {
    return isBoolean(val) && val === false;
}
