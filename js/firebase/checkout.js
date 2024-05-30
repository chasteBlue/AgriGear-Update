import { auth, ref, database, app, push, get, set, child, query, orderByChild, equalTo, update } from '../firebase/auth/auth.js';
import { simplifiedCart } from '../firebase/home.js';
import { getOrdersByUserId } from '../firebase/history.js';

console.log('Retrieved simplified cart in checkout.js:', simplifiedCart);
console.log('Retrieved getOrdersbyID:', getOrdersByUserId);
document.addEventListener('DOMContentLoaded', () => {
    const gcashRadio = document.getElementById("gcashRadio");
    const codRadio = document.getElementById("codRadio");
    const codDetailsDiv = document.getElementById("codDetails");

    if (gcashRadio && codRadio && codDetailsDiv) {
        gcashRadio.addEventListener("change", function() {
            if (gcashRadio.checked) {
                console.log("Selected payment method: GCash");
                codDetailsDiv.style.display = "none";
            }
        });

        codRadio.addEventListener("change", function() {
            if (codRadio.checked) {
                console.log("Selected payment method: Cash on Delivery (COD)");
                codDetailsDiv.style.display = "block";
            }
        });
    }

    const orderForm = document.forms["orderform"];
    const purchaseButton = document.querySelector(".btn-purchase");

    if (orderForm) {
        orderForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            try {
                const user = auth.currentUser;

                if (!user) {
                    throw new Error("User is not authenticated.");
                }

                purchaseButton.disabled = true;

                const updatedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
                if (updatedCart.length === 0) {
                    throw new Error("Cart is empty. Please add items to your cart before proceeding.");
                }

                const userId = user.uid;

                const lastNameInput = orderForm["Clastname"];
                const firstNameInput = orderForm["Cfirstname"];
                const emailInput = orderForm["Cemail"];
                const phoneInput = orderForm["Cphone"];
                const streetInput = orderForm["Cstreet"];
                const regionInput = orderForm["Cregion"];
                const cityInput = orderForm["Ccity"];
                const zipInput = orderForm["Czip"];
                const termsInput = orderForm["terms"];
                const paymentMethodInput = orderForm.querySelector('input[name="paymentMethod"]:checked');

                if (!lastNameInput || !firstNameInput || !emailInput || !phoneInput || !streetInput ||
                    !regionInput || !cityInput || !zipInput || !termsInput || !paymentMethodInput) {
                    console.error("One or more form fields are missing.");
                    purchaseButton.disabled = false;
                    return;
                }

                const lastName = lastNameInput.value;
                const firstName = firstNameInput.value;
                const email = emailInput.value;
                const phone = phoneInput.value;
                const street = streetInput.value;
                const region = regionInput.value;
                const city = cityInput.value;
                const zip = zipInput.value;
                const terms = termsInput.value;
                const paymentMethod = paymentMethodInput.value;

                const salesId = Math.floor(100000 + Math.random() * 900000);

                const simplifiedCart = updatedCart.map(item => {
                    const subtotal = item.price * item.quantity;
                    return {
                        name: item.name,
                        price: item.price,
                        sku: item.sku,
                        quantity: item.quantity,
                        salesId: salesId,
                        subtotal: subtotal
                    };
                });

                await serializeCartItems(simplifiedCart, salesId);

                const currentDate = new Date();
                const formattedDate = currentDate.toISOString();

                const formData = {
                    userId: userId,
                    salesId: salesId,
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    phone: phone,
                    street: street,
                    region: region,
                    city: city,
                    zip: zip,
                    terms: terms,
                    paymentMethod: paymentMethod,
                    cartItems: simplifiedCart,
                    orderDate: formattedDate,
                    status: 'pending'
                };

                await push(ref(database, 'orders'), formData);
                await updateProductQuantities(updatedCart);
                await sendEmail(formData);
                await getOrdersByUserId(userId);

                const successModal = document.getElementById("successModal");
                if (successModal) {
                    successModal.style.display = "block";

                    const successMessage = document.getElementById('successMessage');
                    if (successMessage) {
                        const messageText = 'Order saved successfully!'; 
                        successMessage.textContent = messageText;
                    }

                    const successCloseBtn = successModal.querySelector(".close");
                    successCloseBtn.addEventListener("click", () => {
                        successModal.style.display = "none";
                        clearCart();
                        window.location.href = 'Shop.html';
                    });
                }

                console.log("Order saved successfully!");
            } catch (error) {
                const errorModal = document.getElementById("errorModal");
                if (errorModal) {
                    const errorMessageElement = errorModal.querySelector("errorMessage");
                    if (errorMessageElement) {
                        errorMessageElement.textContent = error.message;
                    }

                    if (errorMessage) {
                        const messageText = 'Error: Checkout failed!'; 
                        errorMessage.textContent = messageText;
                    }

                    errorModal.style.display = "block";
                    const errorCloseBtn = errorModal.querySelector(".close");
                    errorCloseBtn.addEventListener("click", () => {
                        window.location.reload();
                        errorModal.style.display = "none";
                    });
                }
                console.error("Error processing order:", error);
            } finally {
                purchaseButton.disabled = false;
            }
        });
    }
});



async function updateProductQuantities(cart) {
    const productUpdates = {};
    cart.forEach(item => {
        const { sku, quantity } = item;
        if (sku && quantity > 0) {
            if (!productUpdates[sku]) {
                productUpdates[sku] = 0;
            }
            productUpdates[sku] += quantity;
        }
    });

    const productRef = ref(database, 'product');
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
        const products = snapshot.val();
        Object.entries(productUpdates).forEach(([sku, orderedQuantity]) => {
            if (products[sku]) {
                const currentQuantity = products[sku].quantity || 0;
                const updatedQuantity = Math.max(currentQuantity - orderedQuantity, 0);

                set(child(productRef, `${sku}/quantity`), updatedQuantity)
                    .then(() => {
                        console.log(`Quantity updated for SKU ${sku}.`);
                    })
                    .catch(error => {
                        console.error(`Failed to update quantity for SKU ${sku}:`, error);
                    });
            }
        });
    } else {
        console.error('Products data not found.');
    }
}

function formatCartItems(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        console.error("Invalid cart items format or empty cart.");
        return '';
    }

    let tableRows = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price);
        if (isNaN(itemPrice)) {
            console.error(`Invalid price for item: ${item.name}`);
            return;
        }

        const subtotal = itemPrice * item.quantity;
        totalAmount += subtotal;

        tableRows += `
            <tr>
                <td>${item.name}</td>
                <td>₱${itemPrice.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>₱${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    tableRows += `
        <tr>
            <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
            <td>₱${totalAmount.toFixed(2)}</td>
        </tr>
    `;

    return tableRows;
}

async function serializeCartItems(cart, salesId) {
    const salesDatabaseRef = ref(database, '/sales');

    for (const item of cart) {
        const { sku, name, price, quantity } = item;

        const itemSnapshot = await get(child(salesDatabaseRef, sku));
        if (itemSnapshot.exists()) {
            const existingItem = itemSnapshot.val();
            const updatedQuantity = existingItem.quantity + quantity;

            await update(child(salesDatabaseRef, sku), {
                quantity: updatedQuantity
            });
        } else {
            await set(child(salesDatabaseRef, sku), {
                salesId: salesId,
                sku: sku,
                name: name,
                price: price,
                quantity: quantity
            });
        }
    }
}

function sendEmail(formData) {
    const cartItemsList = formatCartItems(formData.cartItems);

    const emailBody = `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Spartan', sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #296c00;
                    text-align: center;
                }
                p {
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    border: none;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Order Confirmation</h2>
                <p><strong>Customer:</strong> ${formData.firstName} ${formData.lastName},</p>
                <p><strong>Phone Number:</strong> ${formData.phone}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p>Your order has been received successfully!</p>
                <h3>Order Details:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartItemsList}
                    </tbody>
                </table>
                <p>Thank you again for your purchase!</p>
                <p style="font-weight: bold;">Best regards,<br>AgriGear Team</p>
            </div>
        </body>
        </html>
    `;

    const emailConfig = {
        Host: 'smtp.elasticemail.com',
        Port: 2525,
        Username: 'agrigear4@gmail.com',
        Password: 'FE3AB1ED53213800A1E778D1107DDCA874BD',
        To: 'agrigear4@gmail.com',
        From: 'agrigear4@gmail.com',
        Subject: 'Order Confirmation',
        Body: emailBody
    };

    Email.send(emailConfig)
        .then(message => {
            console.log("Email sent successfully!");
        })
        .catch(error => {
            console.error("Email sending failed:", error);
        });
}

function clearCart() {
    sessionStorage.removeItem("cart");
    setTimeout(() => {
        const cartCountSpan = document.getElementById('cartCount');
        if (cartCountSpan) {
            cartCountSpan.textContent = '0';
            cartCountSpan.style.display = 'none';
        } else {
            console.warn('cartCountSpan element not found in the DOM.');
        }
        updateCartCount();
        populateCart();
    }, 100);
}
