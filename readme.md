# Escape the Evil AI: The Purge 🤖⚔️

A browser-based text adventure game built with JavaScript (`prompt()`, `alert()`, `confirm()`, and the `console`), HTML, and a touch of dystopian survival strategy. 

Developed as an advanced JavaScript assignment featuring modular functions, state management, interactive decision trees, and psychological AI taunts.

---

## 🌟 Features
- **Immersive Console & Pop-up Synergy:** Atmospheric storytelling, inventory tracking, and dynamic location updates are printed directly to the browser console, while choices and AI taunts occur via native `prompt()` and `alert()` pop-ups.
- **Multiple Locations:** Navigate between the *Apartment Complex*, *The Church*, *The Library*, and the *Shopping Mall*.
- **Item Exchange Mechanics:** The eccentric Wizard in the church won't hand over the crucial *AI Override Code* until you trade him weapons looted from the mall.
- **Secret & Multiple Endings:** 
  - Successful escape via the AI override terminal.
  - A hilarious secret ending for trying to defeat killer robots with "witty knowledge" in the library.
- **Robust Input Handling:** Gracefully handles invalid inputs, trailing spaces, capitalization, and cancellation prompts without crashing the game loop.
- **Full Replayability:** Re-triggers a clean game reset upon completion or restart.

---

## 🚀 How to Play

1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/t3hj/JS-Assignment-2-.git
   ```
2. Open your browser console **before** launching the game (Press `F12` or right-click -> `Inspect` -> `Console`).
3. Open `index.html` in any web browser.
4. Follow the pop-up prompts and read the console narrative to survive the purge and escape the Evil AI!

---

## 🛠️ Project Structure
- `index.html`: The HTML wrapper that loads the game script and instructs players on opening the console.
- `game.js`: Contains all core game logic, state handlers, room loops, and conditional routing.