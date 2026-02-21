const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const form = document.querySelector('[data-waitlist]');
const note = document.querySelector('.form-note');

if (form && note) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = String(new FormData(form).get('email') || '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      note.textContent = 'Enter a valid work email to join the waitlist.';
      note.style.color = '#ff9e7d';
      return;
    }

    note.textContent = `You're in, ${email}. We'll send your invite soon.`;
    note.style.color = '#2df6b3';
    form.reset();
  });
}
