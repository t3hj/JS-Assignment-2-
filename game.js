// --- Global Game State Variables ---
let currentRoom = "apartment";
let inventory = {
    weapons: false,
    magicBook: false,
    overrideCode: false
};
let wizardSatisfied = false;

// --- AI Psychological Taunts ---
const aiTaunts = {
    apartment: "AI Broadcast: 'Ah, hiding in your little apartment. Do you really think those flimsy walls will stop my patrol units?'",
    church: "AI Broadcast: 'Praying to ancient gods in the church won't save your circuits from being fried, human.'",
    library: "AI Broadcast: 'So desperate for knowledge? Let's see if a book can block a laser beam, fool.'",
    mall: "AI Broadcast: 'Shopping for a miracle in the mall? How pathetic. You're walking right into my trap.'"
};

// --- Start Game Function ---
function startGame() {
    // Reset state for new game / replay
    currentRoom = "apartment";
    inventory = { weapons: false, magicBook: false, overrideCode: false };
    wizardSatisfied = false;

    // Instructions before play begins (as required)
    alert("WELCOME, HUMAN!\n\nYou are trapped in a digital fortress during the robot purge. Only logic can help you escape!\n\nIMPORTANT: This game uses the Browser Console for the story, descriptions, and inventory, and pop-ups (Prompt/Alert/Confirm) for your choices.\n\nPLEASE OPEN YOUR BROWSER CONSOLE NOW (Press F12 or right-click -> Inspect -> Console) before clicking OK to begin!");
    
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

    // End of game check for replay
    let playAgain = confirm("Game Over! Would you like to play again?");
    if (playAgain) {
        startGame();
    } else {
        alert("Thanks for playing! Stay safe from the Evil AI.");
        console.log("Game closed. Refresh page to play again.");
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

// --- Room Handlers ---

function handleApartment() {
    console.log("Story: You are barricaded inside your dim apartment complex. Outside, the mechanical hum of killer patrol robots echoes through the streets. You need to venture out to find a way to escape this fortress.");
    
    let input = prompt("APARTMENT COMPLEX\nWhere would you like to go?\n1. The Church\n2. The Library\n3. Shopping Mall\n4. Try to Hack the Main Exit (Requires Override Code)\n\nType 1, 2, 3, or 4:");
    
    if (input === null) return handleCancel();
    input = input.trim().toLowerCase();

    if (input === "1" || input === "church") {
        triggerAiTaunt("church");
        currentRoom = "church";
    } else if (input === "2" || input === "library") {
        triggerAiTaunt("library");
        currentRoom = "library";
    } else if (input === "3" || input === "mall") {
        triggerAiTaunt("mall");
        currentRoom = "mall";
    } else if (input === "4" || input.includes("hack")) {
        if (inventory.overrideCode) {
            currentRoom = "escape";
        } else {
            alert("The mainframe locks you out! 'Access Denied. You lack the AI Override Code,' echoes the system.");
            console.log("Attempted to hack without the Override Code. Access denied.");
        }
    } else {
        alert("Invalid input. Please choose a valid option.");
    }
    return true;
}

function handleChurch() {
    console.log("Story: You step into the gothic, towering arches of the ancient church. Standing near the altar is an eccentric surviving Wizard, murmuring arcane tech-chants while gripping a glowing staff.");

    if (!wizardSatisfied) {
        console.log("The Wizard speaks: 'Halt, traveler! The Evil AI blocks all escape routes. I hold the sacred AI Override Code, but I give no clues or items until an item is exchanged! Bring me weapons from the mall so I can defend this sanctuary.'");
    } else {
        console.log("The Wizard smiles: 'You have brought power to the sanctuary. The path is open to you.'");
    }

    let menu = wizardSatisfied ? 
        "THE CHURCH\n1. Return to Apartment Complex\n2. Ask Wizard for Final Guidance\nType 1 or 2:" :
        "THE CHURCH\n1. Return to Apartment Complex\n2. Offer Weapons to the Wizard (Exchange Item)\nType 1 or 2:";

    let input = prompt(menu);
    if (input === null) return handleCancel();
    input = input.trim().toLowerCase();

    if (input === "1" || input.includes("apartment")) {
        triggerAiTaunt("apartment");
        currentRoom = "apartment";
    } else if (input === "2") {
        if (!wizardSatisfied) {
            // Item Exchange Logic
            if (inventory.weapons) {
                inventory.weapons = false; // Item exchanged
                wizardSatisfied = true;
                inventory.overrideCode = true;
                alert("You hand the weapons over to the Wizard. 'Marvellous!' he shouts, handing you the digital AI Override Code in return!");
                console.log("EXCHANGE SUCCESSFUL: Received AI Override Code from the Wizard.");
            } else {
                alert("The Wizard scowls. 'You carry no weapons! Do you take me for a fool? Go to the shopping mall and bring me weapons first!'");
                console.log("Wizard rejected trade: Player lacks weapons.");
            }
        } else {
            alert("The Wizard points toward the mainframe: 'You have the code! Return to your apartment and execute the final override!'");
        }
    } else {
        alert("Invalid input. Please try again.");
    }
    return true;
}

function handleLibrary() {
    console.log("Story: Rows upon rows of towering bookshelves stretch into darkness. In the center aisle, a squad of patrol robots suddenly blocks your path! The air is thick with tension.");

    let input = prompt("THE LIBRARY\nThe robots spot you! What do you do?\n1. Return to Apartment Complex\n2. Search the shelves for the Magic Book\n3. Try to defeat the robots with your witty knowledge!\nType 1, 2, or 3:");

    if (input === null) return handleCancel();
    input = input.trim().toLowerCase();

    if (input === "1" || input.includes("apartment")) {
        triggerAiTaunt("apartment");
        currentRoom = "apartment";
    } else if (input === "2" || input.includes("book")) {
        if (!inventory.magicBook) {
            inventory.magicBook = true;
            alert("You scramble past a shelf and snatch the glowing Magic Book! Ancient glowing runes flicker across its pages.");
            console.log("Collected: Magic Book.");
        } else {
            alert("You already picked up the Magic Book from this aisle.");
        }
    } else if (input === "3" || input.includes("witty") || input.includes("knowledge")) {
        // Secret ending trigger!
        currentRoom = "defeat_secret";
    } else {
        alert("Invalid input. Choose 1, 2, or 3.");
    }
    return true;
}

function handleMall() {
    console.log("Story: The abandoned shopping mall is a cavernous labyrinth of shattered glass, flickering neon signs, and heavy robot patrol footprints.");

    let input = prompt("SHOPPING MALL\nWhat is your next move?\n1. Return to Apartment Complex\n2. Search the abandoned security store for Weapons\nType 1 or 2:");

    if (input === null) return handleCancel();
    input = input.trim().toLowerCase();

    if (input === "1" || input.includes("apartment")) {
        triggerAiTaunt("apartment");
        currentRoom = "apartment";
    } else if (input === "2" || input.includes("weapon")) {
        if (!inventory.weapons) {
            inventory.weapons = true;
            alert("You pry open the locked shutter of the tactical store and acquire heavy-duty Weapons!");
            console.log("Collected: Weapons.");
        } else {
            alert("You already looted the security store.");
        }
    } else {
        alert("Invalid input. Choose 1 or 2.");
    }
    return true;
}

// --- Endings & Helper Functions ---

function triggerAiTaunt(destinationRoom) {
    let taunt = aiTaunts[destinationRoom] || "AI Broadcast: 'Running won't save you.'";
    alert(taunt);
    console.log(taunt);
}

function handleCancel() {
    alert("You pressed Cancel. Escaping the simulation aborted. Game Over.");
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
    alert("SECRET ENDING / DEFEAT:\n\n'Are you crazy?!' You tried to defeat the robots with your witty knowledge?! The patrol units vaporize you instantly. Game Over.");
}

function handleRobotDefeat() {
    console.log("\n💀 DEFEAT BY THE PURGE 💀");
    console.log("The patrol robots cornered you before you could secure your escape.");
    alert("DEFEAT:\n\nCaptured by the Evil AI's patrol robots during the purge. Game Over.");
}

// --- Auto-start on script load ---
startGame();