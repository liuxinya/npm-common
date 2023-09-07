export function jsonp<T>(url: string, opts: {
    prefix?: string;
    param?: string;
    timeout?: number;
    data?: any;
} = {}): Promise<T> {
    // 实现Promise化
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // 设置默认参数
        const {
            prefix = 'headerDisplayNameCallBack',
            param = 'callback',
            timeout = 60000,
            data = {},
        } = opts;
        const name = `${prefix}${new Date().getTime()}`;
        let timer: number = null;
        // 清除script标签以及注册的全局函数以及超时定时器
        function cleanup() { // 清除函数
            if (script.parentNode) {
                script.parentNode.removeChild(script);
                // @ts-ignore
                window[name] = null;
                if (timer) {
                    clearTimeout(timer);
                }
            }
        }
        if (timeout) { // 超时
            timer = setTimeout(() => {
                cleanup();
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('timeout');
            }, timeout);
        }
        // 注册全局函数，等待执行中...
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window[name] = res => {
        // 只要这个函数一执行，就表示请求成功，可以使用清除函数了
            // @ts-ignore
            if (window[name]) {
                cleanup();
            }
            // 将请求到的数据扔给then
            resolve(res);
        };
        // 以下将data对象格式的参数拼接到url的后面
        let str = '';
        // eslint-disable-next-line guard-for-in
        for (const key in data) {
            // eslint-disable-next-line no-negated-condition
            const value = data[key] !== undefined ? data[key] : '';
            str += `&${key}=${encodeURIComponent(value)}`;
        }
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        url = url + (url.indexOf('?') > 0 ? '' : '?') + str.substr(1);
        // 最后加上与服务端协商的jsonp请求字段
        url = `${url}${param}=${name}`;
        script.src = url;
        // 以下这条执行且成功后，全局等待函数就会被执行
        document.head.appendChild(script);
    });
}
