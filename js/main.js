(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "73px");
        } else {
            $('.nav-bar').removeClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "0");
        }
    });
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    // Nested submenu: tap to expand on mobile (desktop uses CSS hover)
    $(document).on('click', '.dropdown-submenu > .dropdown-item', function (e) {
        if ($(window).width() < 992) {
            e.preventDefault();
            e.stopPropagation();
            $(this).next('.dropdown-menu').toggleClass('show');
        }
    });

    // Scroll reveal animations (home page)
    $(document).ready(function () {
        if (!document.querySelector('.carousel .owl-carousel') || !('IntersectionObserver' in window)) {
            return;
        }

        var targets = document.querySelectorAll([
            '.section-header',
            '.feature-card',
            '.about-content',
            '.service-item',
            '.flange-card',
            '.industry-card',
            '.material-pill',
            '.facts-item',
            '.cta-banner'
        ].join(','));

        // stagger cards within the same row so grids cascade in
        function staggerIndex(el) {
            var node = el;
            for (var i = 0; i < 3 && node.parentElement; i++) {
                var parent = node.parentElement;
                if (parent.classList.contains('row') || parent.children.length > 2) {
                    return Array.prototype.indexOf.call(parent.children, node);
                }
                node = parent;
            }
            return 0;
        }

        targets.forEach(function (el) {
            el.classList.add('reveal');
            el.style.transitionDelay = (staggerIndex(el) % 4) * 90 + 'ms';
        });

        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) {
            revealObserver.observe(el);
        });
    });

    
    // Main carousel
    $(".carousel .owl-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 9000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        smartSpeed: 1200,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    
    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    // $(".testimonials-carousel").owlCarousel({
    //     center: true,
    //     autoplay: true,
    //     smartSpeed: 2000,
    //     dots: true,
    //     loop: true,
    //     responsive: {
    //         0:{
    //             items:1
    //         },
    //         576:{
    //             items:1
    //         },
    //         768:{
    //             items:2
    //         },
    //         992:{
    //             items:3
    //         }
    //     }
    // });
    
      $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });
    // Related post carousel
    // $(".related-slider").owlCarousel({
    //     autoplay: true,
    //     dots: false,
    //     loop: true,
    //     nav : true,
    //     navText : [
    //         '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    //         '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    //     ],
    //     responsive: {
    //         0:{
    //             items:1
    //         },
    //         576:{
    //             items:1
    //         },
    //         768:{
    //             items:2
    //         }
    //     }
    // });

    $(".related-slider").owlCarousel({
    autoplay: true,
    dots: false,
    loop: true,
    nav: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 3 } // ✅ Show 3 cards on desktop
    }
});

    
})(jQuery);

