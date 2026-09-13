(() => {
    'use strict';
    const viewer = document.querySelector('.vf-gallery-viewer');
    if (!viewer || typeof viewer.showModal !== 'function') return;
    const links = [...document.querySelectorAll('[data-gallery-image]')];
    const image = viewer.querySelector('.vf-gallery-viewer-stage img');
    const title = viewer.querySelector('h2');
    const original = viewer.querySelector('[data-gallery-original]');
    const position = viewer.querySelector('[data-gallery-position]');
    const close = viewer.querySelector('[data-gallery-close]');
    let current = 0;
    let trigger;
    const show = index => {
        current = (index + links.length) % links.length;
        const source = links[current].querySelector('img');
        image.src = source.src;
        image.alt = source.alt;
        title.textContent = links[current].closest('figure').querySelector('h3').textContent;
        original.href = links[current].href;
        position.textContent = `${current + 1} / ${links.length}`;
    };
    links.forEach((link, index) => link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        trigger = link;
        show(index);
        viewer.showModal();
        document.body.classList.add('vf-gallery-modal-open');
        close.focus();
    }));
    close.addEventListener('click', () => viewer.close());
    viewer.querySelector('[data-gallery-previous]').addEventListener('click', () => show(current - 1));
    viewer.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
    viewer.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            show(current + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    viewer.addEventListener('click', event => {
        if (event.target !== viewer) return;
        const bounds = viewer.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
    });
    viewer.addEventListener('close', () => {
        document.body.classList.remove('vf-gallery-modal-open');
        trigger?.focus({ preventScroll: true });
    });
})();