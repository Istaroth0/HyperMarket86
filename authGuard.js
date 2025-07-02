import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Determine which login page to redirect to based on the current page
function getLoginPage() {
    // Example: if this is an admin page, redirect to admin login
    if (window.location.pathname.includes('admin')) {
        return 'loginAdmin.html';
    }
    return 'index.html';
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Not logged in, redirect to login page
        window.location.href = getLoginPage();
    }
});
