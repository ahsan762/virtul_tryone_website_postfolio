function initSlider() {
    const sliderContainer = document.querySelector('.testimonials-swiper');
    if (!sliderContainer) return;

    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            },
            effect: 'slide',
            speed: 800
        });
        return;
    }

    const slider = new CustomSlider(sliderContainer);
    slider.init();
}

class CustomSlider {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.testimonial-slide');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isPaused = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    init() {
        if (this.slides.length === 0) return;

        this.createNavigation();
        this.createPagination();
        this.setupTouchEvents();
        this.setupHoverPause();
        this.showSlide(0);
        this.startAutoplay();
    }

    createNavigation() {
        const prevBtn = this.container.querySelector('.slider-prev') || this.createButton('prev');
        const nextBtn = this.container.querySelector('.slider-next') || this.createButton('next');

        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());
    }

    createButton(direction) {
        const btn = document.createElement('button');
        btn.className = `slider-btn slider-${direction}`;
        btn.innerHTML = direction === 'prev' ? '&#10094;' : '&#10095;';
        this.container.appendChild(btn);
        return btn;
    }

    createPagination() {
        let pagination = this.container.querySelector('.slider-pagination');
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.className = 'slider-pagination';
            this.container.appendChild(pagination);
        }

        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'pagination-dot';
            dot.addEventListener('click', () => this.goTo(index));
            pagination.appendChild(dot);
        });

        this.updatePagination();
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        const paginationDots = this.container.querySelectorAll('.pagination-dot');
        paginationDots.forEach(dot => dot.classList.remove('active'));

        this.slides[index].style.display = 'block';
        this.slides[index].classList.add('active');

        setTimeout(() => {
            this.slides[index].style.opacity = '1';
        }, 10);

        if (paginationDots[index]) {
            paginationDots[index].classList.add('active');
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(this.currentIndex);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentIndex);
    }

    goTo(index) {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
    }

    updatePagination() {
        const dots = this.container.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupTouchEvents() {
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    setupHoverPause() {
        this.container.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });
    }
}
