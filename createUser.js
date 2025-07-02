// Import Firebase configuration and SDKs from CDN
import { auth, db } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get form elements
const createUserForm = document.getElementById('createUserForm');
const messageArea = document.getElementById('message-area');
const successAnimation = document.getElementById('success-animation'); // new

// Function to show messages
function showMessage(message, isError = false) {
    messageArea.textContent = message;
    messageArea.className = `mb-4 text-sm text-center ${isError ? 'text-red-500' : 'text-green-500'}`;
    if (!isError && successAnimation) {
        successAnimation.classList.remove('hidden');
        successAnimation.querySelector('svg').classList.add('animate-flash-spin');
        setTimeout(() => {
            successAnimation.classList.add('hidden');
            successAnimation.querySelector('svg').classList.remove('animate-flash-spin');
        }, 4000); // animation now lasts 4 seconds
    } else if (isError && successAnimation) {
        successAnimation.classList.add('hidden');
        successAnimation.querySelector('svg').classList.remove('animate-flash-spin');
    }
}

// Helper: Prompt admin to re-login after user creation
async function reLoginAdmin() {
    const adminEmail = sessionStorage.getItem('adminEmail');
    let adminPassword = '';
    if (adminEmail) {
        adminPassword = prompt('Please re-enter your admin password to continue:');
        if (adminPassword) {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js');
            try {
                await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
                showMessage('Re-authenticated as admin.', false);
            } catch (e) {
                showMessage('Failed to re-authenticate as admin. Please log in again.', true);
                setTimeout(() => window.location.href = 'loginAdmin.html', 2000);
            }
        } else {
            showMessage('Admin password required. Please log in again.', true);
            setTimeout(() => window.location.href = 'loginAdmin.html', 2000);
        }
    } else {
        showMessage('Session expired. Please log in again.', true);
        setTimeout(() => window.location.href = 'loginAdmin.html', 2000);
    }
}

// Save admin email in sessionStorage on page load (if logged in)
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'loginAdmin.html';
    } else {
        sessionStorage.setItem('adminEmail', user.email);
    }
});

// Handle form submission
createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Always create Firestore user doc with role
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            role: role,
            createdAt: new Date().toISOString()
        });

        showMessage('User created successfully!');
        createUserForm.reset();
        // Removed re-authentication prompt for admin after user creation
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Email already in use. Adding Firestore user doc if missing...');
            import('https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js').then(({ fetchSignInMethodsForEmail, getAuth }) => {
                fetchSignInMethodsForEmail(auth, email).then(async (methods) => {
                    if (methods.length > 0) {
                        // Find UID by signing in (with a dummy password, will fail but gives UID in error)
                        try {
                            await createUserWithEmailAndPassword(auth, email, 'dummy');
                        } catch (signInErr) {
                            if (signInErr.customData && signInErr.customData._tokenResponse && signInErr.customData._tokenResponse.localId) {
                                const uid = signInErr.customData._tokenResponse.localId;
                                await setDoc(doc(db, 'users', uid), {
                                    email: email,
                                    role: role,
                                    createdAt: new Date().toISOString()
                                });
                                showMessage('Firestore user doc added for existing Auth user!');
                                // await reLoginAdmin();
                                return;
                            }
                        }
                    }
                    showMessage('Email already in use. Please check Firestore user doc manually.', true);
                    // await reLoginAdmin();
                });
            });
        } else {
            console.error('Error creating user:', error);
            showMessage(error.message, true);
            // await reLoginAdmin();
        }
    }
});
