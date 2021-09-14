
// 接入登录
export function wxLogin(config: {
    appId: string;
    loginWay?: 'snsapi_base' | 'snsapi_userinfo';
}): void {
    const {appId, loginWay = 'snsapi_base'} = config;
    const url = encodeURIComponent(window.location.href); // 注意一定要encodeURIComponent
    // eslint-disable-next-line max-len
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=${loginWay}&state=#wechat_redirect`;
}

export function wxSdkLoad(config: {
    appId: string;
    timestamp: string;
    nonceStr: string;
    signature: string;
    jsApiList?: string[];
    shareInfo: {
        title: string; // 分享标题
        link: string; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        desc?: string; // 分享描述 (朋友圈没有描述)
        imgUrl: string; // 分享图标
        success?: () => void;
    };
}) {
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.onload = () => {
        // eslint-disable-next-line dot-notation
        const wx = (window as any)['wx'];
        wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: config.jsApiList || [
                'updateAppMessageShareData', // 分享给朋友
                'updateTimelineShareData', // 朋友圈
            ],
        });
        wx.error((e: any) => {
            console.log('error', e);
        });
        wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({
                ...config.shareInfo,
                // eslint-disable-next-line func-names
                success: function () {
                    config.shareInfo.success && config.shareInfo.success();
                },
            });
            wx.updateTimelineShareData({
                ...config.shareInfo,
                // eslint-disable-next-line func-names
                success: function () {
                    config.shareInfo.success && config.shareInfo.success();
                },
            });
        });
    };
    document.body.appendChild(script);
}
