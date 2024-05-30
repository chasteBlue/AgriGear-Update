import { auth, ref, database,app,push,get,set} from '../firebase/auth/auth.js';

const imageInput = document.getElementById('image');
const imageIn1 = document.getElementById('image1');
const imageIn2 = document.getElementById('image2');
const imageIn3 = document.getElementById('image3');
const imageIn4 = document.getElementById('image4');

const proNumInput = document.getElementById('proNum');
const skuInput = document.getElementById('sku');
const categoryInput = document.getElementById('category');
const nameInput = document.getElementById('proName');
const stockInput = document.getElementById('stock');
const quanInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');

const descriptionInput = document.getElementById('proDetail');
const shortInput = document.getElementById('shortDetail');


const addButton = document.getElementById('add');
const viewButton = document.getElementById('view');
const updateButton = document.getElementById('btnupdate');
const deleteButton = document.getElementById('btndelete');

const productsContainer = document.getElementById('productsContainer');
const proContainer = document.getElementById('proContainer');
const populateHome = document.getElementById('populateHome');

document.addEventListener('DOMContentLoaded', () => {
    populateProductTable();
});

document.addEventListener('DOMContentLoaded', () => {
    populate();
});

document.addEventListener('DOMContentLoaded', () => {
    populateHomeFeatures();
});

function populate() {
    const proContainer = document.getElementById('proContainer');
    proContainer.innerHTML = ''; // Clear previous data

    const dbRef = ref(database, 'product');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            const productSkus = Object.keys(products);
            const randomProductSkus = getRandomProductSkus(productSkus, 4);

            randomProductSkus.forEach((sku) => {
                const product = products[sku];
                const productDiv = document.createElement('div');
                productDiv.classList.add('pro');

                const img = document.createElement('img');
                if (product.images && product.images.length > 0) {
                    img.src = product.images[0]; // Use the first image from the array
                } else {
                    img.src = 'default-image.jpg'; // Provide a default image source if no images are available
                }
                img.alt = 'Product Image';
                productDiv.appendChild(img);

                const desDiv = document.createElement('div');
                desDiv.classList.add('des');

                const span = document.createElement('span');
                span.textContent = product.category; // Assuming category is available in the data
                desDiv.appendChild(span);

                const h5 = document.createElement('h5');
                h5.textContent = product.proName;
                desDiv.appendChild(h5);


                const h4 = document.createElement('h4');
                    h4.textContent = 'Price: ₱' + product.price + '.00';
                    desDiv.appendChild(h4);

                    const cartLink = document.createElement('a');
                    cartLink.href = `ShopDetail.html?sku=${sku}`;
                    cartLink.classList.add('nav-link'); 

                    const cartContainer = document.createElement('div');
                    cartContainer.classList.add('cart');


                    const cartIcon = document.createElement('i');
                    cartIcon.classList.add('fa-solid', 'fa-eye');
                    cartContainer.appendChild(cartIcon);

                    const viewDetails = document.createElement('span');
                    viewDetails.textContent = 'View Details'; 
                    viewDetails.classList.add('view-details');
                    cartIcon.appendChild(viewDetails); 

                    cartLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        localStorage.setItem('productName', product.proName);
                        window.location.href = cartLink.href;
                    });

                    desDiv.appendChild(cartContainer);
                    cartLink.appendChild(cartContainer);
                    desDiv.appendChild(cartLink);
                    productDiv.appendChild(desDiv);
                    proContainer.appendChild(productDiv);
            });
        } else {
            alert('No products found');
        }
    }).catch((error) => {
        console.log('Error fetching products: ' + error.message);
    });
}

function populateHomeFeatures(){
    const populateHome = document.getElementById('populateHome');
    const loadingScreen = document.getElementById("loading-screen");
    const dataList = document.getElementById("product");
    const listContainer = document.getElementById("list-container");

    //loading

    loadingScreen.style.display = "flex";
    dataList.style.display = "none";
    populateHome.innerHTML = ''; 

    const dbRef = ref(database, 'product');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {


            const products = snapshot.val();
            const productSkus = Object.keys(products);
            const randomProductSkus = getRandomProductSkus(productSkus, 8);

            randomProductSkus.forEach((sku) => {
                const product = products[sku];
                const productDiv = document.createElement('div');
                productDiv.classList.add('pro');
                
                loadingScreen.style.display = "none";
                dataList.style.display = "block";

                const img = document.createElement('img');
                if (product.images && product.images.length > 0) {
                    img.src = product.images[0]; // Use the first image from the array
                } else {
                    img.src = './AgriPic/default/imageDefault.png'; // Provide a default image source if no images are available
                }
                img.alt = 'Product Image';
                productDiv.appendChild(img);

                const desDiv = document.createElement('div');
                desDiv.classList.add('des');

                const span = document.createElement('span');
                span.textContent = product.category; // Assuming category is available in the data
                desDiv.appendChild(span);

                const h5 = document.createElement('h5');
                h5.textContent = product.proName;
                desDiv.appendChild(h5);


                const h4 = document.createElement('h4');
                    h4.textContent = 'Price: ₱' + product.price + '.00';
                    desDiv.appendChild(h4);

                    const cartLink = document.createElement('a');
                    cartLink.href = `ShopDetail.html?sku=${sku}`;
                    cartLink.classList.add('nav-link'); 

                    const cartContainer = document.createElement('div');
                    cartContainer.classList.add('cart');


                    const cartIcon = document.createElement('i');
                    cartIcon.classList.add('fa-solid', 'fa-eye');
                    cartContainer.appendChild(cartIcon);


                    const viewDetails = document.createElement('span');
                    viewDetails.textContent = 'View Details'; 
                    viewDetails.classList.add('view-details'); 
                    cartIcon.appendChild(viewDetails); 

                    cartLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        localStorage.setItem('productName', product.proName);
                        window.location.href = cartLink.href;
                    });
    
                    desDiv.appendChild(cartContainer);
                    cartLink.appendChild(cartContainer);
                    desDiv.appendChild(cartLink);
                    productDiv.appendChild(desDiv);
                    populateHome.appendChild(productDiv);
            });
        } else {
            alert('No products found');
        }
    }).catch((error) => {
        console.log('Error fetching products: ' + error.message);
    });
}

function getRandomProductSkus(productSkus, count) {
    const randomSkus = [];
    const totalProducts = productSkus.length;
    const shuffledSkus = productSkus.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(count, totalProducts); i++) {
        randomSkus.push(shuffledSkus[i]);
    }

    return randomSkus;
}

// Declare global variables to hold category and priceRange
let categoryFilter = null;
let priceRangeFilter = null;

function populateProductTable(category, priceRange, pageNumber = 1, pageSize = 9, keyword = '') {
    // Store category and priceRange in global variables
    categoryFilter = category;
    priceRangeFilter = priceRange;

    const productsContainer = document.getElementById('productsContainer');
    const loadingScreen = document.getElementById("loading-screen");
    const dataList = document.getElementById("product");
    const listContainer = document.getElementById("list-container");

    // Show loading screen
    loadingScreen.style.display = "flex";
    dataList.style.display = "none";
    productsContainer.innerHTML = '';

    const dbRef = ref(database, 'product');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            
            loadingScreen.style.display = "none";
            dataList.style.display = "flex";

            const products = snapshot.val();
            const productSkus = Object.keys(products);

            const filteredProducts = category ? productSkus.filter(sku => products[sku].category === category) : productSkus;

            const priceFilteredProducts = priceRange ? filteredProducts.filter(sku => {
                const productPrice = products[sku].price;
                return productPrice >= priceRange.min && productPrice <= priceRange.max;
            }) : filteredProducts;

            console.log('Price Filtered Products:', priceFilteredProducts);

            const searchFilteredProducts = keyword ? priceFilteredProducts.filter(sku => {
                    const product = products[sku];
                    if (!product || !product.proName || !product.category) {
                        return false; 
                    }
                    
                    const productName = product.proName.toLowerCase();
                    const productCategory = product.category.toLowerCase();
                    const searchQuery = keyword.toLowerCase();
                    
                    const matchesName = productName.includes(searchQuery);
                    const matchesCategory = productCategory.includes(searchQuery);
                    
                    return matchesName || matchesCategory;
                }) : priceFilteredProducts;

        
            console.log('Search Filtered Products:', searchFilteredProducts);

            const startIndex = (pageNumber - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedProducts = searchFilteredProducts.slice(startIndex, endIndex);

            paginatedProducts.forEach(sku => {
                const product = products[sku];
                const productDiv = document.createElement('div');
                productDiv.classList.add('pro');

                const img = document.createElement('img');
                if (product.images && product.images.length > 0) {
                    img.src = product.images[0]; 
                } else {
                    img.src = '/AgriPic/default/imageDefault.jpg'; 
                }
                img.alt = 'Product Image';
                productDiv.appendChild(img);

                const desDiv = document.createElement('div');
                desDiv.classList.add('des');

                const span = document.createElement('span');
                span.textContent = product.category; 
                desDiv.appendChild(span);

                const h5 = document.createElement('h5');
                h5.textContent = product.proName;
                desDiv.appendChild(h5);

                const h4 = document.createElement('h4');
                h4.textContent = 'Price: ₱' + product.price + '.00';
                desDiv.appendChild(h4);

                const cartLink = document.createElement('a');
                cartLink.href = `ShopDetail.html?sku=${sku}`;
                cartLink.classList.add('nav-link');

                const cartContainer = document.createElement('div');
                cartContainer.classList.add('cart');

                const cartIcon = document.createElement('i');
                cartIcon.classList.add('fa-solid', 'fa-eye');
                cartContainer.appendChild(cartIcon);

                const viewDetails = document.createElement('span');
                viewDetails.textContent = 'View Details';
                viewDetails.classList.add('view-details');
                cartIcon.appendChild(viewDetails);

               
                cartLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    localStorage.setItem('productName', product.proName);
                    window.location.href = cartLink.href;
                });
                
                desDiv.appendChild(cartContainer);
                cartLink.appendChild(cartContainer);
                desDiv.appendChild(cartLink);
                productDiv.appendChild(desDiv);
                productsContainer.appendChild(productDiv);
            });

            
            renderPaginationControls(searchFilteredProducts.length, pageNumber, pageSize);
        } else {
            alert('No products found');
        }
    }).catch((error) => {
        console.log('Error fetching products: ' + error.message);
    });
}

const searchButton = document.getElementById('searchButton');
const clearButton = document.getElementById('clearButton');
const searchInput = document.getElementById('searchInput');

searchButton.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    const category = getCategoryFromSearchInput(searchQuery); 
    const keyword = searchQuery.toLowerCase(); 
    populateProductTable(category, null, 1, 9, keyword); 
    clearButton.style.display = 'inline';
});

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    populateProductTable(categoryFilter, priceRangeFilter, 1, 9, '');
});


function getCategoryFromSearchInput(searchInput) {
    const categoryPrefix = 'category:';
    if (searchInput.startsWith(categoryPrefix)) {
        return searchInput.substring(categoryPrefix.length).trim(); 
    }
    return null;
}


function renderPaginationControls(totalProductsCount, currentPage, pageSize) {
    const totalPages = Math.ceil(totalProductsCount / pageSize);

    // Clear existing pagination controls
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('pagination-prev');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            populateProductTable(categoryFilter, priceRangeFilter, currentPage - 1, pageSize);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            populateProductTable(categoryFilter, priceRangeFilter, i, pageSize);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            populateProductTable(categoryFilter, priceRangeFilter, currentPage + 1, pageSize);
        }
    });
    paginationContainer.appendChild(nextButton);
}


function generateTabs() {
    const dbRef = ref(database, 'product');
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                const categories = [...new Set(Object.values(products).map(product => product.category))];
                const tabNavigation = document.getElementById('tabNavigation');
                tabNavigation.classList.add('tab-navigation');
                tabNavigation.innerHTML = '';

                let activeCategory = null; 
                 createPriceRangeCheckboxes();
                
                const allButton = document.createElement('button');
                allButton.textContent = 'All';
                createPriceRangeCheckboxes();
                allButton.addEventListener('click', () => {
                    if (activeCategory !== null) {
                        populateProductTable(null, null); 
                        setActiveButton(allButton);
                        removePriceRangeCheckboxes(); 
                        createPriceRangeCheckboxes();
                        
                    }
                });
                tabNavigation.appendChild(allButton);


        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.addEventListener('click', () => {
                if (activeCategory === category) {
                    removePriceRangeCheckboxes();
                    activeCategory = null; 
                } else {
                    populateProductTable(category, null); 
                    setActiveButton(button);
                    activeCategory = category; 
                    removePriceRangeCheckboxes();
                    createPriceRangeCheckboxes();
                }
            });
            tabNavigation.appendChild(button);
        });
    } else {
        alert('No products found');
    }
})
.catch((error) => {
    console.error('Error fetching products: ' + error.message);
});
    
}
function createPriceRangeCheckboxes() {
    const priceRanges = [
        { min: 100, max: 199 },
        { min: 200, max: 299 },
        { min: 300, max: 499 },
        { min: 500, max: 699 },
        { min: 700, max: 999 },
        { min: 1000, max: 1499 },
        { min: 1500, max: 2000 }
    ];

    const priceRangeContainer = document.getElementById('priceRangeContainer');
    priceRangeContainer.innerHTML = ''; 

    priceRanges.forEach(range => {

        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('price-range-checkbox');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.id = `price-range-${range.min}-${range.max}`;
        checkbox.name = `price-range-${range.min}-${range.max}`;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                filterByPriceRange(range);
            } else {
                // If unchecked, clear the price range filter
                populateProductTable(activeCategory, null);
            }

            // Uncheck all other checkboxes
            const otherCheckboxes = document.querySelectorAll('.price-range-checkbox input[type="checkbox"]');
            otherCheckboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
     

                const tabButtons = document.querySelectorAll('.tab-navigation button');
                tabButtons.forEach(button => {
                    button.classList.remove('active');
                });
            });


        const label = document.createElement('label');
        label.textContent = `₱${range.min} -  ₱${range.max}`;
        label.htmlFor = `price-range-${range.min}-${range.max}`;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        priceRangeContainer.appendChild(checkboxContainer);
    });
}

function removePriceRangeCheckboxes() {
    const priceRangeContainer = document.getElementById('priceRangeContainer');
    priceRangeContainer.innerHTML = ''; 
}

    
// Define the filterByPriceRange function
function filterByPriceRange(priceRange) {
    const category = null; // No category filtering for price range tab
    populateProductTable(category, priceRange);
}

function setActiveButton(activeButton) {
    const allButtons = document.querySelectorAll('.tab-navigation button');
    
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');


}

window.onload = function() {
    generateTabs();
};




