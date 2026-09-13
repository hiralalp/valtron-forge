(() => {
    'use strict';
    if (!document.body.classList.contains('vf-home')) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    for (const [selector, label] of [['.vf-testimonial-grid', 'testimonials'], ['.vf-inspection-logos', 'inspection logos']]) {
        const original = document.querySelector(selector);
        if (!original || !('ResizeObserver' in window) || !('IntersectionObserver' in window)) continue;
        const section = original.closest('section');
        const viewport = document.createElement('div');
        viewport.className = 'vf-marquee';
        const track = document.createElement('div');
        track.className = 'vf-marquee-track';
        original.before(viewport);
        viewport.append(track);
        track.append(original);
        const copy = original.cloneNode(true);
        copy.classList.add('vf-marquee-copy');
        copy.setAttribute('aria-hidden', 'true');
        copy.inert = true;
        for (const image of copy.querySelectorAll('img')) image.loading = 'eager';
        track.append(copy);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'vf-marquee-toggle';
        button.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
        section.querySelector('.vf-section-heading').append(button);
        let paused = false;
        let inView = false;
        let hovered = false;
        const update = () => {
            const enabled = !paused && !reducedMotion.matches;
            viewport.classList.toggle('vf-marquee-enabled', enabled);
            viewport.classList.toggle('vf-marquee-running', enabled && inView && !hovered && !document.hidden && !viewport.matches(':focus-within'));
            const action = `${enabled ? 'Pause' : 'Resume'} ${label} motion`;
            button.setAttribute('aria-label', action);
            button.title = action;
            button.querySelector('i').className = enabled ? 'fas fa-pause' : 'fas fa-play';
            button.hidden = reducedMotion.matches;
        };
        button.addEventListener('click', () => { paused = !paused; update(); });
        viewport.addEventListener('mouseenter', () => { hovered = true; update(); });
        viewport.addEventListener('mouseleave', () => { hovered = false; update(); });
        viewport.addEventListener('focusin', update);
        viewport.addEventListener('focusout', () => queueMicrotask(update));
        reducedMotion.addEventListener('change', update);
        document.addEventListener('visibilitychange', update);
        new ResizeObserver(entries => {
            viewport.style.setProperty('--vf-marquee-width', `${entries[0].contentRect.width}px`);
        }).observe(viewport);
        new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); }).observe(viewport);
        update();
    }
    const activeAnimations = new Set();
    const animate = (element, delay = 0) => {
        if (reducedMotion.matches || !element.animate) return;
        const animation = element.animate([
            { opacity: .12, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
        activeAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
    };
    document.querySelectorAll('.vf-hero-copy > *').forEach((element, index) => animate(element, index * 100));
    if ('IntersectionObserver' in window) {
        const reveal = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                animate(entry.target, Number(entry.target.dataset.revealDelay || 0));
                entry.target.dataset.revealed = 'true';
                reveal.unobserve(entry.target);
            }
        }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
        const selectors = '.vf-section-heading, .vf-product, .vf-home-about > div, .vf-home-material-grid > div, .vf-home-industry-grid article, .vf-home-standard-list > a, .vf-home-facing-grid article, .vf-home-quality-grid > div, .vf-home-drawing > *, .vf-step-list > div, .vf-browse-grid > a, .vf-home-faq details';
        document.querySelectorAll(selectors).forEach(element => {
            const index = [...element.parentElement.children].indexOf(element);
            element.dataset.revealDelay = String(Math.min(index % 3, 2) * 80);
            reveal.observe(element);
        });
    }
    const links = [...document.querySelectorAll('.vf-home-jump a')];
    const sections = links.map(link => document.querySelector(link.hash));
    const progress = document.createElement('div');
    progress.className = 'vf-reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    const hero = document.querySelector('.vf-hero');
    const media = hero.querySelectorAll('.vf-hero-video, .vf-hero-photo');
    let queued = false;
    const renderScroll = () => {
        queued = false;
        const current = sections.findLastIndex(section => section && section.getBoundingClientRect().top <= innerHeight * .3);
        links.forEach((link, index) => {
            if (index === current) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        if (reducedMotion.matches) return;
        const distance = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
        const bounds = hero.getBoundingClientRect();
        const offset = Math.min(20, Math.max(0, -bounds.top * .06));
        for (const element of media) element.style.transform = `translateY(${offset}px) scale(1.075)`;
    };
    const scheduleScroll = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(renderScroll);
    };
    addEventListener('scroll', scheduleScroll, { passive: true });
    addEventListener('resize', scheduleScroll, { passive: true });
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            for (const animation of activeAnimations) animation.cancel();
            for (const element of media) element.style.transform = '';
        } else scheduleScroll();
    });
    scheduleScroll();
})();