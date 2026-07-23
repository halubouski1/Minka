// ========================================
// Lenis smooth scroll
// ========================================
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const lenisRaf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  };
  requestAnimationFrame(lenisRaf);
}

// ========================================
// AOS init
// ========================================
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
  if (lenis) lenis.on('scroll', AOS.refresh);
}

// ========================================
// FAQ accordion
// ========================================
document.querySelectorAll('.faq__item').forEach((item) => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.toggle('active');
    const header = item.querySelector('.faq__header');
    if (header) header.setAttribute('aria-expanded', isOpen);
  });
});

// ========================================
// Dropdown menu
// ========================================
const menu = document.getElementById('menu');
const menuOpenBtn = document.querySelector('[data-menu-open]');

if (menu && menuOpenBtn) {
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuNav = menu.querySelector('.menu__nav');
  const cards = menu.querySelectorAll('.menu__card');

  const openMenu = () => {
    menu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    if (lenis) lenis.stop();
  };

  const closeMenu = () => {
    menu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    if (lenis) lenis.start();
  };

  menuOpenBtn.addEventListener('click', openMenu);
  document.querySelectorAll('[data-menu-close]').forEach((el) => {
    el.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });

  // Crossfade the preview card that matches the hovered link
  const activateCard = (name) => {
    cards.forEach((card) => {
      card.classList.toggle('menu__card--active', card.dataset.menuCard === name);
    });
  };

  menu.querySelectorAll('.menu__link').forEach((link) => {
    link.addEventListener('mouseenter', () => activateCard(link.dataset.menuTarget));
  });

  if (menuNav) {
    menuNav.addEventListener('mouseleave', () => activateCard('default'));
  }
}
// ========================================
// Popups
// ========================================
(() => {
  const popups = document.querySelectorAll('.popup');
  if (!popups.length) return;

  const openPopup = (popup) => {
    // Always open on the form state, with fields cleared
    popup.classList.remove('submitted');
    const form = popup.querySelector('.popup__form');
    if (form) form.reset();
    popup.classList.add('active');
    if (lenis) lenis.stop();
  };

  const closePopups = () => {
    popups.forEach((p) => p.classList.remove('active'));
    if (lenis) lenis.start();
  };

  document.querySelectorAll('[data-popup]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const popup = document.querySelector(`[data-popup-window="${trigger.dataset.popup}"]`);
      if (popup) openPopup(popup);
    });
  });

  document.querySelectorAll('[data-popup-close]').forEach((el) => {
    el.addEventListener('click', closePopups);
  });

  // Close when clicking the dark backdrop (outside the window)
  popups.forEach((popup) => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopups();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.popup.active')) closePopups();
  });

  // On submit: don't reload, swap the form for the thank-you message
  document.querySelectorAll('.popup__form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const popup = form.closest('.popup');
      if (popup) popup.classList.add('submitted');
    });
  });
})();

// ========================================
// Search panel
// ========================================
const searchPanel = document.getElementById('search');
const searchOpenBtn = document.querySelector('[data-search-open]');

if (searchPanel && searchOpenBtn) {
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput = searchPanel.querySelector('.search__input');

  const openSearch = () => {
    searchPanel.classList.add('active');
    if (searchOverlay) searchOverlay.classList.add('active');
    if (lenis) lenis.stop();
    if (searchInput) setTimeout(() => searchInput.focus(), 350);
  };

  const closeSearch = () => {
    searchPanel.classList.remove('active');
    if (searchOverlay) searchOverlay.classList.remove('active');
    if (lenis) lenis.start();
  };

  searchOpenBtn.addEventListener('click', openSearch);
  document.querySelectorAll('[data-search-close]').forEach((el) => {
    el.addEventListener('click', closeSearch);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchPanel.classList.contains('active')) closeSearch();
  });

  const searchClear = searchPanel.querySelector('[data-search-clear]');
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
    });
  }
}

// ========================================
// Favorite buttons (product cards)
// ========================================
document.querySelectorAll('.popular-card__fav').forEach((fav) => {
  fav.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fav.classList.toggle('is-active');
  });
});

// ========================================
// Sticky header (hide on scroll down, go light past hero)
// ========================================
const header = document.querySelector('.header');
const heroForHeader = document.querySelector('.hero');

if (header) {
  let lastScroll = 0;

  const updateHeader = (scrollY) => {
    const current = typeof scrollY === 'number' ? scrollY : window.scrollY;
    const headerHeight = header.offsetHeight;

    // Hide when scrolling down, reveal when scrolling up
    if (current > lastScroll && current > headerHeight) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    // Switch to the light (white) theme once the hero has scrolled past
    const heroBottom = heroForHeader
      ? heroForHeader.getBoundingClientRect().bottom
      : window.innerHeight;
    header.classList.toggle('header--light', heroBottom <= headerHeight);

    lastScroll = current < 0 ? 0 : current;
  };

  if (lenis) {
    lenis.on('scroll', (e) => updateHeader(e.scroll));
  } else {
    window.addEventListener('scroll', () => updateHeader(), { passive: true });
  }
  updateHeader();
}
