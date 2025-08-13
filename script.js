/* Smooth scroll for internal anchors */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* Accordion open/close with animation */
const accordion = document.getElementById('services-accordion');
if (accordion) {
  accordion.querySelectorAll('.acc-item').forEach((item) => {
    const trigger = item.querySelector('.acc-trigger');
    const content = item.querySelector('.acc-content');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      accordion.querySelectorAll('.acc-item').forEach((it) => {
        it.classList.remove('open');
        const c = it.querySelector('.acc-content');
        c.style.maxHeight = 0;
      });
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* Carousel controls */
const track = document.querySelector('.car-track');
if (track) {
  const prev = document.querySelector('.car-btn.prev');
  const next = document.querySelector('.car-btn.next');
  const step = () => Math.min(track.clientWidth * 0.9, 600);
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}

/* Floating WhatsApp */
const waFloat = document.getElementById('wa-float');
const waTrigger = document.getElementById('wa-trigger');
const waMenu = document.getElementById('wa-menu');
if (waFloat && waTrigger && waMenu) {
  const toggle = () => {
    const open = waFloat.classList.toggle('open');
    waTrigger.setAttribute('aria-expanded', String(open));
    waMenu.setAttribute('aria-hidden', String(!open));
  };
  waTrigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('click', (e) => {
    if (!waFloat.contains(e.target)) {
      waFloat.classList.remove('open');
      waTrigger.setAttribute('aria-expanded', 'false');
      waMenu.setAttribute('aria-hidden', 'true');
    }
  });
}