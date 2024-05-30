import { auth, database, ref,update,query, orderByChild, equalTo, get, remove, deleteUser, reauthenticateWithCredential, EmailAuthProvider,updatePassword } from '../firebase/auth/auth.js';
const getUserDetailsByEmail = async (email) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User is not authenticated');
        }

        const usersRef = ref(database, 'users'); // Reference to the 'users' node
        const q = query(usersRef, orderByChild('email'), equalTo(email)); // Construct the query

        const querySnapshot = await get(q);

        if (querySnapshot.exists()) {
            const userId = Object.keys(querySnapshot.val())[0]; // Get the first (and only) userId
            const userDetails = querySnapshot.val()[userId]; // Get the user data object
            return userDetails;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('No user authenticated.');
        
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
        const user = await getCurrentUser(); // Get the current authenticated user
        ProfileUserUI(user);
    } catch (error) {
        return;
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

const ProfileUserUI = async (user) => {
    const usernameInput = document.getElementById('username');
    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const emailDisplay = document.getElementById('emailDisplay'); 
    const updateEmailDisplay = document.getElementById('update-emailDisplay'); 
    if (user) {
        try {
            const userDetails = await getUserDetailsByEmail(user.email);

            if (userDetails) {
                usernameInput.value = userDetails.username;
                firstnameInput.value = userDetails.firstname;
                lastnameInput.value = userDetails.lastname;
                ageInput.value = userDetails.age;
                genderSelect.value = userDetails.gender;

                updateEmailDisplay.textContent = userDetails.email; 
                emailDisplay.textContent = userDetails.email; 
                console.log(userDetails.email);
               
            }
        } catch (error) {
            console.error('Error fetching and displaying user details:', error);
        }
    } else {
        console.error('No user authenticated.');
        const errorModal = document.getElementById("errorModal");
        errorModal.style.display = "block";
            const errorMessage = document.getElementById('errorMessage');
            const messageText = 'No user authenticated, Sign In Now!'; 
            errorMessage.textContent = messageText;    
            const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                errorModal.style.display = "none";
                if (window.location.pathname.includes('Profile.html')) {
                    errorModal.style.display = "none";
                }else {
                    window.location.href = 'Site.html';
                }
               
            });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    await ProfileUserUI(user);

    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const usernameInput = document.getElementById('username');
        const firstnameInput = document.getElementById('firstname');
        const lastnameInput = document.getElementById('lastname');
        const ageInput = document.getElementById('age');
        const genderSelect = document.getElementById('gender');

        const updatedUserDetails = {
            username: usernameInput.value,
            firstname: firstnameInput.value,
            lastname: lastnameInput.value,
            age: ageInput.value,
            gender: genderSelect.value,
        };

        try {
            await updateUserDetailsInFirebase(user.uid, updatedUserDetails);
            const successModal = document.getElementById("successModal");
            successModal.style.display = "block";

            const successMessage = document.getElementById('successMessage');
            const messageText = 'You account is successfully updated!'; 
            successMessage.textContent = messageText;
            const successCloseBtn = successModal.querySelector(".close");
            
            successCloseBtn.addEventListener("click", () => {
                updateUserUI(user);
                successModal.style.display = "none";
            });
        } catch (error) {
            console.error('Error updating user details:', error);
            const errorModal = document.getElementById("errorModal");
            errorModal.style.display = "block";
                
            const errorMessage = document.getElementById('errorMessage');
            const messageText = 'Failed to update your account. Please try again.'; 
            errorMessage.textContent = messageText;
                   
            const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                window.location.reload();
                errorModal.style.display = "none";
            });
        }
    });
});

const updateUserDetailsInFirebase = async (userId, updatedUserDetails) => {
    try {
        const usersRef = ref(database, 'users/' + userId);
        await update(usersRef, updatedUserDetails);
    } catch (error) {
        console.error('Error updating user details:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');

    deleteAccountForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('emailDisplay').textContent;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            displayErrorMessage('Passwords do not match. Please try again.');
            return;
        }

        confirmDeleteModal.style.display = 'block';

        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const cancelBtn = document.getElementById('cancelDeleteBtn');

        const ModalMessage = document.getElementById('ModalMessage');
        const messageText = 'Once you delete your account. There is no getting it back. Make sure you want to delete your account'; 
        ModalMessage.textContent = messageText;

        confirmBtn.addEventListener('click', async () => {

            confirmDeleteModal.style.display = 'none';
            await deleteUserAccount(email, password);
n
            
        });

        cancelBtn.addEventListener('click', () => {
            confirmDeleteModal.style.display = 'none';
        });
    });

    function displayErrorMessage(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.textContent = message;
        errorModal.style.display = 'block';

        const errorCloseBtn = errorModal.querySelector('.close');
        errorCloseBtn.addEventListener('click', () => {
            errorModal.style.display = 'none';
        });
    }
});
const deleteUserAccount = async (email, password) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated.');
        }

        const credentials = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credentials);
        await deleteUser(user);
        await remove(ref(database, `users/${user.uid}`));

        const successModal = document.getElementById("successModal");
            successModal.style.display = "block";

            const successMessage = document.getElementById('successMessage');
            const messageText = 'You account is successfully deleted!'; 
            successMessage.textContent = messageText;
            const successCloseBtn = successModal.querySelector(".close");
            
            successCloseBtn.addEventListener("click", () => {
                sessionStorage.removeItem('cart');
                updateUserUI(null);
                window.location.href = 'index.html';
            });
    } catch (error) {
        const errorModal = document.getElementById("errorModal");
        errorModal.style.display = "block";
            const errorMessage = document.getElementById('errorMessage');
            const messageText = 'Failed to delete your account. Please try again.'; 
            errorMessage.textContent = messageText;
            document.getElementById('errorSubMessage').textContent = 'Failed.' + error.message;
                
            const errorCloseBtn = errorModal.querySelector(".close");
                errorCloseBtn.addEventListener("click", () => {
                window.location.reload();
                errorModal.style.display = "none";
            });
    }
};




const updateAccountForm = document.getElementById('updateAccountForm');

document.addEventListener('DOMContentLoaded', () => {
  
    
    updateAccountForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('password-old').value;
        const newPassword = document.getElementById('password-update').value;
        const confirmPassword = document.getElementById('update-confirmPassword').value;

        if (newPassword.length < 8 || confirmPassword.length < 8) {
            displayErrorMessage('Passwords must be at least 8 characters long. Please try again.');
            return;
        }

        if (newPassword !== confirmPassword) {
            displayErrorMessage('Passwords do not match. Please try again.');
            return;
        }

        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error('User not authenticated.');
            }

            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);

            displaySuccessMessage('Your account password is successfully updated!');

            // Clear the input fields
            document.getElementById('password-old').value = '';
            document.getElementById('password-update').value = '';
            document.getElementById('update-confirmPassword').value = '';
        } catch (error) {
            displayErrorMessage('Failed to update your password. Please try again. ' + error.message);
        }
    });

    function displayErrorMessage(message) {
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;

        errorModal.style.display = 'block';

        const errorCloseBtn = errorModal.querySelector('.close');
        errorCloseBtn.addEventListener('click', () => {
            errorModal.style.display = 'none';
        });
    }

    function displaySuccessMessage(message) {
        const successModal = document.getElementById('successModal');
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;

        successModal.style.display = 'block';

        const successCloseBtn = successModal.querySelector('.close');
        successCloseBtn.addEventListener('click', () => {
            updateUserUI(auth.currentUser);
            successModal.style.display = 'none';
        });
    }
});

auth.onAuthStateChanged(user => {
    ProfileUserUI(user);
});



