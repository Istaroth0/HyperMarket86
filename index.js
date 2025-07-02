// Import Firebase configuration and SDKs from CDN
import { auth, db } from './firebaseConfig.js'; // <-- Update path to match your structure
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get references to the DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageArea = document.getElementById('message-area');
const loginButton = loginForm.querySelector('button[type="submit"]');

// Function to show messages with animation
function showMessage(message, type) {
    messageArea.textContent = message;
    messageArea.className = 'text-center mb-4 text-sm font-medium h-5';
    messageArea.classList.add(type === 'error' ? 'text-red-400' : 'text-green-400');
}

// Add a submit event listener to the form
loginForm.addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Clear any previous messages
    messageArea.textContent = '';

    // Disable form elements during authentication
    loginButton.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;

    // Get the values from the input fields
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // --- Basic Validation ---
    if (email === '' || password === '') {
        // If either field is empty, show an error message
        showMessage('Please fill in all fields.', 'error');
        loginButton.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        return; // Stop the function
    }

    if (!validateEmail(email)) {
        // If the email format is invalid, show an error message
        showMessage('Please enter a valid email address.', 'error');
        loginButton.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        return; // Stop the function
    }
    try {
        // Attempt to sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            showMessage('No Firestore user doc found. Contact admin.', 'error');
            await auth.signOut();
        } else if (userDoc.data().role === 'staff') {
            // Redirect immediately after login
            window.location.href = 'dashboard.html';
        } else {
            // Deny access for admin or any non-staff role
            showMessage('Access denied. Staff account required.', 'error');
            await auth.signOut();
        }
    } catch (error) {
        console.error(error);
        // Handle specific error cases
        let errorMessage = 'An error occurred. Please try again.';
        if (error.code === 'auth/user-not-found') errorMessage = 'User not found.';
        if (error.code === 'auth/wrong-password') errorMessage = 'Wrong password.';
        if (error.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Try again later.';
        if (error.code === 'auth/invalid-email') errorMessage = 'Please enter a valid email address.';
        // Show error code for debugging
        showMessage(`${errorMessage} [${error.code}]`, 'error');
    } finally {
        loginButton.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
    }
});
    
// --- Helper function for email validation ---
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}