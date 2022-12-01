import {useState, useRef, useCallback, Dispatch, SetStateAction} from 'react';
import {isFunction} from '@baidu/bce-helper';


// 对state的扩展
// 组件渲染更新用 state 对于立即要用的变量直接使用ref
// 这符合我们对数据的直觉，不用考虑闭包和capture value特性

export function useStateRef<T>(initialState: T | (() => T)): [
    T,
    Dispatch<SetStateAction<T>>,
    React.MutableRefObject<T>
] {
    const refContainer = useRef<T>();

    const [state, setState] = useState<T>(() => {
        // 初始化保留state的可以传入函数的特性
        const value = isFunction(initialState) ? (initialState as any)() : initialState;
        refContainer.current = value;
        return value;
    });

    // 把setState的原始用法也保留
    const setValue = useCallback((value: any) => {
        if (isFunction(value)) {
            setState((prevState: T) => {
                const newState = value(prevState);
                refContainer.current = newState;
                return newState;
            });
        } else {
            setState(value);
            refContainer.current = value;
        }
    }, []);

    return [state, setValue, refContainer];
}
