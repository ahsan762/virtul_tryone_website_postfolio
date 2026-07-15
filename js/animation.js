function initAnimations() {
    initScrollAnimations();
    initParallax();
    initMouseFollower();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    element.classList.add('animate-in');
                    element.style.animationName = getAnimationType(element);
                }, parseInt(delay));

                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        element.style.animationType = animationType;
        element.classList.add('animate-ready');
        animationObserver.observe(element);
    });
}

function getAnimationType(element) {
    const type = element.getAttribute('data-animate');

    const animations = {
        'fade-up': 'fadeInUp',
        'fade-down': 'fadeInDown',
        'fade-left': 'fadeInLeft',
        'fade-right': 'fadeInRight',
        'zoom-in': 'zoomIn',
        'slide-up': 'slideUp'
    };

    return animations[type] || 'fadeInUp';
}

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(parallaxElements);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax(elements) {
    const scrollY = window.pageYOffset;

    elements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const offset = (scrollY - elementTop) * speed;

        element.style.transform = `translateY(${offset}px)`;
    });
}

function initMouseFollower() {
    if (window.innerWidth < 768) return;

    const cursor = document.querySelector('.cursor-follower');
    const cursorDot = document.querySelector('.cursor-dot');

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
}
