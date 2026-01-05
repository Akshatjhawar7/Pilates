const buttons = document.querySelectorAll("[data-provider]");
const adminMagic = document.getElementById("adminMagic");
const clientMagic = document.getElementById("clientMagic");
const adminEmail = document.getElementById("adminEmail");
const clientEmail = document.getElementById("clientEmail");

function toast(message) {
  alert(message);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const role = btn.dataset.role;
    const provider = btn.dataset.provider;
    const scope = role === "practitioner" ? "Admin SSO" : "Client SSO";
    toast(`${scope}: redirecting to ${provider} for MFA-backed sign-in`);
  });
});

adminMagic.addEventListener("click", () => {
  const email = adminEmail.value.trim();
  if (!email) return toast("Enter your work email to receive a magic link.");
  toast(`Magic link sent to ${email}. Enforce MFA during redemption.`);
});

clientMagic.addEventListener("click", () => {
  const email = clientEmail.value.trim();
  if (!email) return toast("Enter your email to receive a booking link.");
  toast(`One-time booking link sent to ${email}.`);
});
