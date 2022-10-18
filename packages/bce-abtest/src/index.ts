import {getCookie} from '@baidu/bce-helper';
import {netService} from '@baidu/bce-services';

export enum TestStatus {
    BEFORE_START = 'BEFORE_START',
    ONGOING = 'ONGOING',
    END = 'END',
    DELETE = 'DELETE'
}

const urlMap: {
    [p in AbtestConsructorParams['env']]: string;
} = {
    'dev': 'https://yapi.baidu-int.com/mock/24735/api/cms_portal/abtest/:id',
    'sandbox': '',
    'online': ''
}

export class Abtest {
    private params: AbtestConsructorParams = null;
    private abInfo: ABDetailObj = null;
    // 分流id，或百度id、或accountId
    private ruleId: string = '';
    constructor(params: AbtestConsructorParams) {
        this.params = params;   
        this.setUp();
    }
    private async setUp() {
        // 获取信息
        this.abInfo = await this.getAbInfo();
        // 确定分流id 
        this.ruleId = this.getRuleId();
        const val = this.flowHandler();
        this.params.callback(val, this.abInfo)
    }
    private flowHandler(): number {
        let val = -1;
        try {
            // 进行中的实验 开始分流
            if (this.abInfo?.abtestStatus === TestStatus.ONGOING) {
                // 外界自定义规则
                if (this.params.rule) {
                    return this.params.rule(this.abInfo) || this.defaultVersion;
                }
                const test0 = this.abInfo.testList[0];
                const test1 = this.abInfo.testList[1];
                // 实验分流的区间
                const areaKey = test0.flow / 100 * 16;
                // 当前用户的分流标志
                // console使用传入的accountId的最后一位
                const userKey: number = parseInt(this.isAccountId ? this.ruleId[this.ruleId.length - 1] : this.ruleId[0], 16);
                val = userKey < areaKey ? test0.version : test1.version;
                // 查看白名单，重新修正val
                this.abInfo.testList.forEach(item => {
                    if (item.whiteList.includes(this.ruleId)) {
                        val = item.version;
                    }
                })
            } else {
                val = this.defaultVersion;
            }
        } catch {
            val = this.defaultVersion;
        }
        return val;
    }
    private getRuleId() {
        if ((this.isServer || this.isConsole) && !this.params.ruleId) {
            const errMsg = '缺少分流规则id，请手动传入百度Id或accountId';
            console.error('getRuleId', errMsg);
            this.params.errHandler && this.params.errHandler(errMsg);
        }
        return this.params.ruleId || getCookie('BAIDUID') as string;
    }
    public async getAbInfo() {
        if (this.abInfo) return this.abInfo;
        try {
            const res = await netService.get<null, ABDetailObj, {id: string}>(urlMap[this.params.env || 'online'], null, {id: this.params.id});
            return res.result;
        } catch(e) {
            const errMsg = `${e}-abtest信息获取出错`;
            console.error('getAbInfo', errMsg);
            this.params.errHandler && this.params.errHandler(errMsg);
        }
        
    }
    private get isServer() {
        try {
            return !window;
        } catch (e) {
            return true;
        }
    }
    private get defaultVersion() {
        return this.abInfo?.defaultVersion ?? this.params.defaultVersion;
    }
    private get isConsole() {
        const url = window.location.href;
        return this.abInfo && this.abInfo.system === 'console'
            || url.includes('qasandbox.bcetest.baidu.com')
            || url.includes('console.bce.baidu.com');
    }
    private get isAccountId() {
        return this.abInfo && this.abInfo.diversionBasis === 'accountId';
    }
}


export type AbtestConsructorParams = {
    id: string;
    defaultVersion: number;
    // 分流id, 适用于 accountid 或者 服务端的百度ID
    ruleId?: string;
    // 自定义分流规则, 返回版本值信息
    rule?: (abInfo: ABDetailObj) => number;
    env?: 'dev' | 'sandbox' | 'online';
    callback: (val: number, abInfo: ABDetailObj) => void;
    errHandler?: (errMsg: string) => void;
}

type ABItemObj = {
    flow: number;
    groupId: string;
    whiteList: string[];
    version: number;
    desc: string;
}


export type ABDetailObj = {
    abtestId: string;
    abtestName: string;
    attendedFlow: number;
    startTime: string;
    endTime: string;
    diversionBasis: 'baiduId' | 'accountId';
    abtestStatus: TestStatus;
    createdBy: string;
    createdAt: string;
    system: 'console' | 'portal';
    defaultVersion: number;
    testList: ABItemObj[];
}
