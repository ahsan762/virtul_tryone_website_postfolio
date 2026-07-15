function initNavbar() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(header);
                ticking = false;
            });
            ticking = true;
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        });

        sections.forEach(section => sectionObserver.observe(section));
    }
}

function handleScroll(header) {
    if (!header) return;

    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
        header.classList.add('glass-enhanced');
    } else {
        header.classList.remove('scrolled');
        header.classList.remove('glass-enhanced');
    }

    if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('hidden');
        header.classList.remove('visible');
    } else {
        header.classList.remove('hidden');
        header.classList.add('visible');
    }

    lastScroll = currentScroll;
}
