// ---------------- Chatbot (Commented Out) ----------------
/*
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");

let chatHistory = [];
let lastError = null; // Track last error for retry
let lastUserMessage = null; // Track last message for retry

// Determine API base: if the page is served from Live Server (port 5500)
// or from 127.0.0.1:5500, point API calls to the backend running on port 3000.
// Otherwise use relative paths so it works when served by the backend.
function computeApiBase() {
  try {
    const port = window.location.port || '';
    const origin = window.location.origin || '';
    const host = window.location.hostname || '';
    // Detect Live Server by port 5500 on localhost or 127.0.0.1
    if (port === '5500' || origin.includes(':5500') || host === '127.0.0.1' && port === '5500') {
      return 'http://localhost:3000';
    }
    return '';
  } catch (e) {
    console.warn('Failed to compute API_BASE, defaulting to empty', e);
    return '';
  }
}

const API_BASE = computeApiBase();
console.log('Computed API_BASE:', API_BASE);

// --- Chat persistence (localStorage) ---
const CHAT_STORAGE_KEY = 'scp_chat_history_v1';
function loadChatHistory() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) chatHistory = parsed;
    }
  } catch (e) {
    console.warn('Failed to load chat history:', e);
  }
}

function saveChatHistory() {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (e) {
    console.warn('Failed to save chat history:', e);
  }
}

// UI Elements
const clearChatButton = document.getElementById('clear-chat');
const chatbotError = document.getElementById('chatbot-error');
const errorMessage = chatbotError.querySelector('.error-message');
const retryButton = chatbotError.querySelector('.retry-button');
*/

// Header / Nav handlers
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    // toggle display for small screens
    if (getComputedStyle(mainNav).display === 'none') {
      mainNav.style.display = 'flex';
    } else {
      mainNav.style.display = 'none';
    }
  });

  // Close nav when a link is clicked and navigate to section
  mainNav.querySelectorAll('a[data-section]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const section = a.getAttribute('data-section');
      // Map nav sections to page sections
      if (section === 'home') {
        showPage('welcome-page');
      } else if (section === 'recommendations') {
        showPage('dashboard-page');
        showDashboardSection('recommendations');
      } else if (section === 'chatbot') {
        showPage('dashboard-page');
        showDashboardSection('chatbot');
      } else if (section === 'progress') {
        showPage('dashboard-page');
        showDashboardSection('progress');
      }
      // hide nav on mobile
      if (window.innerWidth <= 800) mainNav.style.display = 'none';
    });
  });
}

/* ---------- Chatbot Event Handlers & Functions (Commented Out) ----------
// Clear chat handler
clearChatButton.addEventListener('click', () => {
  if (confirm('Clear chat history? This cannot be undone.')) {
    chatHistory = [];
    localStorage.removeItem(CHAT_STORAGE_KEY);
    renderChat();
    hideError();
  }
});

// Retry button handler
retryButton.addEventListener('click', async () => {
  if (lastUserMessage) {
    hideError();
    await sendMessage(lastUserMessage);
  }
});

function showError(message) {
  errorMessage.textContent = message;
  chatbotError.style.display = 'flex';
}

function hideError() {
  chatbotError.style.display = 'none';
  lastError = null;
}

// Load persisted history on startup (if any) and render
loadChatHistory();
// Render any loaded history
renderChat();

function renderChat() {
  chatbotMessages.innerHTML = chatHistory.map(msg => `
    <div class="chatbot-message ${msg.role}">
      <div class="bubble">${DOMPurify.sanitize(marked.parseInline(msg.text))}</div>
    </div>
  `).join("");
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Send message function (extracted for reuse)
async function sendMessage(message) {
  chatHistory.push({ role: "user", text: message });
  renderChat();
  saveChatHistory();

  // Track this chat interaction
  trackChatInteraction(message);

  // Show loading bubble
  chatHistory.push({ role: "ai", text: "<i class='fa fa-spinner fa-spin'></i>" });
  renderChat();
  saveChatHistory();

  try {
    console.log("Sending chat message:", message);
    lastUserMessage = message; // Save for retry

    // Use API_BASE to handle Live Server (port 5500) or same-origin
    console.log('Calling API at:', `${API_BASE}/api/chatbot`);
    const res = await fetch(`${API_BASE}/api/chatbot`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    console.log("Response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      throw new Error(`Server returned ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Server response:", data);
    
    chatHistory.pop(); // remove loading
    if (data && data.response) {
      chatHistory.push({ role: "ai", text: data.response });
      hideError(); // Clear any previous errors on success
    } else {
      throw new Error("Empty response from server");
    }
    saveChatHistory();
    renderChat();
  } catch (err) {
    chatHistory.pop(); // Remove loading
    lastError = err; // Save for error display
    showError(err.message || "Error contacting AI service");
    chatHistory.push({ role: "ai", text: "Error contacting AI service." });
    saveChatHistory();
    renderChat();
  }
}

// Chatbot form submission disabled
/*
if (chatbotForm) {
  chatbotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const userMsg = chatbotInput.value.trim();
    if (!userMsg) return;
    chatbotInput.value = ""; // Clear input early
    await sendMessage(userMsg);
  });
}
*/


// // Progress tracking imports disabled
// import { trackChatInteraction, trackRecommendation } from './progress.js';
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { db } from "./firebase.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ---------------- Page Navigation ----------------
function showPage(pageId) {
  const pages = ["welcome-page","login-page","signup-page","profile-page","dashboard-page"];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = (id===pageId) ? "block" : "none";
  });
}
// Toggle header visibility based on auth pages
function setAuthPage(isAuth) {
  if (isAuth) document.body.classList.add('auth-page');
  else document.body.classList.remove('auth-page');
}
function showDashboardSection(sectionId){
  const sections = ["home","profile","recommendations","chatbot","progress"];
  sections.forEach(id=>{
    const el = document.getElementById("section-"+id);
    if(el) el.style.display = (id===sectionId)?"block":"none";
  });
}

// ---------------- Signup ----------------
const signupForm = document.getElementById("form-signup");
if (signupForm) {
  signupForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try{
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    window.currentUserEmail = userCredential.user.email || email;
    document.getElementById("profile-name").value = name;
    setAuthPage(false);
    showPage("profile-page");
  }catch(err){
    alert("Error: "+err.message);
  }
  });
} else {
  console.warn("Signup form (#form-signup) not found - signup handler not attached.");
}

// ---------------- Login ----------------
const loginForm = document.getElementById("form-login");
if (loginForm) {
  loginForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try{
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    window.currentUserEmail = userCredential.user.email || email;

    // Fetch user profile
    setAuthPage(false);
    const userId = auth.currentUser.uid;
    const userSnap = await getDoc(doc(db,"users",userId));
    if(userSnap.exists()){
      window.currentUserProfile = userSnap.data();
      const name = window.currentUserProfile.name || window.currentUserEmail;
      document.getElementById("welcome-user").textContent = `Welcome back, ${name}!`;
    }else{
      document.getElementById("welcome-user").textContent = `Welcome back, ${window.currentUserEmail}!`;
    }

    showPage("dashboard-page");
    showDashboardSection("home");

    // Auto-fill profile if available
    if(window.currentUserProfile){
      populateProfileSection(window.currentUserProfile);
    }

  }catch(err){
    alert("Error: "+err.message);
  }
  });
} else {
  console.warn("Login form (#form-login) not found - login handler not attached.");
}

// ---------------- Save Profile ----------------
const profileFormEl = document.getElementById("profile-form");
if (profileFormEl) {
  profileFormEl.addEventListener("submit", async e=>{
    e.preventDefault();
  const profile = {
    name: document.getElementById("profile-name").value.trim(),
    educationLevel: document.getElementById("education-level").value.trim(),
    course: document.getElementById("course").value.trim(),
    careerInterests: document.getElementById("career-interests").value.trim(),
    hobbies: document.getElementById("hobbies").value.trim(),
    skills: document.getElementById("skills").value.split(",").map(s=>s.trim()).filter(Boolean),
    learning: document.getElementById("learning").value,
    location: document.getElementById("location").value.trim(),
    email: window.currentUserEmail,
    createdAt: new Date().toISOString()
  };

  try{
    const userId = auth.currentUser.uid;
    await setDoc(doc(db,"users",userId),profile);
    window.currentUserProfile = profile;
    document.getElementById("welcome-user").textContent = `Hi ${profile.name}! Profile saved 🎉`;
    showPage("dashboard-page");
    showDashboardSection("home");
    populateProfileSection(profile);

  }catch(err){
    console.error(err);
    alert("Error saving profile: "+err.message);
  }
  });
} else {
  console.warn("Profile form (#profile-form) not found - profile save handler not attached.");
}

// ---------------- Populate Profile Section ----------------
function populateProfileSection(profile){
  document.getElementById("display-name").textContent = profile.name || "";
  document.getElementById("display-email").textContent = window.currentUserEmail || "";
  document.getElementById("display-education").textContent = profile.educationLevel || "";
  document.getElementById("display-course").textContent = profile.course || "";
  document.getElementById("display-career").textContent = profile.careerInterests || "";
  document.getElementById("display-hobbies").textContent = profile.hobbies || "";
  document.getElementById("display-skills").textContent = profile.skills?.join(", ") || "";
  document.getElementById("display-learning").textContent = profile.learning || "";
  document.getElementById("display-location").textContent = profile.location || "";

  document.getElementById("summary-education").textContent = profile.educationLevel || "";
  document.getElementById("summary-course").textContent = profile.course || "";
  document.getElementById("summary-career").textContent = profile.careerInterests || "";
  document.getElementById("summary-location").textContent = profile.location || "";
}

// ---------------- Skip Profile ----------------
const skipBtn = document.getElementById("btn-skip-profile");
if (skipBtn) {
  skipBtn.addEventListener("click", ()=>{
    const welcomeEl = document.getElementById("welcome-user");
    if (welcomeEl) welcomeEl.textContent = `Hi ${window.currentUserEmail || "there"}!`;
    showPage("dashboard-page");
    showDashboardSection("home");
  });
} else {
  console.warn("Skip profile button (#btn-skip-profile) not found - skip handler not attached.");
}

// ---------------- Sidebar Navigation ----------------
function attachIfExists(id, handler, desc) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', handler);
  } else {
    console.warn(`${desc || id} not found - handler not attached.`);
  }
}

attachIfExists('nav-home', ()=>showDashboardSection('home'), 'Sidebar nav-home');
attachIfExists('nav-profile', ()=>showDashboardSection('profile'), 'Sidebar nav-profile');
attachIfExists('nav-recommendations', ()=>showDashboardSection('recommendations'), 'Sidebar nav-recommendations');
attachIfExists('nav-chatbot', ()=>showDashboardSection('chatbot'), 'Sidebar nav-chatbot');
attachIfExists('nav-progress', ()=>showDashboardSection('progress'), 'Sidebar nav-progress');
attachIfExists('nav-logout', ()=>{
  window.currentUserEmail = null;
  window.currentUserProfile = null;
  showPage('welcome-page');
}, 'Sidebar nav-logout');

// ---------------- Recommendations (Commented Out) ----------------
/*
async function fetchRecommendations(){
  showDashboardSection("recommendations");
  const container = document.getElementById("recommendations-list");
  container.innerHTML = `<p>⌛ Career recommendations module is currently disabled.</p>`;
}
*/

// ---------------- Welcome Page Buttons ----------------
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
if (btnLogin) btnLogin.addEventListener('click', ()=>showPage('login-page'));
else console.warn('Welcome button #btn-login not found - cannot open login page.');
if (btnSignup) btnSignup.addEventListener('click', ()=>showPage('signup-page'));
else console.warn('Welcome button #btn-signup not found - cannot open signup page.');
