/* eslint-disable no-negated-condition */
/* eslint-disable dot-notation */

export function downloadFileByFrontend(data: BlobPart, fileName: string) {
    //  注意 请求类型 一定要改成 responseType: 'blob'
    const blob = new Blob([data], {type: 'application/vnd.ms-excel'});
    // @ts-ignore
    if (typeof window['chrome'] !== 'undefined') {
        // Chrome version
        const a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.click();
    } else {
        // Firefox version
        const file = new File([data], fileName, {type: 'application/force-download'});
        window.open(URL.createObjectURL(file));
    }
}


export function downFileByArrayBuffer(data: BlobPart, fileName: string) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 下载完成移除元素
    window.URL.revokeObjectURL(url); // 释放掉blob对象
}