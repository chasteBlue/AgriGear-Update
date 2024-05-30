import { app, auth, database, query, orderByChild, equalTo } from '../auth/auth.js';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Function to update UI based on user authentication status
function updateUI(user) {
    console.log('User:', user); // Log the user object
    const authenticatedElements = document.querySelectorAll(".authenticated");
    const unauthenticatedElements = document.querySelectorAll(".unauthenticated");
    const userInfoElement = document.getElementById('userInfo');
    if (user) {
        console.log('User is signed in');
        userInfoElement.textContent = `Logged in as: ${user.email}`;
        authenticatedElements.forEach(element => {
            element.style.display = "block"; // Show authenticated elements
        });
        unauthenticatedElements.forEach(element => {
            element.style.display = "none"; // Hide unauthenticated elements
        });
    } else {
        console.log('User is signed out');
        authenticatedElements.forEach(element => {
            element.style.display = "none"; 
        });
        unauthenticatedElements.forEach(element => {
            element.style.display = "block"; 
        });
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const user = auth.currentUser;
    updateUI(user);

    document.getElementById("register-btn").addEventListener("click", async function() {
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const age = document.getElementById("age").value;
        const gender = document.getElementById("gender").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            if (!username || !email || !gender || !password || !firstname || !lastname || !age) {
                document.getElementById('errorMessage').textContent = 'Please fill all the required fields';
                const errorModal = document.getElementById('errorModal');
                errorModal.style.display = 'block';
                const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                    errorModal.style.display = "none";
                });
                return;
            }

            if (password.length < 8) {
                document.getElementById('errorMessage').textContent = 'Password must be at least 8 characters long.';
                const errorModal = document.getElementById('errorModal');
                errorModal.style.display = 'block';
                const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                    errorModal.style.display = "none";
                });
                return;
            }
    
            if (firstname.length < 2 || lastname.length < 2) {
                document.getElementById('errorMessage').textContent ='Register_error: First name and last name must be at least 2 characters long.'; 
                const errorModal = document.getElementById('errorModal');
                errorModal.style.display = 'block';
                const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                    errorModal.style.display = "none";
                });
                    return;
             }
    
                if (/\d/.test(firstname) || /\d/.test(lastname))
                {
                    document.getElementById('errorMessage').textContent ='Register_error: First name and last name must not contain numbers.'; 
                    const errorModal = document.getElementById('errorModal');
                    errorModal.style.display = 'block';
                    const errorCloseBtn = errorModal.querySelector(".close");
                    errorCloseBtn.addEventListener("click", () => {
                        errorModal.style.display = "none";
                    });
                        return;
                }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                firstname: firstname,
                lastname: lastname,
                age: age,
                gender: gender,
                password: password
            });

            const userDetails = await getUserDetailsByEmail(user.email);
            if (userDetails) {
                const usernameDisplay = document.getElementById('usernameDisplay');
                usernameDisplay.textContent = "'"+ userDetails.username +"'";
            }

            const successModal = document.getElementById("successModal");
            successModal.style.display = "block";

            const successMessage = document.getElementById('successMessage');
            const messageText = 'You have successfully signed up.'; 
            successMessage.textContent = messageText;
            const successCloseBtn = successModal.querySelector(".close");
            
            successCloseBtn.addEventListener("click", () => {
                successModal.style.display = "none";
            });

            document.getElementById('sign-in-btn').click();
        } catch (error) {
            console.error("Error registering user:", error);
            const errorModal = document.getElementById("errorModal");
            errorModal.style.display = "block";
                
            const errorMessage = document.getElementById('errorMessage');
            const messageText = 'Failed in displaying user details. Please try again.'; 
            errorMessage.textContent = messageText;
            document.getElementById('errorSubMessage').textContent = 'Failed.' + error.message;
                    
            const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                errorModal.style.display = "none";
            });
        }
    });
});


document.getElementById("login").addEventListener("click", async function() {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Display success modal
        const successModal = document.getElementById("successModal");
        successModal.style.display = "block";

        function redirectToHomePage() {
            sessionStorage.setItem('userEmail', user.email);
            
            window.location.href = 'index.html';
        }

        // Fetch user details and update username display
        const userDetails = await getUserDetailsByEmail(user.email);
        if (userDetails) {
            const usernameDisplay = document.getElementById('usernameDisplay');
            usernameDisplay.textContent = "'"+ userDetails.username +"'";
        }

        const successMessage = document.getElementById('successMessage');
        const messageText = 'Welcome back! You have successfully signed in'; 
        successMessage.textContent = messageText;
        
        const successCloseBtn = successModal.querySelector(".close");
        successCloseBtn.addEventListener("click", () => {
            successModal.style.display = "none";
            redirectToHomePage();
        });

    } catch (error) {
        const errorModal = document.getElementById("errorModal");
        errorModal.style.display = "block";
            
        const errorMessage = document.getElementById('errorMessage');
        const messageText = 'Error: Sign In Failed! Invalid Details.'; 
        errorMessage.textContent = messageText;
        document.getElementById('errorSubMessage').textContent = 'Failed.' + error.message;
                
        const errorCloseBtn = errorModal.querySelector(".close");
            errorCloseBtn.addEventListener("click", () => {
            errorModal.style.display = "none";
        });
    }
});

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


document.getElementById("signOutOption").addEventListener("click", async function() {
    try {
        await auth.signOut();

        // Clear user session data
        sessionStorage.removeItem('userEmail');

        // Clear cart stored in session storage
        sessionStorage.removeItem('cart');

        // Update UI for signed-out state
        updateUserUI(null);

        alert('Successfully signed out.');
    } catch (error) {
        console.error('Sign-out error:', error);
        alert('Failed to sign out. Please try again.');
    }
});

        const userEmail = sessionStorage.getItem('userEmail');
    
        if (userEmail) {
            updateUserUI({ email: userEmail }); // Simulate user object with stored email
        } else {
            updateUserUI(null); // Update UI for signed-out state
        }
    
        // Realtime listener for authentication state changes
        auth.onAuthStateChanged(user => {
            if (user) {
                updateUserUI(user); // Update UI for authenticated user
                sessionStorage.setItem('userEmail', user.email); // Store user email in session
            } else {
                updateUserUI(null); // Update UI for signed-out state
                sessionStorage.removeItem('userEmail'); // Clear user session data
            }
        });
   

