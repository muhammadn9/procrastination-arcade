// ========================================
Storage.init();
// Initialize storage on load

};
    }
        this.set(this.keys.CUSTOM_TASKS, filtered);
        const filtered = customTasks.filter(t => t.id !== taskId);
        const customTasks = this.get(this.keys.CUSTOM_TASKS);
    deleteCustomTask(taskId) {

    },
        this.set(this.keys.CUSTOM_TASKS, customTasks);
        });
            custom: true
            id: 'custom_' + Date.now(),
            ...task,
        customTasks.push({
        const customTasks = this.get(this.keys.CUSTOM_TASKS);
    addCustomTask(task) {
    // Custom Tasks

    },
        this.set(this.keys.HISTORY, history);

        }
            history.last7Days.shift();
        if (history.last7Days.length > 7) {
        // Keep only last 7 days

        }
            });
                lied: status === 'lied' ? 1 : 0
                half: status === 'half' ? 1 : 0,
                completed: status === 'completed' ? 1 : 0,
                date: today,
            history.last7Days.push({
        } else {
            todayEntry[status] = (todayEntry[status] || 0) + 1;
        if (todayEntry) {
        const todayEntry = history.last7Days.find(entry => entry.date === today);
        // Update last 7 days

        }
            history.totalLied++;
        } else if (status === 'lied') {
            history.totalHalfCompleted++;
        } else if (status === 'half') {
            history.totalCompleted++;
        if (status === 'completed') {
        // Update totals

        const today = new Date().toDateString();
        const history = this.get(this.keys.HISTORY);
    recordTaskCompletion(status) {
    // Task History

    },
        return lastCheckIn !== today;
        const today = new Date().toDateString();
        const lastCheckIn = this.get(this.keys.LAST_CHECK_IN);
    canCheckInToday() {

    },
        return { alreadyCheckedIn: false, newStreak };

        this.set(this.keys.LAST_CHECK_IN, today);
        this.set(this.keys.STREAK, newStreak);

        }
            newStreak = 0;
            // Break streak
        } else {
            }
                newStreak = 1;
            } else {
                newStreak = streak + 1;
            if (lastCheckIn === yesterdayStr) {
            // Continue or start streak
        if (wasProductive) {
        let newStreak;

        const yesterdayStr = yesterday.toDateString();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterday = new Date();
        const streak = this.get(this.keys.STREAK);

        }
            return { alreadyCheckedIn: true };
        if (lastCheckIn === today) {
        // Check if already checked in today

        const today = new Date().toDateString();
        const lastCheckIn = this.get(this.keys.LAST_CHECK_IN);
    updateStreak(wasProductive) {
    // Streak Management

    },
        this.set(this.keys.COSMETICS, cosmetics);

        });
            }
                }
                    cosmetics.unlockedPets.push(allPets[index]);
                if (!cosmetics.unlockedPets.includes(allPets[index])) {
            if (level === petLevel && index < allPets.length) {
        petLevels.forEach((petLevel, index) => {
        const petLevels = [7, 14, 21, 30];
        // Unlock pets at levels 7, 14, 21, 30

        });
            }
                }
                    cosmetics.unlockedHats.push(allHats[index]);
                if (!cosmetics.unlockedHats.includes(allHats[index])) {
            if (level === hatLevel && index < allHats.length) {
        hatLevels.forEach((hatLevel, index) => {
        const hatLevels = [3, 5, 8, 12, 16, 20];
        // Unlock hats at levels 3, 5, 8, 12, 16, 20

        }
            }
                cosmetics.unlockedColors.push(allColors[colorIndex]);
            if (colorIndex < allColors.length && !cosmetics.unlockedColors.includes(allColors[colorIndex])) {
            const colorIndex = Math.floor(level / 2);
        if (level % 2 === 0 && level <= 16) {
        // Unlock colors every 2 levels

        const allPets = ['blob', 'cat', 'ghost', 'robot'];
        const allHats = ['cap', 'crown', 'wizard', 'headphones', 'halo', 'horns'];
        const allColors = ['#FF6B9D', '#4ecca3', '#ffd93d', '#C06C84', '#6C5B7B', '#355C7D', '#ff6b6b', '#a8e6cf'];
        const cosmetics = this.get(this.keys.COSMETICS);
    checkCosmeticUnlocks(level) {

    },
        this.checkCosmeticUnlocks(newLevel);
        // Unlock cosmetics at certain levels

        this.set(this.keys.LEVEL, newLevel);
        const newLevel = currentLevel + 1;
        const currentLevel = this.get(this.keys.LEVEL);
    levelUp() {

    },
        return Math.floor(100 * level * (level + 1) / 2);
        // XP required: 100, 250, 450, 700, 1000, etc.
    getXPForLevel(level) {

    },
        return { leveledUp: false };

        }
            return { leveledUp: true, newLevel: currentLevel + 1 };
            this.levelUp();
        if (newXP >= xpForNextLevel) {
        const xpForNextLevel = this.getXPForLevel(currentLevel + 1);
        // Check for level up

        this.set(this.keys.XP, newXP);

        const newXP = currentXP + amount;
        const currentLevel = this.get(this.keys.LEVEL);
        const currentXP = this.get(this.keys.XP);
    addXP(amount) {
    // XP and Level Management

    },
        this.init();
        });
            localStorage.removeItem(key);
        Object.values(this.keys).forEach(key => {
    clear() {
    // Clear all game data

    },
        }
            console.error(`Error writing ${key}:`, e);
        } catch (e) {
            localStorage.setItem(key, JSON.stringify(value));
        try {
    set(key, value) {
    // Set value in localStorage

    },
        }
            return null;
            console.error(`Error reading ${key}:`, e);
        } catch (e) {
            return value ? JSON.parse(value) : null;
            const value = localStorage.getItem(key);
        try {
    get(key) {
    // Get value from localStorage

    },
        }
            });
                last7Days: []
                totalLied: 0,
                totalHalfCompleted: 0,
                totalCompleted: 0,
            this.set(this.keys.HISTORY, {
        if (!this.get(this.keys.HISTORY)) {
        if (!this.get(this.keys.CUSTOM_TASKS)) this.set(this.keys.CUSTOM_TASKS, []);
        if (!this.get(this.keys.ACTIVE_TASKS)) this.set(this.keys.ACTIVE_TASKS, []);
        }
            });
                activePet: null
                activeHat: null,
                activeColor: '#FF6B9D',
                unlockedDecorations: [],
                unlockedPets: [],
                unlockedHats: [],
                unlockedColors: ['#FF6B9D', '#4ecca3', '#ffd93d'], // Start with 3 colors
            this.set(this.keys.COSMETICS, {
        if (!this.get(this.keys.COSMETICS)) {
        if (!this.get(this.keys.LAST_CHECK_IN)) this.set(this.keys.LAST_CHECK_IN, null);
        if (!this.get(this.keys.STREAK)) this.set(this.keys.STREAK, 0);
        if (!this.get(this.keys.LEVEL)) this.set(this.keys.LEVEL, 1);
        if (!this.get(this.keys.XP)) this.set(this.keys.XP, 0);
    init() {
    // Initialize default game state

    },
        HISTORY: 'history'
        CUSTOM_TASKS: 'customTasks',
        ACTIVE_TASKS: 'activeTasks',
        COSMETICS: 'cosmetics',
        LAST_CHECK_IN: 'lastCheckIn',
        STREAK: 'streak',
        LEVEL: 'level',
        XP: 'xp',
    keys: {
    // Simplified key names for easy debugging
const Storage = {

// ========================================
// Handles all LocalStorage operations with simplified key names
// STORAGE MANAGER

