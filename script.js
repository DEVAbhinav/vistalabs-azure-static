const navToggle = document.querySelector('[data-nav-toggle]');
const navGroup = document.querySelector('[data-nav-menu]');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeNavigation = () => {
    if (!navGroup) {
        return;
    }
    navGroup.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (navToggle) {
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
};

const toggleNavigation = () => {
    if (!navGroup) {
        return;
    }
    const isOpen = navGroup.classList.toggle('is-open');
    document.body.classList.toggle('no-scroll', isOpen);
    if (navToggle) {
        navToggle.classList.toggle('is-active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
};

if (navToggle && navGroup) {
    navToggle.addEventListener('click', toggleNavigation);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeNavigation();
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        closeNavigation();
    }
});

window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeNavigation();
    }
});

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) {
        return;
    }
    element.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
}

window.scrollToSection = scrollToSection;

const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 160;
    let currentId = 'home';

    sections.forEach(section => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('is-active', targetId === currentId);
    });
};

highlightNavigation();
window.addEventListener('scroll', highlightNavigation, { passive: true });

const revealElements = document.querySelectorAll('[data-reveal]');

if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: '0px 0px -80px 0px'
        }
    );

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add('is-visible'));
}

console.log('%cVIstalabs', 'background:#0f8ff8;color:#010409;padding:6px 12px;font-weight:700;border-radius:6px;');
console.log('Top-tier Azure consultancy · Crafted with Playwright quality gates.');