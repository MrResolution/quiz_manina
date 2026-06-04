# QuizMania 🧠

QuizMania is a premium, modern, and highly interactive quiz web platform designed with a sleek dark-mode glassmorphic interface, smooth animations, and rich gamification features. It is built as a highly responsive Single Page Application (SPA) using HTML, Vanilla CSS, and modular Vanilla JavaScript.

## 🚀 Key Features

* **Interactive Quiz Library**: Browse default quizzes across diverse categories (Tech, Science, Geography, History, Pop Culture) with varying difficulties.
* **Smart Gameplay Arena**:
  * Dynamic progress tracking.
  * Sleek circular countdown timer that visually updates.
  * Flame-animated correct-answer streaks.
  * Instant feedback highlighting the correct/incorrect selections alongside detailed explanations.
* **Quiz Builder Studio**: Design, build, and publish custom quizzes. Built quizzes persist locally and are integrated into the main library.
* **Gamified Progression**:
  * Earn XP to level up.
  * Interactive Leaderboard showing ranking position compared to competing players.
  * Badge Vault showcasing unlocked trophies (e.g., *Speed Demon*, *Trivia King*, *Grand Builder*).
* **Responsive Desktop Layout**: Desktop-first layout utilizing modern CSS grids, flexboxes, and floating glowing graphics.

## 🛠️ Technology Stack

* **Structure**: HTML5 Semantic Elements
* **Styling**: Vanilla CSS3 (Custom design tokens, glassmorphism, variable gradients, keyframe animations)
* **Iconography**: [Lucide Icons](https://lucide.dev/)
* **Logic**: Vanilla ES6 JavaScript (State management, browser storage persistence, SVG canvas timer math)

## 💻 Running the Platform Locally

To serve the files locally, use Python's built-in HTTP server or any local server of your choice:

1. Clone or download this repository.
2. Navigate to the root directory and start the server:
   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1
   ```
3. Open your web browser and navigate to:
   ```
   http://127.0.0.1:8080/
   ```

## 📂 Project Structure

```
├── index.html     # SPA layout templates and forms
├── style.css      # Core style definitions & animations
├── app.js         # State logic, quiz repository & interaction scripts
└── README.md      # Platform documentation
```
