import { auth, ref, database,app,push} from '../firebase/auth/auth.js';

    const messageForm = document.getElementById("messageForm");

    if (messageForm) {
        messageForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const nameInput = document.getElementById("nameInput");
            const emailInput = document.getElementById("emailInput");
            const subjectInput = document.getElementById("subjectInput");
            const messageInput = document.getElementById("messageInput");

            if (nameInput && emailInput && subjectInput && messageInput) {
                const name = nameInput.value;
                const email = emailInput.value;
                const subject = subjectInput.value;
                const message = messageInput.value;

                const formData = {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                };
                const messagesRef = ref(database, '/messages'); 
                push(messagesRef, formData)
                    .then(() => {

                        const successModal = document.getElementById("successModal");
                        successModal.style.display = "block";

                        const successMessage = document.getElementById('successMessage');
                    if (successMessage) {
                        const messageText = 'Message sent successfully'; 
                        successMessage.textContent = messageText;
                    }

                        const successCloseBtn = successModal.querySelector(".close");
                        successCloseBtn.addEventListener("click", () => {
                            successModal.style.display = "none";
                            messageForm.reset();
                        });
                        
                    })
                    .catch((error) => {
                        const errorMessageElement = errorModal.querySelector("errorMessage");
                        if (errorMessageElement) {
                            errorMessageElement.textContent = error.message;
                        }
    
                        if (errorMessage) {
                            const messageText = 'Error: Message sent failed!'; 
                            errorMessage.textContent = messageText;
                        }
    
                        errorModal.style.display = "block";
                        const errorCloseBtn = errorModal.querySelector(".close");
                        errorCloseBtn.addEventListener("click", () => {
                            errorModal.style.display = "none";
                        });
                    });
            } else {
                console.error("One or more form input elements not found.");
                alert("An error occurred. Please try again.");
            }
        });
    } else {
        console.error("Message form element not found.");
        alert("An error occurred. Please try again.");
    }






