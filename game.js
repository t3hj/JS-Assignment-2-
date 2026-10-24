// --- Game Settings ---
// Every trip between locations alerts the patrols. After this many trips,
// the next trip gets you caught by the robots.
const MAX_MOVES = 10;
 
// --- Global Game State Variables ---
let currentRoom = "apartment";
let inventory = {
    weapons: false,
    magicBook: false,
    overrideCode: false
};
let wizardSatisfied = false;
let robotsDefeated = false;
let moves = 0;
let endedByCancel = false;
 
// --- AI Psychological Taunts ---
const aiTaunts = {
    apartment: "AI Broadcast: 'Ah, hiding in your little apartment. Do you really think those flimsy walls will stop my patrol units?'",
    church: "AI Broadcast: 'Praying to ancient gods in the church won't save your circuits from being fried, human.'",
    library: "AI Broadcast: 'So desperate for knowledge? Let's see if a book can block a laser beam, fool.'",
    mall: "AI Broadcast: 'Shopping for a miracle in the mall? How pathetic. You're walking right into my trap.'"
};
 
// --- Start Game Function ---
function startGame(isReplay) {
    // Reset ALL state for a new game / replay
    currentRoom = "apartment";
    inventory = { weapons: false, magicBook: false, overrideCode: false };
    wizardSatisfied = false;
    robotsDefeated = false;
    moves = 0;
    endedByCancel = false;
 
    // Instructions before play begins (only on the first game, not on replays)
    if (!isReplay) {
        const ready = showWelcome();
        if (!ready) {
            endGameSafely();
            return;
        }
    }
 
    console.clear();
    console.log("==================================================");
    console.log("       ESCAPE THE EVIL AI: THE PURGE             ");
    console.log("==================================================");
 
    gameLoop();
}
 
// --- Main Game Loop ---
function gameLoop() {
    let playing = true;
 
    while (playing) {
        // Display current status in console
        console.log("\n--------------------------------------------------");
        console.log(`📍 Current Location: ${getRoomName(currentRoom)}`);
        console.log(`🎒 Inventory: Weapons: [${inventory.weapons ? '✅' : '❌'}] | Magic Book: [${inventory.magicBook ? '✅' : '❌'}] | AI Override Code: [${inventory.overrideCode ? '✅' : '❌'}]`);
        console.log(`⏱️ Trips left before the patrols find you: ${getMovesLeft()}`);
        console.log("--------------------------------------------------");
 
        // Handle room-specific logic and choices
        if (currentRoom === "apartment") {
            playing = handleApartment();
        } else if (currentRoom === "church") {
            playing = handleChurch();
        } else if (currentRoom === "library") {
            playing = handleLibrary();
        } else if (currentRoom === "mall") {
            playing = handleMall();
        } else if (currentRoom === "escape") {
            handleVictory();
            playing = false;
        } else if (currentRoom === "defeat_secret") {
            handleSecretDefeat();
            playing = false;
        } else if (currentRoom === "defeat_robots") {
            handleRobotDefeat();
            playing = false;
        }
    }
 
    // Player pressed Cancel in a prompt: end safely, no extra questions
    if (endedByCancel) {
        endGameSafely();
        return;
    }
 
    // Story ended: offer another game
    const won = (currentRoom === "escape");
    const endingText = won
        ? "YOU ESCAPED! You beat the Evil AI and made it out alive."
        : "GAME OVER. The Evil AI wins this time.";
    if (askRestart(endingText)) {
        startGame(true);
    } else {
        endGameSafely(won);
    }
}
 
// --- Helper: Room Display Names ---
function getRoomName(roomKey) {
    switch (roomKey) {
        case "apartment": return "Apartment Complex (Safe Zone)";
        case "church": return "The Church";
        case "library": return "The Library";
        case "mall": return "Shopping Mall";
        default: return roomKey;
    }
}
 
// --- Helper: Inventory as a readable list (used in the dialog status line) ---
function getInventoryList() {
    const items = [];
    if (inventory.weapons) items.push("Weapons");
    if (inventory.magicBook) items.push("Magic Book");
    if (inventory.overrideCode) items.push("AI Override Code");
    return items;
}
 
function getMovesLeft() {
    return Math.max(0, MAX_MOVES - moves);
}
 
function currentStatusLine() {
    return buildStatusLine(getRoomName(currentRoom), getInventoryList(), getMovesLeft());
}
 
// --- Helper: Travel between locations (this is what the patrol timer counts) ---
function travelTo(destination) {
    // No trips left: the robots catch you on the way
    if (moves >= MAX_MOVES) {
        currentRoom = "defeat_robots";
        return;
    }
 
    moves++;
 
    const taunt = aiTaunts[destination] || "AI Broadcast: 'Running won't save you.'";
    const warning = patrolWarning();
    showMessage(warning ? taunt + "\n\n" + warning : taunt);
 
    currentRoom = destination;
}
 
function patrolWarning() {
    const left = getMovesLeft();
    if (left === 0) {
        return "FINAL WARNING: the patrol robots are right behind you! Make one more trip and they will catch you.";
    }
    if (left <= 2) {
        return `WARNING: patrol robots are closing in! Only ${left} trips left before they find you.`;
    }
    return "";
}
 
// --- Room Handlers ---
 
function handleApartment() {
    const story = "You are barricaded inside your dim apartment complex. Outside, the mechanical hum of killer patrol robots echoes through the streets. You need to venture out to find a way to escape this fortress.";
    console.log("Story: " + story);
 
    const choice = askChoice(story, [
        { id: "church", label: "The Church" },
        { id: "library", label: "The Library" },
        { id: "mall", label: "Shopping Mall" },
        { id: "hack", label: "Try to Hack the Main Exit (Requires Override Code)" }
    ], currentStatusLine());
 
    if (choice === null) return handleCancel();
 
    if (choice === "church" || choice === "library" || choice === "mall") {
        travelTo(choice);
    } else if (choice === "hack") {
        if (inventory.overrideCode) {
            currentRoom = "escape";
        } else {
            showMessage("The mainframe locks you out! 'Access Denied. You lack the AI Override Code,' echoes the system.");
        }
    }
    return true;
}
 
function handleChurch() {
    let story = "You step into the gothic, towering arches of the ancient church. Standing near the altar is an eccentric surviving Wizard, murmuring arcane tech-chants while gripping a glowing staff.\n\n";
 
    if (!wizardSatisfied) {
        story += "The Wizard speaks: 'Halt, traveler! The Evil AI blocks all escape routes. I hold the sacred AI Override Code, but I give no clues or items until an item is exchanged! Bring me weapons from the mall so I can defend this sanctuary.'";
    } else {
        story += "The Wizard smiles: 'You have brought power to the sanctuary. The path is open to you.'";
    }
    console.log("Story: " + story);
 
    const options = [{ id: "apartment", label: "Return to Apartment Complex" }];
    if (wizardSatisfied) {
        options.push({ id: "guidance", label: "Ask Wizard for Final Guidance" });
    } else {
        options.push({ id: "offer", label: "Offer Weapons to the Wizard (Exchange Item)" });
    }
 
    const choice = askChoice(story, options, currentStatusLine());
 
    if (choice === null) return handleCancel();
 
    if (choice === "apartment") {
        travelTo("apartment");
    } else if (choice === "offer") {
        // Item Exchange Logic
        if (inventory.weapons) {
            inventory.weapons = false; // Item exchanged
            wizardSatisfied = true;
            inventory.overrideCode = true;
            showMessage("You hand the weapons over to the Wizard. 'Marvellous!' he shouts, handing you the digital AI Override Code in return!");
        } else {
            showMessage("The Wizard scowls. 'You carry no weapons! Do you take me for a fool? Go to the shopping mall and bring me weapons first!'");
        }
    } else if (choice === "guidance") {
        showMessage("The Wizard points toward the mainframe: 'You have the code! Return to your apartment and execute the final override!'");
    }
    return true;
}
 
function handleLibrary() {
    let story;
    if (robotsDefeated) {
        story = "The shattered remains of the patrol squad smoke in the center aisle. The library is eerily quiet now, and the towering bookshelves stretch into darkness.";
    } else {
        story = "Rows upon rows of towering bookshelves stretch into darkness. In the center aisle, a squad of patrol robots suddenly blocks your path! The air is thick with tension.";
    }
    console.log("Story: " + story);
 
    const options = [
        { id: "apartment", label: "Return to Apartment Complex" },
        { id: "book", label: "Search the shelves for the Magic Book" }
    ];
    // The fight is only available while the robots are still standing
    if (!robotsDefeated) {
        options.push({ id: "fight", label: "Try to defeat the robots with your witty knowledge!" });
    }
 
    const choice = askChoice(story, options, currentStatusLine());
 
    if (choice === null) return handleCancel();
 
    if (choice === "apartment") {
        travelTo("apartment");
    } else if (choice === "book") {
        if (!inventory.magicBook) {
            inventory.magicBook = true;
            showMessage("You scramble past a shelf and snatch the glowing Magic Book! Ancient glowing runes flicker across its pages, and they seem to pulse faster whenever you look at the robots.");
        } else {
            showMessage("You already picked up the Magic Book from this aisle.");
        }
    } else if (choice === "fight") {
        // Safety net: this choice can end the game, so make sure it was not a slip
        const hint = inventory.magicBook
            ? "The robots are heavily armed. In your hands, the Magic Book hums.\n\n"
            : "The robots are heavily armed, and you only have your wits.\n\n";
        const sure = confirm(
            hint +
            "Are you sure you want to take them on?\n\n" +
            "OK = fight them\n" +
            "Cancel = think again (the game continues)"
        );
 
        if (sure) {
            if (inventory.magicBook) {
                // The Magic Book decides the fight
                robotsDefeated = true;
                moves = Math.max(0, moves - 3); // Patrol network in chaos: you gain time
                showMessage("You raise the Magic Book and read the runes aloud. Blinding light floods the aisle, and the patrol robots shut down one by one. 'Knowledge is power!' you whisper.\n\nThe patrol network is thrown into chaos, buying you extra time.");
            } else {
                // Secret ending trigger!
                currentRoom = "defeat_secret";
            }
        }
    }
    return true;
}
 
function handleMall() {
    const story = "The abandoned shopping mall is a cavernous labyrinth of shattered glass, flickering neon signs, and heavy robot patrol footprints.";
    console.log("Story: " + story);
 
    const choice = askChoice(story, [
        { id: "apartment", label: "Return to Apartment Complex" },
        { id: "weapons", label: "Search the abandoned security store for Weapons" }
    ], currentStatusLine());
 
    if (choice === null) return handleCancel();
 
    if (choice === "apartment") {
        travelTo("apartment");
    } else if (choice === "weapons") {
        // Also check wizardSatisfied, otherwise the weapons could be looted
        // again after trading them to the Wizard (repeated reward)
        if (!inventory.weapons && !wizardSatisfied) {
            inventory.weapons = true;
            showMessage("You pry open the locked shutter of the tactical store and acquire heavy-duty Weapons!");
        } else {
            showMessage("You already looted the security store.");
        }
    }
    return true;
}
 
// --- Endings & Helper Functions ---
 
function handleCancel() {
    endedByCancel = true;
    console.log("Player aborted game via Cancel.");
    return false;
}
 
function handleVictory() {
    console.log("\n🎉 CONGRATULATIONS! SUCCESSFUL ESCAPE! 🎉");
    console.log("You entered the override code from the apartment terminal. The massive steel blast doors slide open, blinding you with sunlight as you escape the Evil AI's digital fortress into freedom!");
    alert("VICTORY!\n\nYou successfully used the AI Override Code obtained from the Wizard to unlock the fortress gates and escape the purge!");
}
 
function handleSecretDefeat() {
    console.log("\n💥 SECRET ENDING TRIGGERED 💥");
    console.log("Are you crazy?! You tried to defeat the killer robots with your witty knowledge?! Lasers blast in all directions.");
    alert("SECRET ENDING / DEFEAT:\n\n'Are you crazy?!' You tried to defeat the robots with your witty knowledge?! The patrol units vaporize you instantly. Game Over.\n\n(Perhaps something hidden in this library could have helped you...)");
}
 
function handleRobotDefeat() {
    console.log("\n💀 DEFEAT BY THE PURGE 💀");
    console.log("The patrol robots tracked you down after too many trips through the streets.");
    alert("DEFEAT:\n\nYou wandered the streets for too long. The patrol robots tracked you down and captured you. Game Over.");
}
 
 
// ============================================================================
// LUNA'S PART: UX & UI FLOW HELPERS
// prompt / alert / confirm handling, input sanitization, safe Cancel exits
// ============================================================================
 
/**
 * Welcome dialogs shown before the game begins. They work without the console open.
 * @returns {boolean} true to start, false if the player cancelled
 */
function showWelcome() {
    alert(
        "WELCOME, HUMAN!\n\n" +
        "You are trapped in the Evil AI's digital fortress during the robot purge. Only logic can help you escape!\n\n" +
        "HOW TO PLAY:\n" +
        "• Each turn you see where you are, what you carry and a numbered list of choices.\n" +
        "• Type a number (like 1) or the name of a choice, then click OK.\n" +
        "• Click Cancel at any time to leave the game.\n" +
        "• Items you find can be used later, so explore!\n\n" +
        "BEWARE: the patrol robots are hunting you. Every trip between locations brings them closer, so don't wander forever. Your status line shows how many trips you have left."
    );
 
    return confirm(
        "OPTIONAL: THE CONSOLE\n\n" +
        "Everything you need appears in these pop-ups. A full story log is also printed to the browser console. To open it:\n\n" +
        "• Chrome / Edge / Opera / Brave: F12 or Ctrl + Shift + I (Mac: Cmd + Option + I)\n" +
        "• Firefox: Ctrl + Shift + K (Mac: Cmd + Option + K)\n" +
        "• Safari: enable the Develop menu in Settings > Advanced, then Cmd + Option + C\n\n" +
        "Then click the 'Console' tab.\n\n" +
        "Click OK to begin, or Cancel to exit."
    );
}
 
/**
 * Shows a message to the player in a dialog AND in the console.
 * @param {string} text
 */
function showMessage(text) {
    console.log(text);
    alert(text);
}
 
/**
 * One-line status header so the player always knows where they are,
 * what they are carrying and how much time is left.
 * @param {string} locationName
 * @param {string[]} items
 * @param {number} [movesLeft]
 * @returns {string}
 */
function buildStatusLine(locationName, items, movesLeft) {
    const carrying = (items && items.length > 0) ? items.join(", ") : "nothing";
    let line = `LOCATION: ${locationName}  |  CARRYING: ${carrying}`;
    if (movesLeft !== undefined) {
        line += `  |  TRIPS LEFT: ${movesLeft}`;
    }
    return line;
}
 
/**
 * Shows a scene and a numbered list of choices, then validates the answer.
 * - Accepts the number, the label or the id, in any capitalization, with extra spaces.
 * - Invalid input shows a clear alert and asks again, so it can never change progress.
 * - Cancel returns null so the caller can end the game safely.
 * @param {string} sceneText
 * @param {{id: string, label: string}[]} options
 * @param {string} [statusLine]
 * @returns {string|null} the chosen option's id, or null if cancelled
 */
function askChoice(sceneText, options, statusLine) {
    const list = options.map((option, index) => `${index + 1}. ${option.label}`).join("\n");
 
    const message =
        (statusLine ? statusLine + "\n\n" : "") +
        sceneText + "\n\n" +
        "WHAT DO YOU DO?\n" +
        list + "\n\n" +
        "Type the number or the name of your choice. Click Cancel to exit.";
 
    while (true) {
        const input = prompt(message, "");
 
        // Cancel (or a blocked dialog): exit safely, no errors
        if (input === null) {
            return null;
        }
 
        // Ignore capitalization, surrounding spaces and repeated spaces
        const cleaned = input.trim().toLowerCase().replace(/\s+/g, " ");
 
        // 1) By number
        if (/^\d+$/.test(cleaned)) {
            const index = Number(cleaned) - 1;
            if (index >= 0 && index < options.length) {
                return options[index].id;
            }
        }
 
        // 2) By label or id
        const match = options.find(option =>
            option.label.toLowerCase() === cleaned || option.id.toLowerCase() === cleaned
        );
        if (match) {
            return match.id;
        }
 
        // Invalid: explain, log, and ask again. Game state is untouched.
        const shown = input.trim().slice(0, 30);
        console.log(`Invalid attempt: "${shown}". Nothing changed.`);
        if (cleaned === "") {
            alert("You didn't type anything!\n\nPlease type the number or name of one of the choices.\nNothing has changed.");
        } else {
            alert(`"${shown}" is not one of the choices.\n\nPlease type the number (1-${options.length}) or the name of a choice.\nNothing has changed.`);
        }
    }
}
 
/**
 * Offers another game at the end of the story.
 * @param {string} endingText
 * @returns {boolean} true to restart, false to stop
 */
function askRestart(endingText) {
    console.log(endingText);
    return confirm(
        endingText + "\n\n" +
        "Play again?\n" +
        "OK = start a new game (all progress is reset)\n" +
        "Cancel = Exit the game"
    );
}
 
/**
 * Message shown when the player cancels or declines to restart.
 */
function endGameSafely(won) {
    if (won) {
        showMessage("Congratulations on your escape, and thanks for playing! Refresh the page any time to play again.");
    } else {
        showMessage("Game ended. Thanks for playing! Refresh the page any time to play again.");
    }
}
 
 
// --- Auto-start on script load ---
startGame();
