import { auth, ref, database, query, orderByChild, equalTo, get, child } from '../firebase/auth/auth.js';

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            resolve(user || null);
        });
    });
};

const updateUserOrdersUI = async () => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            throw new Error("User is not authenticated.");
        }

        const userId = user.uid;

        const userOrders = await getOrdersByUserId(userId);
        displayUserOrders(userOrders);
    } catch (error) {
        console.error('No user authenticated.');
        const errorModal = document.getElementById("errorModal");
        errorModal.style.display = "block";
            const errorMessage = document.getElementById('errorMessage');
            const messageText = 'No user authenticated, Sign In Now!'; 
            errorMessage.textContent = messageText;    
            const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                errorModal.style.display = "none";
                window.location.href = 'Site.html';
        });
        console.error('Error retrieving user orders:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateUserOrdersUI();

    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', async () => {
        const searchDate = searchInput.value;
        if (searchDate) {
            clearButton.style.display = 'inline-block';
            const user = await getCurrentUser();
            if (!user) {
                console.error("User is not authenticated.");
                return;
            }

            const userId = user.uid;
            const userOrders = await getOrdersByUserId(userId);
            const filteredOrders = filterOrdersByDate(userOrders, searchDate);
            displayUserOrders(filteredOrders);
        }
    });

    clearButton.addEventListener('click', async () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        await updateUserOrdersUI();
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            clearButton.style.display = 'none';
        }
    });
});

const filterOrdersByDate = (orders, date) => {
    return orders.filter(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-CA'); // Format date to 'YYYY-MM-DD'
        return orderDate === date;
    });
};

export async function getOrdersByUserId(userId) {

    const ordersRef = ref(database, '/orders');

    try {
        const userOrdersRef = query(
            ordersRef,
            orderByChild('userId'),
            equalTo(userId)
        );

        const snapshot = await get(userOrdersRef);

        if (snapshot.exists()) {
            const orders = [];
            snapshot.forEach((childSnapshot) => {
                const order = childSnapshot.val();
                orders.push(order);
        
            });
            return orders;
        } else {
            console.log("No orders found for the user.");
            return [];
        }
    } catch (error) {
        console.error("Error retrieving orders:", error);
        throw error;
    }
}

async function displayUserOrders(userOrders) {
    const ordersListContainer = document.getElementById('orders-list');

    
    if (!userOrders || userOrders.length === 0) {
        const noOrdersImage = document.createElement('img');
        noOrdersImage.src = '../AgriPic/default/feature_6.svg';
        noOrdersImage.alt = 'No orders found';
        noOrdersImage.title = 'No orders found';
        noOrdersImage.style.width = '100%';
        noOrdersImage.style.height = '80vh';
        noOrdersImage.style.display = 'flex';
        ordersListContainer.textContent = "No orders found.";
        ordersListContainer.style.fontSize = '25px';
        ordersListContainer.style.padding = '25px';
        ordersListContainer.appendChild(noOrdersImage);
        return;
    }

    ordersListContainer.innerHTML = '';

    async function fetchProductData(sku) {
        const productSnapshot = await get(child(ref(database, 'product'), sku));
        return productSnapshot.val();
    }

    async function fetchstatus(sku) {
        const statusSnapshot = await get(child(ref(database, 'orders'), salesId));
        return statusSnapshot.val();
    }

    async function fetchOrderStatus(salesId) {
        try {
            const sanitizedSalesId = encodeURIComponent(salesId);
            const orderSnapshot = await get(child(ref(database, 'orders'), sanitizedSalesId));
            return orderSnapshot.val() ? orderSnapshot.val().status : 'Unknown';
        } catch (error) {
            console.error(`Error fetching status for salesId ${salesId}:`, error);
            return 'Error';
        }
    }

    for (const order of userOrders) {
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        const salesId = order.salesId;
        const cartItems = order.cartItems;
        const orderStatus = await fetchOrderStatus(salesId);
        const status = order.status;

     
        const orderItemContainer = document.createElement('div');
        orderItemContainer.classList.add('order-item');

        const orderDateElement = document.createElement('div');
        orderDateElement.classList.add('order-date');
        orderDateElement.textContent = `Order Date: ${orderDate} (Sales ID: ${salesId})`;
        orderItemContainer.appendChild(orderDateElement);

        const cartTable = document.createElement('table');
        cartTable.classList.add('cart-table');

        const headerRow = cartTable.createTHead().insertRow();
        const headers = ['SKU', 'Image', 'Name', 'Price', 'Quantity', 'Subtotal', 'Status'];
        headers.forEach((headerText) => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        const tableBody = cartTable.createTBody();
        let orderTotal = 0;
        for (const item of cartItems) {
            const itemRow = tableBody.insertRow();

            const skuCell = itemRow.insertCell();
            skuCell.classList.add('sku');
            skuCell.textContent = item.sku;

            // Image cell
            const imageCell = itemRow.insertCell();
            imageCell.classList.add('img');
            const productData = await fetchProductData(item.sku);
            if (productData && productData.images && productData.images.length > 0) {
                const imageUrl = productData.images[0];
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = item.name;
                imageElement.title = item.name;
                imageElement.style.maxWidth = '100%';
                imageCell.appendChild(imageElement);
            } else {
                imageCell.textContent = 'Image not available';
            }

            // Name cell
            const nameCell = itemRow.insertCell();
            nameCell.classList.add('name');
            nameCell.textContent = item.name;

            // Price cell
            const priceCell = itemRow.insertCell();
            priceCell.classList.add('price');
            priceCell.textContent = `₱${item.price}.00`;

            // Quantity cell
            const quantityCell = itemRow.insertCell();
            quantityCell.classList.add('quantity');
            quantityCell.textContent = item.quantity;

            // Calculate and display subtotal
            const subtotal = item.price * item.quantity;
            const subtotalCell = itemRow.insertCell();
            subtotalCell.classList.add('subtotal');
            subtotalCell.textContent = subtotal.toFixed(2);

            // Status cell
            const statusCell = itemRow.insertCell();
            statusCell.classList.add('info');
            statusCell.textContent = status;

            orderTotal += subtotal;
        }

        const totalRow = cartTable.insertRow();
        const totalCell = document.createElement('td');
        totalCell.colSpan = headers.length;
        totalCell.style.textAlign = 'right';
        totalCell.textContent = `Total: ₱${orderTotal.toFixed(2)}`;
        totalRow.appendChild(totalCell);

        orderItemContainer.appendChild(cartTable);
        ordersListContainer.appendChild(orderItemContainer);
    }
}