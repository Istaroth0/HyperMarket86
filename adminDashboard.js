// Import Firebase configuration
import { auth, db } from '../Utils/firebaseConfig.js';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
  <div id="admin-notification-area" class="mt-10"></div>
`;

// --- Notification UI ---
const notificationArea = document.getElementById('admin-notification-area');
notificationArea.innerHTML = `
  <div class="bg-[#232b2f] rounded-xl shadow-lg p-6 mb-6">
    <h2 class="text-xl font-bold text-white mb-4">Send Notification to Agent</h2>
    <div class="flex flex-col md:flex-row gap-4">
      <input id="notification-input" type="text" maxlength="200"
        class="flex-1 p-3 rounded-lg bg-[#181b1f] border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Type your notification here..." />
      <button id="send-notification-btn"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition">
        Send
      </button>
    </div>
    <div id="notification-status" class="mt-2 text-sm"></div>
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-white mb-2">Recent Notifications</h3>
      <ul id="recent-notifications" class="space-y-2"></ul>
    </div>
  </div>
`;

// --- Add popup container to body ---
let popup = document.createElement('div');
popup.id = 'notification-popup';
popup.style.position = 'fixed';
popup.style.top = '30px';
popup.style.left = '50%';
popup.style.transform = 'translateX(-50%)';
popup.style.zIndex = '9999';
popup.style.display = 'none';
popup.innerHTML = `
  <div class="animate-bounce bg-gradient-to-r from-blue-500 via-green-400 to-blue-700 text-white font-bold px-8 py-5 rounded-2xl shadow-2xl border-4 border-white text-2xl flex items-center gap-3"
       style="box-shadow: 0 8px 32px 0 rgba(59,130,246,0.25);">
    <svg class="w-8 h-8 text-white animate-spin-slow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-80" fill="#fff" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"></path>
    </svg>
    Notification sent to agents!
  </div>
  <style>
    @keyframes spin-slow { 100% { transform: rotate(360deg); } }
    .animate-spin-slow { animation: spin-slow 2s linear infinite; }
  </style>
`;
document.body.appendChild(popup);

// --- Show popup animation ---
function showNotificationPopup() {
  popup.style.display = 'block';
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
  popup.firstElementChild.classList.add('animate__animated', 'animate__fadeInDown');
  setTimeout(() => {
    popup.style.transition = 'opacity 0.7s';
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
  }, 1800);
  setTimeout(() => {
    popup.style.display = 'none';
    popup.style.opacity = '1';
  }, 2500);
}

// --- Send Notification Logic ---
const sendBtn = document.getElementById('send-notification-btn');
const input = document.getElementById('notification-input');
const status = document.getElementById('notification-status');
const recentList = document.getElementById('recent-notifications');

sendBtn.addEventListener('click', async () => {
  console.log("Send button clicked");
  const message = input.value.trim();
  if (!message) {
    status.textContent = "Please enter a message.";
    status.className = "mt-2 text-sm text-red-400";
    return;
  }
  if (!db) {
    status.textContent = "Firestore not initialized.";
    status.className = "mt-2 text-sm text-red-400";
    console.error("Firestore db is not initialized.");
    return;
  }
  status.textContent = "Sending...";
  status.className = "mt-2 text-sm text-blue-400";
  try {
    await addDoc(collection(db, 'notifications'), {
      message,
      timestamp: serverTimestamp()
    });
    console.log("Notification sent to Firestore");
    input.value = "";
    status.textContent = "Notification sent!";
    status.className = "mt-2 text-sm text-green-400";
    showNotificationPopup(); // <-- Show animated popup
  } catch (e) {
    status.textContent = "Failed to send notification.";
    status.className = "mt-2 text-sm text-red-400";
    console.error("Error sending notification:", e);
    alert("Error sending notification: " + (e.message || e));
  }
});

// --- Show Recent Notifications ---
function renderRecentNotifications(docs) {
  recentList.innerHTML = "";
  docs.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    li.className = "bg-[#181b1f] rounded p-3 text-white border border-gray-700";
    li.textContent = data.message + " ";
    const time = document.createElement('span');
    time.className = "text-xs text-gray-400 float-right";
    time.textContent = data.timestamp?.toDate
      ? data.timestamp.toDate().toLocaleString()
      : "";
    li.appendChild(time);
    recentList.appendChild(li);
  });
}

// Listen for recent notifications (last 5)
const notificationsQuery = query(
  collection(db, 'notifications'),
  orderBy('timestamp', 'desc'),
  limit(5)
);
onSnapshot(notificationsQuery, (snapshot) => {
  renderRecentNotifications(snapshot.docs);
});

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
