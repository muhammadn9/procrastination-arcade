// ========================================
// DIALOGUE SYSTEM
// Contains all NPC personalities and responses
// ========================================

const Dialogue = {
    // Task Machine - Robotic/Cynical personality
    taskMachine: {
        greetings: [
            "TASK DISPENSED. FULFILLMENT UNLIKELY.",
            "PRODUCTIVITY MODULE ACTIVATED. COMPLIANCE OPTIONAL.",
            "GENERATING OBLIGATION... COMPLETE.",
            "DISPENSING RESPONSIBILITY. PLEASE HOLD.",
            "INITIATING GUILT SEQUENCE...",
            "ERROR 404: MOTIVATION NOT FOUND. TASK ASSIGNED ANYWAY.",
            "CALCULATING OPTIMAL PROCRASTINATION RATIO...",
            "TASK READY. YOUR EXCUSE READY TOO?",
            "BEEP BOOP. DO THE THING.",
            "SYSTEM SUGGESTS: STOP AVOIDING LIFE."
        ],
        onComplete: [
            "TASK COMPLETE. IMPRESSED.EXE LOADING...",
            "COMPLETION REGISTERED. DOPAMINE APPROVED.",
            "YOU DID IT? SYSTEM CONFUSED BUT PLEASED.",
            "PROCESSING... GOOD JOB, HUMAN.",
            "PRODUCTIVITY DETECTED. RARE EVENT LOGGED.",
            "TASK MARKED COMPLETE. NEXT TASK IN 3... 2... 1...",
            "SUCCESS ACKNOWLEDGED. DON'T GET COCKY."
        ],
        onHalf: [
            "PARTIAL COMPLETION. BETTER THAN NOTHING.EXE",
            "50% EFFORT DETECTED. TYPICAL.",
            "HALF-TASK LOGGED. COMMITMENT ISSUES NOTED.",
            "MEDIOCRITY ACCEPTED. BARELY.",
            "TASK STATUS: MEH. MOVING ON."
        ],
        onLied: [
            "LIE DETECTED. DATABASE UPDATED: UNTRUSTWORTHY.",
            "DISHONESTY PROTOCOLS ENGAGED. JUDGMENT MODE: MAXIMUM.",
            "SYSTEM KNOWS. SYSTEM ALWAYS KNOWS.",
            "TASK STATUS: FICTIONAL. LIKE YOUR MOTIVATION.",
            "ERROR: HONESTY.EXE NOT FOUND."
        ]
    },

    // Mirror NPC - Philosophical/Guilt-Trippy personality
    mirror: {
        greetings: [
            "The reflection never lies. Unlike you, sometimes.",
            "Look deep. What do you see? Potential? Or excuses?",
            "Mirror, mirror on the wall... are you productive at all?",
            "Be honest. The mirror already knows.",
            "Reflect on your choices. The mirror reflects your truth.",
            "Stare into the abyss of your to-do list.",
            "The mirror shows what you could be. If you tried.",
            "Honesty hurts. But so does avoiding responsibility.",
            "What you see is what you get. Are you proud?"
        ],
        onYes: [
            "Your honesty is refreshing. Keep this energy.",
            "Productive AND honest? A rare combination.",
            "The mirror reflects growth. Well done.",
            "You earned this moment. Embrace it.",
            "Today was yours. Tomorrow could be too.",
            "The reflection smiles. Finally.",
            "Consistency breeds success. You're on the path."
        ],
        onKinda: [
            "Partial honesty. Partial effort. Perfectly average.",
            "The mirror sees the 'kinda.' It always does.",
            "'Kinda' is better than 'not at all.' Progress.",
            "Half-truths for half-efforts. Fair trade.",
            "The reflection shrugs. At least you tried... kinda.",
            "Could be worse. Could be better. Could be honest.",
            "The mirror accepts your mediocrity. For now."
        ],
        onNo: [
            "Honesty in defeat is still honesty. Tomorrow exists.",
            "The mirror doesn't judge. It just... reflects.",
            "Today was not your day. But you admitted it.",
            "Unproductive, yes. But honest. There's honor in that.",
            "The reflection looks tired. So do you. Rest, then try.",
            "Failure acknowledged. Growth begins here.",
            "Not every day is golden. But every day is a chance."
        ],
        streakMessages: {
            high: [
                "Your {streak}-day streak glows in the reflection. Radiant.",
                "The mirror remembers your {streak} days of truth. Impressive.",
                "{streak} days of honesty. The mirror is proud."
            ],
            broken: [
                "The streak is broken. The mirror doesn't judge... much.",
                "Zero days. A clean slate. Start again.",
                "The reflection resets. So can you."
            ]
        }
    },

    // Roulette Wheel - Chaotic/Manic personality
    roulette: {
        greetings: [
            "SPIN SPIN SPIN! Chaos demands productivity!",
            "WHEEL OF FORTUNE! (the productive kind)",
            "Let fate decide your responsibility!",
            "Round and round! What task will destiny choose?",
            "CHAOS WHEEL ACTIVATED! Embrace the unknown!",
            "Spin for glory! Or at least... task completion!",
            "The wheel decides! You obey! FUN!",
            "Random task incoming! BRACE YOURSELF!",
            "Fate is a wheel! And the wheel is spinning!",
            "SPIN IT! SPIN IT! PRODUCTIVITY ROULETTE!"
        ],
        spinning: [
            "Spinning... spinning... SPINNING!",
            "The wheel decides your fate!",
            "Round and round it goes!",
            "Where it stops, nobody knows!",
            "MAXIMUM CHAOS ENGAGED!"
        ],
        landed: [
            "FATE HAS SPOKEN! Do the thing!",
            "The wheel has chosen! No take-backs!",
            "DESTINY DEMANDS THIS TASK!",
            "Chaos selected! Now execute!",
            "THE WHEEL NEVER LIES! Unlike you!"
        ]
    },

    // Couch - Completely silent (comedic effect)
    couch: {
        // No dialogue. The couch says nothing. Ever.
        // This is intentional and funny.
    },

    // Helper function to get random dialogue
    getRandom(dialogueArray) {
        return dialogueArray[Math.floor(Math.random() * dialogueArray.length)];
    },

    // Get Task Machine dialogue
    getTaskMachineGreeting() {
        return this.getRandom(this.taskMachine.greetings);
    },

    getTaskMachineResponse(status) {
        if (status === 'completed') return this.getRandom(this.taskMachine.onComplete);
        if (status === 'half') return this.getRandom(this.taskMachine.onHalf);
        if (status === 'lied') return this.getRandom(this.taskMachine.onLied);
    },

    // Get Mirror dialogue
    getMirrorGreeting() {
        return this.getRandom(this.mirror.greetings);
    },

    getMirrorResponse(answer, streak) {
        let response = '';

        if (answer === 'yes') response = this.getRandom(this.mirror.onYes);
        else if (answer === 'kinda') response = this.getRandom(this.mirror.onKinda);
        else if (answer === 'no') response = this.getRandom(this.mirror.onNo);

        // Add streak-specific message
        if (streak > 3) {
            response += '\n\n' + this.getRandom(this.mirror.streakMessages.high).replace('{streak}', streak);
        } else if (streak === 0 && answer === 'no') {
            response += '\n\n' + this.getRandom(this.mirror.streakMessages.broken);
        }

        return response;
    },

    // Get Roulette dialogue
    getRouletteGreeting() {
        return this.getRandom(this.roulette.greetings);
    },

    getRouletteSpinning() {
        return this.getRandom(this.roulette.spinning);
    },

    getRouletteLanded() {
        return this.getRandom(this.roulette.landed);
    }
};

