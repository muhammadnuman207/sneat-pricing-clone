const billingSwitch = document.getElementById("billingSwitch");
const amounts = document.querySelectorAll(".amount");
const durations = document.querySelectorAll(".duration");
const perYearEls = document.querySelectorAll(".per-year");
const API_URL = 'http://localhost:3000/api/products';


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

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', function(){
    this.focus();
  });
});


document.addEventListener('DOMContentLoaded', (event) => {
  const card = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function(){
      cards.forEach(c => c.blur());
      this.focus();
    });
  });

  // View switching
  const viewLinks = document.querySelectorAll('.sidebar-link[data-view]');
  viewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.getAttribute('data-view');
      switchView(viewName);
      
      // Update active link
      viewLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

function switchView(viewName) {
  const pricingView = document.getElementById('pricing-view');
  const dynamicContent = document.getElementById('dynamic-content');
  
  if (viewName === 'pricing') {
    pricingView.style.display = 'block';
    dynamicContent.style.display = 'none';
  } else if (viewName === 'product') {
    pricingView.style.display = 'none';
    dynamicContent.style.display = 'block';
    loadProductPage();
  }
}

function loadProductPage() {
  const dynamicContent = document.getElementById('dynamic-content');
  
  fetch('product.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load product page');
      }
      return response.text();
    })
    .then(html => {
      dynamicContent.innerHTML = html;
    })
    .catch(error => {
      console.error('Error loading product page:', error);
      dynamicContent.innerHTML = '<p class="text-danger">Failed to load product page</p>';
    });
}

const dynamicContent = document.getElementById('dynamic-content');
if (dynamicContent.innerHTML.trim() !== '') {
  console.log('Product view is active');
const mylabel = document.getElementById("product-form");
mylabel.addEventListener('submit',(e) => {
e.preventDefault();
submitForm();
});
}
function submitForm() {
  const Name = document.getElementById("name").value;
const Price = document.getElementById("price").value;
const category = document.getElementById("category").value;
const checkbox = document.getElementById("inStock").value;
const date = document.getElementById("createdAt").value;
console.log('API URL:', Name, Price, category, checkbox, date);
}

