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
function showDashboardSection(sectionId){
  const sections = ["home","profile","recommendations","chatbot","progress"];
  sections.forEach(id=>{
    const el = document.getElementById("section-"+id);
    if(el) el.style.display = (id===sectionId)?"block":"none";
  });
}

// ---------------- Signup ----------------
const signupForm = document.getElementById("form-signup");
signupForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try{
    const userCredential = await createUserWithEmailAndPassword(auth,email,password);
    window.currentUserEmail = userCredential.user.email || email;
    document.getElementById("profile-name").value = name;
    showPage("profile-page");
  }catch(err){
    alert("Error: "+err.message);
  }
});

// ---------------- Login ----------------
const loginForm = document.getElementById("form-login");
loginForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try{
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    window.currentUserEmail = userCredential.user.email || email;

    // Fetch user profile
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

// ---------------- Save Profile ----------------
document.getElementById("profile-form").addEventListener("submit", async e=>{
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
document.getElementById("btn-skip-profile").addEventListener("click", ()=>{
  document.getElementById("welcome-user").textContent = `Hi ${window.currentUserEmail || "there"}!`;
  showPage("dashboard-page");
  showDashboardSection("home");
});

// ---------------- Sidebar Navigation ----------------
document.getElementById("nav-home").addEventListener("click", ()=>showDashboardSection("home"));
document.getElementById("nav-profile").addEventListener("click", ()=>showDashboardSection("profile"));
document.getElementById("nav-recommendations").addEventListener("click", ()=>fetchRecommendations());
document.getElementById("nav-chatbot").addEventListener("click", () => { showDashboardSection("chatbot"); });
document.getElementById("nav-progress").addEventListener("click", ()=>showDashboardSection("progress"));
document.getElementById("nav-logout").addEventListener("click", ()=>{
  window.currentUserEmail = null;
  window.currentUserProfile = null;
  showPage("welcome-page");
});

// ---------------- Recommendations (Gemini API) ----------------
async function fetchRecommendations(){
  showDashboardSection("recommendations");
  const container = document.getElementById("recommendations-list");
  container.innerHTML = `<p>⏳ Fetching personalized recommendations...</p>`;

  try{
    const userId = auth.currentUser.uid;
    const userSnap = await getDoc(doc(db,"users",userId));
    if(!userSnap.exists()){
      container.innerHTML = `<p>No user profile found. Please complete your profile first.</p>`;
      return;
    }

    const user = userSnap.data();
    const res = await fetch("http://localhost:3000/api/recommend", {
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({ userData: user })
    });

    if(!res.ok){
      container.innerHTML = `<p>⚠️ Error from server (${res.status}). Try again later.</p>`;
      return;
    }

    const data = await res.json();
    container.innerHTML = `
      <h3>AI-Based Personalized Recommendation</h3>
      <p>${data.recommendation || "No recommendations found."}</p>
    `;

  }catch(err){
    console.error("Error fetching recommendation:",err);
    container.innerHTML = `<p>⚠️ Failed to load recommendations.</p>`;
  }
}

// ---------------- Welcome Page Buttons ----------------
document.getElementById("btn-login").addEventListener("click", ()=>showPage("login-page"));
document.getElementById("btn-signup").addEventListener("click", ()=>showPage("signup-page"));
