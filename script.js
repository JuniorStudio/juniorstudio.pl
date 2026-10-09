/* JuniorStudio — interakcje i UX */
(() => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    /* Header + mobile menu */
    const header = $('#siteHeader');
    const menuToggle = $('#menuToggle');
    const mobileMenu = $('#mobileMenu');

    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 25);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    $$('#mobileMenu a').forEach(link => link.addEventListener('click', closeMenu));

    /* Active section in navigation */
    const sections = $$('main section[id]');
    const navLinks = $$('.nav-link');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
            ));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach(section => navObserver.observe(section));

    /* Scroll reveal */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    $$('.reveal').forEach(el => revealObserver.observe(el));

    /* Portfolio filters */
    $$('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            $$('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            $$('.portfolio-item').forEach(item => {
                const categories = (item.dataset.category || '').split(/\s+/).filter(Boolean);
                const show = filter === 'all' || categories.includes(filter);
                item.classList.toggle('hidden', !show);
            });
        });
    });

    /* Portfolio modal with previous/next navigation */
    const modal = $('#imageModal');
    const modalImg = $('#modalImg');
    const modalTitle = $('#modalTitle');
    const modalDesc = $('#modalDesc');
    const modalClose = $('#modalClose');
    const modalCloseText = $('#modalCloseText');
    const modalPrev = $('#modalPrev');
    const modalNext = $('#modalNext');
    let currentModalItem = null;

    const visiblePortfolioItems = () => $$('.portfolio-item').filter(item => !item.classList.contains('hidden'));
    const showModalItem = (item) => {
        if (!item) return;
        currentModalItem = item;
        modalImg.src = item.dataset.image;
        modalImg.alt = item.querySelector('img')?.alt || item.dataset.title || 'Podgląd projektu';
        modalTitle.textContent = item.dataset.title || 'Projekt JuniorStudio';
        modalDesc.textContent = item.dataset.desc || '';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    };
    const openModal = (item) => showModalItem(item);
    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        currentModalItem = null;
        setTimeout(() => { modalImg.src = ''; }, 250);
    };
    const moveModal = (direction) => {
        const items = visiblePortfolioItems();
        if (!items.length || !currentModalItem) return;
        const index = items.indexOf(currentModalItem);
        const nextIndex = (index + direction + items.length) % items.length;
        showModalItem(items[nextIndex]);
    };

    $$('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => openModal(item));
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(item);
            }
        });
    });
    modalClose?.addEventListener('click', closeModal);
    modalCloseText?.addEventListener('click', closeModal);
    modalPrev?.addEventListener('click', () => moveModal(-1));
    modalNext?.addEventListener('click', () => moveModal(1));
    modal?.addEventListener('click', event => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', event => {
        if (!modal.classList.contains('open')) return;
        if (event.key === 'Escape') closeModal();
        if (event.key === 'ArrowLeft') moveModal(-1);
        if (event.key === 'ArrowRight') moveModal(1);
    });

    /* Interactive before/after sliders */
    $$('[data-comparison]').forEach(card => {
        const stage = $('.comparison-stage', card);
        const range = $('.comparison-range', card);
        if (!stage || !range) return;
        const update = () => stage.style.setProperty('--split', `${range.value}%`);
        range.addEventListener('input', update);
        update();
    });

    /* Copy Discord handle */
    const copyButton = $('#copyDiscord');
    const toast = $('#toast');

    copyButton?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('kontakt.juniorstudio');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
        } catch {
            // Clipboard can be unavailable on local/non-secure environments.
            const range = document.createRange();
            const handle = $('.contact-handle b');
            range.selectNodeContents(handle);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    /* Small cursor glow on desktop */
    const glow = $('.cursor-glow');
    if (glow && window.matchMedia('(pointer:fine)').matches) {
        glow.style.opacity = '1';
        window.addEventListener('pointermove', event => {
            glow.style.left = `${event.clientX}px`;
            glow.style.top = `${event.clientY}px`;
        }, { passive: true });
    }

    /* Accessible FAQ: only one item open at a time */
    $$('.faq-list details').forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (!detail.open) return;
            $$('.faq-list details').forEach(other => {
                if (other !== detail) other.removeAttribute('open');
            });
        });
    });
})();
