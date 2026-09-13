import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { references } from './references.mjs';
import { products, additionalProducts } from './catalogue.mjs';
import { galleryImages } from './gallery.mjs';

const browser = await chromium.launch({ headless: true });
const output = '_not-deployed/browser-checks';
await mkdir(output, { recursive: true });
const url = path => pathToFileURL(resolve(path)).href;
try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const path of ['index.html', 'service.html', 'about.html', 'gallery.html', 'flanges.html', 'weld-neck-flanges.html', 'orifice-flanges.html', 'contact.html', 'flange-materials.html', 'forged.html', 'flange-standards.html', 'flange-facing-finish.html', 'stainless-steel-flanges.html', 'asme-b16-47-series-a-flanges.html', 'sans-1123-flanges.html', 'tongue-and-groove-flanges.html', 'rtj-flanges.html', 'lap-joint-facing.html', 'asme-b16-48-line-blanks.html', 'flange-types-guide.html', 'flange-pressure-ratings.html', 'flange-material-selection.html', ...additionalProducts.map(product => `${product.slug}.html`)]) {
            await page.goto(url(path), { waitUntil: 'load' });
            await page.evaluate(() => { for (const image of document.images) image.loading = 'eager'; });
            await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout: 15000 });
            const issues = await page.evaluate(() => {
                const images = [...document.images];
                return {
                    overflow: document.documentElement.scrollWidth > innerWidth + 1,
                    broken: images.filter(image => !image.naturalWidth).map(image => image.src),
                    clipped: [...document.querySelectorAll('h1, h2, h3, .vf-button, label')].filter(element => element.scrollWidth > element.clientWidth + 2).map(element => element.textContent)
                };
            });
            assert.equal(issues.overflow, false, `${path} ${viewport.width}: viewport overflow`);
            assert.deepEqual(issues.broken, [], `${path} ${viewport.width}: images`);
            assert.deepEqual(issues.clipped, [], `${path} ${viewport.width}: clipped text`);
            const whatsapp = page.locator('.vf-whatsapp');
            assert.equal(await whatsapp.count(), 1);
            assert.equal(await whatsapp.evaluate(link => {
                const bounds = link.getBoundingClientRect();
                return getComputedStyle(link).position === 'fixed' && bounds.width === 56 && bounds.height === 56 && Math.abs(innerWidth - bounds.right - 20) < 1 && Math.abs(innerHeight - bounds.bottom - 20) < 1;
            }), true, `${path} ${viewport.width}: WhatsApp fixed at bottom right`);
            assert.notEqual(await whatsapp.locator('i').evaluate(icon => getComputedStyle(icon, '::before').content), 'none');
            if (await page.locator('.back-to-top').count()) {
                await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
                assert.equal(await whatsapp.evaluate(link => {
                    const back = document.querySelector('.back-to-top').getBoundingClientRect();
                    return back.bottom <= link.getBoundingClientRect().top - 8;
                }), true, `${path}: floating controls separated`);
                await page.evaluate(() => scrollTo(0, 0));
            }
            if (path === 'index.html') {
                await page.waitForFunction(() => {
                    const video = document.querySelector('.vf-hero-video');
                    return video.readyState >= 2 && video.videoWidth > 0 && !video.paused && video.currentTime > .2;
                }, null, { timeout: 20000 });
                assert.equal(await page.locator('#hero-video').evaluate(video => video.muted && video.loop && video.playsInline), true);
                assert.equal(await page.locator('#hero-video').evaluate(video => video.currentSrc.endsWith('/video/banner-forging.webm') && video.videoWidth === 1280 && Math.abs(video.duration - 25) < .2), true, 'first clip contains only original 00:05 through 00:30');
                await page.locator('.vf-hero').screenshot({ path: `${output}/hero-slide-1-${viewport.width}.png` });
                await page.getByRole('button', { name: 'Pause hero video', exact: true }).click();
                assert.equal(await page.locator('#hero-video').evaluate(video => video.paused), true);
                await page.getByRole('button', { name: 'Play hero video', exact: true }).click();
                await page.waitForFunction(() => !document.querySelector('.vf-hero-video').paused);
                await page.getByRole('button', { name: 'Resume slideshow', exact: true }).click();
                await page.mouse.move(0, 0);
                const firstSlideStarted = Date.now();
                await page.waitForFunction(() => !document.querySelector('#hero-slide-2').hidden, null, { timeout: 30000 });
                assert.ok(Date.now() - firstSlideStarted >= 24500, 'first video stays visible for twenty-five seconds');
                assert.equal(await page.locator('.vf-hero-message:visible .vf-hero-title').textContent(), 'Exporter & Supplier of Industrial Piping Solutions');
                const heroHeight = await page.locator('.vf-hero').evaluate(hero => hero.clientHeight);
                await page.waitForFunction(() => {
                    const video = document.querySelector('#hero-video-new');
                    return video.readyState >= 2 && video.videoWidth === 1280 && !video.paused && video.currentTime > .2;
                }, null, { timeout: 20000 });
                assert.equal(await page.locator('#hero-video').evaluate(video => video.paused), true);
                assert.equal(await page.locator('.vf-hero').evaluate(hero => {
                    const navigation = hero.querySelector('.vf-hero-controls').getBoundingClientRect();
                    const playback = hero.querySelector('.vf-hero-playback').getBoundingClientRect();
                    return navigation.right + 8 <= playback.left;
                }), true, `${viewport.width}: carousel controls do not overlap`);
                await page.locator('.vf-hero').screenshot({ path: `${output}/hero-slide-2-${viewport.width}.png` });
                await page.getByRole('button', { name: 'Next slide', exact: true }).click();
                assert.equal(await page.locator('#hero-slide-3').isVisible(), true);
                assert.equal(await page.locator('.vf-hero-message:visible .vf-hero-title').textContent(), 'Global Exporter of Flanges');
                assert.equal(await page.locator('.vf-hero').evaluate(hero => hero.clientHeight), heroHeight);
                assert.equal(await page.locator('#hero-slide-3 img').evaluate(image => image.naturalWidth > 0), true);
                assert.equal(await page.locator('.vf-hero-playback').isVisible(), false);
                assert.equal(await page.locator('.vf-hero video').evaluateAll(videos => videos.every(video => video.paused)), true);
                await page.locator('.vf-hero').screenshot({ path: `${output}/hero-slide-3-${viewport.width}.png` });
                await page.getByRole('button', { name: 'Next slide', exact: true }).click();
                assert.equal(await page.locator('#hero-slide-4').isVisible(), true);
                assert.equal(await page.locator('#hero-slide-4 img').evaluate(image => image.naturalWidth === 1024 && image.naturalHeight === 576), true);
                assert.equal(await page.locator('.vf-hero-message:visible .vf-hero-title').textContent(), 'Exporter & Supplier of Industrial Piping Solutions');
                assert.equal(await page.locator('.vf-hero').evaluate(hero => hero.clientHeight), heroHeight);
                assert.equal(await page.locator('[data-hero-slide="3"]').getAttribute('aria-current'), 'true');
                assert.equal(await page.locator('.vf-hero-playback').isVisible(), false);
                await page.locator('.vf-hero').screenshot({ path: `${output}/hero-slide-4-${viewport.width}.png` });
                await page.getByRole('button', { name: 'Next slide', exact: true }).click();
                assert.equal(await page.locator('#hero-slide-1').isVisible(), true);
                await page.getByRole('button', { name: 'Previous slide', exact: true }).click();
                assert.equal(await page.locator('#hero-slide-4').isVisible(), true);
                await page.getByRole('button', { name: 'Show slide 1', exact: true }).click();
                await page.waitForFunction(() => !document.querySelector('#hero-video').paused);
                assert.ok(await page.locator('.vf-hero').evaluate(element => element.getBoundingClientRect().bottom < innerHeight), `${viewport.width}: next section visible`);
                const ratio = await page.locator('.vf-product-image').first().evaluate(element => element.clientWidth / element.clientHeight);
                assert.ok(Math.abs(ratio - (viewport.width <= 600 ? 1.75 : 1.55)) < .03, `${viewport.width}: stable image frame`);
                assert.equal(await page.locator('main > section').count(), 19);
                assert.equal(await page.locator('#home-markets + #home-testimonials').count(), 1);
                assert.equal(await page.locator('.vf-market-grid li').count(), 12);
                assert.equal(await page.locator('.vf-market-grid img').evaluateAll(images => images.every(image => image.naturalWidth === 160)), true);
                assert.equal(await page.locator('.vf-market-grid span').evaluateAll(labels => labels.every(label => label.scrollWidth <= label.clientWidth + 1)), true);
                assert.equal(await page.locator('#home-testimonials + #home-inspection + #home-faq').count(), 1);
                assert.equal(await page.locator('.vf-testimonial-grid:not(.vf-marquee-copy) blockquote').count(), 3);
                assert.equal(await page.locator('.vf-inspection-logos:not(.vf-marquee-copy) img').count(), 6);
                assert.equal(await page.locator('.vf-hero + #home-forging').count(), 1);
                const reel = page.locator('#home-forging .vf-forging-reel');
                await reel.scrollIntoViewIfNeeded();
                await page.waitForFunction(() => {
                    const video = document.querySelector('#home-forging .vf-forging-reel');
                    return video.dataset.startReady === 'true' && video.readyState >= 2 && Math.abs(video.videoWidth / video.videoHeight - 16 / 9) < .01 && !video.paused && video.currentTime > .1;
                }, null, { timeout: 20000 });
                assert.equal(await reel.evaluate(video => video.controls && video.muted && video.playsInline), true);
                assert.match(await reel.evaluate(video => video.currentSrc), /banner-video-3\.(mp4|webm)$/);
                assert.equal(await reel.evaluate(video => Math.abs(video.duration - 10.42) < .1), true);
                await reel.evaluate(video => { video.currentTime = video.duration - .2; });
                await page.waitForFunction(() => {
                    const video = document.querySelector('#home-forging .vf-forging-reel');
                    return !video.paused && video.currentTime > 0 && video.currentTime < 2;
                });
                await reel.evaluate(video => video.pause());
                assert.equal(await reel.evaluate(video => video.paused), true);
                await reel.evaluate(video => video.play());
                await page.locator('#home-forging').screenshot({ path: `${output}/home-forging-${viewport.width}.png` });
                assert.equal(await page.locator('.vf-home-material-grid a').count(), 12);
                assert.equal(await page.locator('.vf-home-material-grid > div').count(), 3);
                await page.evaluate(() => document.fonts.ready);
                assert.match(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily), /Manrope/);
                assert.match(await page.locator('body').evaluate(element => getComputedStyle(element).fontFamily), /Manrope/);
                await page.locator('#home-about').scrollIntoViewIfNeeded();
                await page.waitForFunction(() => document.querySelector('.vf-forging-reel').paused);
                await page.waitForFunction(() => document.querySelector('.vf-home-about > div').dataset.revealed === 'true');
                assert.ok(await page.locator('.vf-reading-progress').evaluate(element => Number(getComputedStyle(element).transform.match(/matrix\(([^,]+)/)[1]) > 0));
                assert.match(await page.locator('#hero-video').evaluate(element => element.style.transform), /translateY/);
                await page.locator('.vf-home-jump a[href="#home-faq"]').click();
                assert.ok(await page.locator('#home-faq').evaluate(element => Math.abs(element.getBoundingClientRect().top - 24) < 3), `${viewport.width}: FAQ jump link`);
                const question = page.locator('.vf-home-faq summary').first();
                await question.focus();
                await page.keyboard.press('Enter');
                assert.equal(await page.locator('.vf-home-faq details').first().getAttribute('open'), '');
                assert.equal(await page.locator('.vf-home-faq details p').first().isVisible(), true);
                await page.keyboard.press('Enter');
                assert.equal(await page.locator('.vf-home-faq details p').first().isVisible(), false);
                await page.evaluate(() => document.activeElement?.blur());
                const marketsHeight = await page.locator('#home-markets').evaluate(section => section.offsetHeight);
                await page.setViewportSize({ width: viewport.width, height: Math.max(viewport.height, marketsHeight + 80) });
                await page.locator('#home-markets').scrollIntoViewIfNeeded();
                await page.waitForFunction(() => document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).every(animation => animation.playState !== 'running'));
                await page.locator('#home-markets').screenshot({ path: `${output}/home-markets-${viewport.width}.png` });
                await page.setViewportSize(viewport);
                await page.locator('#home-markets .vf-text-link').click();
                assert.ok(page.url().endsWith('/contact.html'));
                await page.goBack();
                for (const section of ['home-testimonials', 'home-inspection']) {
                    await page.evaluate(() => document.activeElement?.blur());
                    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
                    await page.mouse.move(0, 0);
                    const marquee = page.locator(`#${section} .vf-marquee`);
                    const track = page.locator(`#${section} .vf-marquee-track`);
                    await page.waitForFunction(selector => document.querySelector(selector).classList.contains('vf-marquee-running'), `#${section} .vf-marquee`);
                    const startPosition = await track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
                    await page.waitForFunction(({ selector, startPosition }) => new DOMMatrix(getComputedStyle(document.querySelector(selector)).transform).m41 < startPosition - 3, { selector: `#${section} .vf-marquee-track`, startPosition });
                    assert.equal(await marquee.locator('.vf-marquee-copy').getAttribute('aria-hidden'), 'true');
                    assert.equal(await marquee.locator('.vf-marquee-copy').evaluate(element => element.inert), true);
                    await marquee.hover();
                    await page.waitForFunction(selector => document.querySelector(selector).getAnimations()[0].playState === 'paused', `#${section} .vf-marquee-track`);
                    await page.locator(`#${section} .vf-marquee-toggle`).click();
                    assert.equal(await marquee.evaluate(element => element.classList.contains('vf-marquee-enabled')), false);
                    assert.equal(await marquee.locator('.vf-marquee-copy').isVisible(), false);
                    await page.locator(`#${section} .vf-marquee-toggle`).click();
                    await page.evaluate(() => document.activeElement?.blur());
                    await page.mouse.move(0, 0);
                    await page.waitForFunction(() => document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).every(animation => animation.playState !== 'running'));
                    await page.locator(`#${section}`).screenshot({ path: `${output}/${section}-${viewport.width}.png` });
                }
                await page.locator('#home-inspection .vf-text-link').click();
                assert.ok(page.url().endsWith('/contact.html'));
                await page.goBack();
                await page.evaluate(() => scrollTo(0, 0));
                await page.waitForFunction(() => document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).every(animation => animation.playState !== 'running'));
                console.log(`Homepage at ${viewport.width}px: ${await page.evaluate(() => document.documentElement.scrollHeight)}px, 19 sections, international markets, testimonials, inspection logos, forging reel playback and keyboard FAQ verified`);
            }
            if (path === 'service.html') {
                assert.equal(await page.locator('.vf-service-industry').count(), 9);
                assert.equal(await page.locator('.vf-service-industry img').count(), 9);
                assert.equal(await page.locator('.vf-company').count(), 0);
                assert.equal(await page.locator('#vf-menu a[href="service.html"]').getAttribute('aria-current'), 'page');
                await page.locator('.vf-service-directory a[href="#industry-lng"]').click();
                assert.ok(await page.locator('#industry-lng').evaluate(element => Math.abs(element.getBoundingClientRect().top - 24) < 3));
                await page.locator('#industry-lng .vf-service-guide').click();
                assert.ok(page.url().endsWith('/flange-pressure-ratings.html'));
                await page.goBack();
                await page.evaluate(() => scrollTo(0, 0));
                console.log(`PASS: Services ${viewport.width}px, nine industries, section links and product guides`);
            }
            if (path === 'contact.html') {
                const office = page.locator('#head-office');
                assert.equal(await page.locator('.vf-contact-layout + #head-office').count(), 1);
                await office.scrollIntoViewIfNeeded();
                assert.equal(await office.locator('img').evaluate(image => image.naturalWidth === 1440 && image.naturalHeight === 720), true);
                assert.equal(await page.locator('.vf-office-pin').evaluate(pin => {
                    const marker = pin.getBoundingClientRect();
                    const map = pin.parentElement.getBoundingClientRect();
                    return Math.abs((marker.left + marker.width / 2 - map.left) / map.width - (72.82 + 180) / 360) < .001 && Math.abs((marker.bottom - map.top) / map.height - (90 - 18.96) / 180) < .001;
                }), true, `${viewport.width}: Mumbai marker position`);
                assert.notEqual(await page.locator('.vf-office-pin i').evaluate(icon => getComputedStyle(icon, '::before').content), 'none');
                await page.locator('.vf-office-pin').focus();
                const popupPromise = page.waitForEvent('popup');
                await page.keyboard.press('Enter');
                const popup = await popupPromise;
                await popup.close();
                await page.evaluate(() => document.activeElement?.blur());
                await office.screenshot({ path: `${output}/contact-map-${viewport.width}.png` });
            }
            if (path === 'about.html') {
                assert.equal(await page.locator('.vf-company').count(), 1);
                assert.equal(await page.locator('main video').count(), 0);
                const banner = page.locator('.vf-company > img');
                assert.equal(await banner.getAttribute('src'), 'img/flange%20banner01.jpg');
                assert.equal(await banner.evaluate(image => image.naturalWidth === 1024 && image.naturalHeight === 576 && Math.abs(image.clientWidth / image.clientHeight - 1024 / 576) < .02), true);
                assert.match(await page.locator('.vf-company').textContent(), /Jitendra Kumar/);
                await page.locator('.vf-company').scrollIntoViewIfNeeded();
                await page.screenshot({ path: `${output}/about-company-${viewport.width}.png` });
                assert.equal(await page.locator('.vf-service-grid').count(), 0);
                assert.equal(await page.locator('main section[id^="about-"]').count(), 6);
                assert.equal(await page.locator('.vf-about-photos img').count(), 2);
                assert.equal(await page.locator('.vf-about-photos img').evaluateAll(images => images.every(image => image.clientWidth <= image.naturalWidth && image.clientHeight <= image.naturalHeight)), true);
                await page.locator('#about-facilities .vf-text-link').click();
                assert.ok(page.url().endsWith('/gallery.html'));
                await page.goBack();
                await page.locator('#about-enquiry .vf-text-link').click();
                assert.ok(page.url().endsWith('/service.html'));
                await page.goBack();
                await page.evaluate(() => scrollTo(0, 0));
                console.log(`PASS: About ${viewport.width}px, extended company profile and facility links`);
            }
            if (path === 'gallery.html') {
                assert.equal(await page.locator('[data-gallery-image]').count(), galleryImages.length);
                assert.notEqual(await page.locator('.vf-gallery-expand i').first().evaluate(icon => getComputedStyle(icon, '::before').content), 'none');
                assert.equal(await page.locator('#vf-menu a[href="gallery.html"]').getAttribute('aria-current'), 'page');
                const dimensions = await page.locator('[data-gallery-image] img').evaluateAll(images => images.map(image => ({ width: image.naturalWidth, height: image.naturalHeight, displayed: image.getBoundingClientRect().width })));
                galleryImages.forEach((image, index) => {
                    assert.equal(dimensions[index].width, image.width);
                    assert.equal(dimensions[index].height, image.height);
                    assert.ok(dimensions[index].displayed <= image.width + 1, `${image.slug}: no upscaling`);
                });
                const firstPhoto = page.locator('[data-gallery-image]').first();
                await firstPhoto.focus();
                await page.keyboard.press('Enter');
                const viewer = page.locator('.vf-gallery-viewer');
                assert.equal(await viewer.isVisible(), true);
                assert.equal(await page.locator('[data-gallery-close]').evaluate(element => document.activeElement === element), true);
                await page.keyboard.press('ArrowLeft');
                assert.equal(await page.locator('[data-gallery-position]').textContent(), '12 / 12');
                await page.getByRole('button', { name: 'Next image', exact: true }).click();
                assert.equal(await page.locator('[data-gallery-position]').textContent(), '1 / 12');
                await page.keyboard.press('ArrowRight');
                assert.equal(await page.locator('#gallery-viewer-title').textContent(), 'Unit 1');
                await page.locator('.vf-gallery-viewer-stage img').evaluate(image => image.decode());
                assert.equal(await page.locator('.vf-gallery-viewer-stage img').evaluate(image => image.clientWidth <= image.naturalWidth && image.clientHeight <= image.naturalHeight), true);
                assert.match(await page.locator('[data-gallery-original]').getAttribute('href'), /unit-one\.png$/);
                if (viewport.width !== 320) await page.screenshot({ path: `${output}/gallery-viewer-${viewport.width}.png` });
                await page.keyboard.press('Escape');
                await page.waitForFunction(() => !document.body.classList.contains('vf-gallery-modal-open'));
                assert.equal(await viewer.isVisible(), false);
                assert.equal(await firstPhoto.evaluate(element => document.activeElement === element), true);
                await firstPhoto.click();
                await page.getByRole('button', { name: 'Close image', exact: true }).click();
                await page.waitForFunction(() => !document.body.classList.contains('vf-gallery-modal-open'));
                assert.equal(await page.locator('body').evaluate(body => body.classList.contains('vf-gallery-modal-open')), false);
                await firstPhoto.evaluate(element => element.blur());
                await page.evaluate(() => scrollTo(0, 0));
                console.log(`PASS: gallery ${viewport.width}px, 12 native-size images and accessible viewer`);
            }
            if (viewport.width !== 320) await page.screenshot({ path: `${output}/${path.replace('.html', '')}-${viewport.width}.png`, fullPage: true });
            const product = additionalProducts.find(candidate => `${candidate.slug}.html` === path);
            if (product) {
                assert.equal(await page.locator('.vf-product-notes section').count(), 2);
                assert.equal(await page.locator('.vf-product-illustration img').evaluate(image => image.naturalWidth), 980);
                assert.equal(await page.locator('.vf-product-illustration > a').getAttribute('href'), product.image);
                await page.locator('.vf-product-detail .vf-button').click();
                assert.equal(await page.locator('#quote-product').inputValue(), product.name);
                assert.equal(await page.locator('#quote-category').inputValue(), 'Flanges');
            }
        }
        for (const path of ['flat-face-flanges.html', 'weld-neck-flanges.html', 'stainless-steel-flanges.html', 'forged-elbow.html', 'buttweld-short-45.html']) {
            await page.goto(url(path));
            const navigator = page.locator('.vf-product-navigation');
            assert.equal(await navigator.count(), 1);
            assert.equal(await page.locator('.vf-product-information table').count(), 3);
            for (const menu of await navigator.locator('summary').all()) {
                await menu.click();
                assert.equal(await navigator.locator('details[open]').count(), 1);
                assert.equal(await navigator.evaluate(element => element.scrollWidth > element.clientWidth + 2), false);
                await page.keyboard.press('Escape');
                assert.equal(await navigator.locator('details[open]').count(), 0);
            }
            await navigator.locator('summary').filter({ hasText: 'Flange types' }).click();
            await page.locator('h1, .header-4').first().click();
            assert.equal(await navigator.locator('details[open]').count(), 0);
            for (const region of await page.locator('.vf-product-information .vf-table-scroll').all()) {
                if (viewport.width <= 600) {
                    assert.equal(await region.evaluate(element => element.scrollWidth > element.clientWidth), true);
                    await region.focus();
                    await page.keyboard.press('End');
                    await region.evaluate(element => { element.scrollLeft = element.scrollWidth; });
                    assert.ok(await region.evaluate(element => element.scrollLeft > 0));
                    await region.evaluate(element => { element.scrollLeft = 0; element.blur(); });
                }
            }
            assert.equal(await page.locator('.vf-product-information, .vf-product-navigation').evaluateAll(elements => elements.some(element => element.getBoundingClientRect().right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1)), false, `${path}: added content overflow`);
            if (path === 'flat-face-flanges.html' && viewport.width !== 320) {
                await page.locator('h1').click();
                await page.evaluate(() => scrollTo(0, 0));
                await page.screenshot({ path: `${output}/flat-face-expanded-${viewport.width}.png`, fullPage: true });
            }
        }
        await page.goto(url('flat-face-flanges.html'));
        await page.locator('.vf-product-navigation summary').filter({ hasText: 'Flange types' }).click();
        await page.locator('.vf-product-navigation a[href="plate-flanges.html"]').click();
        assert.equal(await page.locator('h1').textContent(), 'Plate Flanges');
        await page.locator('.vf-product-navigation summary').filter({ hasText: 'Buttweld Fittings' }).click();
        await page.locator('.vf-product-navigation a[href="buttweld-equal-tee.html"]').click();
        assert.ok(page.url().endsWith('buttweld-equal-tee.html'));
        await page.goto(url('flanges.html'));
        await page.locator('#product-search').fill('screwed');
        assert.equal(await page.locator('[data-product]:visible').count(), 1);
        assert.match(await page.locator('[data-product]:visible h3').textContent(), /Threaded/);
        await page.locator('#product-family').selectOption('Welded connections');
        assert.equal(await page.locator('[data-product]:visible').count(), 0);
        assert.equal(await page.locator('.vf-empty').isVisible(), true);
        await page.locator('[data-reset-filters]').click();
        assert.equal(await page.locator('[data-product]:visible').count(), products.length);
        for (const product of additionalProducts) {
            await page.locator('#product-search').fill(product.name);
            assert.equal(await page.locator(`[data-product] a[href="${product.slug}.html"]`).isVisible(), true);
        }
        await page.locator('#product-search').fill('');
        await page.locator('#product-family').selectOption('Branch connections');
        assert.equal(await page.locator('[data-product]:visible').count(), 2);
        await page.locator('#product-family').selectOption('');
        await page.locator('#product-search').fill('RF');
        assert.ok(await page.locator('[data-product]:visible').count() > 0);
        if (viewport.width < 850) {
            assert.equal(await page.locator('#vf-menu').isVisible(), false);
            await page.getByRole('button', { name: 'Open navigation' }).click();
            assert.equal(await page.locator('#vf-menu').isVisible(), true);
            await page.locator('.vf-nav-group summary').click();
            assert.equal(await page.locator('.vf-nav-group a').first().isVisible(), true);
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('.vf-nav-group').getAttribute('open'), null);
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('#vf-menu').isVisible(), false);
        }
        await page.goto(url('contact.html') + '?category=Forged+Fittings&product=Caps+%26+Plugs');
        assert.equal(await page.locator('#quote-product').inputValue(), 'Caps & Plugs');
        assert.equal(await page.locator('#quote-facing').isEnabled(), false);
        assert.equal(await page.locator('#quote-connection').isVisible(), true);
        await page.locator('#quote-category').selectOption('Flanges');
        assert.equal(await page.locator('#quote-facing').isVisible(), true);
        assert.equal(await page.locator('#quote-connection').isEnabled(), false);
        await page.locator('#quote-category').selectOption('Buttweld Fittings');
        await page.evaluate(() => { window.open = destination => { window.testDestination = destination; return null; }; });
        await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
        assert.equal(await page.evaluate(() => window.testDestination), undefined);
        await page.locator('#quote-connection').fill('SCH 40 / BW');
        await page.locator('#quote-name').fill('Browser Test');
        await page.locator('#quote-email').fill('test@example.com');
        await page.locator('#quote-phone').fill('1234567890');
        await page.locator('#quote-quantity').fill('12');
        await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
        const destination = new URL(await page.evaluate(() => window.testDestination));
        assert.equal(destination.hostname, 'wa.me');
        assert.match(destination.searchParams.get('text'), /Category: Buttweld Fittings/);
        assert.match(destination.searchParams.get('text'), /SCH 40 \/ BW/);
        assert.ok(!destination.searchParams.get('text').includes('Facing:'));
        assert.equal(await page.locator('#quote-status a').count(), 1);
        assert.deepEqual(errors, [], `JavaScript errors at ${viewport.width}`);
        for (const path of ['forged-elbow.html', 'buttweld-short-45.html', 'wire.html']) {
            await page.goto(url(path), { waitUntil: 'load' });
            const sharedOverflow = await page.locator('.vf-header, .vf-footer').evaluateAll(elements => elements.some(element => element.scrollWidth > innerWidth + 1));
            assert.equal(sharedOverflow, false, `${path} ${viewport.width}: shared navigation overflow`);
            if (viewport.width < 850) {
                await page.getByRole('button', { name: 'Open navigation' }).click();
                assert.equal(await page.locator('#vf-menu').isVisible(), true);
            }
            if (path === 'forged-elbow.html' && viewport.width !== 320) await page.screenshot({ path: `${output}/legacy-forged-${viewport.width}.png`, fullPage: true });
        }
        for (const slug of ['stainless-steel-flanges', 'asme-b16-47-series-a-flanges', 'raised-face-flanges']) {
            const reference = references.find(candidate => candidate.slug === slug);
            await page.goto(url(`${slug}.html`));
            await page.locator('.vf-reference-detail .vf-button').click();
            assert.equal(await page.locator('#quote-category').inputValue(), 'Flanges');
            assert.equal(await page.locator('#quote-product').inputValue(), reference.title);
            for (const [field, value] of Object.entries(reference.enquiry)) assert.equal(await page.locator(`#quote-${field}`).inputValue(), value);
            await page.locator('#quote-name').fill('Reference Browser Test');
            await page.locator('#quote-email').fill('test@example.com');
            await page.locator('#quote-phone').fill('1234567890');
            await page.locator('#quote-quantity').fill('2');
            await page.evaluate(() => { window.open = destination => { window.testDestination = destination; return null; }; });
            await page.getByRole('button', { name: 'Continue to WhatsApp' }).click();
            const message = new URL(await page.evaluate(() => window.testDestination)).searchParams.get('text');
            for (const value of Object.values(reference.enquiry)) assert.ok(message.includes(value));
        }
        assert.deepEqual(errors, [], `JavaScript errors at ${viewport.width}`);
        console.log(`PASS: ${viewport.width}px layout, images, search, navigation and reference-specific quote flow`);
        await context.close();
    }
    const reducedContext = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(url('index.html'));
    assert.equal(await reducedPage.locator('.vf-reading-progress').isVisible(), false);
    assert.equal(await reducedPage.locator('#hero-video').evaluate(element => getComputedStyle(element).transform), 'none');
    assert.equal(await reducedPage.evaluate(() => document.getAnimations().length), 0);
    assert.equal(await reducedPage.locator('.vf-marquee-enabled').count(), 0);
    assert.equal(await reducedPage.locator('.vf-marquee-copy:visible').count(), 0);
    assert.equal(await reducedPage.locator('.vf-hero-video').evaluateAll(videos => videos.every(video => video.paused && video.currentTime === 0)), true);
    assert.equal(await reducedPage.getByRole('button', { name: 'Resume slideshow', exact: true }).isVisible(), true);
    await reducedPage.getByRole('button', { name: 'Show slide 2', exact: true }).click();
    assert.equal(await reducedPage.locator('#hero-video-new').evaluate(video => video.paused), true);
    await reducedPage.getByRole('button', { name: 'Show slide 1', exact: true }).click();
    await reducedPage.getByRole('button', { name: 'Play hero video', exact: true }).click();
    await reducedPage.waitForFunction(() => document.querySelector('.vf-hero-video').currentTime > .2, null, { timeout: 20000 });
    await reducedPage.evaluate(() => {
        window.motionChangeObserved = false;
        matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => { window.motionChangeObserved = true; }, { once: true });
    });
    await reducedPage.emulateMedia({ reducedMotion: 'no-preference' });
    await reducedPage.waitForFunction(() => window.motionChangeObserved);
    await reducedPage.emulateMedia({ reducedMotion: 'reduce' });
    await reducedPage.waitForFunction(() => document.querySelector('.vf-hero-video').paused);
    await reducedPage.goto(url('index.html'));
    await reducedPage.locator('.vf-forging-reel').scrollIntoViewIfNeeded();
    await reducedPage.waitForFunction(() => document.querySelector('.vf-forging-reel').dataset.startReady === 'true');
    assert.equal(await reducedPage.locator('.vf-forging-reel').evaluate(video => video.paused && video.currentTime < .1), true);
    await reducedPage.locator('.vf-forging-reel').evaluate(video => video.play());
    await reducedPage.waitForFunction(() => document.querySelector('.vf-forging-reel').currentTime > .1);
    await reducedPage.goto(url('about.html'));
    assert.equal(await reducedPage.locator('main video').count(), 0);
    assert.equal(await reducedPage.locator('.vf-company > img').isVisible(), true);
    await reducedContext.close();
    console.log('PASS: hero video playback, pause/resume and reduced-motion preference');
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(url('index.html'));
    await page.waitForFunction(() => document.querySelector('.vf-forging-reel').readyState >= 2);
    assert.equal(await page.locator('.vf-forging-reel').evaluate(video => video.controls && video.paused && video.currentTime < .1), true);
    await page.goto(url('about.html'));
    assert.equal(await page.locator('main video').count(), 0);
    assert.equal(await page.locator('.vf-company > img').evaluate(image => image.complete && image.naturalWidth === 1024), true);
    await page.goto(url('service.html'));
    await page.locator('.vf-service-directory a[href="#industry-marine"]').click();
    assert.equal(await page.locator('#industry-marine h2').textContent(), 'Marine');
    assert.equal(await page.locator('.vf-service-industry').count(), 9);
    await page.goto(url('gallery.html'));
    assert.equal(await page.locator('[data-gallery-image]').count(), 12);
    await page.locator('[data-gallery-image]').first().click();
    assert.ok(page.url().endsWith('/img/gallery/team.png'));
    await page.goto(url('index.html'));
    assert.equal(await page.locator('.vf-hero-slide:visible').count(), 1);
    assert.equal(await page.locator('.vf-hero-controls').isVisible(), false);
    assert.equal(await page.locator('.vf-testimonial blockquote').count(), 3);
    assert.equal(await page.locator('.vf-inspection-logos img').count(), 6);
    assert.equal(await page.locator('.vf-whatsapp').isVisible(), true);
    assert.equal(await page.locator('.vf-whatsapp').getAttribute('href'), 'https://wa.me/919619770076');
    await page.locator('.vf-home-jump a[href="#home-faq"]').click();
    await page.locator('.vf-home-faq summary').first().click();
    assert.equal(await page.locator('.vf-home-faq details p').first().isVisible(), true);
    await page.goto(url('flanges.html'));
    assert.equal(await page.locator('[data-product]:visible').count(), products.length);
    await page.locator('[data-product] a[href="puddle-flanges.html"]').click();
    assert.equal(await page.locator('h1').textContent(), 'Puddle Flanges');
    assert.equal(await page.locator('.vf-product-illustration img').isVisible(), true);
    await page.goto(url('flanges.html'));
    assert.equal(await page.locator('#vf-menu').isVisible(), true);
    await page.locator('.vf-nav-group summary').click();
    assert.equal(await page.locator('.vf-nav-group a').first().isVisible(), true);
    await page.goto(url('flange-facing-finish.html'));
    await page.getByRole('link', { name: 'Tongue and Groove', exact: true }).click();
    assert.equal(await page.locator('h1').textContent(), 'Tongue and Groove Flanges');
    assert.equal(await page.locator('.vf-reference-detail img').isVisible(), true);
    assert.equal(await page.locator('.vf-reference-detail .vf-button').isVisible(), true);
    await page.locator('.vf-product-navigation summary').filter({ hasText: 'Flange types' }).click();
    assert.equal(await page.locator('.vf-product-navigation details[open] a[href="flat-face-flanges.html"]').count(), 0);
    await page.locator('.vf-product-navigation summary').filter({ hasText: 'Facings & guides' }).click();
    await page.locator('.vf-product-navigation a[href="flat-face-flanges.html"]').click();
    assert.equal(await page.locator('h1').textContent(), 'Flat Face (FF) Flanges');
    assert.equal(await page.locator('.vf-product-information table').count(), 3);
    await page.goto(url('contact.html'));
    assert.equal(await page.locator('noscript a[href^="mailto:"]').isVisible(), true);
    await context.close();
    console.log('PASS: static product links, mobile navigation and contact fallback without JavaScript');
    const diagrams = [...new Set([...references, ...additionalProducts].map(reference => reference.image).filter(path => path.startsWith('img/flanges/reference/')))];
    assert.equal(diagrams.length, 21);
    const pixelPage = await browser.newPage();
    for (const path of diagrams) {
        const encoded = (await readFile(path)).toString('base64');
        const pixels = await pixelPage.evaluate(async encoded => {
            const image = new Image();
            image.src = `data:image/png;base64,${encoded}`;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let nonwhite = 0;
            for (let offset = 0; offset < data.length; offset += 4) if (data[offset] < 245 || data[offset + 1] < 245 || data[offset + 2] < 245) nonwhite++;
            return { width: canvas.width, height: canvas.height, nonwhite };
        }, encoded);
        assert.equal(pixels.width, 980, path);
        assert.equal(pixels.height, 600, path);
        assert.ok(pixels.nonwhite > (path.includes('/product-') ? 25000 : 50000), `${path}: nonblank illustration`);
    }
    await pixelPage.close();
    console.log('PASS: 21 original diagrams decode at 980x600 with nonblank pixel content');
} finally {
    await browser.close();
}