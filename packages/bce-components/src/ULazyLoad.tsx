import {useRef, cloneElement} from 'react';
import {useOnMount} from '@baidu/bce-hooks';

type Type = 'background' | 'backgroundImage' | 'all-imgs' | 'callback';
export function ULazyLoad(
    props: {
        option?: IntersectionObserverInit;
        children: JSX.Element;
        type?: Type;
        lazyCallback?: (e: Element) => void;
    } & JSX.IntrinsicElements['div']
) {
    const ref = useRef<HTMLDivElement>(null);
    useOnMount(() => {
        let observerable: IntersectionObserver = null;
        try {
            observerable = new IntersectionObserver(entries => {
                entries.forEach(item => {
                    const target = item.target as HTMLImageElement;
                    if (item.isIntersecting && target.classList.contains('lazy')) {
                        setSrc(props.type, target, props.lazyCallback);
                        target.classList.remove('lazy');
                        observerable.unobserve(target);
                    }
                });
            }, {
                rootMargin: '0px 0px 256px 0px',
                ...props.option,
            });
        } catch (e) {
            // 不兼容就直接赋值，以防页面资源位置空白
            setSrc(props.type, ref.current, props.lazyCallback);
        }
        observerable.observe(ref.current);
        return () => {
            ref.current && observerable.unobserve(ref.current);
        };
    });
    return cloneElement(props.children, {
        ref,
        className: `${props.children.props.className} lazy`,
    });
}

function setSrc(type: Type, target: any, lazyCallback: (e: Element) => void) {
    switch (type) {
        case 'background':
            target.classList.add('visible');
            break;
        case 'backgroundImage':
            target.style.backgroundImage = `url(${target.dataset.url})`;
            break;
        case 'all-imgs':
            // eslint-disable-next-line no-case-declarations
            const imgs = target.querySelectorAll('img.lazy') as unknown as HTMLImageElement[];
            imgs.forEach(item => {
                item.src = item.dataset.src;
            });
            break;
        case 'callback':
            lazyCallback && lazyCallback(target);
            break;
        default:
            target.src = target.dataset.src;
    }
}
