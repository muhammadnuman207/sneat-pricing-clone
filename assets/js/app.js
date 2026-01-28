const billingSwitch = document.getElementById("billingSwitch");
const amounts = document.querySelectorAll(".amount");
const durations = document.querySelectorAll(".duration");
const perYearEls = document.querySelectorAll(".per-year");
const API_URL = "http://localhost:3000/api/products";

function setBilling(isYearly) {
  amounts.forEach((el) => {
    const month = el.getAttribute("data-month");
    const year = el.getAttribute("data-year");
    el.textContent = isYearly ? year : month;
  });

  durations.forEach((el) => {
    el.textContent = isYearly ? "/year" : "/month";
  });
}

billingSwitch?.addEventListener("change", (e) => {
  setBilling(e.target.checked);
});

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

  if (
    !isClickInsideSidebar &&
    !isClickOnToggle &&
    sidebar?.classList.contains("open")
  ) {
    closeSidebarFunc();
  }
});

setBilling(false);

const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", function () {
    this.focus();
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  const card = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      cards.forEach((c) => c.blur());
      this.focus();
    });
  });

  // view switching
  const viewLinks = document.querySelectorAll(".sidebar-link[data-view]");
  viewLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = link.getAttribute("data-view");
      switchView(viewName);

      // update active link
      viewLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});

function switchView(viewName) {
  const pricingView = document.getElementById("pricing-view");
  const dynamicContent = document.getElementById("dynamic-content");

  if (viewName === "pricing") {
    pricingView.style.display = "block";
    dynamicContent.style.display = "none";
  } else if (viewName === "product") {
    pricingView.style.display = "none";
    dynamicContent.style.display = "block";
    loadProductPage();
  }
}

let products = [];
let editingId = null;

function loadProductPage() {
  const dynamicContent = document.getElementById("dynamic-content");

  fetch("product.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load product page");
      }
      return response.text();
    })
    .then((html) => {
      dynamicContent.innerHTML = html;
      initializeProductForm();
      loadProducts(); // Load products from API
    })
    .catch((error) => {
      console.error("Error loading product page:", error);
      dynamicContent.innerHTML =
        '<p class="text-danger">Failed to load product page</p>';
    });
}

// Load products from API
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await response.json();
    displayProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    // If API fails, just display local products array
    displayProducts();
  }
}

function initializeProductForm() {
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm();
    });
  }
}

async function submitForm() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const checkbox = document.getElementById("inStock").checked;
  const date = document.getElementById("createdAt").value;
  console.log("date", date);
  try {
    if (editingId) {
      // Update existing product
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: price,
          category: category,
          inStock: checkbox,
          createdAt: date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      
      // Update in local array
      const index = products.findIndex((p) => p._id === editingId);
      if (index > -1) {
        products[index] = updatedProduct;
      }
      
      editingId = null;
      document.querySelector(
        '#product-form button[type="submit"]',
      ).textContent = "Save Product";
    } else {
      // Add new product
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: price,
          category: category,
          inStock: checkbox,
          createdAt: date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product from frontend");
      }

      const newProduct = await response.json();
      products.push(newProduct);
    }

    document.getElementById("product-form").reset();
    displayProducts();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to save product. Please check the console for details.");
  }
}

function displayProducts() {
  const tbody = document.getElementById("products-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${product.name}</td>
    <td>$${product.price}</td>
    <td>${product.category}</td>
    <td>${product.inStock ? "Yes" : "No"}</td>
    <td>${product.createdAt}</td>
    <td>
    <button class="btn btn-sm btn-warning edit-btn" data-id="${product._id}">
      <i class="fa fa-edit"></i> Update
    </button>
    <button class="btn btn-sm btn-danger delete-btn" id="delete" data-id="${product._id}">
      <i class="fa fa-trash"></i> Delete
    </button>
  </td>
`;
    tbody.appendChild(row);
  });

  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".edit-btn").getAttribute("data-id");
      editProduct(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("e.target", e.target);
      
      const id = e.target.closest(".delete-btn").getAttribute("data-id");
      // console.log("Deleting product with id:", id);
      deleteProduct(id);
    });
  });
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
}

function editProduct(id) {
  const product = products.find((p) => p._id === id);
  console.log(product);
  
  if (product) {
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("inStock").checked = product.inStock;
    document.getElementById("createdAt").value = formatDateTime(product.createdAt);
    console.log(formatDateTime(product.createdAt));
    
    
    editingId = id;
    document.querySelector('#product-form button[type="submit"]').textContent ="Update Product";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

async function deleteProduct(id) {
  if (!id) {
    console.error("Invalid product id:", id);
    return;
  }
  console.log("Deleting product with id:", id);
  
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      products = products.filter((p) => p._id !== id);
      displayProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please check the console for details.");
    }
  }
}