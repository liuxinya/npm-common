## 更新指南

1. 安装所有 package 的依赖

```ts
lerna bootstrap
```
2. 先  `git add .`,  `git commit`

3. 更新包内容之后 可执行一次 `lerna changed` 查看待发布包

4. 编译 `lerna run build`  

5. 发布 `lerna publish` 只发布不提交至git仓库 `lerna publish --no-push`


## `其他`

+ `lerna clean`  

    - 清理所有 package 的 node_modules 文件夹

* `lerna run build`

    - 执行所有 package 的 `build` 指令

* `发布失败了，包版本已经被lerna更改了咋办`

回退方案
```
lerna publish from-git

git reset --hard HEAD~1 && git tag -d $(git log --date-order --tags --simplify-by-decoration --pretty=format:'%d' | head -1 | tr -d '()' | sed 's/,* tag://g')

```

# 关于bce-storage的特别解释
## 使用文档
http://wiki.baidu.com/pages/viewpage.action?pageId=1593070933

## 开发相关
如果更新了npm包，记得更新一下bos上的文件，具体步骤如下：
1. yarn build
2. 修改dist里的index.js文件，删掉 ```Object.defineProperty(exports, "__esModule", { value: true });```
    将最后一行```exports.default = bceStorage;```改成```window.bceStorage = bceStorage;```
3. 将文件index.js改名上传到bos对应文件夹下，/bce-cdn/portal-server/common/bce-storage.js
