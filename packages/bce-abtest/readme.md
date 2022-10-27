# abtest分流统一入口

## 用法
```js
import Abtest from '@baidu/bce-abtest';

new Abtest({
    id: '21',
    ruleId: '888',
    env: 'dev',
    rule: () => 1,
    defaultVersion: 0,
    callback: val => {},
})
```

## 参数interface
```js
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
```

## ABDetailObj  
```js
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

type ABItemObj = {
    flow: number;
    groupId: string;
    whitelist: string[];
    version: number;
    description: string;
}
```


## 介绍

|字段|介绍|是否必需|
|---|---|---|
|id|abtest的唯一ID|√|
|defaultVersion|默认版本值，停止实验或内部出错时得默认值|√|
|callback: (p1, p2) => {}|分流回调，p1是分流版本值，p2是abtest详细信息|√|
|ruleId|分流ID，不传默认使用baiduid。如果是服务端或者console，这个值必传|视情况|
|rule|分流规则，提供给外界用于自定义分流规则，返回值会自动传入callback|X|
|env|当前环境，默认线上环境|X|
|errHandler: err => {}|错误回调|X|

## env参数值介绍

+ 类型定义 
    -  AbtestConsructorParams['env']
+ 值
    - dev sandbox online
