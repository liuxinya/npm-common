<template>
    <van-popup
        v-model="show" position="bottom"
        :style="{height: '60%'}"
    >
        <div>
            <van-cell-group>
                <van-cell title="订单信息" :value="payInfo.title"/>
                <van-cell title="订单ID" :value="orderId"/>
                <van-cell
                    class="sum-cash-amount"
                    title="订单金额"
                    :value="payInfo.sumCashAmount"
                />
                <van-cell class="pay-method" title="支付方式">
                    <van-radio-group v-model="payMethod">
                        <van-radio name="balance">余额支付</van-radio>
                        <van-radio name="ALIPAY">支付宝支付</van-radio>
                    </van-radio-group>
                </van-cell>
            </van-cell-group>
            <div class="footer">
                <van-button
                    type="info" :loading="payButtonLoading"
                    @click="confirmPay"
                >确认支付</van-button>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { Toast as toast } from 'vant';
import VanPopup from 'vant/lib/popup/index';
import VanCellGroup from 'vant/lib/cell-group/index';
import VanRadioGroup from 'vant/lib/radio-group/index';
import VanRadio from 'vant/lib/radio/index';
import VanCell from 'vant/lib/cell/index';
import PayHelper from './PayHelper';
import VanButton from 'vant/lib/button/index';
import 'vant/lib/index.css';

function getChannelType(payMethod) {
    return payMethod === 'ALIPAY' ? 'ALIPAY' : 'BCEPAY';
}

export default {
    props: {
        orderId: {
            type: String,
            default: '',
        },
    },
    components: {
        VanPopup,
        VanCellGroup,
        VanRadioGroup,
        VanRadio,
        VanCell,
        VanButton,
    },
    data() {
        return {
            show: true,
            sumAmount: '',
            payMethod: 1,
            payHelper: null,
            payInfo: {
                sumCashAmount: '',
                originPrice: 0,
                balance: 0,
                orderStatus: 'INIT',
                isPureCoupon: null,
                title: ' ',
                serviceTypeSet: [],
                hasRebate: false,
                rebateBalance: 0,
                hasBaihuiCoin: false,
                baihuiCoinBalance: 0,
                supportPayByAgent: false,
                agentUserRegisterName: '',
                isBalanceEnough: true,
            },
            payButtonLoading: false,
        };
    },
    created() {
        this.show = true;
        const payHelper = new PayHelper({ orderId: this.orderId });
        this.payHelper = payHelper;
        payHelper.getPayInfo().then(e => {
            this.payInfo = e.result;
        });
    },
    methods: {
        confirmPay() {
            this.payButtonLoading = true;
            this.payHelper.appPay({
                orderId: this.orderId,
                channelType: getChannelType(this.payMethod),
                useBalance: this.payMethod === 'balance',
                useRebate: false,
                useCredit: false,
                useMixed: false,
                useBaihui: false,
                cashAmount: '0.00',
                rebateAmount: '0.00',
                successUrl: 'https://baidu.com',
                failureUrl: 'https://cloud.baidu.com',
            })
                .then(e => {
                    this.payButtonLoading = false;
                    toast.success('支付成功');
                    this.show = false;
                    this.$emit('paySucess');
                });
        },
    },
};
</script>

<style lang="less" scoped>
.van-cell-group {
    padding-top: 5px;

    &::after {
        display: none;
    }

    .van-cell {
        height: 50px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        &:last-child {
            height: auto;
            align-items: flex-start;
        }
        .van-cell__title {
            color: rgba(25,28,61,0.60);
            flex: none;
        }
        .van-cell__value {
            flex: 1;
            color: #191C3D;
        }
        &.sum-cash-amount {
           .van-cell__value {
               font-family: DINAlternate-Bold;
                font-size: 16px;
                color: #DB4A2C;
                font-weight: 700;
           }
        }
        &.pay-method {
            padding-top: 15px;
            .van-cell__value {
                padding-left: 34px;
                .van-radio {
                    margin-bottom: 16px;
                }
            }
            &::after {
                display: none;
            }
        }
    }
}

.footer {
    display: flex;
    position: absolute;
    bottom: 16px;
    width: 343px;
    height: 44px;
    left: 50%;
    transform: translateX(-50%);
    /deep/ .van-button {
        width: 100%;
        background: #2468F2;
        border-radius: 22px;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        font-weight: 400;
    }
}
</style>
