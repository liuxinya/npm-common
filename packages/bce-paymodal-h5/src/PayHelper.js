import {
    http,
    getCsrfToken
} from './utils/tool';
import $ from 'jquery';
// import context from '../../context';
// import bridge from '../../bridge';
// import {Toast as toast} from 'vant';

const csrfToken = getCsrfToken();

export default class PayHelper {
    constructor({ orderId }) {
        this.orderId = orderId;
    }

    getPayInfo() {
        return http.post('/api/finance/payinfo', { orderId: this.orderId });
    }

    browserAlipay(payload) {
        return new Promise(() => {
            const submitSimpleForm = function (api, data) {
                const form = $('<form />').attr({
                    action: api,
                    method: 'get',
                    target: '_self',
                }).hide();

                $.each(data, function (key, val) {
                    form.append($('<input />').attr({
                        name: key,
                        value: val,
                    }));
                });

                form.append($('<input />').attr({
                    name: 'token',
                    value: csrfToken,
                }));

                $(document.body).append(form);
                form.submit();
                form.remove();
            };

            submitSimpleForm('/api/finance/payment/v2', payload);
        });
    }

    nativeAlipay(payload) {
        return http.post('/api/finance/app/pay', {
            orderId: this.payOrderId,
            // 根据后台调整，所有余额逻辑走mix，useRebate 和 useBalance 无效化,不确定有坑否
            useBalance: false,
            useRebate: false,
            useCredit: false,
            useMixed: false,
            cashAmount: '0.00',
            rebateAmount: '0.00',
            channelType: 'ALIPAY',
            token: csrfToken,
            deviceType: 'APP',
            ...payload,
        })
            .then(res => {
                if (res.result.request_content) {
                    bridge.alipay(res.result.request_content);
                } else {
                    return Promise.reject('支付宝token生成失败，请前往订单列表重新支付');
                }
            });
    }

    alipay(payload) {
        return this.browserAlipay(payload);
        // switch (context.platform) {
        //     case 'browser':
        //         // 浏览器内的支付宝支付走表单提交
        //     case 'android':
        //         return this.nativeAlipay(payload);
        //     case 'ios':
        //         return this.nativeAlipay(payload);
        //     default:
        //         return this.browserAlipay(payload);
        // }
    }

    cashPay(payload) {
        return http.post('/api/finance/app/pay', {
            orderId: this.payOrderId,
            // 根据后台调整，所有余额逻辑走mix，useRebate 和 useBalance 无效化,不确定有坑否
            useBalance: false,
            useRebate: false,
            useCredit: this.payType === 'credit',
            useMixed: !!(this.payType === 'balance' && (this.useBalance === true || this.useRebate === true)),
            cashAmount: this.useBalance && this.payType === 'balance' ? this.useBalanceNum.toFixed(2) : 0,
            rebateAmount: this.useRebate && this.payType === 'balance' ? this.useRebateNum.toFixed(2) : 0,
            channelType: this.payType === 'ALIPAY' ? (window.isInApp ? 'ALIPAY' : 'ALIPAY_WAP') : 'BCEPAY',
            token: csrfToken,
            deviceType: 'APP',
            ...payload,
        });
    }

    appPay(payload) {
        switch (payload.channelType) {
        case 'ALIPAY':
            return this.alipay(payload);
        case 'BCEPAY':
            // 余额支付直接走API
            return this.cashPay(payload);
        default:
            return Promise.reject('不支持的支付方式：' + payload.channelType);
        }
    }
}
