// Import Firebase configuration
import { auth, db } from '../Utils/firebaseConfig.js';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

// --- Agent Notification Area ---
const agentNotificationArea = document.getElementById('agent-notification-area');
agentNotificationArea.innerHTML = `
  <div id="agent-notification-card" class="hidden bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg p-6 mb-8 mt-6 flex items-center">
    <div class="flex-1">
      <div class="text-white text-lg font-semibold mb-1">📢 Admin Notification</div>
      <div id="agent-notification-message" class="text-white text-base"></div>
      <div id="agent-notification-time" class="text-xs text-blue-100 mt-2"></div>
    </div>
  </div>
`;

// --- Listen for latest notification ---
const notificationsQuery = query(
  collection(db, 'notifications'),
  orderBy('timestamp', 'desc'),
  limit(1)
);
onSnapshot(notificationsQuery, (snapshot) => {
  const card = document.getElementById('agent-notification-card');
  if (snapshot.empty) {
    card.classList.add('hidden');
    return;
  }
  const data = snapshot.docs[0].data();
  document.getElementById('agent-notification-message').textContent = data.message;
  document.getElementById('agent-notification-time').textContent = data.timestamp?.toDate
    ? "Sent: " + data.timestamp.toDate().toLocaleString()
    : "";
  card.classList.remove('hidden');
});

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