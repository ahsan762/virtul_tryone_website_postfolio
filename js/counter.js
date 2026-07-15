function initCounter() {
    const counters = document.querySelectorAll('.stat-number[data-target], .about-stat-number[data-target]');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = easeOutExpo(progress);
        const current = Math.round(eased * target);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }

    requestAnimationFrame(update);
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(num) {
    if (num >= 200) return `${num}+`;
    if (num >= 150) return `${num}+`;
    if (num >= 50) return `${num}+`;
    if (num >= 30) return `${num}+`;
    if (num >= 5) return `${num}+`;
    return `${num}`;
}
