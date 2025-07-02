// Import Firebase configuration
import { auth } from '../Utils/firebaseConfig.js';

// Check if user is authenticated
auth.onAuthStateChanged((user) => {
    if (!user) {
        // No user is signed in, redirect to login
        window.location.href = 'index.html';
    }
});

// --- Dashboard Cards ---
// This script dynamically creates dashboard cards for a modern look
const dashboardContainer = document.querySelector('.max-w-4xl.mx-auto');
dashboardContainer.innerHTML = `
  <h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">👥</div>
      <h2 class="text-xl font-semibold text-white mb-2">Staff Management</h2>
      <p class="text-gray-400 mb-4 text-center">View, add, or manage staff accounts and permissions.</p>
      <a href="createUser.html" class="dashboard-button">Manage Staff</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">🧮</div>
      <h2 class="text-xl font-semibold text-white mb-2">Calculator</h2>
      <p class="text-gray-400 mb-4 text-center">Access the HyperMarket calculator for quick calculations.</p>
      <a href="calculator.html" class="dashboard-button">Open Calculator</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">📦</div>
      <h2 class="text-xl font-semibold text-white mb-2">Inventory</h2>
      <p class="text-gray-400 mb-4 text-center">Access the HyperMarket inventory system.</p>
      <a href="https://hmp86inventory.tiiny.site/" class="dashboard-button" target="_blank" rel="noopener noreferrer">Go to Inventory</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">🚪</div>
      <h2 class="text-xl font-semibold text-white mb-2">Logout</h2>
      <p class="text-gray-400 mb-4 text-center">Sign out of your staff account securely.</p>
      <button id="logoutBtn" class="dashboard-button">Logout</button>
    </div>
  </div>
`;

// --- Logout functionality ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async function () {
    try {
      await auth.signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  });
}