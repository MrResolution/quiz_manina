// --- DEFAULT PRE-POPULATED QUIZZES ---
const DEFAULT_QUIZZES = [];


// --- BADGES SYSTEM DEFINITIONS ---
const BADGES = [
  {
    id: "first_quiz",
    title: "Initiation Badge",
    description: "Complete your first quiz on QuizMania.",
    icon: "rocket"
  },
  {
    id: "perfect_score",
    title: "Trivia King",
    description: "Score 100% on any quiz.",
    icon: "crown"
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Answer a question with more than 80% time remaining.",
    icon: "zap"
  },
  {
    id: "streak_5",
    title: "Unstoppable",
    description: "Achieve a correct answer streak of 5.",
    icon: "flame"
  },
  {
    id: "streak_10",
    title: "Omniscient",
    description: "Achieve a correct answer streak of 10.",
    icon: "sparkles"
  },
  {
    id: "quiz_creator",
    title: "Grand Builder",
    description: "Create and publish a custom quiz.",
    icon: "wrench"
  },
  {
    id: "tech_master",
    title: "Silicon Valley Elite",
    description: "Score 80% or higher on a Tech quiz.",
    icon: "laptop"
  },
  {
    id: "space_explorer",
    title: "Interstellar Mind",
    description: "Score 80% or higher on a Science/Space quiz.",
    icon: "orbit"
  }
];

const SIMULATED_LEADERBOARD = [];

// --- APPLICATION STATE ---
let state = {
  user: {
    xp: 0,
    quizzesCompleted: 0,
    totalAnswers: 0,
    correctAnswers: 0,
    badges: [],
    username: "You"
  },
  quizzes: [...DEFAULT_QUIZZES],
  gameplay: {
    activeQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    timeLeft: 0,
    timerInterval: null,
    answersLog: [],
    startTime: null,
    questionStartTime: null,
    unlockedBadgesThisRun: [],
    shuffledQuestions: [],   // randomized question order
    selectedAnswers: {},     // {questionIndex: selectedValue} for review-before-submit
    tabSwitchCount: 0        // anti-cheat tab switch counter
  },
  attemptHistory: [],        // persisted array of past attempts
  multiplayer: {
    active: false,
    role: null, // 'host' or 'student'
    pin: null,
    status: 'lobby',
    pollInterval: null,
    quiz: null,
    currentQuestionIndex: 0,
    participants: []
  },
  currentView: "dashboard-view",
  listenersSetup: false
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  await loadUserProfile();
  await loadQuizzes();
  await loadAttemptHistory();
  
  renderDashboard();
  renderMiniLeaderboard();
  renderMiniBadges();
  
  if (!state.listenersSetup) {
    setupNavigation();
    setupDashboardControls();
    setupQuizArenaHandlers();
    setupQuizCreatorHandlers();
    setupResultsHandlers();
    setupAntiCheat();
    setupReviewModal();
    setupShareModal();
    setupCSVHandlers();
    setupHistoryHandlers();
    setupLoginHandlers();
    setupMultiplayerHandlers();
    state.listenersSetup = true;
  }
  
  // Render Lucide icons
  lucide.createIcons();
}

// --- STATE PERSISTENCE & ACCOUNT MANAGEMENT ---
const DEFAULT_ACCOUNTS = [
  { username: "student", password: "password", role: "student" },
  { username: "teacher", password: "password", role: "teacher" }
];

function getAccounts() {
  const raw = localStorage.getItem("quizmania_accounts");
  if (!raw) {
    localStorage.setItem("quizmania_accounts", JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("quizmania_accounts", JSON.stringify(accounts));
}

function saveUserProfile() {
  updateHeaderProfile();
}

async function loadUserProfile() {
  const activeUser = localStorage.getItem("quizmania_active_user");
  if (!activeUser) {
    document.getElementById("login-overlay").classList.add("active");
    return;
  }

  document.getElementById("login-overlay").classList.remove("active");
  
  try {
    const res = await fetch(`/api/users/${activeUser}`);
    if (res.ok) {
      state.user = await res.json();
    } else {
      state.user = {
        xp: 0,
        quizzesCompleted: 0,
        totalAnswers: 0,
        correctAnswers: 0,
        badges: [],
        username: activeUser,
        role: "student"
      };
    }
  } catch (e) {
    console.error("Failed to load user profile from database", e);
    // Fallback in case of database disconnects
    state.user = {
      xp: 0,
      quizzesCompleted: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      badges: [],
      username: activeUser,
      role: "student"
    };
  }
  updateHeaderProfile();
  applyRoleAccessControl();
}

function applyRoleAccessControl() {
  const role = state.user.role || "student";
  const navAnalytics = document.querySelector('[data-target="analytics-view"]');
  const navCreator = document.querySelector('[data-target="creator-view"]');

  if (role === "student") {
    if (navAnalytics) navAnalytics.style.display = "none";
    if (navCreator) navCreator.style.display = "none";
    
    // Redirect if they are somehow on a restricted view
    if (state.currentView === "analytics-view" || state.currentView === "creator-view") {
      switchView("dashboard-view");
    }
  } else {
    if (navAnalytics) navAnalytics.style.display = "";
    if (navCreator) navCreator.style.display = "";
  }
}

function updateHeaderProfile() {
  const xpEl = document.getElementById("header-user-xp");
  if (xpEl) {
    xpEl.textContent = state.user.xp.toLocaleString();
  }
  const lvlEl = document.getElementById("header-user-level");
  if (lvlEl) {
    lvlEl.textContent = calculateLevel(state.user.xp);
  }
  
  // Update role badge, username, and avatar
  const roleBadge = document.getElementById("header-user-role-badge");
  const usernameEl = document.getElementById("header-username");
  const avatarEl = document.getElementById("header-user-avatar");
  
  if (roleBadge) {
    roleBadge.textContent = state.user.role === "teacher" ? "Teacher" : "Student";
  }
  if (usernameEl) {
    usernameEl.textContent = state.user.username || "You";
  }
  if (avatarEl) {
    avatarEl.textContent = (state.user.username || "Y")[0].toUpperCase();
  }
  
  // Update dashboard statistics
  const statsXp = document.getElementById("stats-xp");
  const statsQuizzes = document.getElementById("stats-quizzes");
  const statsAccuracy = document.getElementById("stats-accuracy");
  
  if (statsXp) statsXp.textContent = state.user.xp.toLocaleString();
  if (statsQuizzes) statsQuizzes.textContent = state.user.quizzesCompleted;
  
  if (statsAccuracy) {
    const accuracyPct = state.user.totalAnswers > 0 
      ? Math.round((state.user.correctAnswers / state.user.totalAnswers) * 100)
      : 0;
    statsAccuracy.textContent = `${accuracyPct}%`;
  }
}

function calculateLevel(xp) {
  // Simple level formula: Level = floor( sqrt(xp / 100) ) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

async function loadQuizzes() {
  try {
    const res = await fetch('/api/quizzes');
    if (res.ok) {
      state.quizzes = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch quizzes from database", e);
  }
}

async function saveCustomQuiz(newQuiz) {
  try {
    const response = await fetch('/api/quizzes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newQuiz,
        createdBy: state.user.username
      })
    });
    
    if (response.ok) {
      showToast("Quiz published to the database successfully!", "success");
      await loadQuizzes();
      renderDashboard();
    } else {
      const err = await response.json();
      if (response.status === 400) {
        showToast(`Failed to create quiz: ${err.error || 'Server error'}`, "error");
        return;
      }
      throw new Error(err.error || 'Server error');
    }
  } catch (e) {
    console.warn("Error creating quiz on database, saving locally:", e);
    newQuiz.id = newQuiz.id || `custom-${Date.now()}`;
    state.quizzes.push(newQuiz);
    showToast("Quiz saved locally (Offline Mode)!", "success");
    renderDashboard();
  }
}

function unlockBadge(badgeId) {
  if (!state.user.badges.includes(badgeId)) {
    state.user.badges.push(badgeId);
    state.gameplay.unlockedBadgesThisRun.push(badgeId);
    return true; // Newly unlocked
  }
  return false;
}

// --- NAVIGATION SYSTEM ---
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-target");
      switchView(targetView);
    });
  });

  // Logo returns to dashboard
  document.getElementById("nav-logo").addEventListener("click", (e) => {
    e.preventDefault();
    switchView("dashboard-view");
  });

  // Widget actions
  document.getElementById("sidebar-view-leaderboard-btn").addEventListener("click", () => {
    switchView("leaderboard-view");
  });
  document.getElementById("sidebar-view-badges-btn").addEventListener("click", () => {
    switchView("badges-view");
  });
}

function switchView(viewId) {
  // Clear active timers if leaving arena
  if (state.currentView === "arena-view" && viewId !== "arena-view") {
    clearInterval(state.gameplay.timerInterval);
  }

  // Clear multiplayer polling if navigating away
  if (state.multiplayer && state.multiplayer.active) {
    if (viewId !== "host-lobby-view" && viewId !== "host-game-view" && viewId !== "student-lobby-view" && viewId !== "arena-view") {
      clearInterval(state.multiplayer.pollInterval);
      state.multiplayer.active = false;
      state.multiplayer.pin = null;
    }
  }

  // Update navbar styling
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-target") === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Switch visibility
  const views = document.querySelectorAll(".view");
  views.forEach(view => {
    if (view.id === viewId) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  state.currentView = viewId;

  // Render content depending on destination view
  if (viewId === "dashboard-view") {
    renderDashboard();
    renderMiniBadges();
    updateHeaderProfile();
  } else if (viewId === "leaderboard-view") {
    renderLeaderboard();
  } else if (viewId === "badges-view") {
    renderBadgesGallery();
  } else if (viewId === "analytics-view") {
    renderAnalyticsDashboard();
  } else if (viewId === "history-view") {
    renderAttemptHistory();
  }
  
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- RENDER DASHBOARD ---
function renderDashboard() {
  const quizzesContainer = document.getElementById("quizzes-list-container");
  quizzesContainer.innerHTML = "";

  state.quizzes.forEach(quiz => {
    const card = document.createElement("div");
    card.className = `quiz-card glass glow-hover category-${quiz.category.toLowerCase().replace(" ", "-")}`;
    
    // SVG and labels setup
    const qCount = quiz.questions.length;
    const minutes = Math.ceil((qCount * quiz.timeLimit) / 60);
    
    const isTeacher = state.user.role === "teacher";
    const hostButtonHtml = isTeacher 
      ? `<button class="btn btn-secondary host-quiz-btn" data-id="${quiz.id}" style="margin-top: 8px; width: 100%;">
           Host Live Quiz <i data-lucide="users" size="16"></i>
         </button>`
      : "";

    const isCreator = quiz.createdBy && state.user.username && quiz.createdBy.toLowerCase() === state.user.username.toLowerCase();
    const canDelete = isCreator || isTeacher;
    const deleteButtonHtml = canDelete 
      ? `<button class="btn btn-danger delete-quiz-btn" data-id="${quiz.id}" style="margin-top: 8px; width: 100%;">
           Delete Quiz <i data-lucide="trash-2" size="16"></i>
         </button>`
      : "";

    card.innerHTML = `
      <div class="quiz-meta-top">
        <span class="quiz-category">${quiz.category}</span>
        <span class="difficulty-badge difficulty-${quiz.difficulty}">
          <span class="difficulty-dot"></span>
          ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
        </span>
      </div>
      <h3 class="quiz-title">${quiz.title}</h3>
      <p class="quiz-description">${quiz.description}</p>
      
      <div class="quiz-info-row">
        <div class="quiz-info-item">
          <i data-lucide="help-circle" size="14"></i>
          <span>${qCount} Questions</span>
        </div>
        <div class="quiz-info-item">
          <i data-lucide="clock" size="14"></i>
          <span>~${minutes} Min</span>
        </div>
      </div>
      
      <button class="btn btn-primary start-quiz-btn" data-id="${quiz.id}">
        Start Challenge <i data-lucide="play" size="16"></i>
      </button>
      ${hostButtonHtml}
      ${deleteButtonHtml}
    `;
    quizzesContainer.appendChild(card);
  });

  // Attach start listeners
  document.querySelectorAll(".start-quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const quizId = btn.getAttribute("data-id");
      startQuiz(quizId);
    });
  });

  // Attach host listeners
  document.querySelectorAll(".host-quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const quizId = btn.getAttribute("data-id");
      hostQuiz(quizId);
    });
  });

  // Attach delete listeners
  document.querySelectorAll(".delete-quiz-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const quizId = btn.getAttribute("data-id");
      const quiz = state.quizzes.find(q => q.id === quizId);
      const title = quiz ? quiz.title : "this quiz";
      
      if (confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
        if (quizId.startsWith('custom-')) {
          state.quizzes = state.quizzes.filter(q => q.id !== quizId);
          showToast("Quiz deleted successfully!", "success");
          renderDashboard();
          return;
        }

        try {
          const res = await fetch(`/api/quizzes/${quizId}?username=${encodeURIComponent(state.user.username)}`, {
            method: 'DELETE'
          });
          
          if (res.ok) {
            showToast("Quiz deleted successfully!", "success");
            await loadQuizzes();
            renderDashboard();
          } else {
            const err = await res.json();
            showToast(`Error deleting quiz: ${err.error || 'Server error'}`, "error");
          }
        } catch (e) {
          console.warn("Failed to delete quiz on server, removing locally:", e);
          state.quizzes = state.quizzes.filter(q => q.id !== quizId);
          showToast("Quiz deleted locally!", "success");
          renderDashboard();
        }
      }
    });
  });
}

function setupDashboardControls() {
  const searchInput = document.getElementById("quiz-search");
  const filterChips = document.querySelectorAll(".filter-chip");

  let activeFilter = "all";
  let searchVal = "";

  function applyFilter() {
    const cards = document.querySelectorAll("#quizzes-list-container .quiz-card");
    
    state.quizzes.forEach((quiz, index) => {
      const card = cards[index];
      if (!card) return;

      const matchesSearch = quiz.title.toLowerCase().includes(searchVal) || 
                            quiz.description.toLowerCase().includes(searchVal) || 
                            quiz.category.toLowerCase().includes(searchVal);
      
      const matchesCategory = activeFilter === "all" || quiz.category.toLowerCase() === activeFilter.toLowerCase();

      if (matchesSearch && matchesCategory) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", (e) => {
    searchVal = e.target.value.toLowerCase().trim();
    applyFilter();
  });

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.getAttribute("data-category");
      applyFilter();
    });
  });
}

// --- RENDER MINI WIDGETS ---
// --- RENDER MINI WIDGETS ---
async function renderMiniLeaderboard() {
  const container = document.getElementById("mini-leaderboard-list");
  container.innerHTML = "";

  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const leaderboard = await res.json();
      leaderboard.slice(0, 5).forEach(item => {
        const isUser = item.name.toLowerCase() === state.user.username.toLowerCase();
        const row = document.createElement("div");
        row.className = "leaderboard-row";
        if (isUser) {
          row.style.background = "rgba(139, 92, 246, 0.1)";
          row.style.borderColor = "rgba(139, 92, 246, 0.2)";
        }

        row.innerHTML = `
          <span class="leaderboard-rank rank-${item.rank}">${item.rank}</span>
          <div class="leaderboard-avatar">${item.avatar}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-name">${isUser ? "You (Player)" : item.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${item.quizzes} Quizzes • ${item.accuracy} Acc</div>
          </div>
          <span class="leaderboard-score">${item.xp.toLocaleString()} XP</span>
        `;
        container.appendChild(row);
      });
    }
  } catch (e) {
    console.error("Failed to render mini leaderboard", e);
  }
}

function renderMiniBadges() {
  const container = document.getElementById("mini-badges-grid");
  container.innerHTML = "";

  BADGES.forEach(badge => {
    const isUnlocked = state.user.badges.includes(badge.id);
    const mini = document.createElement("div");
    mini.className = `badge-mini ${isUnlocked ? '' : 'locked'}`;
    mini.innerHTML = `<i data-lucide="${badge.icon}" style="width: 18px; height: 18px;"></i>`;
    mini.setAttribute("data-tooltip", `${badge.title}: ${badge.description} (${isUnlocked ? 'Unlocked' : 'Locked'})`);
    container.appendChild(mini);
  });
  lucide.createIcons();
}

// --- RENDER FULL LEADERBOARD VIEW ---
async function renderLeaderboard() {
  const tableBody = document.getElementById("leaderboard-table-body");
  tableBody.innerHTML = "";

  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const leaderboard = await res.json();
      
      // Find current user's rank
      const userRankItem = leaderboard.find(item => item.name.toLowerCase() === state.user.username.toLowerCase());
      const userRank = userRankItem ? userRankItem.rank : "-";
      document.getElementById("lb-user-rank").textContent = `#${userRank}`;

      leaderboard.forEach(item => {
        const isUser = item.name.toLowerCase() === state.user.username.toLowerCase();
        const tr = document.createElement("tr");
        if (isUser) {
          tr.style.background = "rgba(139, 92, 246, 0.1)";
          tr.style.fontWeight = "bold";
        }

        const calculatedLvl = calculateLevel(item.xp);

        tr.innerHTML = `
          <td style="font-weight: 800; font-family: var(--font-heading);" class="rank-${item.rank}">#${item.rank}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="leaderboard-avatar" style="margin: 0;">${item.avatar}</div>
              <span>${isUser ? "You (Player)" : item.name}</span>
            </div>
          </td>
          <td>Level ${calculatedLvl}</td>
          <td style="color: var(--success-color);">${item.accuracy}</td>
          <td>${item.quizzes}</td>
          <td style="text-align: right; font-weight: 700; color: var(--accent-blue);">${item.xp.toLocaleString()} XP</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  } catch (e) {
    console.error("Failed to render leaderboard", e);
  }
}

// --- RENDER BADGES ROOM ---
function renderBadgesGallery() {
  const container = document.getElementById("badges-gallery-container");
  container.innerHTML = "";

  BADGES.forEach(badge => {
    const isUnlocked = state.user.badges.includes(badge.id);
    const card = document.createElement("div");
    card.className = `badge-card glass ${isUnlocked ? '' : 'locked'}`;

    card.innerHTML = `
      <div class="badge-card-icon"><i data-lucide="${badge.icon}" style="width: 32px; height: 32px;"></i></div>
      <div class="badge-card-title">${badge.title}</div>
      <div class="badge-card-desc">${badge.description}</div>
      <span class="badge-status-tag">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// --- QUIZ GAMEPLAY CORE (ARENA) ---
function startQuiz(quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  // Enforce attempt limits
  if (quiz.maxAttempts && quiz.maxAttempts > 0) {
    const pastAttempts = state.attemptHistory.filter(a => a.quizId === quizId);
    if (pastAttempts.length >= quiz.maxAttempts) {
      showToast(`You've reached the maximum of ${quiz.maxAttempts} attempt(s) for this quiz.`, "warning");
      return;
    }
  }

  // Deep clone questions so we can shuffle without mutating originals
  let questions = JSON.parse(JSON.stringify(quiz.questions));

  // Shuffle questions if configured
  if (quiz.shuffleQuestions !== false) {
    questions = shuffleArray(questions);
  }

  // Shuffle answer options if configured
  if (quiz.shuffleAnswers !== false) {
    questions.forEach(q => {
      if (q.options && q.options.length > 0) {
        const correctText = q.options[q.answer];
        q.options = shuffleArray(q.options);
        q.answer = q.options.indexOf(correctText);
      }
    });
  }

  // Initialize gameplay state
  state.gameplay.activeQuiz = quiz;
  state.gameplay.shuffledQuestions = questions;
  state.gameplay.currentQuestionIndex = 0;
  state.gameplay.score = 0;
  state.gameplay.correctCount = 0;
  state.gameplay.streak = 0;
  state.gameplay.maxStreak = 0;
  state.gameplay.answersLog = [];
  state.gameplay.startTime = Date.now();
  state.gameplay.unlockedBadgesThisRun = [];
  state.gameplay.selectedAnswers = {};
  state.gameplay.tabSwitchCount = 0;

  // Update header text
  document.getElementById("arena-quiz-title").textContent = quiz.title;
  document.getElementById("arena-total-q-num").textContent = questions.length;
  
  // Transition View
  switchView("arena-view");
  
  // Load question
  loadQuestion();
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function loadQuestion() {
  const quiz = state.gameplay.activeQuiz;
  const qIdx = state.gameplay.currentQuestionIndex;
  const questions = state.gameplay.shuffledQuestions;
  const questionObj = questions[qIdx];

  // Update indicators
  document.getElementById("arena-current-q-num").textContent = qIdx + 1;
  document.getElementById("arena-score-val").textContent = `${state.gameplay.score} XP`;
  
  // Progress Bar
  const progressPercent = (qIdx / questions.length) * 100;
  document.getElementById("arena-progress-bar").style.width = `${progressPercent}%`;

  // Question details
  document.getElementById("arena-question-tag").textContent = quiz.category;
  document.getElementById("arena-question-text").textContent = questionObj.question;

  // Build options based on question type
  const optionsContainer = document.getElementById("arena-options-list");
  optionsContainer.innerHTML = "";

  const qType = questionObj.type || "mcq";

  if (qType === "truefalse") {
    // True/False buttons
    const row = document.createElement("div");
    row.className = "tf-options-row";
    
    ["True", "False"].forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.className = "tf-btn";
      btn.innerHTML = `<i data-lucide="${idx === 0 ? 'check-circle' : 'x-circle'}" size="24"></i> ${label}`;
      btn.addEventListener("click", () => selectOption(idx));
      row.appendChild(btn);
    });
    optionsContainer.appendChild(row);

  } else if (qType === "short_answer") {
    // Short answer input
    const wrapper = document.createElement("div");
    wrapper.className = "short-answer-wrapper";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "short-answer-input";
    input.id = "arena-short-answer-input";
    input.placeholder = "Type your answer here...";
    input.autocomplete = "off";
    input.addEventListener("input", () => {
      selectedOptionIdx = input.value.trim();
      document.getElementById("arena-action-btn").disabled = !input.value.trim();
    });
    wrapper.appendChild(input);
    optionsContainer.appendChild(wrapper);

  } else {
    // MCQ (default)
    questionObj.options.forEach((optionText, idx) => {
      const letter = String.fromCharCode(65 + idx);
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-letter">${letter}</span>
        <span class="option-text">${optionText}</span>
      `;
      btn.addEventListener("click", () => selectOption(idx));
      optionsContainer.appendChild(btn);
    });
  }

  // Hide explanation
  document.getElementById("arena-explanation-panel").style.display = "none";

  // Action Button reset
  const actionBtn = document.getElementById("arena-action-btn");
  actionBtn.innerHTML = `Submit Answer <i data-lucide="check"></i>`;
  actionBtn.disabled = true;
  selectedOptionIdx = -1;
  lucide.createIcons();

  // Reset & Start Timer
  state.gameplay.timeLeft = quiz.timeLimit;
  state.gameplay.questionStartTime = Date.now();
  startTimer();
}

// --- GAMEPLAY TIMER ---
function startTimer() {
  clearInterval(state.gameplay.timerInterval);
  updateTimerUI();

  state.gameplay.timerInterval = setInterval(() => {
    state.gameplay.timeLeft--;
    updateTimerUI();

    if (state.gameplay.timeLeft <= 0) {
      clearInterval(state.gameplay.timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

function updateTimerUI() {
  const timerText = document.getElementById("arena-timer-text");
  const timerFill = document.getElementById("arena-timer-fill");
  const limit = state.gameplay.activeQuiz.timeLimit;
  const curr = state.gameplay.timeLeft;

  timerText.textContent = curr;

  // Circumference = 176
  const offset = 176 - (curr / limit) * 176;
  timerFill.style.strokeDashoffset = offset;

  // Danger colors
  timerFill.classList.remove("warning", "danger");
  if (curr <= 5) {
    timerFill.classList.add("danger");
  } else if (curr <= 10) {
    timerFill.classList.add("warning");
  }
}

// --- OPTION SELECT & SUBMIT ---
let selectedOptionIdx = -1;

function selectOption(optionIdx) {
  const questions = state.gameplay.shuffledQuestions;
  const qIdx = state.gameplay.currentQuestionIndex;
  const questionObj = questions[qIdx];
  const qType = questionObj.type || "mcq";

  // Check if options are disabled
  if (qType === "mcq") {
    const buttons = document.querySelectorAll(".option-btn");
    if (buttons.length > 0 && buttons[0].disabled) return;
    buttons.forEach((btn, idx) => {
      btn.classList.toggle("selected", idx === optionIdx);
    });
  } else if (qType === "truefalse") {
    const buttons = document.querySelectorAll(".tf-btn");
    if (buttons.length > 0 && buttons[0].disabled) return;
    buttons.forEach((btn, idx) => {
      btn.classList.toggle("selected", idx === optionIdx);
    });
  }

  selectedOptionIdx = optionIdx;
  state.gameplay.selectedAnswers[qIdx] = optionIdx;

  document.getElementById("arena-action-btn").disabled = false;
}

function handleTimeOut() {
  validateAnswer(-1);
}

function setupQuizArenaHandlers() {
  const actionBtn = document.getElementById("arena-action-btn");
  const quitBtn = document.getElementById("arena-quit-btn");

  actionBtn.addEventListener("click", () => {
    if (actionBtn.textContent.includes("Submit")) {
      clearInterval(state.gameplay.timerInterval);
      validateAnswer(selectedOptionIdx);
    } else {
      state.gameplay.currentQuestionIndex++;
      const questions = state.gameplay.shuffledQuestions;
      
      if (state.gameplay.currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        finishQuiz();
      }
    }
  });

  quitBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to quit? Your progress for this attempt will not be saved.")) {
      clearInterval(state.gameplay.timerInterval);
      switchView("dashboard-view");
    }
  });
}

function validateAnswer(selectedIdx) {
  const quiz = state.gameplay.activeQuiz;
  const qIdx = state.gameplay.currentQuestionIndex;
  const questions = state.gameplay.shuffledQuestions;
  const questionObj = questions[qIdx];
  const qType = questionObj.type || "mcq";
  const correctIdx = questionObj.answer;
  
  let isCorrect = false;

  if (qType === "short_answer") {
    // Compare strings case-insensitively
    const userAnswer = typeof selectedIdx === "string" ? selectedIdx.trim().toLowerCase() : "";
    const correctAnswer = (questionObj.correctText || "").trim().toLowerCase();
    isCorrect = userAnswer === correctAnswer;
    
    const input = document.getElementById("arena-short-answer-input");
    if (input) {
      input.disabled = true;
      input.classList.add(isCorrect ? "correct" : "incorrect");
      if (!isCorrect) {
        const label = document.createElement("div");
        label.className = "short-answer-correct-label";
        label.textContent = `Correct answer: ${questionObj.correctText}`;
        input.parentElement.appendChild(label);
      }
    }
  } else {
    // MCQ or True/False
    isCorrect = selectedIdx === correctIdx;
    
    const btnClass = qType === "truefalse" ? ".tf-btn" : ".option-btn";
    const buttons = document.querySelectorAll(btnClass);
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      if (selectedIdx >= 0) buttons[selectedIdx].classList.add("correct");
    } else {
      if (selectedIdx >= 0) buttons[selectedIdx].classList.add("incorrect");
      buttons[correctIdx].classList.add("correct");
    }
  }

  // Record Answer Log
  state.gameplay.answersLog.push({
    question: questionObj.question,
    selected: selectedIdx,
    correct: correctIdx,
    isCorrect: isCorrect,
    explanation: questionObj.explanation,
    options: questionObj.options
  });

  if (isCorrect) {
    state.gameplay.correctCount++;
    state.gameplay.streak++;
    
    if (state.gameplay.streak > state.gameplay.maxStreak) {
      state.gameplay.maxStreak = state.gameplay.streak;
    }

    // Award XP (Base 100 XP + time bonus up to 50 XP + streak bonus)
    const timeUsed = (Date.now() - state.gameplay.questionStartTime) / 1000;
    const timeLimit = quiz.timeLimit;
    const timeRatio = Math.max(0, 1 - (timeUsed / timeLimit));
    
    if (timeRatio > 0.8) {
      unlockBadge("speed_demon");
    }

    const timeBonus = Math.round(timeRatio * 50);
    const streakBonus = state.gameplay.streak > 1 ? (state.gameplay.streak - 1) * 10 : 0;
    const earnedXp = 100 + timeBonus + streakBonus;

    state.gameplay.score += earnedXp;

    // Streak UI animation
    const streakBox = document.getElementById("arena-streak");
    document.getElementById("arena-streak-val").textContent = state.gameplay.streak;
    if (state.gameplay.streak >= 2) {
      streakBox.classList.add("active");
    }
  } else {
    state.gameplay.streak = 0;
    document.getElementById("arena-streak").classList.remove("active");
  }

  // Populate & Reveal Explanation
  const explanationPanel = document.getElementById("arena-explanation-panel");
  const explanationText = document.getElementById("arena-explanation-text");
  explanationText.textContent = questionObj.explanation || "No explanation details provided.";
  explanationPanel.style.display = "block";

  // Check milestone streaks
  if (state.gameplay.streak >= 5) unlockBadge("streak_5");
  if (state.gameplay.streak >= 10) unlockBadge("streak_10");

  // Modify action button
  const actionBtn = document.getElementById("arena-action-btn");
  
  if (state.multiplayer && state.multiplayer.active) {
    actionBtn.innerHTML = `Waiting for Host <i data-lucide="loader"></i>`;
    actionBtn.disabled = true;
    lucide.createIcons();
    
    // Submit answer to backend
    const scoreGained = isCorrect ? (100 + (Math.round(Math.max(0, 1 - ((Date.now() - state.gameplay.questionStartTime) / 1000 / quiz.timeLimit)) * 50))) : 0;
    fetch(`/api/rooms/submit-answer/${state.multiplayer.pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: state.user.username,
        scoreGained: scoreGained
      })
    }).catch(err => console.error("Error submitting multiplayer score:", err));
  } else {
    const isLastQuestion = qIdx === questions.length - 1;
    if (isLastQuestion) {
      actionBtn.innerHTML = `Finish Quiz <i data-lucide="award"></i>`;
    } else {
      actionBtn.innerHTML = `Next Question <i data-lucide="arrow-right"></i>`;
    }
    actionBtn.disabled = false;
    lucide.createIcons();
  }
}

// --- FINISH QUIZ (RESULTS CALCULATIONS) ---
async function finishQuiz() {
  const gameplay = state.gameplay;
  const quiz = gameplay.activeQuiz;
  const questions = gameplay.shuffledQuestions;
  const elapsedSeconds = Math.round((Date.now() - gameplay.startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const accuracyPct = Math.round((gameplay.correctCount / questions.length) * 100);
  const passingScore = quiz.passingScore || 50;
  const passed = accuracyPct >= passingScore;

  try {
    // 1. Update XP on database
    await fetch(`/api/users/${state.user.username}/update-xp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: gameplay.score })
    });

    // 2. Save attempt to database (which also checks and unlocks badges on the database)
    await fetch('/api/attempts/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: state.user.username,
        quizId: quiz.id,
        score: gameplay.score,
        correctCount: gameplay.correctCount,
        totalQuestions: questions.length,
        accuracyPct: accuracyPct,
        passed: passed,
        maxStreak: gameplay.maxStreak,
        timeTaken: formattedTime,
        answersLog: gameplay.answersLog
      })
    });

    // 3. Reload profile & attempts history from database
    await loadUserProfile();
    await loadAttemptHistory();
  } catch (e) {
    console.error("Failed to sync attempt to backend database", e);
    // Local fallback
    state.user.xp += gameplay.score;
    state.user.quizzesCompleted += 1;
    state.user.totalAnswers += questions.length;
    state.user.correctAnswers += gameplay.correctCount;
    
    // Badge updates based on performance
    unlockBadge("first_quiz");
    if (accuracyPct === 100) unlockBadge("perfect_score");
    if (accuracyPct >= 80) {
      if (quiz.category === "Tech") unlockBadge("tech_master");
      else if (quiz.category === "Science") unlockBadge("space_explorer");
    }

    const attemptRecord = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score: gameplay.score,
      correctCount: gameplay.correctCount,
      totalQuestions: questions.length,
      accuracyPct: accuracyPct,
      passed: passed,
      passingScore: passingScore,
      maxStreak: gameplay.maxStreak,
      timeTaken: formattedTime,
      timestamp: new Date().toISOString(),
      answersLog: gameplay.answersLog
    };
    state.attemptHistory.unshift(attemptRecord);
    saveAttemptHistory();
    saveUserProfile();
  }

  // Toast notification
  if (passed) {
    showToast(`Quiz completed! You passed with ${accuracyPct}% accuracy.`, "success");
  } else {
    showToast(`Quiz completed. You scored ${accuracyPct}% (need ${passingScore}% to pass).`, "warning");
  }

  // Populate Results Screen
  document.getElementById("res-stat-xp").textContent = `+${gameplay.score} XP`;
  document.getElementById("res-stat-correct").textContent = `${gameplay.correctCount}/${questions.length}`;
  document.getElementById("res-stat-time").textContent = formattedTime;
  document.getElementById("res-stat-streak").textContent = gameplay.maxStreak;
  
  document.getElementById("results-score-pct").textContent = `${accuracyPct}%`;
  document.getElementById("results-subheading").textContent = `You finished the '${quiz.title}' quiz`;

  // Custom messages based on accuracy
  const resIcon = document.getElementById("results-icon");
  const resHeading = document.getElementById("results-heading");
  if (accuracyPct === 100) {
    resIcon.innerHTML = `<i data-lucide="crown" style="width: 72px; height: 72px; color: var(--warning-color);"></i>`;
    resHeading.textContent = "Flawless Victory!";
  } else if (accuracyPct >= 80) {
    resIcon.innerHTML = `<i data-lucide="trophy" style="width: 72px; height: 72px; color: var(--warning-color);"></i>`;
    resHeading.textContent = "Outstanding Performance!";
  } else if (accuracyPct >= 50) {
    resIcon.innerHTML = `<i data-lucide="graduation-cap" style="width: 72px; height: 72px; color: var(--accent-blue);"></i>`;
    resHeading.textContent = "Great Effort!";
  } else {
    resIcon.innerHTML = `<i data-lucide="award" style="width: 72px; height: 72px; color: var(--text-muted);"></i>`;
    resHeading.textContent = "Keep Learning!";
  }

  // Show badges earned this run
  const badgesContainer = document.getElementById("results-badges-container");
  const badgesList = document.getElementById("results-badges-list");
  
  if (gameplay.unlockedBadgesThisRun.length > 0) {
    badgesList.innerHTML = "";
    gameplay.unlockedBadgesThisRun.forEach(badgeId => {
      const badgeObj = BADGES.find(b => b.id === badgeId);
      if (badgeObj) {
        const chip = document.createElement("div");
        chip.className = "badge-unlocked-chip";
        chip.innerHTML = `<span><i data-lucide="${badgeObj.icon}" style="width: 16px; height: 16px; vertical-align: middle;"></i></span> <strong>${badgeObj.title}</strong>`;
        badgesList.appendChild(chip);
      }
    });
    badgesContainer.style.display = "block";
  } else {
    badgesContainer.style.display = "none";
  }

  // Render Detailed Question Review
  renderQuestionReviewList();

  // Load mini widgets on side panel
  renderMiniLeaderboard();
  renderMiniBadges();

  // Transition to results screen
  switchView("results-view");
}

function renderQuestionReviewList() {
  const container = document.getElementById("results-review-list");
  container.innerHTML = "";

  state.gameplay.answersLog.forEach((log, idx) => {
    const item = document.createElement("div");
    item.className = "review-item glass";
    item.style.borderLeft = log.isCorrect ? "4px solid var(--success-color)" : "4px solid var(--error-color)";

    const reviewOptionsHTML = log.options.map((optText, optIdx) => {
      let optClass = "";
      let optIcon = "";

      if (optIdx === log.correct) {
        optClass = "correct";
        optIcon = `<i data-lucide="check" class="review-icon" style="color: var(--success-color);"></i>`;
      } else if (optIdx === log.selected && !log.isCorrect) {
        optClass = "incorrect";
        optIcon = `<i data-lucide="x" class="review-icon" style="color: var(--error-color);"></i>`;
      } else {
        optIcon = `<div style="width: 16px; margin-right: 10px;"></div>`;
      }

      return `
        <div class="review-option ${optClass}">
          ${optIcon}
          <span>${optText}</span>
        </div>
      `;
    }).join("");

    item.innerHTML = `
      <div class="review-header">
        <div class="review-q-text">Q${idx + 1}: ${log.question}</div>
        <span class="review-badge ${log.isCorrect ? 'correct' : 'incorrect'}">${log.isCorrect ? 'Correct' : 'Incorrect'}</span>
      </div>
      <div class="review-options-list">
        ${reviewOptionsHTML}
      </div>
      <div class="review-explanation">
        <strong>Explanation:</strong> ${log.explanation || 'No explanation provided.'}
      </div>
    `;
    container.appendChild(item);
  });
  lucide.createIcons();
}

function setupResultsHandlers() {
  document.getElementById("res-action-dashboard").addEventListener("click", () => {
    switchView("dashboard-view");
  });

  document.getElementById("res-action-retry").addEventListener("click", () => {
    if (state.gameplay.activeQuiz) {
      startQuiz(state.gameplay.activeQuiz.id);
    }
  });
}

// --- QUIZ CREATOR LOGIC ---
let creatorQuestions = [];

function setupQuizCreatorHandlers() {
  const form = document.getElementById("quiz-creator-form");
  const addQuestionBtn = document.getElementById("c-add-question-btn");
  const cancelBtn = document.getElementById("c-cancel-btn");

  // Form Reset and init 1 default question
  function resetCreator() {
    form.reset();
    creatorQuestions = [];
    document.getElementById("creator-questions-list").innerHTML = "";
    addQuestionBlock();
  }

  addQuestionBtn.addEventListener("click", () => {
    addQuestionBlock();
  });

  cancelBtn.addEventListener("click", () => {
    if (confirm("Reset the form? You will lose all filled questions.")) {
      resetCreator();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Gather Meta
    const title = document.getElementById("c-title").value.trim();
    const description = document.getElementById("c-description").value.trim();
    const category = document.getElementById("c-category").value;
    const difficulty = document.getElementById("c-difficulty").value;
    const timeLimit = parseInt(document.getElementById("c-time-limit").value) || 30;

    // Gather Questions
    const questionBlocks = document.querySelectorAll(".question-builder-item");
    const parsedQuestions = [];

    let validationFailed = false;

    questionBlocks.forEach((block, qIdx) => {
      const qText = block.querySelector(".q-text-input").value.trim();
      const explanation = block.querySelector(".q-explanation-input").value.trim();
      
      const optInputs = block.querySelectorAll(".opt-text-input");
      const optRadios = block.querySelectorAll(".opt-radio-input");
      
      const options = [];
      let correctIdx = -1;

      optInputs.forEach((optInput, optIdx) => {
        const optionVal = optInput.value.trim();
        options.push(optionVal);
        
        if (optRadios[optIdx].checked) {
          correctIdx = optIdx;
        }
      });

      if (!qText) {
        alert(`Please enter a question text for Question #${qIdx + 1}`);
        validationFailed = true;
        return;
      }

      if (options.some(opt => !opt)) {
        alert(`Please fill all option fields for Question #${qIdx + 1}`);
        validationFailed = true;
        return;
      }

      if (correctIdx === -1) {
        alert(`Please select the correct answer for Question #${qIdx + 1}`);
        validationFailed = true;
        return;
      }

      parsedQuestions.push({
        question: qText,
        options: options,
        answer: correctIdx,
        explanation: explanation
      });
    });

    if (validationFailed) return;

    if (parsedQuestions.length === 0) {
      alert("Please add at least one question to your quiz.");
      return;
    }

    // Save custom quiz
    const uniqueId = `quiz-custom-${Date.now()}`;
    const passingScore = parseInt(document.getElementById("c-passing-score").value) || 50;
    const maxAttempts = parseInt(document.getElementById("c-max-attempts").value) || 0;
    const shuffleQuestions = document.getElementById("c-shuffle-questions").checked;
    const shuffleAnswers = document.getElementById("c-shuffle-answers").checked;

    const newQuiz = {
      id: uniqueId,
      title: title,
      description: description,
      category: category,
      difficulty: difficulty,
      timeLimit: timeLimit,
      passingScore: passingScore,
      maxAttempts: maxAttempts,
      shuffleQuestions: shuffleQuestions,
      shuffleAnswers: shuffleAnswers,
      questions: parsedQuestions
    };

    saveCustomQuiz(newQuiz);
    showToast(`'${title}' has been published to your Dashboard!`, "success");
    
    // Reset and return
    resetCreator();
    switchView("dashboard-view");
  });

  // Init one block
  resetCreator();
}

function addQuestionBlock() {
  const container = document.getElementById("creator-questions-list");
  const qNum = container.children.length + 1;

  const block = document.createElement("div");
  block.className = "question-builder-item glass";
  block.id = `q-block-${qNum}`;

  block.innerHTML = `
    <div class="question-builder-header">
      <span class="question-number-lbl">Question #${qNum}</span>
      ${qNum > 1 ? `<button type="button" class="remove-question-btn" onclick="removeQuestionBlock(${qNum})"><i data-lucide="trash-2" size="14"></i> Remove Question</button>` : ''}
    </div>

    <div class="creator-form-group">
      <label class="creator-label">Question Text</label>
      <input class="creator-input q-text-input" type="text" placeholder="e.g. Which language runs in a web browser?" required>
    </div>

    <label class="creator-label">Options & Correct Answer</label>
    <p class="options-help-text">Type in the possible options and select the circular radio button next to the correct answer.</p>

    <div class="options-builder-grid">
      <div class="option-input-wrapper">
        <input type="radio" name="correct-radio-q${qNum}" class="option-radio opt-radio-input" required checked>
        <input class="option-builder-text opt-text-input" type="text" placeholder="Option A" required>
      </div>
      <div class="option-input-wrapper">
        <input type="radio" name="correct-radio-q${qNum}" class="option-radio opt-radio-input" required>
        <input class="option-builder-text opt-text-input" type="text" placeholder="Option B" required>
      </div>
      <div class="option-input-wrapper">
        <input type="radio" name="correct-radio-q${qNum}" class="option-radio opt-radio-input" required>
        <input class="option-builder-text opt-text-input" type="text" placeholder="Option C" required>
      </div>
      <div class="option-input-wrapper">
        <input type="radio" name="correct-radio-q${qNum}" class="option-radio opt-radio-input" required>
        <input class="option-builder-text opt-text-input" type="text" placeholder="Option D" required>
      </div>
    </div>

    <div class="creator-form-group">
      <label class="creator-label">Answer Explanation (Optional)</label>
      <input class="creator-input q-explanation-input" type="text" placeholder="Explain why the selected option is correct...">
    </div>
  `;

  container.appendChild(block);
  document.getElementById("c-question-count-lbl").textContent = container.children.length;
  
  // Highlight correct answer input border wrapper
  const radios = block.querySelectorAll(".opt-radio-input");
  const wrappers = block.querySelectorAll(".option-input-wrapper");
  
  radios.forEach((radio, idx) => {
    // Initialize checked states
    if (radio.checked) {
      wrappers[idx].classList.add("correct-answer-selected");
    }

    radio.addEventListener("change", () => {
      wrappers.forEach(w => w.classList.remove("correct-answer-selected"));
      wrappers[idx].classList.add("correct-answer-selected");
    });
  });

  lucide.createIcons();
}

function removeQuestionBlock(qNum) {
  const block = document.getElementById(`q-block-${qNum}`);
  if (block) {
    block.remove();
    
    // Reindex remaining questions
    const container = document.getElementById("creator-questions-list");
    const questionBlocks = container.querySelectorAll(".question-builder-item");
    
    questionBlocks.forEach((qBlock, idx) => {
      const currentNum = idx + 1;
      qBlock.id = `q-block-${currentNum}`;
      
      // Update heading text
      const header = qBlock.querySelector(".question-number-lbl");
      header.textContent = `Question #${currentNum}`;

      // Update names on radios to avoid cross-question radio selections
      const radios = qBlock.querySelectorAll(".opt-radio-input");
      radios.forEach(radio => {
        radio.setAttribute("name", `correct-radio-q${currentNum}`);
      });

      // Update delete button if any
      const deleteBtnContainer = qBlock.querySelector(".question-builder-header");
      const existingBtn = deleteBtnContainer.querySelector(".remove-question-btn");
      if (existingBtn) {
        existingBtn.remove();
      }

      if (currentNum > 1) {
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "remove-question-btn";
        deleteBtn.setAttribute("onclick", `removeQuestionBlock(${currentNum})`);
        deleteBtn.innerHTML = `<i data-lucide="trash-2" size="14"></i> Remove Question`;
        deleteBtnContainer.appendChild(deleteBtn);
      }
    });

    document.getElementById("c-question-count-lbl").textContent = questionBlocks.length;
    lucide.createIcons();
  }
}

// =========================================
// NEW FEATURES
// =========================================

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const icons = { success: "check-circle", error: "x-circle", warning: "alert-triangle", info: "info" };
  toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" class="toast-icon"></i> <span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- ATTEMPT HISTORY PERSISTENCE ---
function loadAttemptHistory() {
  const raw = localStorage.getItem("quizmania_attempt_history");
  if (raw) {
    try { state.attemptHistory = JSON.parse(raw); } catch (e) { state.attemptHistory = []; }
  }
}

function saveAttemptHistory() {
  localStorage.setItem("quizmania_attempt_history", JSON.stringify(state.attemptHistory));
}

function renderAttemptHistory() {
  const tbody = document.getElementById("history-table-body");
  const empty = document.getElementById("history-empty-state");
  tbody.innerHTML = "";

  if (state.attemptHistory.length === 0) {
    empty.style.display = "block";
    tbody.parentElement.style.display = "none";
    return;
  }

  empty.style.display = "none";
  tbody.parentElement.style.display = "table";

  state.attemptHistory.forEach(a => {
    const tr = document.createElement("tr");
    const date = new Date(a.timestamp);
    const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    tr.innerHTML = `
      <td style="font-weight: 600;">${a.quizTitle}</td>
      <td><span class="quiz-category">${a.category}</span></td>
      <td style="font-weight: 700; color: var(--accent-blue);">+${a.score} XP</td>
      <td>${a.accuracyPct}% (${a.correctCount}/${a.totalQuestions})</td>
      <td><span class="review-badge ${a.passed ? 'correct' : 'incorrect'}">${a.passed ? 'PASSED' : 'FAILED'}</span></td>
      <td style="color: var(--text-muted);">${dateStr}</td>
    `;
    tbody.appendChild(tr);
  });
}

function setupHistoryHandlers() {
  document.getElementById("clear-history-btn").addEventListener("click", () => {
    if (confirm("Clear all attempt history? This cannot be undone.")) {
      state.attemptHistory = [];
      saveAttemptHistory();
      renderAttemptHistory();
      showToast("Attempt history cleared.", "info");
    }
  });
}

let analyticsRequestSeq = 0;

// --- ADMIN ANALYTICS DASHBOARD ---
async function renderAnalyticsDashboard() {
  const currentSeq = ++analyticsRequestSeq;
  const grid = document.getElementById("admin-stats-grid");
  const hardestList = document.getElementById("hardest-questions-list");
  
  grid.innerHTML = '<div style="color: var(--text-muted); padding: 20px; grid-column: span 4; text-align: center;">Loading analytics...</div>';
  hardestList.innerHTML = "";

  try {
    const res = await fetch('/api/analytics');
    if (currentSeq !== analyticsRequestSeq) return;

    if (res.ok) {
      const data = await res.json();
      if (currentSeq !== analyticsRequestSeq) return;
      
      const totalAttempts = data.stats.total_attempts || 0;
      const avgScore = data.stats.avg_accuracy || 0;
      const completionRate = data.stats.pass_rate || 0;
      
      // Calculate total XP earned by all users
      const xpRes = await fetch('/api/leaderboard');
      if (currentSeq !== analyticsRequestSeq) return;

      let totalXpEarned = 0;
      if (xpRes.ok) {
        const users = await xpRes.json();
        if (currentSeq !== analyticsRequestSeq) return;
        totalXpEarned = users.reduce((sum, u) => sum + u.xp, 0);
      }

      grid.innerHTML = "";
      const stats = [
        { icon: "bar-chart-3", val: totalAttempts, lbl: "Global Attempts", color: "var(--accent-blue)" },
        { icon: "target", val: `${avgScore}%`, lbl: "Global Accuracy", color: "var(--error-color)" },
        { icon: "check-circle", val: `${completionRate}%`, lbl: "Global Pass Rate", color: "var(--success-color)" },
        { icon: "zap", val: totalXpEarned.toLocaleString(), lbl: "Total XP Earned", color: "var(--warning-color)" }
      ];

      stats.forEach(s => {
        const card = document.createElement("div");
        card.className = "admin-stat-card glass";
        card.innerHTML = `
          <div class="admin-stat-icon"><i data-lucide="${s.icon}" style="color: ${s.color}; width: 28px; height: 28px;"></i></div>
          <div class="admin-stat-val">${s.val}</div>
          <div class="admin-stat-lbl">${s.lbl}</div>
        `;
        grid.appendChild(card);
      });

      if (data.hardestQuestions.length === 0) {
        hardestList.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No global statistics recorded yet.</p>';
        lucide.createIcons();
        return;
      }

      data.hardestQuestions.forEach(item => {
        const rateClass = item.success_rate < 40 ? "bad" : item.success_rate < 70 ? "ok" : "good";
        const row = document.createElement("div");
        row.className = "hardest-question-row";
        row.innerHTML = `
          <span class="hardest-q-text">${item.question.length > 80 ? item.question.slice(0, 80) + '…' : item.question}</span>
          <span class="hardest-q-rate ${rateClass}">${item.success_rate}% success (${item.total_answers} attempts)</span>
        `;
        hardestList.appendChild(row);
      });
      lucide.createIcons();
      return;
    }
  } catch (err) {
    console.error("Error fetching database analytics", err);
  }

  if (currentSeq !== analyticsRequestSeq) return;

  // Fallback to local user history calculations if database analytics API fails
  const history = state.attemptHistory;
  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s, a) => s + a.accuracyPct, 0) / totalAttempts) : 0;
  const completionRate = totalAttempts > 0 ? Math.round((history.filter(a => a.passed).length / totalAttempts) * 100) : 0;
  const totalXpEarned = history.reduce((s, a) => s + a.score, 0);

  grid.innerHTML = "";
  const stats = [
    { icon: "bar-chart-3", val: totalAttempts, lbl: "Total Attempts", color: "var(--accent-blue)" },
    { icon: "target", val: `${avgScore}%`, lbl: "Avg Accuracy", color: "var(--error-color)" },
    { icon: "check-circle", val: `${completionRate}%`, lbl: "Pass Rate", color: "var(--success-color)" },
    { icon: "zap", val: totalXpEarned.toLocaleString(), lbl: "Total XP Earned", color: "var(--warning-color)" }
  ];

  stats.forEach(s => {
    const card = document.createElement("div");
    card.className = "admin-stat-card glass";
    card.innerHTML = `
      <div class="admin-stat-icon"><i data-lucide="${s.icon}" style="color: ${s.color}; width: 28px; height: 28px;"></i></div>
      <div class="admin-stat-val">${s.val}</div>
      <div class="admin-stat-lbl">${s.lbl}</div>
    `;
    grid.appendChild(card);
  });

  const questionStats = {};
  history.forEach(attempt => {
    if (!attempt.answersLog) return;
    attempt.answersLog.forEach(log => {
      if (!questionStats[log.question]) {
        questionStats[log.question] = { correct: 0, total: 0 };
      }
      questionStats[log.question].total++;
      if (log.isCorrect) questionStats[log.question].correct++;
    });
  });

  const sorted = Object.entries(questionStats)
    .map(([q, s]) => ({ question: q, rate: Math.round((s.correct / s.total) * 100), total: s.total }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 8);

  if (sorted.length === 0) {
    hardestList.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">Complete some quizzes to see analytics here.</p>';
    lucide.createIcons();
    return;
  }

  sorted.forEach(item => {
    const rateClass = item.rate < 40 ? "bad" : item.rate < 70 ? "ok" : "good";
    const row = document.createElement("div");
    row.className = "hardest-question-row";
    row.innerHTML = `
      <span class="hardest-q-text">${item.question.length > 80 ? item.question.slice(0, 80) + '…' : item.question}</span>
      <span class="hardest-q-rate ${rateClass}">${item.rate}% success (${item.total} attempts)</span>
    `;
    hardestList.appendChild(row);
  });
  lucide.createIcons();
}

// --- ANTI-CHEAT: TAB SWITCH DETECTION ---
function setupAntiCheat() {
  const overlay = document.getElementById("anticheat-overlay");
  const counter = document.getElementById("anticheat-counter");
  const resumeBtn = document.getElementById("anticheat-resume-btn");

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.currentView === "arena-view") {
      state.gameplay.tabSwitchCount++;
      clearInterval(state.gameplay.timerInterval);

      counter.textContent = `Warnings: ${state.gameplay.tabSwitchCount} / 3`;
      overlay.classList.add("active");

      if (state.gameplay.tabSwitchCount >= 3) {
        overlay.querySelector(".anticheat-text").textContent = "You have exceeded the maximum tab-switch warnings. Your quiz has been automatically submitted.";
        resumeBtn.textContent = "View Results";
        resumeBtn.onclick = () => {
          overlay.classList.remove("active");
          finishQuiz();
        };
      }
    }
  });

  resumeBtn.addEventListener("click", () => {
    if (state.gameplay.tabSwitchCount < 3) {
      overlay.classList.remove("active");
      startTimer();
    }
  });
}

// --- REVIEW BEFORE SUBMIT MODAL ---
function setupReviewModal() {
  const modal = document.getElementById("review-modal");
  const closeBtn = document.getElementById("review-modal-close");
  const backBtn = document.getElementById("review-modal-back");
  const submitBtn = document.getElementById("review-modal-submit");

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  backBtn.addEventListener("click", () => modal.classList.remove("active"));
  
  submitBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    finishQuiz();
  });
}

function showReviewModal() {
  const modal = document.getElementById("review-modal");
  const list = document.getElementById("review-summary-list");
  list.innerHTML = "";

  const questions = state.gameplay.shuffledQuestions;
  
  questions.forEach((q, idx) => {
    const selected = state.gameplay.selectedAnswers[idx];
    const qType = q.type || "mcq";
    let answerText = "Not answered";
    let isAnswered = selected !== undefined && selected !== -1;

    if (isAnswered) {
      if (qType === "short_answer") {
        answerText = typeof selected === "string" ? selected : "Typed answer";
      } else if (qType === "truefalse") {
        answerText = selected === 0 ? "True" : "False";
      } else {
        answerText = q.options[selected] || "Selected";
      }
    }

    const item = document.createElement("div");
    item.className = `review-summary-item ${isAnswered ? 'answered' : 'unanswered'}`;
    item.innerHTML = `
      <span class="review-summary-q-label">Q${idx + 1}: ${q.question.length > 50 ? q.question.slice(0, 50) + '…' : q.question}</span>
      <span class="review-summary-answer">${answerText}</span>
    `;
    item.addEventListener("click", () => {
      modal.classList.remove("active");
      state.gameplay.currentQuestionIndex = idx;
      loadQuestion();
    });
    list.appendChild(item);
  });

  modal.classList.add("active");
  lucide.createIcons();
}

// --- SHARE QUIZ MODAL ---
function setupShareModal() {
  const modal = document.getElementById("share-modal");
  const closeBtn = document.getElementById("share-modal-close");
  const copyBtn = document.getElementById("share-copy-btn");

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));

  copyBtn.addEventListener("click", () => {
    const input = document.getElementById("share-link-input");
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
      showToast("Link copied to clipboard!", "success");
    }).catch(() => {
      document.execCommand("copy");
      showToast("Link copied!", "success");
    });
  });
}

function openShareModal(quizId) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?quiz=${quizId}`;
  document.getElementById("share-link-input").value = shareUrl;
  document.getElementById("share-modal").classList.add("active");
  lucide.createIcons();
}

// --- CSV IMPORT / EXPORT ---
function setupCSVHandlers() {
  const dropZone = document.getElementById("csv-drop-zone");
  const fileInput = document.getElementById("csv-file-input");
  const exportBtn = document.getElementById("csv-export-btn");
  const templateBtn = document.getElementById("csv-template-btn");

  dropZone.addEventListener("click", () => fileInput.click());
  
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) importCSV(file);
    else showToast("Please drop a .csv file.", "error");
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) importCSV(e.target.files[0]);
  });

  exportBtn.addEventListener("click", () => exportCSV());
  templateBtn.addEventListener("click", () => downloadCSVTemplate());
}

function importCSV(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const lines = e.target.result.split("\n").filter(l => l.trim());
    if (lines.length < 2) { showToast("CSV file is empty or invalid.", "error"); return; }

    const questions = [];
    // Expected format: question,optionA,optionB,optionC,optionD,correctIndex,explanation
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 6) continue;

      questions.push({
        question: cols[0],
        options: [cols[1], cols[2], cols[3], cols[4]],
        answer: parseInt(cols[5]) || 0,
        explanation: cols[6] || ""
      });
    }

    if (questions.length === 0) { showToast("No valid questions found in CSV.", "error"); return; }

    // Add as question blocks in the creator
    const container = document.getElementById("creator-questions-list");
    questions.forEach(q => {
      addQuestionBlock();
      const blocks = container.querySelectorAll(".question-builder-item");
      const lastBlock = blocks[blocks.length - 1];
      
      lastBlock.querySelector(".q-text-input").value = q.question;
      const opts = lastBlock.querySelectorAll(".opt-text-input");
      q.options.forEach((opt, i) => { if (opts[i]) opts[i].value = opt; });
      
      const radios = lastBlock.querySelectorAll(".opt-radio-input");
      radios.forEach((r, i) => r.checked = (i === q.answer));
      
      const expInput = lastBlock.querySelector(".q-explanation-input");
      if (expInput) expInput.value = q.explanation;
    });

    showToast(`Imported ${questions.length} questions from CSV.`, "success");
  };
  reader.readAsText(file);
}

function exportCSV() {
  const blocks = document.querySelectorAll(".question-builder-item");
  if (blocks.length === 0) { showToast("No questions to export.", "warning"); return; }

  let csv = "question,optionA,optionB,optionC,optionD,correctIndex,explanation\n";
  
  blocks.forEach(block => {
    const qText = block.querySelector(".q-text-input").value.trim();
    const opts = [...block.querySelectorAll(".opt-text-input")].map(i => i.value.trim());
    const radios = block.querySelectorAll(".opt-radio-input");
    let correctIdx = 0;
    radios.forEach((r, i) => { if (r.checked) correctIdx = i; });
    const explanation = block.querySelector(".q-explanation-input").value.trim();
    
    csv += `"${qText}","${opts[0] || ''}","${opts[1] || ''}","${opts[2] || ''}","${opts[3] || ''}",${correctIdx},"${explanation}"\n`;
  });

  downloadFile("quiz_questions.csv", csv, "text/csv");
  showToast("Questions exported as CSV.", "success");
}

function downloadCSVTemplate() {
  const template = `question,optionA,optionB,optionC,optionD,correctIndex,explanation
"What is 2+2?","3","4","5","6",1,"2+2 equals 4"
"Is the sky blue?","True","False","","",0,"The sky appears blue due to Rayleigh scattering"`;
  downloadFile("quiz_template.csv", template, "text/csv");
  showToast("CSV template downloaded.", "info");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- ADD SHARE BUTTON TO QUIZ CARDS ---
const origRenderDashboard = renderDashboard;
renderDashboard = function() {
  origRenderDashboard();
  
  // Add share buttons after rendering
  document.querySelectorAll(".quiz-card").forEach((card, idx) => {
    const quiz = state.quizzes[idx];
    if (!quiz) return;
    
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display: flex; gap: 8px; margin-top: 8px;";
    
    const shareBtn = document.createElement("button");
    shareBtn.className = "btn btn-secondary";
    shareBtn.style.fontSize = "13px";
    shareBtn.innerHTML = `<i data-lucide="share-2" size="14"></i> Share`;
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openShareModal(quiz.id);
    });
    btnRow.appendChild(shareBtn);
    card.appendChild(btnRow);
  });
  
  lucide.createIcons();
};

function setupLoginHandlers() {
  const loginOverlay = document.getElementById("login-overlay");
  
  // Tab Switchers
  const tabLoginBtn = document.getElementById("tab-login-btn");
  const tabSignupBtn = document.getElementById("tab-signup-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  tabLoginBtn.addEventListener("click", () => {
    tabLoginBtn.classList.add("active");
    tabSignupBtn.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });

  tabSignupBtn.addEventListener("click", () => {
    tabSignupBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Role buttons on Sign Up
  const roleStudentBtn = document.getElementById("role-student-btn");
  const roleTeacherBtn = document.getElementById("role-teacher-btn");
  let selectedSignupRole = "student";

  roleStudentBtn.addEventListener("click", () => {
    roleStudentBtn.classList.add("selected");
    roleTeacherBtn.classList.remove("selected");
    selectedSignupRole = "student";
  });

  roleTeacherBtn.addEventListener("click", () => {
    roleTeacherBtn.classList.add("selected");
    roleStudentBtn.classList.remove("selected");
    selectedSignupRole = "teacher";
  });

  // Sign In submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("l-username").value.trim();
    const passwordInput = document.getElementById("l-password").value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("quizmania_active_user", data.username);
        showToast(`Signed in successfully as ${data.username}!`, "success");
        await initApp();
        switchView("dashboard-view");
        loginForm.reset();
        return;
      }

      if (res.status === 400) {
        const data = await res.json();
        showToast(data.error || "Invalid username or password.", "error");
        return;
      }
      
      throw new Error("Server error or endpoint not found.");
    } catch (err) {
      console.warn("Backend login failed, falling back to local accounts:", err);
      
      const accounts = getAccounts();
      const user = accounts.find(a => a.username.toLowerCase() === usernameInput.toLowerCase());
      if (user && user.password === passwordInput) {
        localStorage.setItem("quizmania_active_user", user.username);
        showToast(`Signed in successfully as ${user.username} (Offline Mode)!`, "success");
        await initApp();
        switchView("dashboard-view");
        loginForm.reset();
      } else {
        const defaultUser = DEFAULT_ACCOUNTS.find(a => a.username.toLowerCase() === usernameInput.toLowerCase());
        if (defaultUser && defaultUser.password === passwordInput) {
          localStorage.setItem("quizmania_active_user", defaultUser.username);
          showToast(`Signed in successfully as ${defaultUser.username} (Offline Mode)!`, "success");
          await initApp();
          switchView("dashboard-view");
          loginForm.reset();
        } else {
          showToast("Invalid username or password (offline).", "error");
        }
      }
    }
  });

  // Sign Up submit
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("s-username").value.trim();
    const passwordInput = document.getElementById("s-password").value;

    if (usernameInput.length < 3) {
      showToast("Username must be at least 3 characters.", "warning");
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          role: selectedSignupRole
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("quizmania_active_user", data.username);
        showToast("Account created successfully!", "success");
        await initApp();
        switchView("dashboard-view");
        signupForm.reset();
        tabLoginBtn.click();
        return;
      }
      
      if (res.status === 400) {
        const data = await res.json();
        showToast(data.error || "Registration failed.", "error");
        return;
      }

      throw new Error("Server error or endpoint not found.");
    } catch (err) {
      console.warn("Backend registration failed, falling back to local accounts:", err);
      
      const accounts = getAccounts();
      const exists = accounts.some(a => a.username.toLowerCase() === usernameInput.toLowerCase()) ||
                     DEFAULT_ACCOUNTS.some(a => a.username.toLowerCase() === usernameInput.toLowerCase());
      
      if (exists) {
        showToast("Username is already taken (offline).", "error");
        return;
      }

      const newAccount = {
        username: usernameInput,
        password: passwordInput,
        role: selectedSignupRole
      };
      
      accounts.push(newAccount);
      saveAccounts(accounts);
      
      localStorage.setItem("quizmania_active_user", newAccount.username);
      showToast("Account created successfully (Offline Mode)!", "success");
      
      await initApp();
      switchView("dashboard-view");
      signupForm.reset();
      tabLoginBtn.click();
    }
  });

  // Logout button handler
  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("quizmania_active_user");
      
      // Clear game states
      if (state.gameplay.timerInterval) {
        clearInterval(state.gameplay.timerInterval);
      }
      
      // Reset user state to generic guest
      state.user = {
        xp: 0,
        quizzesCompleted: 0,
        totalAnswers: 0,
        correctAnswers: 0,
        badges: [],
        username: "You",
        role: "student"
      };

      // Show login overlay
      loginOverlay.classList.add("active");
      showToast("Logged out successfully.", "info");
      
      // Reset input fields
      document.getElementById("l-username").value = "";
      document.getElementById("l-password").value = "";
      
      applyRoleAccessControl();
    }
  });
}

// ==========================================
// MULTIPLAYER ROOMS & GAMEPLAY LOGIC
// ==========================================

function setupMultiplayerHandlers() {
  const joinBtn = document.getElementById("join-room-btn");
  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      const pinVal = document.getElementById("join-pin-input").value.trim();
      if (pinVal.length !== 6 || isNaN(pinVal)) {
        showToast("Please enter a valid 6-digit PIN code.", "warning");
        return;
      }
      joinQuizRoom(pinVal);
    });
  }

  const cancelHostBtn = document.getElementById("host-cancel-btn");
  if (cancelHostBtn) {
    cancelHostBtn.addEventListener("click", () => {
      cancelHostedRoom();
    });
  }

  const startHostBtn = document.getElementById("host-start-btn");
  if (startHostBtn) {
    startHostBtn.addEventListener("click", () => {
      startHostedRoom();
    });
  }

  const nextHostBtn = document.getElementById("host-game-next-btn");
  if (nextHostBtn) {
    nextHostBtn.addEventListener("click", () => {
      advanceHostGameQuestion();
    });
  }

  const endHostBtn = document.getElementById("host-game-end-btn");
  if (endHostBtn) {
    endHostBtn.addEventListener("click", () => {
      endHostedRoom();
    });
  }

  const leaveLobbyBtn = document.getElementById("student-lobby-leave-btn");
  if (leaveLobbyBtn) {
    leaveLobbyBtn.addEventListener("click", () => {
      leaveStudentLobby();
    });
  }
}

async function hostQuiz(quizId) {
  const hostUsername = state.user.username;
  try {
    const res = await fetch('/api/rooms/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, hostUsername })
    });
    
    if (!res.ok) {
      const data = await res.json();
      showToast(data.error || "Failed to host quiz room.", "error");
      return;
    }
    
    const { pin } = await res.json();
    
    state.multiplayer = {
      active: true,
      role: 'host',
      pin: pin,
      status: 'lobby',
      quiz: state.quizzes.find(q => q.id === quizId),
      currentQuestionIndex: 0,
      participants: []
    };
    
    document.getElementById("host-pin-code").textContent = pin;
    document.getElementById("host-player-count").textContent = "0";
    document.getElementById("host-players-list").innerHTML = "";
    document.getElementById("host-start-btn").disabled = true;
    
    switchView("host-lobby-view");
    startMultiplayerPolling();
    showToast(`Quiz hosted! PIN: ${pin}`, "success");
  } catch (error) {
    console.error("Error hosting room:", error);
    showToast("Connection to server failed.", "error");
  }
}

async function joinQuizRoom(pin) {
  const username = state.user.username || "You";
  try {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, username })
    });
    
    if (!res.ok) {
      const data = await res.json();
      showToast(data.error || "Failed to join quiz room.", "error");
      return;
    }
    
    const { quizId } = await res.json();
    
    state.multiplayer = {
      active: true,
      role: 'student',
      pin: pin,
      status: 'lobby',
      quiz: state.quizzes.find(q => q.id === quizId),
      currentQuestionIndex: 0,
      participants: []
    };
    
    document.getElementById("student-lobby-quiz-title").textContent = state.multiplayer.quiz ? state.multiplayer.quiz.title : "Live Quiz";
    document.getElementById("student-lobby-pin").textContent = pin;
    document.getElementById("student-lobby-players-list").innerHTML = "";
    
    switchView("student-lobby-view");
    startMultiplayerPolling();
    showToast("Joined live lobby successfully!", "success");
  } catch (error) {
    console.error("Error joining room:", error);
    showToast("Connection to server failed.", "error");
  }
}

function startMultiplayerPolling() {
  if (state.multiplayer.pollInterval) {
    clearInterval(state.multiplayer.pollInterval);
  }
  
  state.multiplayer.pollInterval = setInterval(async () => {
    if (!state.multiplayer.pin) {
      clearInterval(state.multiplayer.pollInterval);
      return;
    }
    
    try {
      const res = await fetch(`/api/rooms/status/${state.multiplayer.pin}`);
      if (!res.ok) {
        clearInterval(state.multiplayer.pollInterval);
        showToast("Live session was closed by the host.", "warning");
        leaveMultiplayerSession();
        return;
      }
      
      const statusData = await res.json();
      state.multiplayer.participants = statusData.participants;
      state.multiplayer.status = statusData.status;
      state.multiplayer.currentQuestionIndex = statusData.currentQuestionIndex;
      
      if (state.multiplayer.role === 'host') {
        updateHostLobbyUI();
        if (state.multiplayer.status === 'active' && state.currentView === 'host-lobby-view') {
          startHostGameplay();
        }
      } else {
        updateStudentLobbyUI();
        
        if (state.multiplayer.status === 'active') {
          if (state.currentView !== 'arena-view') {
            startStudentGameplay();
          } else {
            if (state.gameplay.currentQuestionIndex !== state.multiplayer.currentQuestionIndex) {
              loadSyncedStudentQuestion();
            }
          }
        } else if (state.multiplayer.status === 'finished') {
          showRoomPodium();
        }
      }
    } catch (e) {
      console.error("Multiplayer polling error:", e);
    }
  }, 2000);
}

function updateHostLobbyUI() {
  const countEl = document.getElementById("host-player-count");
  const listEl = document.getElementById("host-players-list");
  const startBtn = document.getElementById("host-start-btn");
  
  if (countEl) countEl.textContent = state.multiplayer.participants.length;
  if (listEl) {
    listEl.innerHTML = state.multiplayer.participants.map(p => `
      <div class="user-profile-badge" style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); font-weight: 600; padding: 8px 16px;">
        <span class="user-avatar" style="width: 24px; height: 24px; font-size: 11px; margin-right: 6px;">${p.username[0].toUpperCase()}</span>
        ${p.username}
      </div>
    `).join("");
  }
  if (startBtn) {
    startBtn.disabled = state.multiplayer.participants.length === 0;
  }
}

function updateStudentLobbyUI() {
  const listEl = document.getElementById("student-lobby-players-list");
  if (listEl) {
    listEl.innerHTML = state.multiplayer.participants.map(p => `
      <div class="user-profile-badge" style="background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.2); padding: 6px 12px; font-size: 12px;">
        ${p.username}
      </div>
    `).join("");
  }
}

async function cancelHostedRoom() {
  if (confirm("Are you sure you want to cancel this live session?")) {
    try {
      await fetch(`/api/rooms/end/${state.multiplayer.pin}`, { method: 'POST' });
    } catch (e) {}
    leaveMultiplayerSession();
  }
}

async function startHostedRoom() {
  try {
    const res = await fetch(`/api/rooms/start/${state.multiplayer.pin}`, { method: 'POST' });
    if (res.ok) {
      startHostGameplay();
    }
  } catch (error) {
    console.error("Error starting room:", error);
  }
}

function startHostGameplay() {
  state.multiplayer.status = 'active';
  
  document.getElementById("host-game-quiz-title").textContent = state.multiplayer.quiz.title;
  document.getElementById("host-game-pin-display").textContent = state.multiplayer.pin;
  document.getElementById("host-game-q-total").textContent = state.multiplayer.quiz.questions.length;
  document.getElementById("host-game-next-btn").style.display = "inline-flex";
  
  switchView("host-game-view");
  loadHostQuestion();
}

function loadHostQuestion() {
  const qIdx = state.multiplayer.currentQuestionIndex;
  const quiz = state.multiplayer.quiz;
  const questionObj = quiz.questions[qIdx];
  
  document.getElementById("host-game-q-num").textContent = qIdx + 1;
  document.getElementById("host-game-question-text").textContent = questionObj.question;
  
  updateHostLiveScores();
}

function updateHostLiveScores() {
  const scoreListEl = document.getElementById("host-game-scores-list");
  if (scoreListEl) {
    scoreListEl.innerHTML = state.multiplayer.participants.map((p, idx) => `
      <div class="leaderboard-row" style="padding: 10px 16px;">
        <span class="leaderboard-rank rank-${idx + 1}">${idx + 1}</span>
        <div class="leaderboard-avatar">${p.username.slice(0, 2).toUpperCase()}</div>
        <div class="leaderboard-name">${p.username}</div>
        <span class="leaderboard-score" style="color: var(--accent-blue);">${p.score} pts</span>
      </div>
    `).join("");
  }
  
  const responsesCountEl = document.getElementById("host-game-responses-count");
  if (responsesCountEl) {
    responsesCountEl.textContent = state.multiplayer.participants.length;
  }
}

async function advanceHostGameQuestion() {
  const maxQ = state.multiplayer.quiz.questions.length;
  try {
    const res = await fetch(`/api/rooms/next-question/${state.multiplayer.pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxQuestions: maxQ })
    });
    
    if (res.ok) {
      const statusRes = await fetch(`/api/rooms/status/${state.multiplayer.pin}`);
      const statusData = await statusRes.json();
      state.multiplayer.currentQuestionIndex = statusData.currentQuestionIndex;
      state.multiplayer.status = statusData.status;
      
      if (state.multiplayer.status === 'finished') {
        endHostedRoom();
      } else {
        loadHostQuestion();
      }
    }
  } catch (error) {
    console.error("Error advancing question:", error);
  }
}

async function endHostedRoom() {
  try {
    await fetch(`/api/rooms/end/${state.multiplayer.pin}`, { method: 'POST' });
    showHostPodium();
  } catch (error) {
    console.error("Error ending room:", error);
  }
}

function showHostPodium() {
  clearInterval(state.multiplayer.pollInterval);
  
  const listEl = document.getElementById("host-game-scores-list");
  if (listEl) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 24px; width: 100%;">
        <h2 style="color: var(--warning-color); font-size: 26px; margin-bottom: 16px;"><i data-lucide="award" style="vertical-align: middle; margin-right: 8px; width: 26px; height: 26px; color: var(--warning-color);"></i>Live Quiz Podium</h2>
        <div style="display: flex; flex-direction: column; gap: 10px; max-width: 400px; margin: 0 auto;">
          ${state.multiplayer.participants.map((p, idx) => `
            <div class="leaderboard-row" style="padding: 12px 20px; background: rgba(255, 255, 255, 0.05); width: 100%; box-sizing: border-box;">
              <span class="leaderboard-rank rank-${idx + 1}" style="font-size: 16px;">#${idx + 1}</span>
              <div class="leaderboard-name" style="font-weight: bold;">${p.username}</div>
              <span class="leaderboard-score" style="font-size: 14px; color: var(--success-color);">${p.score} pts</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    lucide.createIcons();
  }
  
  document.getElementById("host-game-next-btn").style.display = "none";
}

function startStudentGameplay() {
  const quiz = state.multiplayer.quiz;
  if (!quiz) return;
  
  state.gameplay.activeQuiz = quiz;
  state.gameplay.shuffledQuestions = JSON.parse(JSON.stringify(quiz.questions));
  
  state.gameplay.currentQuestionIndex = state.multiplayer.currentQuestionIndex;
  state.gameplay.score = 0;
  state.gameplay.correctCount = 0;
  state.gameplay.streak = 0;
  state.gameplay.maxStreak = 0;
  state.gameplay.answersLog = [];
  state.gameplay.startTime = Date.now();
  state.gameplay.selectedAnswers = {};
  
  document.getElementById("arena-quiz-title").textContent = quiz.title + " (Live)";
  document.getElementById("arena-total-q-num").textContent = quiz.questions.length;
  
  switchView("arena-view");
  loadSyncedStudentQuestion();
}

function loadSyncedStudentQuestion() {
  const qIdx = state.multiplayer.currentQuestionIndex;
  state.gameplay.currentQuestionIndex = qIdx;
  
  const questionObj = state.gameplay.shuffledQuestions[qIdx];
  
  document.getElementById("arena-current-q-num").textContent = qIdx + 1;
  document.getElementById("arena-score-val").textContent = `${state.gameplay.score} XP`;
  
  const progressPercent = (qIdx / state.gameplay.shuffledQuestions.length) * 100;
  document.getElementById("arena-progress-bar").style.width = `${progressPercent}%`;
  
  document.getElementById("arena-question-tag").textContent = state.multiplayer.quiz.category;
  document.getElementById("arena-question-text").textContent = questionObj.question;
  
  const optionsContainer = document.getElementById("arena-options-list");
  optionsContainer.innerHTML = "";
  
  const qType = questionObj.type || "mcq";
  
  if (qType === "truefalse") {
    const row = document.createElement("div");
    row.className = "tf-options-row";
    ["True", "False"].forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.className = "tf-btn";
      btn.innerHTML = `<i data-lucide="${idx === 0 ? 'check-circle' : 'x-circle'}" size="24"></i> ${label}`;
      btn.addEventListener("click", () => selectOption(idx));
      row.appendChild(btn);
    });
    optionsContainer.appendChild(row);
  } else if (qType === "short_answer") {
    const wrapper = document.createElement("div");
    wrapper.className = "short-answer-wrapper";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "short-answer-input";
    input.id = "arena-short-answer-input";
    input.placeholder = "Type your answer here...";
    input.addEventListener("input", () => {
      selectedOptionIdx = input.value.trim();
      document.getElementById("arena-action-btn").disabled = !input.value.trim();
    });
    wrapper.appendChild(input);
    optionsContainer.appendChild(wrapper);
  } else {
    questionObj.options.forEach((optionText, idx) => {
      const letter = String.fromCharCode(65 + idx);
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-letter">${letter}</span>
        <span class="option-text">${optionText}</span>
      `;
      btn.addEventListener("click", () => selectOption(idx));
      optionsContainer.appendChild(btn);
    });
  }
  
  document.getElementById("arena-explanation-panel").style.display = "none";
  
  const actionBtn = document.getElementById("arena-action-btn");
  actionBtn.innerHTML = `Submit Answer <i data-lucide="check"></i>`;
  actionBtn.disabled = true;
  selectedOptionIdx = -1;
  lucide.createIcons();
  
  state.gameplay.timeLeft = state.multiplayer.quiz.timeLimit;
  startTimer();
}

async function leaveStudentLobby() {
  leaveMultiplayerSession();
}

function leaveMultiplayerSession() {
  clearInterval(state.multiplayer.pollInterval);
  state.multiplayer = {
    active: false,
    role: null,
    pin: null,
    status: 'lobby',
    pollInterval: null,
    quiz: null,
    currentQuestionIndex: 0,
    participants: []
  };
  switchView("dashboard-view");
}

function showRoomPodium() {
  clearInterval(state.multiplayer.pollInterval);
  
  // Show student success/podium screen
  const explanationPanel = document.getElementById("arena-explanation-panel");
  const explanationText = document.getElementById("arena-explanation-text");
  
  explanationPanel.style.display = "block";
  explanationText.innerHTML = `
    <div style="text-align: center; padding: 16px;">
      <h3 style="color: var(--success-color); margin-bottom: 8px;"><i data-lucide="party-popper" style="vertical-align: middle; margin-right: 8px; width: 22px; height: 22px; color: var(--success-color);"></i>Live Quiz Finished!</h3>
      <p>The host has ended the session. Thank you for playing!</p>
      <button class="btn btn-secondary" onclick="leaveMultiplayerSession()" style="margin-top: 16px; width: auto; margin-left: auto; margin-right: auto;">Back to Dashboard</button>
    </div>
  `;
  lucide.createIcons();
  
  // Disable option controls
  document.getElementById("arena-action-btn").style.display = "none";
}
