const billingSwitch = document.getElementById("billingSwitch");
const amounts = document.querySelectorAll(".amount");
const durations = document.querySelectorAll(".duration");
const perYearEls = document.querySelectorAll(".per-year");

function setBilling(isYearly) {
  amounts.forEach(el => {
    const month = el.getAttribute("data-month");
    const year = el.getAttribute("data-year");
    el.textContent = isYearly ? year : month;
  });

  durations.forEach(el => {
    el.textContent = isYearly ? "/year" : "/month";
  });

  // Optional helper line under price (like “USD 480 / year”)
  perYearEls.forEach(el => {
    el.style.display = isYearly ? "none" : "block";
  });
}

billingSwitch?.addEventListener("change", (e) => {
  setBilling(e.target.checked);
});

// Sidebar toggle on mobile
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

toggleSidebar?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

// Initial
setBilling(false);
