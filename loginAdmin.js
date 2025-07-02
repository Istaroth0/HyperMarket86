// Import Firebase configuration and SDKs from CDN
import { auth, db } from './firebaseConfig.js'; // <-- Update path if needed
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get references to the DOM elements
const adminLoginForm = document.getElementById('adminLoginForm');
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const messageArea = document.getElementById('admin-message-area');
const loginButton = adminLoginForm.querySelector('button[type="submit"]');

// Function to show messages with animation
function showMessage(message, type) {
    messageArea.textContent = message;
    messageArea.className = 'text-center mb-4 text-sm font-medium h-5';
    messageArea.classList.add(type === 'error' ? 'text-red-400' : 'text-green-400');
}

// Add submit event listener to the form
adminLoginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    messageArea.textContent = '';
    loginButton.disabled = true;
    adminEmailInput.disabled = true;
    adminPasswordInput.disabled = true;

    const email = adminEmailInput.value.trim();
    const password = adminPasswordInput.value.trim();

    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            showMessage('No Firestore user doc found. Contact admin.', 'error');
            await auth.signOut();
        } else if (userDoc.data().role === 'admin') {
            // Allow only admin role
            // Redirect to admin dashboard after successful login
            window.location.href = 'adminDashboard.html';
        } else {
            // Deny access for staff or any non-admin role
            showMessage('Access denied. Admin only.', 'error');
            await auth.signOut();
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        let errorMessage = 'Invalid email or password.';
        if (error.code === 'auth/user-not-found') errorMessage = 'User not found.';
        if (error.code === 'auth/wrong-password') errorMessage = 'Wrong password.';
        if (error.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Try again later.';
        // Show error code for debugging
        showMessage(`${errorMessage} [${error.code}]`, 'error');
    } finally {
        loginButton.disabled = false;
        adminEmailInput.disabled = false;
        adminPasswordInput.disabled = false;
    }
});