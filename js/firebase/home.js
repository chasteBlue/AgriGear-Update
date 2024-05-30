import { auth, database, ref,update,query, orderByChild, equalTo, get, remove, deleteUser, reauthenticateWithCredential, EmailAuthProvider,updatePassword } from '../firebase/auth/auth.js';

const getUserDetailsByEmail = async (email) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User is not authenticated');
        }

        const usersRef = ref(database, 'users'); 
        const q = query(usersRef, orderByChild('email'), equalTo(email)); 

        const querySnapshot = await get(q);

        if (querySnapshot.exists()) {
            const userId = Object.keys(querySnapshot.val())[0]; 
            const userDetails = querySnapshot.val()[userId]; 
            return userDetails;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            resolve(user || null);
        });
    });
};
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user = await getCurrentUser();
        updateUserUI(user);
    } catch (error) {
        console.error('Error getting current user:', error);
    }
});
const updateUserUI = async (user) => {
    const myAccountDropdown = document.getElementById('myAccountDropdown');
    const signInLink = document.getElementById('signInOption');
    const signInLinkAnchor = document.getElementById('signInLinkAnchor');
    const profileOption = document.getElementById('profileOption');
    const historyOption = document.getElementById('historyOption');
    const signOutOption = document.getElementById('signOutOption');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (user) {
        myAccountDropdown.style.display = 'block'; 
        signInLink.style.display = 'none'; 
        profileOption.style.display = 'block'; 
        historyOption.style.display = 'block'; 
        signOutOption.style.display = 'block'; 
        signInLinkAnchor.style.display = 'none';

        try {
            const userDetails = await getUserDetailsByEmail(user.email);

            if (userDetails) {
                usernameDisplay.textContent = userDetails.username;
                usernameDisplay.style.textTransform = 'uppercase';
                const iconName = document.createElement('i');
                iconName.classList.add('fa-solid','fa-chevron-down');
                iconName.style.marginLeft = '3px';
                iconName.style.cursor = 'pointer';
                iconName.style.color = 'white';
                usernameDisplay.appendChild(iconName);
             }
        } catch (error) {
            console.error('Error fetching and displaying user details:', error);
        }
    } else {
        myAccountDropdown.style.display = 'none'; 
        signInLinkAnchor.style.display = 'block';
        usernameDisplay.textContent = 'My Account'; 
    }
};

auth.onAuthStateChanged(user => {
    updateUserUI(user);
});

document.getElementById('signOutOption').addEventListener('click', async () => {
    const user = auth.currentUser;
    
    if (user) {
        try {
            await auth.signOut();
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('cart');
            updateUserUI(null); 

            const successModal = document.getElementById("successModal");
            if (successModal) {
                successModal.style.display = "block";
    
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    const messageText = 'Sign out successfully!'; 
                    successMessage.textContent = messageText;
                }

                const successCloseBtn = successModal.querySelector(".close");
                if (successCloseBtn) {
                    successCloseBtn.addEventListener("click", () => {
                        successModal.style.display = "none";
                
                        if (window.location.pathname.includes('Checkout.html')) {
                            window.location.href = 'Cart.html';
                        } else if (window.location.pathname.includes('Profile.html')) {
                            window.location.href = 'index.html';
                        }
                        else if (window.location.pathname.includes('History.html')) {
                            window.location.href = 'index.html';
                        } else {
                            window.location.reload();
                        }
                    });
                } else {
                    console.error('Close button in success modal not found.');
                }
            } else {
                console.error('Success modal not found.');
            }
        } catch (error) {
            const errorModal = document.getElementById("errorModal");
            if (errorModal) {
                errorModal.style.display = "block";

                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    const messageText = 'Error: Sign Out failed!'; 
                    errorMessage.textContent = messageText;
                }

                const errorSubMessage = document.getElementById('errorSubMessage');
                if (errorSubMessage) {
                    errorSubMessage.textContent = 'Unable to sign out. ' + error.message;
                }

                const errorCloseBtn = errorModal.querySelector(".close");
                if (errorCloseBtn) {
                    errorCloseBtn.addEventListener("click", () => {
                        window.location.reload();
                        errorModal.style.display = "none";
                    });
                } else {
                    console.error('Close button in error modal not found.');
                }
            } else {
                console.error('Error modal not found.');
            }
            console.error("Error during sign-out:", error);
        }
    } else {
        window.location.href = 'Sign.html';
    }
});


const updatedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
console.log('Retrieved updated cart:', updatedCart);

const simplifiedCart = updatedCart.map(item => ({
    name: item.name,
    price: item.price,
    sku: item.sku,
    quantity: item.quantity
}));

console.log('Simplified cart data:', simplifiedCart);

export { simplifiedCart };



