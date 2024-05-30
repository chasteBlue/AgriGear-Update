import {  ref, database, get } from '../firebase/auth/auth.js';



function getProductDetailsFromDatabase(sku) {
    return new Promise((resolve, reject) => {
        const databaseRef = ref(database, 'product/' + sku);
        get(databaseRef).then((snapshot) => {
            if (snapshot.exists()) {
                const productData = snapshot.val();
                const productDetails = {
                    sku: sku,
                    quantity: productData.quantity || 0,
                    name: productData.proName || 'Unknown Product',
                };
                resolve(productDetails);
            } else {
                reject(new Error('Product not found'));
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

async function handleCheckout() {
    var cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    var adjustments = []; 

    for (const item of cart) {
        try {
            const productDetails = await getProductDetailsFromDatabase(item.sku);

            if (!productDetails) {
                console.error(`Product with SKU ${item.sku} not found`);
                continue;
            }

            const databaseQuantity = productDetails.quantity;

            if (item.quantity > databaseQuantity) {
                console.warn(`Quantity for SKU ${item.sku} exceeds available stock. Adjusting quantity.`);
                item.quantity = databaseQuantity;
                adjustments.push({
                    name: productDetails.name,
                    adjustedQuantity: databaseQuantity
                });
            sessionStorage.setItem('cart', JSON.stringify(cart));

            openCheckoutModal(adjustments);
            }else{
                openCheckModal();
            }
        } catch (error) {
            console.error(`Error while processing checkout for SKU ${item.sku}:`, error);
        }
    }
}

function openCheckoutModal(adjustments) {
    var modal = document.getElementById('checkoutModal');

    modal.style.display = 'block';

    var modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = ''; 

    adjustments.forEach((adjustment, index) => {
        var adjustmentInfo = `
            <p>Exceed Quantity: Product ${index + 1}, Do you want the ${adjustment.name} to be adjusted to ${adjustment.adjustedQuantity}.?</p>
        `;
        modalContent.innerHTML += adjustmentInfo;
    });

    // Handle the actions when the modal is displayed
    var confirmButton = document.getElementById('confirmCheckout');
    var cancelButton = document.getElementById('cancelCheckout');

    confirmButton.onclick = function() {
        // Retrieve the updated cart from session storage
        const updatedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
        console.log('Retrieved updated cart:', updatedCart);
    
        // Create an array to hold the simplified cart item data
        const simplifiedCart = updatedCart.map(item => ({
            name: item.name,
            price: item.price,
            sku: item.sku,
            quantity: item.quantity
        }));
    
        console.log('Simplified cart data:', simplifiedCart);
    
        // Create a custom event with the simplified cart item data
        const cartUpdateEvent = new CustomEvent('cartUpdate', { detail: { updatedCart: simplifiedCart } });
    
        // Dispatch the event to notify other parts of the application
        document.dispatchEvent(cartUpdateEvent);
    
        console.log('Cart update event dispatched.');
    
        // Update displayed quantities for cart items in the modal
        const cartItems = document.getElementsByClassName('cart-item');
    
        for (let i = 0; i < cartItems.length; i++) {
            // Retrieve the SKU of the item from the cart display
            const sku = cartItems[i].getAttribute('data-sku');
    
            // Find the corresponding item in the updated cart
            const cartItem = updatedCart.find(item => item.sku === sku);
    
            if (cartItem) {
                const quantityElement = cartItems[i].querySelector('.quantity');
                if (quantityElement) {
                    console.log(`Updating quantity for SKU ${sku}: ${cartItem.quantity}`);
                    quantityElement.value = cartItem.quantity;
                }

                const totalPriceElement = cartItems[i].querySelector('.total-price');
                if (totalPriceElement) {
                    const totalPrice = (cartItem.price * cartItem.quantity).toFixed(2);
                    console.log(`Updating total price for SKU ${sku}: ₱${totalPrice}`);
                    totalPriceElement.textContent = '₱' + totalPrice;
                }
            }
        }
    
        modal.style.display = 'none';
    };
    

        cancelButton.onclick = function() {
    
            modal.style.display = 'none';
        };
    }


function initializeCheckoutButton() {
    var checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.innerHTML = '<a class="nav-link" href="#"><span>Checkout</span></a>';
        checkoutButton.addEventListener('click', handleCheckout);
    } else {
        console.warn('Checkout button not found.');
    }
}

initializeCheckoutButton();


function openCheckModal() {
    var modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';


    var modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = ''; 
    modalContent.textContent = 'Are you sure you want to proceed to checkout?';

    
    var confirmButton = document.getElementById('confirmCheckout');
    var cancelButton = document.getElementById('cancelCheckout');

    confirmButton.onclick = function() {
        const updatedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
        console.log('Retrieved updated cart:', updatedCart);
    
        const simplifiedCart = updatedCart.map(item => ({
            name: item.name,
            price: item.price,
            sku: item.sku,
            quantity: item.quantity
        }));
    
        console.log(simplifiedCart);
    
        window.location.href = 'Checkout.html';
    };
    

    // Handle click on Cancel button
    cancelButton.onclick = function() {
        // Close the modal
        modal.style.display = 'none';
    };
}

document.addEventListener('DOMContentLoaded', function() {
    var subtotalElement = document.getElementById('subtotalAmount');
    var totalElement = document.getElementById('totalAmount');
    var updateCartCountElement = document.getElementById('updateCartCount');

    document.addEventListener('cartUpdate', function(event) {
        var updatedCart = event.detail.updatedCart || [];

        updatedCart.forEach((updatedItem) => {
            var cartItemElement = document.querySelector(`[data-sku="${updatedItem.sku}"]`);

            if (cartItemElement) {
                var quantityInput = cartItemElement.querySelector('.quantity');
                if (quantityInput) {
                    quantityInput.value = updatedItem.quantity;
                }

                var totalPriceElement = cartItemElement.querySelector('.total-price');
                if (totalPriceElement) {
                    totalPriceElement.textContent = '₱' + (updatedItem.price * updatedItem.quantity).toFixed(2);
                }
            }
        });

        var updatedSubtotal = calculateSubtotal(updatedCart);
        var shippingCost = 50.00;
        var updatedTotal = updatedSubtotal + shippingCost;

        if (subtotalElement) {
            subtotalElement.textContent = '₱ ' + updatedSubtotal.toFixed(2);
        }

        if (totalElement) {
            totalElement.textContent = '₱ ' + updatedTotal.toFixed(2);
        }

        // Update cart count display
        if (updateCartCountElement) {
            updateCartCountElement.textContent = updatedCart.length.toString();
        }
    });
});






