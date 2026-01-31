const revealItems = document.querySelectorAll('.reveal');
const form = document.getElementById('waitlist-form');
const hint = document.getElementById('form-hint');

const onReveal = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      item.classList.add('is-visible');
    }
  });
};

window.addEventListener('scroll', onReveal);
window.addEventListener('load', onReveal);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = data.get('email');
  if (!email) {
    hint.textContent = 'Drop an email to join the crew.';
    return;
  }
  hint.textContent = `You’re in, ${email}. We’ll roll out access soon.`;
  form.reset();
});
