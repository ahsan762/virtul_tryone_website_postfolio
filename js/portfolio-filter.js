function initPortfolioFilter() {
    const filterContainer = document.querySelector('.portfolio-filters');
    const portfolioItems = document.querySelectorAll('.portfolio-card');

    if (!filterContainer || portfolioItems.length === 0) return;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            filterItems(portfolioItems, filter);
        });
    });
}

function filterItems(items, filter) {
    let visibleIndex = 0;

    items.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        if (shouldShow) {
            const delay = visibleIndex * 100;

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.classList.remove('hidden');
                item.classList.add('visible');
            }, delay);

            visibleIndex++;
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';

            setTimeout(() => {
                item.classList.add('hidden');
                item.classList.remove('visible');
            }, 400);
        }
    });
}
