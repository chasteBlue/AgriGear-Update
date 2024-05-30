var cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function updateSubtotalDisplay(subtotal) {
    var subtotalSpan = document.getElementById('subtotalAmount');
    if (subtotalSpan) {
        var formattedSubtotal = formatCurrency(subtotal);
        subtotalSpan.textContent = '₱ ' + formattedSubtotal;
    }
}

function updateTotalDisplay(subtotal) {
    var totalCost = calculateTotal(subtotal);
    var totalCostSpan = document.getElementById('totalAmount');
    if (totalCostSpan) {
        var formattedTotalCost = formatCurrency(totalCost);
        totalCostSpan.textContent = '₱ ' + formattedTotalCost;
    }
}

function formatCurrency(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function calculateTotal(subtotal) {
    var shippingCost = 50.00;
    return subtotal + shippingCost;
}

 async function populateCart() {
    var cartItemsHtml = ''; 
    var subtotal = 0;
    var cartItemsContainer = document.getElementById('cart-items');


    if (cart && cart.length > 0) {
        cart.forEach((item, index) => {
            cartItemsHtml += `
                <tr class="cart-item" data-sku="${item.sku}">
                    <td>${index + 1}</td>
                    <td>`;
            if (Array.isArray(item.images) && item.images.length > 0) {
                cartItemsHtml += `<img src="${item.images[0]}" width="100%" alt="Product ${index + 1}">`;
            } else if (typeof item.images === 'string') {
                cartItemsHtml += `<img src="${item.images}" width="100%" alt="Product ${index + 1}">`;
            } else {
                cartItemsHtml += `<img src="./AgriPic/default/imageDefault.jpg" width="100%" alt="No Image">`;
            }
            cartItemsHtml += `</td>
                    <td>${item.name}</td>
                    <td>₱${item.price}</td>
                    <td><input type="number" class="quantity" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
                    <td class="total-price">₱${item.price * item.quantity}</td>
                    <td><a href="#" onclick="removeItem(${index})"><i class="fa-solid fa-trash" title="Remove an Item"> Cancel</i></a></td>
                </tr>`;

            subtotal += item.price * item.quantity;
        });
        document.getElementById('cart-items').innerHTML = cartItemsHtml;
    } else {
        cartItemsHtml += `
            <tr>
                <td colspan="3"><span>Cart is empty</span><p>Shop More!</p></td>
                <td colspan="4"><img src="../AgriPic/default/feature_5.svg" class="empty-cart" alt="Cart is Empty" title="Cart is Empty"></td>  
            </tr>`;
        document.getElementById('cart-items').innerHTML = cartItemsHtml;
    }
    cartItemsContainer.innerHTML = cartItemsHtml;

    updateSubtotalDisplay(subtotal);
    updateTotalDisplay(subtotal);
    updateCartCount();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = parseInt(newQuantity);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        populateCart(); 
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    populateCart(); 
    updateCartCount(); 
}

function clearCart() {
    sessionStorage.removeItem('cart');
    cart = []; 
    populateCart(); 
}

function updateCartCount() {
    var cartCountSpan = document.getElementById('cartCount');
    var updateCartCountSpan = document.getElementById('updateCartCount');
    var showSubtotal = document.getElementById('subtotal');
    
    if (cartCountSpan) {
        var cartCount = cart.length;
        cartCountSpan.textContent = cartCount;

        if (cartCount > 0) {
            cartCountSpan.style.display = 'inline';
            if (updateCartCountSpan) {
                updateCartCountSpan.textContent = cartCount; 
                updateCartCountSpan.style.display = 'inline';
            }
            if (showSubtotal) {
                showSubtotal.style.display = 'inline';
            }
        } else {
            cartCountSpan.style.display = 'none';
            if (updateCartCountSpan) {
                updateCartCountSpan.textContent = '0';
                updateCartCountSpan.style.display = 'none';
            }
            if (showSubtotal) {
                showSubtotal.style.display = 'none';
            }
        }
    }
}


document.addEventListener('cartUpdate', function(event) {
    var updatedCart = event.detail.updatedCart || [];

    updatedCart.forEach((updatedItem) => {
        var cartItemElement = document.querySelector(`[data-sku="${updatedItem.sku}"]`);

        if (cartItemElement) {
            var nameElement = cartItemElement.querySelector('.item-name');
            var priceElement = cartItemElement.querySelector('.item-price');
            var skuElement = cartItemElement.querySelector('.item-sku');
            var quantityInput = cartItemElement.querySelector('.quantity');
            var totalPriceElement = cartItemElement.querySelector('.total-price');

            // Update name, price, sku, and quantity
            if (nameElement) {
                console.log(`Updating name for SKU ${updatedItem.sku}: ${updatedItem.name}`);
                nameElement.textContent = updatedItem.name;
            }

            if (priceElement) {
                console.log(`Updating price for SKU ${updatedItem.sku}: ₱${updatedItem.price.toFixed(2)}`);
                priceElement.textContent = `₱${updatedItem.price.toFixed(2)}`;
            }

            if (skuElement) {
                console.log(`Updating SKU for SKU ${updatedItem.sku}: ${updatedItem.sku}`);
                skuElement.textContent = `SKU: ${updatedItem.sku}`;
            }

            if (quantityInput) {
                console.log(`Updating quantity for SKU ${updatedItem.sku}: ${updatedItem.quantity}`);
                quantityInput.value = updatedItem.quantity;
            }

            if (totalPriceElement) {
                const totalItemPrice = (updatedItem.price * updatedItem.quantity).toFixed(2);
                console.log(`Updating total price for SKU ${updatedItem.sku}: ₱${totalItemPrice}`);
                totalPriceElement.textContent = `₱${totalItemPrice}`;
            }
        }
    });

    var updatedSubtotal = calculateSubtotal(updatedCart);
    console.log(`Updated subtotal: ₱${updatedSubtotal.toFixed(2)}`);
    updateSubtotalDisplay(updatedSubtotal);

    var updatedTotal = calculateTotal(updatedSubtotal);
    console.log(`Updated total: ₱${updatedTotal.toFixed(2)}`);
    updateTotalDisplay(updatedSubtotal);

    console.log(`Updated cart count: ${updatedCart.length}`);
    updateCartCount(updatedCart.length);
});



var updatedSubtotal = calculateSubtotal(cart);
updateSubtotalDisplay(updatedSubtotal);
updateTotalDisplay(updatedSubtotal);
updateCartCount();

window.onload = function() {

    
    populateCart();
};
