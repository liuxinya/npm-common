import React, {useRef} from 'react';
import {useOnMount} from '@baidu/bce-hooks';
import {RxObject} from '@baidu/bce-helper';

export function DomExposure(props: {
    children: JSX.Element;
    options?: IntersectionObserverInit;
    type?: string;
    label?: string;
    value?: string;
    exposureHandler?: () => void;
    className?: string;
}) {
    const {type, label, value, className} = props;
    const ref = useRef<HTMLDivElement>(null);
    useOnMount(() => {
        let observer: IntersectionObserver = null;
        if (ref.current && !observer && window.IntersectionObserver) {
            const rx = new RxObject<HTMLDivElement>(null);
            const exposureHandler = () => {
                props.exposureHandler && props.exposureHandler();
                if (props.type && props.label) {
                    const pushConfig = ['_trackEvent', type, 'exposure', label, value];
                    (window as any) && (window as any)._hmt.push(pushConfig);
                }
            };
            rx.subscribe(exposureHandler);
            observer = new IntersectionObserver(entries => {
                for (const item of entries) {
                    if (item.isIntersecting) {
                        rx.next(item.target as any);
                        rx.unsubscribe(exposureHandler);
                    }
                }
            }, {
                threshold: 1,
                ...props.options,
            });
            observer.observe(ref.current);
        }
        return () => {
            observer && ref.current && observer.unobserve(ref.current);
        };
    });

    return (
        <div ref={ref} className={className}>
            {props.children}
        </div>
    );
}
