import './index.less';
import { throttle } from 'lodash';

function lazyLoad(options = {}) {
    const { cls, srcAttr, offset, container } = {...options, ...{
        cls: 'lazy',
        srcAttr: 'data-src',
        container: window,
        offset: window.innerHeight
    }};

    function load() {
        const imgs = $('.' + cls);

        imgs.each((idx, img) => {
            setTimeout(() => {
                const src = img.getAttribute(srcAttr);
                const rect = img.getBoundingClientRect();

                if (!src ||
                    rect.bottom + offset <  0 ||
                    rect.top > window.innerHeight + offset) {
                    return;
                }

                img.removeAttribute('data-src');

                const loadedCls = img.className.replace(cls, 'loaded');

                // set img tag src attribute
                if (img.tagName.toLowerCase() === 'img') {
                    img.onload = () => {
                        img.className = loadedCls;
                    };

                    img.onerror = () => {
                        // img.className = 'error';
                    };

                    img.setAttribute('src', src);
                } else {
                    // set none img tag background-image
                    const image = new Image();

                    image.onload = () => {
                        img.className = loadedCls;
                        img.style.backgroundImage = `url(${src})`;
                    };

                    image.onerror = () => {
                        // img.className = 'error';
                    };

                    image.src = src;
                }
            }, 0);
        });
    }

    load();

    $(container).on('scroll touchend', throttle(load, 200));

    return load;
}

export default lazyLoad;
