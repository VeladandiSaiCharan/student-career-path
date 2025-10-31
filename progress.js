// Progress tracking functionality (Minimal Version)
const PROGRESS_STORAGE_KEY = 'scp_user_progress';
let userProgress = {
  goals: [],
  activities: []
};

// Load progress data
function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      userProgress = JSON.parse(saved);
      updateProgressUI();
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
}

// Save progress data
function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

// Update UI with current progress
function updateProgressUI() {
  // Update goals list
  const goalsList = document.getElementById('learning-goals');
  goalsList.innerHTML = userProgress.goals.map((goal, index) => `
    <div class="goal-item">
      <div class="goal-checkbox ${goal.completed ? 'completed' : ''}" 
           onclick="toggleGoal(${index})">
        ${goal.completed ? '<i class="fas fa-check"></i>' : ''}
      </div>
      <span class="goal-text">${goal.text}</span>
      <span class="goal-date">${new Date(goal.date).toLocaleDateString()}</span>
    </div>
  `).join('');

  // Update timeline
  const timeline = document.getElementById('activity-timeline');
  timeline.innerHTML = userProgress.activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10) // Show last 10 activities
    .map(activity => `
      <div class="timeline-entry">
        <div class="timeline-time">${new Date(activity.time).toLocaleString()}</div>
        <div class="timeline-text">${activity.text}</div>
      </div>
    `).join('');
}

// Add learning goal
function addLearningGoal(text) {
  userProgress.goals.push({
    text,
    date: new Date().toISOString(),
    completed: false
  });
  
  addActivity(`Added new learning goal: ${text}`);
  
  saveProgress();
  updateProgressUI();
}

// Toggle goal completion
function toggleGoal(index) {
  if (userProgress.goals[index]) {
    userProgress.goals[index].completed = !userProgress.goals[index].completed;
    
    addActivity(
      userProgress.goals[index].completed 
        ? `Completed goal: ${userProgress.goals[index].text}`
        : `Unmarked goal: ${userProgress.goals[index].text}`
    );
    
    saveProgress();
    updateProgressUI();
  }
}

// Add activity to timeline
function addActivity(text) {
  userProgress.activities.unshift({
    time: new Date().toISOString(),
    text
  });
  
  // Keep only last 50 activities
  if (userProgress.activities.length > 50) {
    userProgress.activities = userProgress.activities.slice(0, 50);
  }
}

// Setup event listeners
document.getElementById('add-goal').addEventListener('click', () => {
  const text = prompt('Enter your learning goal:');
  if (text && text.trim()) {
    addLearningGoal(text.trim());
  }
});

// Initialize
loadProgress();