document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const form = document.getElementById('waitlist-form');
  if (form) {
    const emailInput = form.querySelector('input[type="email"]');
    const msg = form.querySelector('.waitlist-msg');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = (emailInput?.value || '').trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      form.classList.remove('is-error', 'is-success');

      if (!isValid) {
        form.classList.add('is-error');
        if (msg) msg.textContent = 'Enter a valid email address.';
        return;
      }

      form.classList.add('is-success');
      if (msg) msg.textContent = 'You are on the waitlist. Invite incoming soon.';
      form.reset();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
