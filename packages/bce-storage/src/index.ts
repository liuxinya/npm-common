
interface OptionObj {
    key: string;
    storage?: 'localStorage' | 'sessionStorage';
    payload?: any;
}

interface PostMessageOptionObj extends OptionObj {
    cmd: 'get' | 'set';
}

class BceStorage {
    origin: string = null;
    iframeEle: HTMLIFrameElement = null;
    isLoaded = false;
    isInited = false;
    init(env: 'SANDBOX' | 'ONLINE') {
        this.isInited = true;
        this.origin = `https://cloud${env === 'SANDBOX' ? 'test' : ''}.baidu.com`;
        const oldIframeEle = document.getElementById('bceStorage');
        if (oldIframeEle) {
            this.isLoaded = true;
            this.iframeEle = oldIframeEle as HTMLIFrameElement;
            return;
        }
        this.iframeEle = document.createElement('iframe');
        this.iframeEle.setAttribute('src', `${this.origin}/helper/i.html`);
        this.iframeEle.setAttribute('id', 'bceStorage');
        this.iframeEle.setAttribute('style', 'width:0;height:0;border:0;position:absolute;');
        const bodyEle = document.querySelector('body');
        bodyEle.appendChild(this.iframeEle);
        this.iframeEle.onload = () => {
            this.isLoaded = true;
        };
    }
    private postMessage(option: PostMessageOptionObj) {
        this.iframeEle.contentWindow.postMessage(JSON.stringify(option), this.origin);
    }

    get = (option: OptionObj) => {
        return new Promise((resolve: (value: string) => void, reject) => {
            if (!this.isInited) {
                reject(new Error('bceStorage: Need init!'));
            }
            const handleMessage = (e: MessageEvent<string>) => {
                const timer = setTimeout(() => {
                    reject(new Error('bceStorage: Response timeout!'));
                }, 5000);
                if (e.origin === this.origin && e.data) {
                    clearTimeout(timer);
                    window.removeEventListener('message', handleMessage);
                    resolve(e.data);
                }
            };
            window.addEventListener('message', handleMessage);
            const postMessageOption: PostMessageOptionObj = {
                ...option,
                cmd: 'get',
            };
            if (this.isLoaded) {
                this.postMessage(postMessageOption);
            } else {
                let time = 0;
                const timer = setInterval(() => {
                    if (this.isLoaded) {
                        clearInterval(timer);
                        this.postMessage(postMessageOption);
                        return;
                    }
                    time += 50;
                    if (time > 5 * 1000) {
                        window.removeEventListener('message', handleMessage);
                        clearInterval(timer);
                        reject(new Error('bceStorage: Load iframe timeout!'));
                    }
                }, 50);
            }
        });
    };
    set = (option: OptionObj) => {
        return new Promise((resolve: (value: string) => void, reject) => {
            if (!this.isInited) {
                reject(new Error('bceStorage: Need init!'));
            }
            const postMessageOption: PostMessageOptionObj = {
                ...option,
                cmd: 'set',
            };
            if (this.isLoaded) {
                this.postMessage(postMessageOption);
                resolve(JSON.stringify(option.payload));
            } else {
                let time = 0;
                const timer = setInterval(() => {
                    if (this.isLoaded) {
                        this.postMessage(postMessageOption);
                        clearInterval(timer);
                        resolve(JSON.stringify(option.payload));
                        return;
                    }
                    time += 50;
                    if (time > 5 * 1000) {
                        clearInterval(timer);
                        reject(new Error('bceStorage: Load iframe timeout!'));
                    }
                }, 50);
            }
        });
    };
}

const bceStorage = new BceStorage();

export default bceStorage;
