import Vue from 'vue';
import Pay from './Pay.vue';
import { initAxios } from './utils/tool';

export default {
    create(config) {
        // 外界可自行配置axios
        initAxios(config.httpConfig);
        const el = document.createElement('div');
        document.body.appendChild(el);
        const payContainerInstance = new Vue({
            render: h => h(Pay, {
                props: {
                    orderId: config.orderId,
                },
            }),
        }).$mount(el);
        return payContainerInstance.$children && payContainerInstance.$children[0];
    },
};
