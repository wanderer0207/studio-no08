(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const button = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');

  if (button && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.querySelector('span').textContent = '＋';
    };
    button.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span').textContent = open ? '－' : '＋';
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; observer.observe(el); });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const cursor = document.querySelector('.cursor');
  if (finePointer && cursor && !reduceMotion) {
    window.addEventListener('pointermove', event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('pointerenter', () => { cursor.style.width = '34px'; cursor.style.height = '34px'; });
      el.addEventListener('pointerleave', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; });
    });
  }

  if (finePointer && !reduceMotion) {
    const hero = document.querySelector('.hero-stage');
    const object = document.querySelector('.hero-object');
    if (hero && object) {
      hero.addEventListener('pointermove', event => {
        const r = hero.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        object.style.transform = `translate3d(${x * 25}px, ${y * 20}px, 0) rotateX(${-y * 12}deg) rotateY(${x * 16}deg)`;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { object.style.transform = ''; });
    }

    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('pointermove', event => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
      }, { passive: true });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', event => {
        const r = el.getBoundingClientRect();
        const x = event.clientX - r.left - r.width / 2;
        const y = event.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }, { passive: true });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Scroll progress drives a subtle vertical drift; content remains visible without JS.
  if (!reduceMotion) {
    const object = document.querySelector('.hero-object');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        if (object && window.innerWidth > 760) object.style.setProperty('--scroll-drift', `${y * 0.06}px`);
        ticking = false;
      });
    }, { passive: true });
  }
})();
