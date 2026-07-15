document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initSmoothScroll();
    initBackToTop();
    initLazyLoad();
    initNavbar();
    initTyping();
    initCounter();
    initPortfolioFilter();
    initSlider();
    initContactForm();
    initAOS();
    initTheme();
    initSkillsTabs();
    initPricingToggle();
    initSkillBars();
    initFAQ();
    initAnimations();
});

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const faqItem = item.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = item.querySelector('i');
            const isOpen = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('active');
                const otherAnswer = other.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = null;
                const otherIcon = other.querySelector('.faq-question i');
                if (otherIcon) { otherIcon.className = 'fas fa-plus'; }
            });

            if (!isOpen) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.className = 'fas fa-minus';
            }
        });
    });
}

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    if (bars.length === 0) return;

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
        bar.style.width = '0%';
        barObserver.observe(bar);
    });
}

function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const cards = document.querySelectorAll('.skill-card');
    if (tabs.length === 0 || cards.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => { card.style.display = 'none'; }, 400);
                }
            });
        });
    });
}

function initPricingToggle() {
    const toggle = document.querySelector('#pricingToggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;
        const amounts = document.querySelectorAll('.plan-price .amount');

        amounts.forEach(amount => {
            const monthly = amount.getAttribute('data-monthly');
            const yearly = amount.getAttribute('data-yearly');
            if (monthly && yearly) {
                amount.textContent = isYearly ? yearly : monthly;
            }
        });

        document.querySelectorAll('.toggle-label').forEach(label => {
            label.classList.remove('active');
            if ((label.getAttribute('data-period') === 'yearly' && isYearly) ||
                (label.getAttribute('data-period') === 'monthly' && !isYearly)) {
                label.classList.add('active');
            }
        });
    });
}

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: window.innerWidth < 768
        });
    }
}

function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}
