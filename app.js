// --- DEFAULT PRE-POPULATED QUIZZES ---
const DEFAULT_QUIZZES = [
  {
    id: "quiz-web-dev",
    title: "Web Development Core",
    description: "Test your skills on modern JavaScript concepts, CSS layouts, and web fundamentals.",
    category: "Tech",
    difficulty: "medium",
    timeLimit: 30, // seconds per question
    questions: [
      {
        question: "What is the output of 'typeof NaN' in JavaScript?",
        options: ["number", "NaN", "undefined", "object"],
        answer: 0,
        explanation: "In JavaScript, 'NaN' stands for 'Not-a-Number', but its data type is actually a number."
      },
      {
        question: "Which CSS property is used to align items along the main axis in Flexbox?",
        options: ["align-items", "justify-content", "align-content", "grid-gap"],
        answer: 1,
        explanation: "justify-content aligns items along the main axis, while align-items aligns them along the cross axis."
      },
      {
        question: "What does the 'defer' attribute in a script tag do?",
        options: [
          "Executes the script synchronously.",
          "Downloads the script in parallel and executes it after document parsing.",
          "Downloads the script and executes it immediately, blocking HTML rendering.",
          "Prevents the script from executing at all."
        ],
        answer: 1,
        explanation: "The defer attribute tells the browser to execute script only after the HTML document has been fully parsed."
      },
      {
        question: "Which HTTP status code represents a successful resource creation?",
        options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
        answer: 1,
        explanation: "HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource."
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A method to close browser tabs.",
          "The combination of a function bundled together with references to its surrounding state.",
          "A way to safely encrypt API keys.",
          "A loop structure that terminates early."
        ],
        answer: 1,
        explanation: "A closure gives you access to an outer function's scope from an inner function."
      },
      {
        question: "Which of the following is NOT a semantic HTML element?",
        options: ["<article>", "<section>", "<div>", "<aside>"],
        answer: 2,
        explanation: "<div> is a generic container and has no semantic meaning. <article>, <section>, and <aside> describe their content."
      },
      {
        question: "What is the purpose of the 'key' prop in React lists?",
        options: [
          "To uniquely identify elements and help React identify which items changed, are added, or removed.",
          "To style list items individually.",
          "To encrypt list item content.",
          "To bind click event handlers automatically."
        ],
        answer: 0,
        explanation: "Keys help React identify which items have changed, been added, or been removed, optimizing rendering performance."
      },
      {
        question: "Which protocol is used to fetch web resources securely?",
        options: ["FTP", "HTTP", "HTTPS", "SSH"],
        answer: 2,
        explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts communication using TLS/SSL."
      },
      {
        question: "What does 'Event Bubbling' refer to in JS DOM events?",
        options: [
          "Events propagating from the target element upwards through its ancestors in the DOM tree.",
          "Events triggering recursively inside a loop.",
          "The visual animation of buttons popping.",
          "Events descending from the document node down to the target element."
        ],
        answer: 0,
        explanation: "Event bubbling starts from the deepest target element and bubbles up through parent elements."
      },
      {
        question: "What is the main advantage of HTTP/2 over HTTP/1.1?",
        options: [
          "It uses plain text for headers.",
          "Multiplexing, which allows multiple requests and responses over a single TCP connection.",
          "It removes the need for IP addresses.",
          "It only works on wireless connections."
        ],
        answer: 1,
        explanation: "HTTP/2 multiplexing reduces latency by allowing concurrent requests/responses over a single connection."
      }
    ]
  },
  {
    id: "quiz-space",
    title: "Cosmos & Space Exploration",
    description: "Embark on a journey through the stars, planets, and historic space flight missions.",
    category: "Science",
    difficulty: "hard",
    timeLimit: 25,
    questions: [
      {
        question: "Which planet is the hottest in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        answer: 1,
        explanation: "Venus is the hottest planet due to its thick greenhouse-gas atmosphere, which traps heat."
      },
      {
        question: "What is the approximate speed of light in a vacuum?",
        options: ["150,000 km/s", "300,000 km/s", "500,000 km/s", "1,000,000 km/s"],
        answer: 1,
        explanation: "The speed of light is approximately 299,792 kilometers per second (about 186,000 miles per second)."
      },
      {
        question: "What is the name of the boundary around a black hole beyond which nothing can escape?",
        options: ["Singularity", "Accretion Disk", "Event Horizon", "Schwarzschild Radius"],
        answer: 2,
        explanation: "The Event Horizon is the threshold where gravity is so strong that even light cannot escape."
      },
      {
        question: "Which galaxy is closest to our Milky Way?",
        options: ["Andromeda", "Triangulum", "Large Magellanic Cloud", "Sombrero Galaxy"],
        answer: 0,
        explanation: "Andromeda (M31) is the nearest large galaxy to the Milky Way, located about 2.5 million light-years away."
      },
      {
        question: "What was the name of the first human-made satellite launched into space?",
        options: ["Apollo 11", "Vostok 1", "Sputnik 1", "Explorer 1"],
        answer: 2,
        explanation: "Sputnik 1 was launched by the Soviet Union on October 4, 1957, marking the beginning of the space age."
      },
      {
        question: "Which moon is the largest in our solar system?",
        options: ["Titan", "Ganymede", "Europa", "Io"],
        answer: 1,
        explanation: "Ganymede, a moon of Jupiter, is the largest moon in the Solar System, even larger than the planet Mercury."
      },
      {
        question: "What telescope, launched in 2021, is designed to study the universe in infrared light?",
        options: ["Hubble Space Telescope", "James Webb Space Telescope", "Kepler Space Telescope", "Chandra X-ray Observatory"],
        answer: 1,
        explanation: "The James Webb Space Telescope (JWST) is a premier infrared space observatory launched on December 25, 2021."
      },
      {
        question: "What is the primary source of energy for stars?",
        options: ["Chemical combustion", "Nuclear fission", "Nuclear fusion", "Gravitational friction"],
        answer: 2,
        explanation: "Stars generate energy by fusing hydrogen atoms into helium under extreme heat and pressure in their cores."
      },
      {
        question: "Which Mars rover was the first to deploy a helicopter (Ingenuity) on the Martian surface?",
        options: ["Curiosity", "Opportunity", "Spirit", "Perseverance"],
        answer: 3,
        explanation: "Perseverance, landing in 2021, carried the Ingenuity helicopter, achieving the first powered flight on another planet."
      },
      {
        question: "Who was the first woman in space?",
        options: ["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Peggy Whitson"],
        answer: 1,
        explanation: "Soviet cosmonaut Valentina Tereshkova flew on Vostok 6 in June 1963, becoming the first woman in space."
      }
    ]
  },
  {
    id: "quiz-geography",
    title: "World Geography Trek",
    description: "Explore Earth's majestic topography, capital cities, rivers, and borders.",
    category: "Geography",
    difficulty: "easy",
    timeLimit: 30,
    questions: [
      {
        question: "What is the capital city of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        answer: 2,
        explanation: "Canberra was selected as the capital in 1908 as a compromise between rivals Sydney and Melbourne."
      },
      {
        question: "Which river is the longest in the world?",
        options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
        answer: 1,
        explanation: "The Nile is traditionally considered the longest river in the world, stretching 6,650 kilometers (4,132 miles)."
      },
      {
        question: "Which country has the largest number of natural lakes?",
        options: ["Canada", "Russia", "United States", "Brazil"],
        answer: 0,
        explanation: "Canada contains more than 60% of the world's lakes, with over 3 million lakes covering 9% of the country."
      },
      {
        question: "What is the deepest point in the world's oceans?",
        options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench (Challenger Deep)", "Sunda Trench"],
        answer: 2,
        explanation: "Challenger Deep in the Mariana Trench reaches a depth of nearly 11,000 meters (36,000 feet)."
      },
      {
        question: "Which of these countries is completely landlocked?",
        options: ["Vietnam", "Bolivia", "South Africa", "Portugal"],
        answer: 1,
        explanation: "Bolivia lost its coastline to Chile in the War of the Pacific (1879-1884) and remains landlocked."
      },
      {
        question: "What is the smallest independent nation in the world by land area?",
        options: ["Monaco", "San Marino", "Liechtenstein", "Vatican City"],
        answer: 3,
        explanation: "Vatican City covers only 0.49 square kilometers (121 acres) and is entirely surrounded by Rome, Italy."
      },
      {
        question: "Which mountain is the tallest in the world, measured from base to peak?",
        options: ["Mount Everest", "K2", "Mauna Kea", "Mount Kilimanjaro"],
        answer: 2,
        explanation: "While Everest is the highest above sea level, Mauna Kea in Hawaii is the tallest from base (underwater) to peak."
      },
      {
        question: "Which African country has the most pyramids?",
        options: ["Egypt", "Sudan", "Ethiopia", "Libya"],
        answer: 1,
        explanation: "Sudan has over 200 pyramids (built by the Nubian Kingdom of Kush), which is double Egypt's count."
      },
      {
        question: "Which country shares the longest border with another country?",
        options: ["Russia", "China", "Canada", "Chile"],
        answer: 2,
        explanation: "The Canada-United States border is the longest international border, measuring 8,891 kilometers."
      },
      {
        question: "Which ocean is the largest on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"],
        answer: 3,
        explanation: "The Pacific Ocean covers more than 30% of the Earth's surface, making it larger than all Earth's landmasses combined."
      }
    ]
  },
  {
    id: "quiz-history",
    title: "History Epochs & Milestones",
    description: "Chronicle major historical events, revolutions, and world-shaping figures.",
    category: "History",
    difficulty: "medium",
    timeLimit: 30,
    questions: [
      {
        question: "Who was the first Emperor of the Roman Empire?",
        options: ["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"],
        answer: 1,
        explanation: "Augustus (formerly Octavian) became the first official Roman Emperor in 27 BC, ending the Roman Republic."
      },
      {
        question: "What year did the Berlin Wall fall, leading to the reunification of Germany?",
        options: ["1985", "1989", "1991", "1993"],
        answer: 1,
        explanation: "The Berlin Wall was opened on November 9, 1989, paving the way for the end of communist regimes in Europe."
      },
      {
        question: "Who invented the movable type printing press in Europe around 1440?",
        options: ["Leonardo da Vinci", "Johannes Gutenberg", "Isaac Newton", "Galileo Galilei"],
        answer: 1,
        explanation: "Johannes Gutenberg's printing press revolutionized knowledge distribution, initiating the printing revolution."
      },
      {
        question: "Which ancient civilization constructed the city of Machu Picchu?",
        options: ["Aztecs", "Mayans", "Incas", "Olmecs"],
        answer: 2,
        explanation: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru."
      },
      {
        question: "What was the primary cause of the US Civil War?",
        options: ["Tariffs and taxation", "The institution of slavery", "Gold Rush territorial disputes", "The War of 1812 residuals"],
        answer: 1,
        explanation: "The war erupted primarily due to disagreements over the expansion of slavery into new territories and states' rights to keep it."
      },
      {
        question: "Who was the British Prime Minister during most of World War II?",
        options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Anthony Eden"],
        answer: 1,
        explanation: "Winston Churchill served as Prime Minister from 1940 to 1945, leading Britain's war efforts against the Axis powers."
      },
      {
        question: "What code of laws, dating back to around 1750 BC, is famous for the phrase 'an eye for an eye'?",
        options: ["Code of Hammurabi", "Justinian Code", "Magna Carta", "Ten Commandments"],
        answer: 0,
        explanation: "The Code of Hammurabi is one of the oldest deciphered writings of significant length in the world, originating in Babylon."
      },
      {
        question: "The signing of which document in 1215 limited the power of the English monarchy?",
        options: ["Treaty of Versailles", "Magna Carta", "Declaration of Independence", "Bill of Rights"],
        answer: 1,
        explanation: "Magna Carta was issued by King John of England at Runnymede to make the king subject to the law."
      },
      {
        question: "Which empire was ruled by Genghis Khan?",
        options: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Persian Empire"],
        answer: 2,
        explanation: "Genghis Khan founded the Mongol Empire in 1206, which grew to become the largest contiguous land empire in history."
      },
      {
        question: "What event in 1914 triggered the outbreak of World War I?",
        options: [
          "The sinking of the Lusitania",
          "The assassination of Archduke Franz Ferdinand",
          "The invasion of Poland",
          "The Bolshevik Revolution"
        ],
        answer: 1,
        explanation: "Archduke Franz Ferdinand of Austria was assassinated in Sarajevo by Gavrilo Princip, setting off the WWI alliance system."
      }
    ]
  },
  {
    id: "quiz-pop-culture",
    title: "Pop Culture & Gaming History",
    description: "Celebrate popular films, media franchises, and historic milestones in gaming.",
    category: "Pop Culture",
    difficulty: "easy",
    timeLimit: 25,
    questions: [
      {
        question: "What is the best-selling video game of all time?",
        options: ["Tetris", "Grand Theft Auto V", "Minecraft", "Super Mario Bros."],
        answer: 2,
        explanation: "Minecraft, released in 2011, has sold over 300 million copies across all platforms."
      },
      {
        question: "Which film won the first-ever Academy Award for Best Picture in 1929?",
        options: ["Wings", "Metropolis", "The Jazz Singer", "Sunrise"],
        answer: 0,
        explanation: "Wings, a silent war film about WWI fighter pilots, won the first Outstanding Picture Oscar."
      },
      {
        question: "Which video game console, released in 2000, remains the best-selling console of all time?",
        options: ["PlayStation 2", "Nintendo Wii", "Xbox 360", "Nintendo DS"],
        answer: 0,
        explanation: "Sony's PlayStation 2 sold over 155 million units worldwide during its lifecycle."
      },
      {
        question: "Who is known as the 'King of Pop'?",
        options: ["Prince", "Elvis Presley", "Michael Jackson", "David Bowie"],
        answer: 2,
        explanation: "Michael Jackson is globally recognized as the King of Pop due to his influence, dancing, and record sales."
      },
      {
        question: "What is the highest-grossing film box office of all time (unadjusted for inflation)?",
        options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
        answer: 0,
        explanation: "James Cameron's Avatar (2009) holds the top spot with over $2.9 billion in worldwide earnings."
      },
      {
        question: "In what year was the first commercial video game, 'Computer Space', released?",
        options: ["1969", "1971", "1975", "1980"],
        answer: 1,
        explanation: "Created by Nolan Bushnell and Ted Dabney (future founders of Atari), Computer Space was released in 1971."
      },
      {
        question: "Which of the following characters is the protagonist of the Legend of Zelda series?",
        options: ["Zelda", "Link", "Ganon", "Mario"],
        answer: 1,
        explanation: "Link is the green-clad hero who rescues Princess Zelda in the fantasy adventure franchise."
      },
      {
        question: "Which pop singer's fans are famously referred to as 'Swifties'?",
        options: ["Ariana Grande", "Taylor Swift", "Selena Gomez", "Billie Eilish"],
        answer: 1,
        explanation: "Taylor Swift's massive and dedicated fanbase is widely known as Swifties."
      },
      {
        question: "Which gaming franchise features a master assassin named Ezio Auditore da Firenze?",
        options: ["God of War", "Assassin's Creed", "Witcher", "Skyrim"],
        answer: 1,
        explanation: "Ezio is the beloved protagonist of Assassin's Creed II, Brotherhood, and Revelations."
      },
      {
        question: "How many members were there in the classic lineup of the English rock band The Beatles?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explanation: "The Beatles' famous lineup consisted of John Lennon, Paul McCartney, George Harrison, and Ringo Starr."
      }
    ]
  }
];

// --- BADGES SYSTEM DEFINITIONS ---
const BADGES = [
  {
    id: "first_quiz",
    title: "Initiation Badge",
    description: "Complete your first quiz on QuizMania.",
    icon: "🚀"
  },
  {
    id: "perfect_score",
    title: "Trivia King",
    description: "Score 100% on any quiz.",
    icon: "👑"
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Answer a question with more than 80% time remaining.",
    icon: "⚡"
  },
  {
    id: "streak_5",
    title: "Unstoppable",
    description: "Achieve a correct answer streak of 5.",
    icon: "🔥"
  },
  {
    id: "streak_10",
    title: "Omniscient",
    description: "Achieve a correct answer streak of 10.",
    icon: "🔮"
  },
  {
    id: "quiz_creator",
    title: "Grand Builder",
    description: "Create and publish a custom quiz.",
    icon: "🛠️"
  },
  {
    id: "tech_master",
    title: "Silicon Valley Elite",
    description: "Score 80% or higher on a Tech quiz.",
    icon: "💻"
  },
  {
    id: "space_explorer",
    title: "Interstellar Mind",
    description: "Score 80% or higher on a Science/Space quiz.",
    icon: "🌌"
  }
];

// --- SIMULATED COMPETITORS (LEADERBOARD BOTS) ---
const SIMULATED_LEADERBOARD = [
  { rank: 1, name: "TriviaWizard", xp: 12400, accuracy: "94%", quizzes: 34, avatar: "TW" },
  { rank: 2, name: "CodeEinstein", xp: 9800, accuracy: "89%", quizzes: 28, avatar: "CE" },
  { rank: 3, name: "CosmicTraveller", xp: 7500, accuracy: "85%", quizzes: 22, avatar: "CT" },
  { rank: 4, name: "GeographicGuru", xp: 4800, accuracy: "82%", quizzes: 15, avatar: "GG" },
  { rank: 5, name: "HistoryBuff92", xp: 3200, accuracy: "78%", quizzes: 11, avatar: "HB" }
];

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
    answersLog: [], // stores logs for review screen {question, selected, correct, isCorrect, explanation, options}
    startTime: null,
    questionStartTime: null,
    unlockedBadgesThisRun: []
  },
  currentView: "dashboard-view"
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadCustomQuizzes();
  renderDashboard();
  renderMiniLeaderboard();
  renderMiniBadges();
  setupNavigation();
  setupDashboardControls();
  setupQuizArenaHandlers();
  setupQuizCreatorHandlers();
  setupResultsHandlers();
  
  // Render Lucide icons
  lucide.createIcons();
});

// --- STATE PERSISTENCE ---
function saveUserProfile() {
  localStorage.setItem("quizmania_user_state", JSON.stringify(state.user));
  updateHeaderProfile();
}

function loadUserProfile() {
  const savedState = localStorage.getItem("quizmania_user_state");
  if (savedState) {
    try {
      state.user = JSON.parse(savedState);
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  } else {
    // Save fresh state
    saveUserProfile();
  }
  updateHeaderProfile();
}

function updateHeaderProfile() {
  document.getElementById("header-user-xp").textContent = state.user.xp.toLocaleString();
  document.getElementById("header-user-level").textContent = calculateLevel(state.user.xp);
  
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

function loadCustomQuizzes() {
  const customQuizzesRaw = localStorage.getItem("quizmania_custom_quizzes");
  if (customQuizzesRaw) {
    try {
      const customQuizzes = JSON.parse(customQuizzesRaw);
      // Clean duplicate custom quizzes if any
      state.quizzes = [...DEFAULT_QUIZZES, ...customQuizzes];
    } catch (e) {
      console.error("Failed to parse custom quizzes", e);
    }
  }
}

function saveCustomQuiz(newQuiz) {
  const customQuizzesRaw = localStorage.getItem("quizmania_custom_quizzes");
  let customQuizzes = [];
  if (customQuizzesRaw) {
    try {
      customQuizzes = JSON.parse(customQuizzesRaw);
    } catch (e) {
      customQuizzes = [];
    }
  }
  customQuizzes.push(newQuiz);
  localStorage.setItem("quizmania_custom_quizzes", JSON.stringify(customQuizzes));
  
  // Reload quizzes
  state.quizzes = [...DEFAULT_QUIZZES, ...customQuizzes];
  
  // Grant creator badge if not unlocked
  unlockBadge("quiz_creator");
  saveUserProfile();
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
function renderMiniLeaderboard() {
  const container = document.getElementById("mini-leaderboard-list");
  container.innerHTML = "";

  // Combine bot leaderboard and user
  let fullList = [...SIMULATED_LEADERBOARD];
  
  // Calculate where user ranks
  const userRankData = {
    rank: 6, // default
    name: "You",
    xp: state.user.xp,
    accuracy: state.user.totalAnswers > 0 ? `${Math.round((state.user.correctAnswers / state.user.totalAnswers) * 100)}%` : "0%",
    quizzes: state.user.quizzesCompleted,
    avatar: "U"
  };

  fullList.push(userRankData);
  fullList.sort((a, b) => b.xp - a.xp);

  // Recalculate ranks
  fullList.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Display top 5
  fullList.slice(0, 5).forEach(item => {
    const isUser = item.name === "You";
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

function renderMiniBadges() {
  const container = document.getElementById("mini-badges-grid");
  container.innerHTML = "";

  BADGES.forEach(badge => {
    const isUnlocked = state.user.badges.includes(badge.id);
    const mini = document.createElement("div");
    mini.className = `badge-mini ${isUnlocked ? '' : 'locked'}`;
    mini.innerHTML = badge.icon;
    mini.setAttribute("data-tooltip", `${badge.title}: ${badge.description} (${isUnlocked ? 'Unlocked' : 'Locked'})`);
    container.appendChild(mini);
  });
}

// --- RENDER FULL LEADERBOARD VIEW ---
function renderLeaderboard() {
  const tableBody = document.getElementById("leaderboard-table-body");
  tableBody.innerHTML = "";

  let fullList = [...SIMULATED_LEADERBOARD];
  const userRankData = {
    rank: 6,
    name: "You",
    xp: state.user.xp,
    accuracy: state.user.totalAnswers > 0 ? `${Math.round((state.user.correctAnswers / state.user.totalAnswers) * 100)}%` : "0%",
    quizzes: state.user.quizzesCompleted,
    avatar: "U"
  };

  fullList.push(userRankData);
  fullList.sort((a, b) => b.xp - a.xp);

  let userRank = 6;
  fullList.forEach((item, index) => {
    item.rank = index + 1;
    if (item.name === "You") {
      userRank = item.rank;
    }
  });

  // Update User Rank Display
  document.getElementById("lb-user-rank").textContent = `#${userRank}`;

  fullList.forEach(item => {
    const isUser = item.name === "You";
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

// --- RENDER BADGES ROOM ---
function renderBadgesGallery() {
  const container = document.getElementById("badges-gallery-container");
  container.innerHTML = "";

  BADGES.forEach(badge => {
    const isUnlocked = state.user.badges.includes(badge.id);
    const card = document.createElement("div");
    card.className = `badge-card glass ${isUnlocked ? '' : 'locked'}`;

    card.innerHTML = `
      <div class="badge-card-icon">${badge.icon}</div>
      <div class="badge-card-title">${badge.title}</div>
      <div class="badge-card-desc">${badge.description}</div>
      <span class="badge-status-tag">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
    `;
    container.appendChild(card);
  });
}

// --- QUIZ GAMEPLAY CORE (ARENA) ---
function startQuiz(quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  // Initialize gameplay state
  state.gameplay.activeQuiz = quiz;
  state.gameplay.currentQuestionIndex = 0;
  state.gameplay.score = 0;
  state.gameplay.correctCount = 0;
  state.gameplay.streak = 0;
  state.gameplay.maxStreak = 0;
  state.gameplay.answersLog = [];
  state.gameplay.startTime = Date.now();
  state.gameplay.unlockedBadgesThisRun = [];

  // Update header text
  document.getElementById("arena-quiz-title").textContent = quiz.title;
  document.getElementById("arena-total-q-num").textContent = quiz.questions.length;
  
  // Transition View
  switchView("arena-view");
  
  // Load question
  loadQuestion();
}

function loadQuestion() {
  const quiz = state.gameplay.activeQuiz;
  const qIdx = state.gameplay.currentQuestionIndex;
  const questionObj = quiz.questions[qIdx];

  // Update indicators
  document.getElementById("arena-current-q-num").textContent = qIdx + 1;
  document.getElementById("arena-score-val").textContent = `${state.gameplay.score} XP`;
  
  // Progress Bar
  const progressPercent = (qIdx / quiz.questions.length) * 100;
  document.getElementById("arena-progress-bar").style.width = `${progressPercent}%`;

  // Question details
  document.getElementById("arena-question-tag").textContent = quiz.category;
  document.getElementById("arena-question-text").textContent = questionObj.question;

  // Options lists
  const optionsContainer = document.getElementById("arena-options-list");
  optionsContainer.innerHTML = "";

  questionObj.options.forEach((optionText, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C, D
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="option-letter">${letter}</span>
      <span class="option-text">${optionText}</span>
    `;
    
    btn.addEventListener("click", () => selectOption(idx));
    optionsContainer.appendChild(btn);
  });

  // Hide explanation
  document.getElementById("arena-explanation-panel").style.display = "none";

  // Action Button reset
  const actionBtn = document.getElementById("arena-action-btn");
  actionBtn.innerHTML = `Submit Answer <i data-lucide="check"></i>`;
  actionBtn.disabled = true;
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
  // If timer or options are disabled, ignore
  const buttons = document.querySelectorAll(".option-btn");
  if (buttons[0].disabled) return;

  selectedOptionIdx = optionIdx;

  buttons.forEach((btn, idx) => {
    if (idx === optionIdx) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });

  // Enable action button
  document.getElementById("arena-action-btn").disabled = false;
}

function handleTimeOut() {
  // Answer as incorrect since they ran out of time
  validateAnswer(-1);
}

function setupQuizArenaHandlers() {
  const actionBtn = document.getElementById("arena-action-btn");
  const quitBtn = document.getElementById("arena-quit-btn");

  actionBtn.addEventListener("click", () => {
    if (actionBtn.textContent.includes("Submit")) {
      // Validate
      clearInterval(state.gameplay.timerInterval);
      validateAnswer(selectedOptionIdx);
    } else {
      // Move on
      state.gameplay.currentQuestionIndex++;
      const quiz = state.gameplay.activeQuiz;
      
      if (state.gameplay.currentQuestionIndex < quiz.questions.length) {
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
  const questionObj = quiz.questions[qIdx];
  const correctIdx = questionObj.answer;
  
  const buttons = document.querySelectorAll(".option-btn");
  
  // Disable all options
  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = selectedIdx === correctIdx;
  const explanationPanel = document.getElementById("arena-explanation-panel");
  const explanationText = document.getElementById("arena-explanation-text");

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
    
    // Speed Demon check (answered in under 20% of the limit time limit)
    if (timeRatio > 0.8) {
      unlockBadge("speed_demon");
    }

    const timeBonus = Math.round(timeRatio * 50);
    const streakBonus = state.gameplay.streak > 1 ? (state.gameplay.streak - 1) * 10 : 0;
    const earnedXp = 100 + timeBonus + streakBonus;

    state.gameplay.score += earnedXp;

    // Show correct visual state
    if (selectedIdx >= 0) {
      buttons[selectedIdx].classList.add("correct");
    }

    // Streak UI animation
    const streakBox = document.getElementById("arena-streak");
    document.getElementById("arena-streak-val").textContent = state.gameplay.streak;
    if (state.gameplay.streak >= 2) {
      streakBox.classList.add("active");
    }
  } else {
    // Break streak
    state.gameplay.streak = 0;
    document.getElementById("arena-streak").classList.remove("active");

    // Show failure states
    if (selectedIdx >= 0) {
      buttons[selectedIdx].classList.add("incorrect");
    }
    buttons[correctIdx].classList.add("correct");
  }

  // Populate & Reveal Explanation
  explanationText.textContent = questionObj.explanation || "No explanation details provided.";
  explanationPanel.style.display = "block";

  // Check milestone streaks
  if (state.gameplay.streak >= 5) unlockBadge("streak_5");
  if (state.gameplay.streak >= 10) unlockBadge("streak_10");

  // Modify action button
  const actionBtn = document.getElementById("arena-action-btn");
  const isLastQuestion = qIdx === quiz.questions.length - 1;
  if (isLastQuestion) {
    actionBtn.innerHTML = `Finish Quiz <i data-lucide="award"></i>`;
  } else {
    actionBtn.innerHTML = `Next Question <i data-lucide="arrow-right"></i>`;
  }
  actionBtn.disabled = false;
  lucide.createIcons();
}

// --- FINISH QUIZ (RESULTS CALCULATIONS) ---
function finishQuiz() {
  const gameplay = state.gameplay;
  const quiz = gameplay.activeQuiz;
  const elapsedSeconds = Math.round((Date.now() - gameplay.startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const accuracyPct = Math.round((gameplay.correctCount / quiz.questions.length) * 100);

  // Update global user stats
  state.user.xp += gameplay.score;
  state.user.quizzesCompleted += 1;
  state.user.totalAnswers += quiz.questions.length;
  state.user.correctAnswers += gameplay.correctCount;

  // Badge updates based on performance
  unlockBadge("first_quiz");
  
  if (accuracyPct === 100) {
    unlockBadge("perfect_score");
  }

  if (accuracyPct >= 80) {
    if (quiz.category === "Tech") {
      unlockBadge("tech_master");
    } else if (quiz.category === "Science") {
      unlockBadge("space_explorer");
    }
  }

  // Persist User updates
  saveUserProfile();

  // Populate Results Screen
  document.getElementById("res-stat-xp").textContent = `+${gameplay.score} XP`;
  document.getElementById("res-stat-correct").textContent = `${gameplay.correctCount}/${quiz.questions.length}`;
  document.getElementById("res-stat-time").textContent = formattedTime;
  document.getElementById("res-stat-streak").textContent = gameplay.maxStreak;
  
  document.getElementById("results-score-pct").textContent = `${accuracyPct}%`;
  document.getElementById("results-subheading").textContent = `You finished the '${quiz.title}' quiz`;

  // Custom messages based on accuracy
  const resIcon = document.getElementById("results-icon");
  const resHeading = document.getElementById("results-heading");
  if (accuracyPct === 100) {
    resIcon.textContent = "👑";
    resHeading.textContent = "Flawless Victory!";
  } else if (accuracyPct >= 80) {
    resIcon.textContent = "🏆";
    resHeading.textContent = "Outstanding Performance!";
  } else if (accuracyPct >= 50) {
    resIcon.textContent = "🎓";
    resHeading.textContent = "Great Effort!";
  } else {
    resIcon.textContent = "💪";
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
        chip.innerHTML = `<span>${badgeObj.icon}</span> <strong>${badgeObj.title}</strong>`;
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
    const newQuiz = {
      id: uniqueId,
      title: title,
      description: description,
      category: category,
      difficulty: difficulty,
      timeLimit: timeLimit,
      questions: parsedQuestions
    };

    saveCustomQuiz(newQuiz);
    alert(`Success! '${title}' has been successfully published to your Dashboard.`);
    
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
