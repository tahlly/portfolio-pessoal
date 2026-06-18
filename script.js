document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section, .hero');
    const form = document.getElementById('contact-form');

    /* ===== Hamburger ===== */
    if (hamburger && navList) {
        const toggleMenu = (open) => {
            const isOpen = open ?? !navList.classList.contains('active');
            navList.classList.toggle('active', isOpen);
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
            if (isOpen) {
                navLinks[0]?.focus();
            } else {
                hamburger.focus();
            }
        };

        hamburger.addEventListener('click', () => toggleMenu());
        navLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    /* ===== Header Scroll ===== */
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (header) {
                    header.classList.toggle('scrolled', scrollY > 50);
                }

                /* Active nav link */
                let current = '';
                sections.forEach((section) => {
                    const top = section.offsetTop - 150;
                    const bottom = top + section.offsetHeight;
                    if (scrollY >= top && scrollY < bottom) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
                    if (link.getAttribute('href') === `#${current}`) {
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== Intersection Observer for animations ===== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.section').forEach(section => observer.observe(section));

    /* ===== Form ===== */
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('.form-input, .form-textarea');
            let isValid = true;

            inputs.forEach(input => {
                input.classList.remove('error');
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                }
                if (input.type === 'email' && input.value.trim() && !input.validity.valid) {
                    input.classList.add('error');
                    isValid = false;
                }
            });

            if (isValid) {
                const btn = form.querySelector('.btn-submit');
                const original = btn.textContent;
                btn.classList.add('sent');
                btn.textContent = '✓ ENVIADO!';
                form.reset();
                setTimeout(() => {
                    btn.classList.remove('sent');
                    btn.textContent = original;
                }, 3000);
            } else {
                const firstError = form.querySelector('.error');
                firstError?.focus();
            }
        });
    }
});
