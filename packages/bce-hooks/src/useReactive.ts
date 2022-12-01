/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */

import {stop, reactive, effect} from '@vue/reactivity';
import {useMemo, useEffect, useCallback} from 'react';
import {cloneDeep} from 'lodash';
import {isObject, isArray} from '@baidu/bce-helper';
import {useForceUpdate} from './lifeCycle';

export function useReactive<T extends object>(initState: T) {
    const forceUpdate = useForceUpdate();
    const stateOrigin = useMemo(() => cloneDeep(initState), [initState]);
    const state = useMemo(() => reactive<T>(initState), [initState]);
    const stateDeps = useMemo<Array<{key: string, isReset: boolean}>>(() => (initState as any).deps, [initState]);
    // 依赖收集， 只收集被 @State 装饰的属性
    const depsGather = useCallback((target = state, deps: Array<{key: string, isReset: boolean}> = stateDeps || []) => {
        deps.forEach(item => {
            const dep = (target as any)[item.key];
            if (isObject(dep)) {
                depsGather(dep, Object.keys(dep).map(tem => ({key: tem, isReset: item.isReset})));
            }
            if (isArray(dep)) {
                dep.forEach((curr: any) => {
                    if (isObject(curr)) {
                        depsGather(curr, Object.keys(curr).map(tem => ({key: tem, isReset: item.isReset})));
                    }
                });
            }
        });
    }, [state, stateDeps]);

    useEffect(() => {
        let isdep = false;
        const runner = effect(() => {
            depsGather();
            isdep && forceUpdate();
            if (!isdep) {
                isdep = true;
            }
        });
        return () => {
            stateDeps.forEach(item => {
                if (item.isReset) {
                    (state as any)[item.key] = (stateOrigin as any)[item.key];
                }
            });
            stop(runner);
        };
    }, [depsGather, forceUpdate, state, stateDeps, stateOrigin]);

    return state;
}
