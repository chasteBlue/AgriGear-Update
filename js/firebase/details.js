import { auth, ref, get, database,app } from '../firebase/auth/auth.js';

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const sku = getUrlParameter('sku');
const databaseRef = ref(database, 'product/' + sku);

get(databaseRef).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        document.getElementById('sku').textContent = 'SKU: ' + sku;
        document.getElementById('category').textContent = 'Category: ' + data.category;
        document.getElementById('proName').textContent = data.proName;
        document.getElementById('price').textContent = 'Price: ₱' + data.price + '.00';
        document.getElementById('shortDetail').textContent = data.shortDetail;
        document.getElementById('proDetail').textContent = data.proDetail;

        const mainImg = document.getElementById('mainImg');
        mainImg.src = data.images[0]; 

        const smallImages = document.querySelectorAll('.small-img');
        if (data.images && data.images.length > 0) {
            data.images.forEach((imageUrl, index) => {
                if (index < smallImages.length) {
                    smallImages[index].src = imageUrl;
                }
            });
        }
        const stockElement = document.getElementById('stock');
        const productAvailability = data.quantity > 0 ? 'In Stock' : 'Out of Stock';
        stockElement.textContent = 'Stock: ' + productAvailability;

        const addToCartButton = document.getElementById('addToCartButton');

        auth.onAuthStateChanged(user => {
            if (user) {
                const signInText = 'Add to Cart';

                const signInSpan = document.createElement('span');
            
                const plusIcon = document.createElement('i');
                plusIcon.classList.add('fas', 'fa-plus');
                
                signInSpan.appendChild(plusIcon);
                
                signInSpan.appendChild(document.createTextNode(signInText));
                
                addToCartButton.textContent = '';
                addToCartButton.appendChild(signInSpan);
                

                    addToCartButton.addEventListener('click', function() {
                    addToCart(sku, data.proName, data.price, data.proNum,data.images);
                    updateCartCount();
                });
            } else {
                const signInText = 'Sign In to Add to Cart';
                const signInLink = 'Sign.html';
            
                const signInSpan = document.createElement('span');
                signInSpan.textContent = signInText;
            
                addToCartButton.textContent = ''; 
                addToCartButton.appendChild(signInSpan);
            
                signInSpan.addEventListener('click', function() {
                    window.location.href = signInLink; 
                });
            }
        });

    } else {
        console.error('No product found for SKU:', sku);
    }
}).catch((error) => {
    console.error('Error fetching product details:', error.message);
});

function updateCartCount() {
    var cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    var uniqueItems = new Set(cart.map(item => item.sku));
    var cartCount = uniqueItems.size;
    var cartCountSpan = document.getElementById('cartCount');

    cartCountSpan.textContent = cartCount;

    if (cartCount > 0) {
        cartCountSpan.style.display = 'inline'; 
    } else {
        cartCountSpan.style.display = 'none'; 
    }
    var updateCartCountSpan = document.getElementById('updateCartCount');
    if (updateCartCountSpan) {
        updateCartCountSpan.textContent = cartCount;
    }
}

function addToCart(sku, proName, price, proNum,images) {
    var quantityInput = document.getElementById('quantity');
    var quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        console.error('Invalid quantity');
        return;
    }
    getProductDetailsFromDatabase(sku)
        .then((productDetails) => {
            if (!productDetails) {
                console.error('Product not found');
                return;
            }
            const databaseQuantity = productDetails.quantity;

            if (databaseQuantity === 0) {
                displayErrorMessage('Product is out of stock');
                return;
            }

            if (quantity > databaseQuantity) {
                displayErrorMessage('Not enough stock available. Available quantity: ' + databaseQuantity);
                return;
            }

            var cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            var existingItem = cart.find(item => item.sku === sku);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                var imagesArray = [];
                if (Array.isArray(images)) {
                    images.forEach(image => {
                        imagesArray.push(image); 
                    });
                } else {
                    imagesArray.push(images); 
            }
                cart.push({
                    sku: sku,
                    name: proName,
                    price: price,
                    quantity: quantity,
                    proNum: proNum,
                    images:imagesArray
                });
            }
            updateCartCount();
            sessionStorage.setItem('cart', JSON.stringify(cart));
            const successModal = document.getElementById("successModal");
            successModal.style.display = "block";

            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                const messageText = 'Item added to cart successfully!'; 
                successMessage.textContent = messageText;
            }
        
            const successCloseBtn = successModal.querySelector(".close");
            successCloseBtn.addEventListener("click", () => {
                updateCartCount();
                sessionStorage.setItem('cart', JSON.stringify(cart));
                successModal.style.display = "none";                
                
            });
        })
        .catch((error) => {
            displayErrorMessage('Item added to cart failed!');
               
        });
}
updateCartCount();

function getProductDetailsFromDatabase(sku) {
    return new Promise((resolve, reject) => {
        const databaseRef = ref(database, 'product/' + sku);
        get(databaseRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const productData = snapshot.val();
                    const productDetails = {
                        sku: sku,
                        quantity: productData.quantity, 
                        category: productData.category,
                        proName: productData.proName,
                        price: productData.price,
                        shortDetail: productData.shortDetail,
                        proDetail: productData.proDetail,
                        images: productData.images || [] 
                    };

                    resolve(productDetails);
                } else {
                    reject(new Error('Product not found'));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}



