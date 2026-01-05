const buttons = document.querySelectorAll("[data-provider]");
const clientEmail = document.getElementById("clientEmail");
const clientMagic = document.getElementById("clientMagic");

function toast(message) {
  alert(message);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const provider = btn.dataset.provider;
    toast(`Redirecting to ${provider} for SSO + MFA-backed sign-in`);
  });
});

clientMagic.addEventListener("click", () => {
  const email = clientEmail.value.trim();
  if (!email) return toast("Enter your email to receive a one-time link.");
  toast(`One-time link sent to ${email}.`);
});
