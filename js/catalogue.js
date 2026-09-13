(() => {
    'use strict';
    const hero = document.querySelector('.vf-hero');
    const playbackButton = document.querySelector('.vf-hero-playback');
    if (hero && playbackButton) {
        const slides = [...hero.querySelectorAll('.vf-hero-slide')];
        const controls = hero.querySelector('.vf-hero-controls');
        const rotationButton = hero.querySelector('.vf-hero-rotation');
        const dots = [...hero.querySelectorAll('[data-hero-slide]')];
        const status = hero.querySelector('[data-hero-status]');
        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
        let current = 0;
        let rotationPaused = reducedMotion.matches;
        let inView = true;
        let hovered = false;
        let timer;
        const activeVideo = () => slides[current].querySelector('video');
        const updatePlayback = () => {
            const heroVideo = activeVideo();
            playbackButton.hidden = !heroVideo || heroVideo.hidden;
            if (!heroVideo || heroVideo.hidden) return;
            playbackButton.setAttribute('aria-controls', heroVideo.id);
            const loading = !heroVideo.paused && heroVideo.readyState < 2;
            playbackButton.disabled = loading;
            if (loading) {
                playbackButton.setAttribute('aria-label', 'Loading hero video');
                playbackButton.title = 'Loading hero video';
                playbackButton.querySelector('i').className = 'fas fa-spinner fa-spin';
                return;
            }
            const label = heroVideo.paused ? 'Play hero video' : 'Pause hero video';
            playbackButton.setAttribute('aria-label', label);
            playbackButton.title = label;
            playbackButton.querySelector('i').className = heroVideo.paused ? 'fas fa-play' : 'fas fa-pause';
        };
        const playVideo = () => {
            const video = activeVideo();
            if (video && !video.hidden && inView && !document.hidden) video.play().catch(updatePlayback);
        };
        const schedule = () => {
            clearTimeout(timer);
            const label = rotationPaused ? 'Resume slideshow' : 'Pause slideshow';
            rotationButton.setAttribute('aria-label', label);
            rotationButton.title = label;
            rotationButton.querySelector('i').className = rotationPaused ? 'fas fa-play' : 'fas fa-pause';
            status.setAttribute('aria-live', rotationPaused ? 'polite' : 'off');
            if (!rotationPaused && !hovered && inView && !document.hidden) {
                const interval = current === 0 ? 25000 : Number(hero.dataset.slideInterval);
                timer = setTimeout(() => showSlide(current + 1), interval);
            }
        };
        const showSlide = index => {
            for (const video of hero.querySelectorAll('video')) video.pause();
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, index) => { slide.hidden = index !== current; });
            hero.querySelectorAll('[data-hero-message]').forEach((message, index) => {
                message.classList.toggle('is-active', index === current);
                message.setAttribute('aria-hidden', String(index !== current));
                message.inert = index !== current;
            });
            dots.forEach((dot, index) => {
                if (index === current) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            status.textContent = `Slide ${current + 1} of ${slides.length}`;
            const video = activeVideo();
            if (video && video.readyState >= 1) video.currentTime = 0;
            if (!reducedMotion.matches) playVideo();
            updatePlayback();
            schedule();
        };
        for (const heroVideo of hero.querySelectorAll('video')) {
            heroVideo.muted = true;
            for (const event of ['play', 'playing', 'waiting', 'loadeddata', 'pause']) heroVideo.addEventListener(event, updatePlayback);
            heroVideo.addEventListener('playing', () => {
                if (heroVideo !== activeVideo() || !inView || document.hidden) heroVideo.pause();
            });
            const showPoster = () => {
                heroVideo.pause();
                heroVideo.hidden = true;
                updatePlayback();
            };
            heroVideo.addEventListener('error', showPoster);
            const sources = [...heroVideo.querySelectorAll('source')];
            const failedSources = new Set();
            for (const source of sources) source.addEventListener('error', () => {
                failedSources.add(source);
                if (failedSources.size === sources.length) showPoster();
            });
        }
        controls.hidden = false;
        controls.addEventListener('click', event => {
            const step = event.target.closest('[data-hero-step]');
            const dot = event.target.closest('[data-hero-slide]');
            if (step || dot) {
                rotationPaused = true;
                showSlide(dot ? Number(dot.dataset.heroSlide) : current + Number(step.dataset.heroStep));
            }
        });
        rotationButton.addEventListener('click', () => {
            rotationPaused = !rotationPaused;
            if (rotationPaused) activeVideo()?.pause();
            else playVideo();
            schedule();
        });
        playbackButton.addEventListener('click', () => {
            rotationPaused = true;
            const video = activeVideo();
            if (video?.paused) playVideo();
            else video?.pause();
            schedule();
        });
        hero.addEventListener('mouseenter', () => { hovered = true; schedule(); });
        hero.addEventListener('mouseleave', () => { hovered = false; schedule(); });
        hero.addEventListener('focusin', event => {
            if (event.target !== rotationButton) rotationPaused = true;
            schedule();
        });
        const syncVisibility = () => {
            if (!inView || document.hidden) {
                for (const video of hero.querySelectorAll('video')) video.pause();
            } else if (!rotationPaused && !reducedMotion.matches) playVideo();
            schedule();
        };
        document.addEventListener('visibilitychange', syncVisibility);
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                inView = entries[0].isIntersecting;
                syncVisibility();
            }, { threshold: 0 }).observe(hero);
        }
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) {
                rotationPaused = true;
                for (const video of hero.querySelectorAll('video')) video.pause();
            }
            schedule();
        });
        updatePlayback();
        schedule();
        if (!reducedMotion.matches) playVideo();
    }
    const forgingReel = document.querySelector('.vf-forging-reel');
    if (forgingReel) {
        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
        let inView = false;
        let ready = false;
        let manuallyPaused = false;
        let automaticPauses = 0;
        const pauseReel = () => {
            if (forgingReel.paused) return;
            automaticPauses++;
            forgingReel.pause();
        };
        const startReel = () => {
            if (!ready || !inView || document.hidden || reducedMotion.matches || manuallyPaused) return;
            forgingReel.play().catch(() => {});
        };
        forgingReel.addEventListener('pause', () => {
            if (automaticPauses) automaticPauses--;
            else if (!forgingReel.ended) manuallyPaused = true;
        });
        forgingReel.addEventListener('play', () => { manuallyPaused = false; });
        forgingReel.addEventListener('playing', () => {
            if (!inView || document.hidden) pauseReel();
        });
        const setStart = () => {
            if (!Number.isFinite(forgingReel.duration) || forgingReel.duration <= 0) return;
            forgingReel.currentTime = 0;
            ready = true;
            forgingReel.dataset.startReady = 'true';
            startReel();
        };
        forgingReel.addEventListener('loadedmetadata', setStart, { once: true });
        if (forgingReel.readyState >= 1) setStart();
        forgingReel.addEventListener('ended', () => {
            forgingReel.currentTime = 0;
            startReel();
        });
        const showReelError = () => {
            document.querySelector('.vf-reel-fallback').hidden = false;
        };
        forgingReel.addEventListener('error', showReelError);
        const sources = [...forgingReel.querySelectorAll('source')];
        const failedSources = new Set();
        for (const source of sources) source.addEventListener('error', () => {
            failedSources.add(source);
            if (failedSources.size === sources.length) showReelError();
        });
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) pauseReel();
            else startReel();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) pauseReel();
            else startReel();
        });
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .35;
                if (inView) startReel();
                else pauseReel();
            }, { threshold: [0, .35] });
            observer.observe(forgingReel);
        }
    }
    const header = document.querySelector('.vf-header');
    const menuButton = document.querySelector('.vf-menu-button');
    if (header && menuButton) {
        header.classList.add('vf-enhanced');
        const mobile = matchMedia('(max-width: 850px)');
        const closeMenu = () => {
            header.classList.remove('vf-menu-open');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open navigation');
        };
        const resizeMenu = () => { menuButton.hidden = !mobile.matches; closeMenu(); };
        resizeMenu();
        mobile.addEventListener('change', resizeMenu);
        menuButton.addEventListener('click', () => {
            const opened = header.classList.toggle('vf-menu-open');
            menuButton.setAttribute('aria-expanded', String(opened));
            menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
        });
        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            const details = header.querySelector('details[open]');
            if (details) { details.open = false; details.querySelector('summary').focus(); }
            else if (header.classList.contains('vf-menu-open')) { closeMenu(); menuButton.focus(); }
        });
        document.addEventListener('click', event => {
            for (const details of header.querySelectorAll('details[open]')) if (!details.contains(event.target)) details.open = false;
        });
    }

    const productNavigation = document.querySelector('.vf-product-navigation');
    if (productNavigation) {
        document.addEventListener('click', event => {
            if (!productNavigation.contains(event.target)) {
                for (const details of productNavigation.querySelectorAll('details[open]')) details.open = false;
            }
        });
        productNavigation.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            const opened = productNavigation.querySelector('details[open]');
            if (opened) { opened.open = false; opened.querySelector('summary').focus(); }
        });
    }

    const catalogue = document.querySelector('[data-catalogue]');
    if (catalogue) {
        const form = catalogue.querySelector('form');
        const search = form.elements.q;
        const family = form.elements.family;
        const cards = [...catalogue.querySelectorAll('[data-product]')];
        const normalize = text => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const parameters = new URLSearchParams(location.search);
        search.value = parameters.get('q') || '';
        family.value = [...family.options].some(option => option.value === parameters.get('family')) ? parameters.get('family') : '';
        const filter = () => {
            const words = normalize(search.value).split(' ').filter(Boolean);
            let count = 0;
            for (const card of cards) {
                const match = words.every(word => normalize(card.dataset.search).includes(word)) && (!family.value || card.dataset.family === family.value);
                card.hidden = !match;
                if (match) count++;
            }
            catalogue.querySelector('#result-count').textContent = `${count} flange ${count === 1 ? 'type' : 'types'}`;
            catalogue.querySelector('.vf-empty').hidden = count !== 0;
        };
        form.addEventListener('input', filter);
        form.addEventListener('change', filter);
        form.addEventListener('submit', event => { event.preventDefault(); filter(); });
        form.addEventListener('reset', () => { search.value = ''; family.value = ''; queueMicrotask(filter); });
        catalogue.querySelector('[data-reset-filters]').addEventListener('click', () => { form.reset(); search.focus(); });
        filter();
    }

    const quote = document.querySelector('#vf-quote-form');
    if (quote) {
        const parameters = new URLSearchParams(location.search);
        const category = quote.elements.category;
        const categoryValue = parameters.get('category');
        if ([...category.options].some(option => option.value === categoryValue)) category.value = categoryValue;
        quote.elements.product.value = (parameters.get('product') || '').slice(0, 160);
        for (const field of ['material', 'standard', 'facing']) quote.elements[field].value = (parameters.get(field) || '').slice(0, 160);
        const updateFields = () => {
            const flange = category.value === 'Flanges';
            quote.querySelector('[data-flange-field]').hidden = !flange;
            quote.elements.facing.disabled = !flange;
            quote.querySelector('[data-fitting-field]').hidden = flange;
            quote.elements.connection.disabled = flange;
        };
        category.addEventListener('change', updateFields);
        updateFields();
        quote.addEventListener('submit', event => {
            event.preventDefault();
            if (!quote.reportValidity()) return;
            const labels = { category: 'Category', product: 'Product', material: 'Material / grade', size: 'Nominal size', rating: 'Rating', standard: 'Standard', facing: 'Facing', connection: 'Schedule / end connection', quantity: 'Quantity', drawing: 'Drawing reference', name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', message: 'Requirements' };
            const lines = ['Valtron website enquiry'];
            for (const [name, value] of new FormData(quote)) if (String(value).trim() && labels[name]) lines.push(`${labels[name]}: ${String(value).trim()}`);
            const url = `https://wa.me/919619770076?${new URLSearchParams({ text: lines.join('\n') })}`;
            const status = document.querySelector('#quote-status');
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Open the prepared enquiry in WhatsApp';
            status.replaceChildren(link);
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }
})();