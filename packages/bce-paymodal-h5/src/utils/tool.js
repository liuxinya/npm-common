import axios from 'axios';

import {Toast as toast} from 'vant';


let instance = null;

export function initAxios(config = {}) {
    instance = axios.create({
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Request-By': 'VueApplication',
            'csrfToken': getCsrfToken(),
            'toast': true,
        },
        ...config
    });

    instance.interceptors.request.use((config) => {
        if (config.params) {
            Object.assign(config.params, {locale: 'zh-cn'});
        } else {
            config.params = {locale: 'zh-cn'};
        }

        const headers = config.headers;
        if (headers && headers.region) {
            config.headers['X-Region'] = headers.region;
        }

        if (!config.silence) {
            toast.loading({
                duration: 0,
                forbidClick: true,
                loadingType: 'spinner',
            });
        }
        return config;
    });

    instance.interceptors.response.use(response => {
        toast.clear();
        if (response.data.success === false || response.data.success === 'false') {
            const errorStr = JSON.stringify(response.data.message);
            if (instance.defaults.headers && instance.defaults.headers.toast === true) {
                toast({
                    type: 'fail',
                    message: errorStr,
                    duration: 2000,
                });
            }

            return Promise.reject(response.data.message);
        }
        return response && response.data;
    }, error => {
        toast.fail(error.message);
        return Promise.reject(error);
    });
}

function getCsrfToken() {
    const csrfToken = getCookie('bce-user-info');
    if (csrfToken) {
        return csrfToken.replace(/'|"/g, '');
        // const firstCharacter = csrfToken[0];
        // console.log(firstCharacter);
        // // 如果两边是引号 就去掉两边
        // return (firstCharacter === '"' | firstCharacter === "'" | firstCharacter === '\"')
        //     ? csrfToken.slice(1, -1)
        //     : csrfToken;
    } else {
        return '';
    }
}

function getCookie(name) {
    let match = new RegExp('(^|;\\s*)(' + name + ')=([^;]*)').exec(document.cookie);
    return (match ? decodeURIComponent(match[3]) : null);
}

function isAbsoluteUrl(url) {
    return new RegExp('^(http|https)://', 'i').test(url);
}
export {
    instance as http,
    getCookie,
    getCsrfToken,
};
