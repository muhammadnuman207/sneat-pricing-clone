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
}

billingSwitch?.addEventListener("change", (e) => {
  setBilling(e.target.checked);
});

// Sidebar toggle on mobile
const toggleSidebar = document.getElementById("toggleSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.querySelector(".sidebar");
const app = document.querySelector(".app");

function openSidebar() {
  sidebar?.classList.add("open");
  app?.classList.add("sidebar-open");
}

function closeSidebarFunc() {
  sidebar?.classList.remove("open");
  app?.classList.remove("sidebar-open");
}

toggleSidebar?.addEventListener("click", () => {
  if (sidebar?.classList.contains("open")) {
    closeSidebarFunc();
  } else {
    openSidebar();
  }
});

closeSidebar?.addEventListener("click", () => {
  closeSidebarFunc();
});

// close sidebar when clicking outside
document.addEventListener("click", (e) => {
  const isClickInsideSidebar = sidebar?.contains(e.target);
  const isClickOnToggle = toggleSidebar?.contains(e.target);
  
  if (!isClickInsideSidebar && !isClickOnToggle && sidebar?.classList.contains("open")) {
    closeSidebarFunc();
  }
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

  // view switching
  const viewLinks = document.querySelectorAll('.sidebar-link[data-view]');
  viewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.getAttribute('data-view');
      switchView(viewName);
      
      // update active link
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

let products = [];
let editingId = null;

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
      initializeProductForm();
      displayProducts();
    })
    .catch(error => {
      console.error('Error loading product page:', error);
      dynamicContent.innerHTML = '<p class="text-danger">Failed to load product page</p>';
    });
}

function initializeProductForm() {
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    });
  }
}

function submitForm() {
  const Name = document.getElementById("name").value;
  const Price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const checkbox = document.getElementById("inStock").checked;
  const date = document.getElementById("createdAt").value;
  
  if (editingId) {
    // Update existing product
    const index = products.findIndex(p => p.id === editingId);
    if (index > -1) {
      products[index] = { id: editingId, Name, Price, category, checkbox, date };
      editingId = null;
      document.querySelector('#product-form button[type="submit"]').textContent = 'Save Product';
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      Name,
      Price,
      category,
      checkbox,
      date
    };
    products.push(newProduct);
  }

  const response = fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: Name,
      price: Price,
      category: category,
      inStock: checkbox,
      createdAt: date
    })
  });
  console.log(response);
  

  document.getElementById("product-form").reset();
  displayProducts();
}

function displayProducts() {
  const tbody = document.getElementById("products-tbody");
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.Name}</td>
      <td>$${product.Price}</td>
      <td>${product.category}</td>
      <td>${product.checkbox ? 'Yes' : 'No'}</td>
      <td>${product.date}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">
          <i class="fa fa-edit"></i> Update
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
          <i class="fa fa-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('.edit-btn').getAttribute('data-id');
      editProduct(parseInt(id));
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('.delete-btn').getAttribute('data-id');
      deleteProduct(parseInt(id));
    });
  });
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    document.getElementById("name").value = product.Name;
    document.getElementById("price").value = product.Price;
    document.getElementById("category").value = product.category;
    document.getElementById("inStock").checked = product.checkbox;
    document.getElementById("createdAt").value = product.date;
    editingId = id;
    document.querySelector('#product-form button[type="submit"]').textContent = 'Update Product';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    products = products.filter(p => p.id !== id);
    displayProducts();
  }
}


