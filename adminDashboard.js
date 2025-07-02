// Import Firebase configuration
import { auth } from '../Utils/firebaseConfig.js';

// Check if user is authenticated
auth.onAuthStateChanged((user) => {
    if (!user) {
        // No user is signed in, redirect to login
        window.location.href = 'loginAdmin.html';
    }
});

// --- Admin Dashboard Cards ---
const dashboardContainer = document.querySelector('.max-w-4xl.mx-auto');
dashboardContainer.innerHTML = `
  <h1 class="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">👥</div>
      <h2 class="text-xl font-semibold text-white mb-2">User Management</h2>
      <p class="text-gray-400 mb-4 text-center">Create, edit, or remove staff and admin accounts.</p>
      <a href="createUser.html" class="dashboard-button">Manage Users</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">📊</div>
      <h2 class="text-xl font-semibold text-white mb-2">Reports & Analytics</h2>
      <p class="text-gray-400 mb-4 text-center">View business reports and analytics for better decisions.</p>
      <a href="adminPdfFiller.html" class="dashboard-button">View Reports</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">⚙️</div>
      <h2 class="text-xl font-semibold text-white mb-2">Settings</h2>
      <p class="text-gray-400 mb-4 text-center">Configure system settings and preferences.</p>
      <a href="adminCalculator.html" class="dashboard-button">Settings</a>
    </div>
    <div class="dashboard-card p-8 flex flex-col items-center justify-center shadow-lg">
      <div class="text-5xl mb-4">🚪</div>
      <h2 class="text-xl font-semibold text-white mb-2">Logout</h2>
      <p class="text-gray-400 mb-4 text-center">Sign out of your admin account securely.</p>
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
      window.location.href = 'loginAdmin.html';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  });
}
