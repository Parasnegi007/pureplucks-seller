// ✅ Wait until DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
    loadCategories();
});
// At the very top of dashboard.js or inside a <script> in dashboard.html
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("sellerAuthToken");
  if (!token) {
    // Redirect to seller login page if not logged in
    window.location.href = "seller.html";
  }
});
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("sellerAuthToken");
    window.location.href = "seller.html"; // Redirect to login
});

// ✅ Add New Category
async function addNewCategory() {
    const name = document.getElementById("newCategoryName").value.trim();
    const description = document.getElementById("newCategoryDescription").value.trim();
    const slug = document.getElementById("newCategorySlug").value.trim();
    const featured = document.getElementById("newCategoryFeatured").checked;
    const imageFile = document.getElementById("newCategoryImage").files[0];

    if (!name || !slug || !imageFile) {
        alert("Name, Slug, and Image are required.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("featured", featured);
    formData.append("image", imageFile);

    try {
        const response = await fetch("https://pureplucks.com/api/categories", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Category added successfully!");
            closePopup("addCategoryPopup");
            loadCategories();
        } else {
            alert("Error adding category.");
        }
    } catch (error) {
        console.error("Error adding category:", error);
    }
}

// ✏️ Edit/Update Category
async function updateCategory(id) {
    const name = document.getElementById(`editCategoryName_${id}`).value.trim();
    const description = document.getElementById(`editCategoryDescription_${id}`).value.trim();
    const slug = document.getElementById(`editCategorySlug_${id}`).value.trim();
    const featured = document.getElementById(`editCategoryFeatured_${id}`).checked;
    const imageFile = document.getElementById(`editCategoryImage_${id}`).files[0];

    if (!name || !slug) {
        alert("Name and Slug are required.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("featured", featured);
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const response = await fetch(`https://pureplucks.com/api/categories/${id}`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            alert("Category updated successfully!");
            loadCategories();
        } else {
            alert("Error updating category.");
        }
    } catch (error) {
        console.error("Error updating category:", error);
    }
}

// ❌ Delete Category
async function deleteCategory(id) {
    if (!confirm("Are you sure you want to delete this category?")) {
        return;
    }

    try {
        const response = await fetch(`https://pureplucks.com/api/categories/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Category deleted successfully!");
            loadCategories();
        } else {
            alert("Error deleting category.");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
    }
}

// 📚 Load Categories in Edit Popup
async function loadCategories() {
    try {
        const response = await fetch("https://pureplucks.com/api/categories");
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();

        const categoryList = document.getElementById("categoryList");
        const editCategoryList = document.getElementById("editCategoryList");

        // Clear both the category list and edit category list before adding new content
        categoryList.innerHTML = '';
        editCategoryList.innerHTML = '';

        // Add "Edit/Add Category" link at the top of the category list
        categoryList.innerHTML = `
            <li onclick="openPopup('editCategoriesPopup')">📝 Edit/Add Category</li>
        `;

        categories.forEach(category => {
            // Add each category to the main category list
            categoryList.innerHTML += `
                <li onclick="openCategoryPopup('${category._id}')">
                    📚 ${category.name}
                </li>
            `;

            // Now, populate the edit category section (editCategoryList)
            editCategoryList.innerHTML += `
                <div class="category-item" id="category_${category._id}">
                    <label>Name:</label>
                    <input type="text" id="editCategoryName_${category._id}" value="${category.name}" />

                    <label>Description:</label>
                    <textarea id="editCategoryDescription_${category._id}">${category.description || ''}</textarea>

                    <label>Upload Image:</label>
                    <input type="file" id="editCategoryImage_${category._id}" />

                    <!-- Display the current image if it exists -->
                    ${category.image ? `<img src="${category.image}" alt="Current Image" class="category-image-preview" />` : ''}

                    <label>Slug:</label>
                    <input type="text" id="editCategorySlug_${category._id}" value="${category.slug}" />

                    <label>
                        <input type="checkbox" id="editCategoryFeatured_${category._id}" ${category.featured ? 'checked' : ''} />
                        Featured
                    </label>

                    <button onclick="updateCategory('${category._id}')">✏️ Update</button>
                    <button onclick="deleteCategory('${category._id}')">❌ Delete</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// 📂 Open Popup and Load Data
function openPopup(id) {
    document.getElementById(id).style.display = 'block';
    if (id === 'editCategoriesPopup') {
        loadCategories();  // Change to loadCategories instead of loadEditCategories
    }
}

// Function to open the "Add Product" form
function openAddProductForm() {
    const popup = document.getElementById('addProductPopup');
    popup.style.display = 'block';
}
const quillAdd = new Quill("#newProductDescription", {
    theme: "snow",
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],  // Headings
            [{ 'font': [] }],  // Font selection
            [{ 'size': ['small', false, 'large', 'huge'] }], // Text & image resizing
            [{ 'align': [] }],  // Text alignment
            ['bold', 'italic', 'underline', 'strike'],  // Text formatting
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Lists
            ['blockquote', 'code-block'],  // Quotes & Code blocks
            [{ 'color': [] }, { 'background': [] }],  // Text & background colors
            ['link', 'image', 'video']  // Links, images, and videos
        ]
    }
});

const quillEdit = new Quill("#editProductDescription", {
    theme: "snow",
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],  // Headings
            [{ 'font': [] }],  // Font selection
            [{ 'size': ['small', false, 'large', 'huge'] }], // Text & image resizing
            [{ 'align': [] }],  // Text alignment
            ['bold', 'italic', 'underline', 'strike'],  // Text formatting
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Lists
            ['blockquote', 'code-block'],  // Quotes & Code blocks
            [{ 'color': [] }, { 'background': [] }],  // Text & background colors
            ['link', 'image', 'video']  // Links, images, and videos
        ]
    }
});

function resizeImage(size) {
    const images = document.querySelectorAll(".ql-editor img");

    images.forEach(img => {
        img.addEventListener("click", () => {
            img.style.width = size === "small" ? "150px" : "400px";
            img.style.height = "auto"; // Maintain aspect ratio
        });
    });
}
document.addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
        selectedImage = event.target;
    }
});

function resizeImage(size) {
    if (selectedImage) {
        selectedImage.style.width = size === "small" ? "150px" : "400px";
    } else {
        alert("Please select an image before resizing.");
    }
}


document.addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
        event.target.style.width = "auto"; // Default width
        event.target.style.height = "auto";
        event.target.contentEditable = true; // Enables adjustments
    }
});
// Function to open the category popup
function openCategoryPopup(categoryId) {
    const popup = document.getElementById('categoryPopup');
    const productList = document.getElementById('productList');

    fetch(`https://pureplucks.com/api/products/category/${categoryId}`)
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = '';

            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <h4>${product.name}</h4>
                    ${product.outOfStock ? '<p style="color: red;"><strong>Out of Stock</strong></p>' : ''}
                    <p>Price: ₹${product.price}</p>
                    <img src="${product.image}" alt="${product.name}" style="max-width:100px;" />
                    <p>${product.description}</p>
                    <button onclick="editProduct('${product._id}')">✏️ Edit</button>
                    <button onclick="deleteProduct('${product._id}')">❌ Delete</button>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    popup.style.display = 'block';
}

function closePopup(popupId = "orderDetailsPopup") {
    const popup = document.getElementById(popupId);
    if (popup) popup.style.display = "none";
    else console.warn("closePopup failed: popup not found", popupId);
}

async function editProduct(productId) {
    try {
        const response = await fetch(`https://pureplucks.com/api/products/${productId}`);
        if (!response.ok) throw new Error(`Failed to fetch product details: ${response.statusText}`);

        const product = await response.json();

        document.getElementById("editProductId").value = product._id;
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editProductMrp").value = product.mrp;
        document.getElementById("editProductSale").checked = product.sale;
        quillEdit.root.innerHTML = product.description;
        document.getElementById("editProductFeatured").checked = product.featured;
        document.getElementById("editProductOutOfStock").checked = product.outOfStock;

        await loadCategoriesForProductForm(true, product.categoryId);
        openPopup("editProductPopup");
    } catch (error) {
        console.error("❌ Error fetching product details:", error);
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://pureplucks.com/api/products/${productId}`, { method: "DELETE" });
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Product deleted:", data.message);
        } else {
            console.error("❌ Error:", response.statusText);
        }
    } catch (error) {
        console.error("❌ Network Error:", error);
    }
}

async function updateProduct() {
    const productId = document.getElementById("editProductId").value;
    const productName = document.getElementById("editProductName").value;
    const productPrice = document.getElementById("editProductPrice").value;
    const productMrp = document.getElementById("editProductMrp").value;
    const productSale = document.getElementById("editProductSale").checked;
    const productDescription = quillEdit.root.innerHTML;
    const productImage = document.getElementById("editProductImage").files[0];
    const productCategory = document.getElementById("editProductCategory").value;
    const productFeatured = document.getElementById("editProductFeatured").checked;
    const productOutOfStock = document.getElementById("editProductOutOfStock").checked;

    if (!productId || !productName || !productPrice || !productMrp || !productCategory) {
        alert("Please fill in all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("mrp", productMrp);
    formData.append("sale", productSale);
    formData.append("description", productDescription);
    formData.append("categoryId", productCategory);
    formData.append("featured", productFeatured);
    formData.append("outOfStock", productOutOfStock);
    if (productImage) formData.append("image", productImage);

    try {
        const response = await fetch(`https://pureplucks.com/api/products/${productId}`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            alert("✅ Product updated successfully!");
            closePopup("editProductPopup");
            openCategoryPopup(productCategory);
        } else {
            alert("❌ Error updating product.");
        }
    } catch (error) {
        console.error("❌ Error updating product:", error);
    }
}

function addNewProduct() {
    const productName = document.getElementById("newProductName").value;
    const productPrice = document.getElementById("newProductPrice").value;
    const productMrp = document.getElementById("newProductMrp").value;
    const productSale = document.getElementById("newProductSale").checked;
    const productDescription = quillAdd.root.innerHTML;
    const productImage = document.getElementById("newProductImage").files[0];
    const productCategory = document.getElementById("newProductCategory").value;
    const productFeatured = document.getElementById("newProductFeatured").checked;
    const productOutOfStock = document.getElementById("newProductOutOfStock").checked;

    if (!productName || !productPrice || !productMrp || !productCategory) {
        alert("Please fill in all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("mrp", productMrp);
    formData.append("sale", productSale);
    formData.append("description", productDescription);
    formData.append("image", productImage);
    formData.append("categoryId", productCategory);
    formData.append("featured", productFeatured);
    formData.append("outOfStock", productOutOfStock);

    fetch("https://pureplucks.com/api/products", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("✅ Product added successfully!");
                closePopup("addProductPopup");
                loadProducts();
            } else {
                alert("❌ Failed to add product.");
            }
        })
        .catch((error) => {
            console.error("❌ Error adding product:", error);
            alert("An error occurred.");
        });
}

async function loadCategoriesForProductForm(editMode = false, selectedCategoryId = null) {
    try {
        const response = await fetch("https://pureplucks.com/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const categories = await response.json();
        const categoryDropdown = editMode
            ? document.getElementById("editProductCategory")
            : document.getElementById("newProductCategory");

        if (!categoryDropdown) return console.error("❌ Category dropdown not found!");

        categoryDropdown.innerHTML = '';

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Category";
        categoryDropdown.appendChild(defaultOption);

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            if (editMode && category._id === selectedCategoryId) option.selected = true;
            categoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error loading categories:", error);
    }
}

function loadProducts() {
    fetch("https://pureplucks.com/api/products")
        .then((response) => response.json())
        .then((products) => {
            const productListContainer = document.getElementById("productListContainer");

            if (productListContainer) {
                productListContainer.innerHTML = "";

                products.forEach((product) => {
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");

                    productItem.innerHTML = `
                        <h4>${product.name}</h4>
                        ${product.outOfStock ? '<p style="color: red;"><strong>Out of Stock</strong></p>' : ''}
                        <p>
                            ${product.sale ? `<span style="text-decoration: line-through; color: gray;">₹${product.mrp}</span>` : ""}
                            <span style="color: ${product.sale ? "red" : "black"};">₹${product.price}</span>
                        </p>
                        <img src="${product.image}" alt="${product.name}" style="max-width:100px;" />
                        <p>${product.description}</p>
                        <button onclick="editProduct('${product._id}')">✏️ Edit</button>
                        <button onclick="deleteProduct('${product._id}', '${product.categoryId}')">❌ Delete</button>
                    `;
                    productListContainer.appendChild(productItem);
                });
            } else {
                console.error("No 'productListContainer' element found in your HTML.");
            }
        })
        .catch((error) => console.error("❌ Error loading products:", error));
}


async function openCategoryPopup(categoryId) {
    const popup = document.getElementById("categoryPopup");
    const productList = document.getElementById("productList");

    try {
        const response = await fetch(`https://pureplucks.com/api/products/category/${categoryId}`);

        // Handle 404 response gracefully
        if (response.status === 404) {
            console.warn("⚠️ No products found, showing fallback message.");
            productList.innerHTML = "<p>No products available in this category.</p>";
            popup.style.display = "block";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();

        productList.innerHTML = ''; // Clear previous products

        if (!Array.isArray(products) || products.length === 0) {
            console.warn(`⚠️ No products found for category: ${categoryId}`);
            productList.innerHTML = "<p>No products available in this category.</p>";
            popup.style.display = "block"; 
            return;
        }

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
                <h4>${product.name}</h4>
                <p>Price: ₹${product.price}</p>
                <img src="${product.image}" alt="${product.name}" />
                <p>${product.description}</p>
                <button onclick="editProduct('${product._id}')">✏️ Edit</button>
                <button onclick="deleteProduct('${product._id}', '${categoryId}')">❌ Delete</button>
            `;
            productList.appendChild(productItem);
        });

        popup.style.display = 'block';
    } catch (error) {
        console.error(`❌ Error fetching products for category ${categoryId}:`, error);
    }
}

// ✅ Re-initialize product categories for product form
window.addEventListener("DOMContentLoaded", function () {
    loadCategoriesForProductForm();
});


// Fetch and display dashboard stats
window.addEventListener("DOMContentLoaded", fetchDashboardStats);
async function fetchDashboardStats() {
    try {
        const response = await fetch("https://pureplucks.com/api/dashboard/stats");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        document.getElementById("totalUsers").textContent = data.totalUsers || 0;
        document.getElementById("totalProducts").textContent = data.totalProducts || 0;
        document.getElementById("totalOrders").textContent = data.totalOrders || 0;
        document.getElementById("totalSales").textContent = `₹${data.totalSales || 0}`;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
    }
}

// Global variables for the chart
let totalOrdersChart;
let currentTimePeriod = "daily"; // Default time period
let userGrowthChart;
let UserDistributionChart;
// Function to render the Total Orders chart
function renderTotalOrdersChart(labels, data) {
    const ctx = document.getElementById("totalOrdersChart").getContext("2d");

    if (totalOrdersChart) {
        totalOrdersChart.destroy();
    }

    totalOrdersChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Orders",
                data: data,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: "Total Orders" }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// ✅ Function to Fetch and Update Total Orders Chart
async function updateTotalOrdersChart() {
    const token = localStorage.getItem("sellerAuthToken"); // ✅ Added token fetch
    if (!token) {
        window.location.href = "seller.html"; // ✅ Redirect if not authenticated
        return;
    }

    try {
        const response = await fetch(`https://pureplucks.com/api/dashboard/orders?timePeriod=${currentTimePeriod}`, {
            headers: {
                Authorization: `Bearer ${token}` // ✅ Added auth header
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { labels, data } = await response.json();
        renderTotalOrdersChart(labels, data);
    } catch (error) {
        console.error("Error updating Total Orders chart:", error);
    }
}

// Show the chart for Total Orders
function showChart(type) {
    if (type === "Total Orders") {
        const chartContainer = document.getElementById("chartContainer");
        const chartControls = document.getElementById("chartControls");

        chartContainer.style.display = "block";
        chartControls.style.display = "flex";
        updateTotalOrdersChart();
    }
}

// Total Orders card click
document.getElementById("totalOrders").addEventListener("click", () => {
    hideAllCharts();
    document.getElementById("totalOrdersChartContainer").style.display = "block";
    document.getElementById("orderControls").style.display = "flex";
    document.getElementById("toggleChartBtn").style.display = "none";
    document.getElementById("chartControls").style.display = "flex";
    document.getElementById("totalProductsChartContainer").style.display = "none";
    currentChartType = "orders";
    updateTotalOrdersChart();
});

// Hide chart containers initially
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("totalOrdersChartContainer").style.display = "none";
    document.getElementById("chartControls").style.display = "none";
    document.getElementById("orderControls").style.display = "none";
    document.getElementById("totalProductsChartContainer").style.display = "none";
});

// Event listener for the Total Users card
document.getElementById("totalUsers").addEventListener("click", () => {
    hideAllCharts();
    document.getElementById("userGrowthSection").style.display = "block";
    document.getElementById("chartControls").style.display = "flex";
    document.getElementById("toggleChartBtn").style.display = "block";
    document.getElementById("totalProductsChartContainer").style.display = "none";
    currentChartType = "growth";
    currentTimePeriod = 'daily'; // or 'weekly', 'monthly', 'yearly'
    updateUserGrowthChart();
});

function hideAllCharts() {
    document.getElementById("userGrowthSection").style.display = "none";
    document.getElementById("userDistributionSection").style.display = "none";
    document.getElementById("totalOrdersChartContainer").style.display = "none";
    document.getElementById("toggleChartBtn").style.display = "none"; 
    document.getElementById("totalProductsChartContainer").style.display = "none";
    document.getElementById("orderControls").style.display = "none";
}
// Fetch and update the User Growth chart
async function updateUserGrowthChart() {
    try {
        const token = localStorage.getItem("sellerAuthToken"); // Ensure the correct token key
        const response = await fetch(`https://pureplucks.com/api/dashboard/users-growth?timePeriod=${currentTimePeriod}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("Received user growth data:", data);

        if (!data || !Array.isArray(data.labels) || !Array.isArray(data.data)) {
            throw new Error("Invalid data received for User Growth chart.");
        }

        renderUserGrowthChart(data.labels, data.data);
    } catch (error) {
        console.error("Error updating User Growth chart:", error);
    }
}


// Change time period
function changeTimePeriod(period) {
    currentTimePeriod = period;

    if (currentChartType === "growth") {
        updateUserGrowthChart();
    } else if (currentChartType === "orders") {
        updateTotalOrdersChart();
    } else if (currentChartType === "products") {
        updateTotalProductsChart();
    }
}

// Populate cities dynamically
async function populateCities() {
    try {
        const response = await fetch("https://pureplucks.com/api/dashboard/cities");
        const cities = await response.json();

        const citySelector = document.getElementById("citySelector");
        citySelector.innerHTML = '<option value="all">All Cities</option>';

        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelector.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading cities:", error);
    }
}

// Update User Distribution chart
async function updateUserDistributionChart() {
    try {
        const response = await fetch("https://pureplucks.com/api/dashboard/users-by-state");
        const data = await response.json();

        if (!data.states || !data.counts) {
            throw new Error("Invalid data received for User Distribution chart.");
        }

        renderUserDistributionChart(data.states, data.counts);
    } catch (error) {
        console.error("Error updating User Distribution chart:", error);
    }
}

// Render User Growth Chart
function renderUserGrowthChart(labels, data) {
    const ctx = document.getElementById("userGrowthChart").getContext("2d");

    if (userGrowthChart) {
        userGrowthChart.destroy();
    }

    userGrowthChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Users",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `Total Users (${currentTimePeriod})`
                }
            },
            onClick: async (event, elements) => {
                if (elements.length && currentTimePeriod === "yearly") {
                    const index = elements[0].index;
                    const clickedMonthLabel = labels[index];
                    const monthNumber = new Date(`${clickedMonthLabel} 1, 2023`).getMonth();
                    const year = new Date().getFullYear();
                    await updateUserGrowthChartForMonth(year, monthNumber);
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Render User Distribution Chart
function renderUserDistributionChart(labels, data) {
    const ctx = document.getElementById("userDistributionChart").getContext("2d");

    if (userDistributionChart) {
        userDistributionChart.destroy();
    }

    userDistributionChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Users by State",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: "User Distribution by State" }
            }
        }
    });
}

// Toggle Chart View
async function toggleChart() {
    const userGrowthSection = document.getElementById("userGrowthSection");
    const userDistributionSection = document.getElementById("userDistributionSection");
    const toggleChartBtn = document.getElementById("toggleChartBtn");

    if (currentChartType === "growth") {
        currentChartType = "geographical";
        userGrowthSection.style.display = "none";
        userDistributionSection.style.display = "block";
        toggleChartBtn.textContent = "Show Growth Chart";
        updateUserDistributionChart();
    } else {
        currentChartType = "growth";
        userDistributionSection.style.display = "none";
        userGrowthSection.style.display = "block";
        toggleChartBtn.textContent = "Show User Distribution";
    }
}

// Total Products chart setup
let totalProductsChart;
document.getElementById("totalProducts").addEventListener("click", () => {
    hideAllCharts();
    document.getElementById("totalProductsChartContainer").style.display = "block";
    document.getElementById("chartControls").style.display = "flex";
    currentChartType = "products";
    updateTotalProductsChart();
});

// Render Total Products Pie Chart
function renderTotalProductsChart(labels, data) {
    const ctx = document.getElementById("totalProductsChart").getContext("2d");

    if (totalProductsChart) {
        totalProductsChart.destroy();
    }

    totalProductsChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Products per Category",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: "Products per Category" }
            }
        }
    });
}

// Fetch and update data for Total Products Chart
async function updateTotalProductsChart() {
    try {
        const response = await fetch("https://pureplucks.com/api/products");
        const products = await response.json();

        const categoryResponse = await fetch("https://pureplucks.com/api/categories");
        const categories = await categoryResponse.json();

        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category._id] = category.name;
        });

        const categoryCount = {};
        products.forEach(product => {
            const categoryName = categoryMap[product.categoryId] || "Unknown";
            categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
        });

        const labels = Object.keys(categoryCount).map(category => `${category} (${categoryCount[category]})`);
        const data = Object.values(categoryCount);

        renderTotalProductsChart(labels, data);
    } catch (error) {
        console.error("Error fetching Total Products data:", error);
    }
}

//USERS 
async function fetchUsers() {
    console.log("✅ fetchUsers() function was called!");

    try {
        const response = await fetch("https://pureplucks.com/api/users");
        const users = await response.json();
        console.log("✅ Users received:", users); // Debug log to check response

        const userList = document.getElementById("userList");
        if (!userList) {
            console.error("❌ userList element is missing in HTML!");
            return;
        }
        userList.innerHTML = ""; // Clear previous data

        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "user-card";

            const street = user?.address?.street || "Not Provided";
            const city = user?.address?.city || "Not Provided";
            const state = user?.address?.state || "Not Provided";
            const zipcode = user?.address?.zipcode || "Not Provided";
            const country = user?.address?.country || "Not Provided";
            const status = user?.status || "Unknown";

            userDiv.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Address:</strong> ${street}, ${city}, ${state}, ${zipcode}, ${country}</p>
            `;
            userList.appendChild(userDiv);
        });

        console.log("✅ userList after updating:", userList.innerHTML); // Debug log
        openPopup("viewUsersPopup"); // ✅ Ensure popup is being opened
    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
}

function openPopup(id) {
    console.log(`✅ openPopup("${id}") function was called!`); // Debug log
    const popup = document.getElementById(id);
    if (!popup) {
        console.error(`❌ Popup with ID "${id}" not found in HTML!`);
        return;
    }
    popup.style.display = "block"; // ✅ Ensure popup is visible
    popup.style.visibility = "visible"; // ✅ Override any hidden visibility
    popup.style.opacity = "1"; // ✅ If there's an animation hiding it
}


async function searchUsers() {
    const query = document.getElementById("searchUser").value;
    const response = await fetch(`https://pureplucks.com/api/users/search?query=${query}`);
    const users = await response.json();

    const manageUserList = document.getElementById("manageUserList");
    manageUserList.innerHTML = "";

    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.className = "user-card";
        userDiv.innerHTML = `
            <p>${user.name} - ${user.email} - ${user.phone}</p>
            <button onclick="toggleBlockUser('${user._id}')">${user.status === "active" ? "Block" : "Unblock"}</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
        `;
        manageUserList.appendChild(userDiv);
    });
}

const updateBtn = document.getElementById("updateStatusBtn");

async function loadOrders() {
    const token = localStorage.getItem('sellerAuthToken');
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '<p>Loading orders...</p>';
  
    if (!token) {
      alert("Unauthorized. Please login again.");
      location.href = "seller.html";
      return;
    }
  
    try {
      const res = await fetch(`https://pureplucks.com/api/dashboard/all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.status === 401) {
        alert("Unauthorized. Please login again.");
        location.href = "/login.html";
        return;
      }
  
      const data = await res.json();
  
      if (!data || !Array.isArray(data)) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
      }
  
      ordersList.innerHTML = '';
      data.forEach(order => {
          const div = document.createElement('div');
          div.className = 'order-card';
          div.innerHTML = `
              <h4>Mongo Object ID: ${order._id}</h4> <!-- Display MongoDB Object ID -->
              <h4>Order ID: ${order.orderId || 'N/A'}</h4> <!-- Display user-friendly Order ID -->
              <p><strong>Tracking ID:</strong> ${order.trackingId || 'N/A'}</p>
              <p><strong>Courier Partner:</strong> ${order.courierPartner || 'N/A'}</p>
              <p><strong>Customer:</strong> ${order.userName || 'N/A'}</p>
             <p><strong>Final Payable:</strong> <strong>₹${order.finalTotal}</strong></p>
              <p><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
              <p><strong>Placed On:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p class="order-status status-${order.orderStatus.toLowerCase()}">Status: ${order.orderStatus}</p>
              <button class="viewOrderBtn" data-order-id="${order._id}">View</button>
          `;
          ordersList.appendChild(div);
      });
      

  
      attachViewButtons();
    } catch (err) {
      console.error('Error loading orders:', err);
      ordersList.innerHTML = '<p>Error loading orders. Please try again.</p>';
    }
  }
  
  function attachViewButtons() {
    document.querySelectorAll(".viewOrderBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const orderId = btn.getAttribute("data-order-id");
        openPopup('orderDetailsPopup');

        await loadOrderDetails(orderId);
      });
    });
  }
  

  async function loadOrderDetails(orderId) {
    const token = localStorage.getItem('sellerAuthToken');
    try {
      const res = await fetch(`https://pureplucks.com/api/dashboard/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const order = await res.json();
  
      if (!order || !order._id) {
        orderDetailsContainer.innerHTML = "<p>Order not found.</p>";
        return;
      }
  
      console.log("Fetched order details:", order);
  
      const address = order.shippingAddress || {};
      const formattedAddress = `
        ${address.street || ''}, ${address.city || ''},<br>
        ${address.state || ''}, ${address.zipcode || ''},<br>
        ${address.country || ''}
      `;
      orderDetailsContainer.innerHTML = `
      <p><strong>Mongo Object ID:</strong> ${order._id}</p> <!-- Display MongoDB Object ID -->
       <h4>Order ID: ${order.orderId || 'N/A'}</h4> <!-- Display user-friendly Order ID -->
              <p><strong>Tracking ID:</strong> ${order.trackingId || 'N/A'}</p>
              <p><strong>Courier Partner:</strong> ${order.courierPartner || 'N/A'}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      <p><strong>User:</strong> ${order.userName || 'N/A'} (${order.userEmail || ''})</p>
      <p><strong>Registered User:</strong> ${order.isRegisteredUser ? 'Yes' : 'No'}</p>
      <p><strong>Phone:</strong> ${order.userPhone || ''}</p>
     <p><strong>Original Total:</strong> ₹${order.totalPrice}</p>
<p><strong>Shipping Charges:</strong> ₹${order.shippingCharges || 0}</p>
<p><strong>Discount:</strong> -₹${order.discountAmount || 0}</p>
<p><strong>Final Payable:</strong> <strong>₹${order.finalTotal}</strong></p>
<p><strong>Applied Coupons:</strong> ${order.appliedCoupons?.length ? order.appliedCoupons.join(', ') : 'None'}</p>
<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
<p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
<p><strong>Transaction ID:</strong> ${order.transactionId || 'N/A'}</p>

      <p><strong>Ordered On:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
  
      <h4>Shipping Address:</h4>
      <p>${formattedAddress}</p>
  
      <h4>Items:</h4>
      <ul>
          ${(order.orderItems || []).map(item => `
              <li>
                  ${item.name} - ₹${item.price} × ${item.quantity}
              </li>
          `).join('')}
      </ul>  
      <h4>Update Tracking Details:</h4>
      <div>
          <label for="trackingIdInput">Tracking ID:</label>
          <input type="text" id="trackingIdInput" value="${order.trackingId || ''}">
      </div>
      <div>
          <label for="courierPartnerInput">Courier Partner:</label>
          <input type="text" id="courierPartnerInput" value="${order.courierPartner || ''}">
      </div>
  
  `;
  
  
      document.getElementById("orderStatusSelect").value = order.orderStatus;
      const updateBtn = document.getElementById("updateStatusBtn");
      updateBtn.setAttribute("data-order-id", order._id);
  
    } catch (err) {
      console.error("Failed to load order", err);
      orderDetailsContainer.innerHTML = "<p>Something went wrong.</p>";
    }
  }

  async function searchOrderByFriendlyId() {
  const input = document.getElementById("orderSearchInput").value.trim();
  const token = localStorage.getItem("sellerAuthToken");

  if (!input) {
    alert("Please enter a valid Order ID.");
    return;
  }

  try {
    const response = await fetch(`https://pureplucks.com/api/dashboard/order-by-orderid/${input}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      document.getElementById("ordersList").innerHTML = `<p>No order found with Order ID: <strong>${input}</strong></p>`;
      return;
    }

    const order = await response.json();
    document.getElementById("ordersList").innerHTML = renderOrderItem(order); // your function to display it

  } catch (err) {
    console.error("Error:", err);
    document.getElementById("ordersList").innerHTML = `<p>Something went wrong while searching.</p>`;
  }
}
function renderOrderItem(order) {
  const address = order.shippingAddress || {};
  const formattedAddress = `
    ${address.street || ''}, ${address.city || ''},<br>
    ${address.state || ''}, ${address.zipcode || ''},<br>
    ${address.country || ''}
  `;

  const itemsHTML = (order.orderItems || [])
    .map(item => `<li>${item.name} - ₹${item.price} × ${item.quantity}</li>`)
    .join('');

  const couponsHTML = (order.appliedCoupons || []).length
    ? `<p><strong>Applied Coupons:</strong> ${order.appliedCoupons.join(', ')}</p>`
    : '';

  return `
    <div class="order-details">
      <p><strong>Mongo Object ID:</strong> ${order._id}</p>
      <h4>Order ID: ${order.orderId}</h4>
      <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
      <p><strong>Courier Partner:</strong> ${order.courierPartner}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      <p><strong>User:</strong> ${order.userName || 'N/A'} (${order.userEmail || ''})</p>
      <p><strong>Registered User:</strong> ${order.isRegisteredUser ? 'Yes' : 'No'}</p>
      <p><strong>Phone:</strong> ${order.userPhone || ''}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
      <p><strong>Discount:</strong> ₹${order.discountAmount || 0}</p>
      <p><strong>Shipping Charges:</strong> ₹${order.shippingCharges || 0}</p>
      <p><strong>Final Total:</strong> ₹${order.finalTotal || order.totalPrice}</p>
      ${couponsHTML}
      <p><strong>Ordered On:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

      <h4>Shipping Address:</h4>
      <p>${formattedAddress}</p>

      <h4>Items:</h4>
      <ul>${itemsHTML}</ul>

      <h4>Update Tracking Details:</h4>
      <div>
          <label for="trackingIdInput">Tracking ID:</label>
          <input type="text" id="trackingIdInput" value="${order.trackingId !== "N/A" ? order.trackingId : ''}">
      </div>
      <div>
          <label for="courierPartnerInput">Courier Partner:</label>
          <input type="text" id="courierPartnerInput" value="${order.courierPartner !== "N/A" ? order.courierPartner : ''}">
      </div>

      <div class="status-update-section">
        <label for="orderStatusSelect">Update Status:</label>
        <select id="orderStatusSelect">
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button id="updateStatusBtn" class="update-btn">Update Status</button>
      </div>
    </div>
  `;
}

  
  // Update order status
  document.getElementById("updateStatusBtn").addEventListener("click", async () => {
    const token = localStorage.getItem('sellerAuthToken');
    const orderId = updateBtn.getAttribute("data-order-id");
    const newStatus = document.getElementById("orderStatusSelect").value;

    // Fetch values from the new tracking and courier partner inputs
    const trackingId = document.getElementById("trackingIdInput").value.trim();
    const courierPartner = document.getElementById("courierPartnerInput").value.trim();

    try {
        const res = await fetch(`https://pureplucks.com/api/dashboard/order/${orderId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status: newStatus,
                trackingId, // Send tracking ID
                courierPartner // Send courier partner
            })
        });

        const result = await res.json();

        if (res.ok) {
            alert("Order updated successfully!");
            closePopup();
            loadOrders(); // Reload the orders list to reflect changes
        } else {
            alert(result.message || "Failed to update order.");
        }
    } catch (err) {
        console.error("Error updating order:", err);
        alert("Something went wrong while updating the order.");
    }
});

  // Initial call
  loadOrders();
  
