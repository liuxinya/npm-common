/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable max-len */

export function isMobile() {
    return Boolean(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
}
