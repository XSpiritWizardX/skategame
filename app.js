const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealElements = document.querySelectorAll('.reveal');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

const forms = document.querySelectorAll('[data-waitlist]');
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const message = form.querySelector('.form-message');
    const email = input.value.trim();

    if (!email || !email.includes('@')) {
      message.textContent = 'Drop a real email so we can reach you.';
      message.style.color = '#ff5b6b';
      return;
    }

    message.textContent = 'You are on the list. Look for an invite soon.';
    message.style.color = '#b7ff4a';
    form.reset();
  });
});
