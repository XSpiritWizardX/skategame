const revealTargets = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  revealTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      target.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const form = document.getElementById("waitlist-form");
const message = document.getElementById("waitlist-message");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(form).get("email");
    if (!email) return;
    message.textContent = "You are in. We will reach out with early access.";
    form.reset();
  });
}
