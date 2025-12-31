// ========================================
// STORAGE MANAGER
// Handles all LocalStorage operations with simplified key names
// ========================================

const Storage = {
    // Simplified key names for easy debugging
    keys: {
        XP: 'xp',
        LEVEL: 'level',
        STREAK: 'streak',
        LAST_CHECK_IN: 'lastCheckIn',
        COSMETICS: 'cosmetics',
        ACTIVE_TASKS: 'activeTasks',
        CUSTOM_TASKS: 'customTasks',
        HISTORY: 'history',
        DAILY_TASKS_PREFIX: 'todayTasks_' // Prefix for daily task keys
    },

    // Initialize default game state
    init() {
        if (!this.get(this.keys.XP)) this.set(this.keys.XP, 0);
        if (!this.get(this.keys.LEVEL)) this.set(this.keys.LEVEL, 1);
        if (!this.get(this.keys.STREAK)) this.set(this.keys.STREAK, 0);
        if (!this.get(this.keys.LAST_CHECK_IN)) this.set(this.keys.LAST_CHECK_IN, null);
        if (!this.get(this.keys.COSMETICS)) {
            this.set(this.keys.COSMETICS, {
                unlockedColors: ['#FF6B9D', '#4ecca3', '#ffd93d'], // Start with 3 colors
                unlockedHats: [],
                unlockedPets: [],
                unlockedDecorations: [],
                activeColor: '#FF6B9D',
                activeHat: null,
                activePet: null
            });
        }
        if (!this.get(this.keys.ACTIVE_TASKS)) this.set(this.keys.ACTIVE_TASKS, []);
        if (!this.get(this.keys.CUSTOM_TASKS)) this.set(this.keys.CUSTOM_TASKS, []);
        if (!this.get(this.keys.HISTORY)) {
            this.set(this.keys.HISTORY, {
                totalCompleted: 0,
                totalHalfCompleted: 0,
                totalLied: 0,
                last7Days: []
            });
        }
    },

    // Get value from localStorage
    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return null;
        }
    },

    // Set value in localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error writing ${key}:`, e);
        }
    },

    // Clear all game data
    clear() {
        Object.values(this.keys).forEach(key => {
            // Skip the prefix constant
            if (key !== this.keys.DAILY_TASKS_PREFIX) {
                localStorage.removeItem(key);
            }
        });
        // Also clear all daily task entries
        this.clearAllDailyTasks();
        this.init();
    },

    // XP and Level Management
    addXP(amount) {
        const currentXP = this.get(this.keys.XP);
        const currentLevel = this.get(this.keys.LEVEL);
        const newXP = currentXP + amount;

        this.set(this.keys.XP, newXP);

        // Check for level up
        const xpForNextLevel = this.getXPForLevel(currentLevel + 1);
        if (newXP >= xpForNextLevel) {
            this.levelUp();
            return { leveledUp: true, newLevel: currentLevel + 1 };
        }

        return { leveledUp: false };
    },

    getXPForLevel(level) {
        // XP required: 100, 250, 450, 700, 1000, etc.
        return Math.floor(100 * level * (level + 1) / 2);
    },

    levelUp() {
        const currentLevel = this.get(this.keys.LEVEL);
        const newLevel = currentLevel + 1;
        this.set(this.keys.LEVEL, newLevel);

        // Unlock cosmetics at certain levels
        this.checkCosmeticUnlocks(newLevel);
    },

    checkCosmeticUnlocks(level) {
        const cosmetics = this.get(this.keys.COSMETICS);
        const allColors = ['#FF6B9D', '#4ecca3', '#ffd93d', '#C06C84', '#6C5B7B', '#355C7D', '#ff6b6b', '#a8e6cf'];
        const allHats = ['cap', 'crown', 'wizard', 'headphones', 'halo', 'horns'];
        const allPets = ['blob', 'cat', 'ghost', 'robot'];

        // Unlock colors every 2 levels
        if (level % 2 === 0 && level <= 16) {
            const colorIndex = Math.floor(level / 2);
            if (colorIndex < allColors.length && !cosmetics.unlockedColors.includes(allColors[colorIndex])) {
                cosmetics.unlockedColors.push(allColors[colorIndex]);
            }
        }

        // Unlock hats at levels 3, 5, 8, 12, 16, 20
        const hatLevels = [3, 5, 8, 12, 16, 20];
        hatLevels.forEach((hatLevel, index) => {
            if (level === hatLevel && index < allHats.length) {
                if (!cosmetics.unlockedHats.includes(allHats[index])) {
                    cosmetics.unlockedHats.push(allHats[index]);
                }
            }
        });

        // Unlock pets at levels 7, 14, 21, 30
        const petLevels = [7, 14, 21, 30];
        petLevels.forEach((petLevel, index) => {
            if (level === petLevel && index < allPets.length) {
                if (!cosmetics.unlockedPets.includes(allPets[index])) {
                    cosmetics.unlockedPets.push(allPets[index]);
                }
            }
        });

        this.set(this.keys.COSMETICS, cosmetics);
    },

    // Streak Management
    updateStreak(wasProductive) {
        const lastCheckIn = this.get(this.keys.LAST_CHECK_IN);
        const today = new Date().toDateString();

        // Check if already checked in today
        if (lastCheckIn === today) {
            return { alreadyCheckedIn: true };
        }

        const streak = this.get(this.keys.STREAK);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak;
        if (wasProductive) {
            // Continue or start streak
            if (lastCheckIn === yesterdayStr) {
                newStreak = streak + 1;
            } else {
                newStreak = 1;
            }
        } else {
            // Break streak
            newStreak = 0;
        }

        this.set(this.keys.STREAK, newStreak);
        this.set(this.keys.LAST_CHECK_IN, today);

        return { alreadyCheckedIn: false, newStreak };
    },

    canCheckInToday() {
        const lastCheckIn = this.get(this.keys.LAST_CHECK_IN);
        const today = new Date().toDateString();
        return lastCheckIn !== today;
    },

    // Task History
    recordTaskCompletion(status) {
        const history = this.get(this.keys.HISTORY);
        const today = new Date().toDateString();

        // Update totals
        if (status === 'completed') {
            history.totalCompleted++;
        } else if (status === 'half') {
            history.totalHalfCompleted++;
        } else if (status === 'lied') {
            history.totalLied++;
        }

        // Update last 7 days
        const todayEntry = history.last7Days.find(entry => entry.date === today);
        if (todayEntry) {
            todayEntry[status] = (todayEntry[status] || 0) + 1;
        } else {
            history.last7Days.push({
                date: today,
                completed: status === 'completed' ? 1 : 0,
                half: status === 'half' ? 1 : 0,
                lied: status === 'lied' ? 1 : 0
            });
        }

        // Keep only last 7 days
        if (history.last7Days.length > 7) {
            history.last7Days.shift();
        }

        this.set(this.keys.HISTORY, history);
    },

    // Custom Tasks
    addCustomTask(task) {
        const customTasks = this.get(this.keys.CUSTOM_TASKS);
        customTasks.push({
            ...task,
            id: 'custom_' + Date.now(),
            custom: true
        });
        this.set(this.keys.CUSTOM_TASKS, customTasks);
    },

    deleteCustomTask(taskId) {
        const customTasks = this.get(this.keys.CUSTOM_TASKS);
        const filtered = customTasks.filter(t => t.id !== taskId);
        this.set(this.keys.CUSTOM_TASKS, filtered);
    },

    // Daily Task Logging
    getDailyTasksKey(date) {
        // Generate key for a specific date
        return this.keys.DAILY_TASKS_PREFIX + date;
    },

    getDailyTasks(date) {
        // Get tasks for a specific date
        const key = this.getDailyTasksKey(date);
        return this.get(key) || [];
    },

    addDailyTask(date, taskText) {
        // Add a task to a specific date
        const tasks = this.getDailyTasks(date);
        tasks.push({
            text: taskText,
            time: new Date().toLocaleTimeString(),
            date: date
        });
        const key = this.getDailyTasksKey(date);
        this.set(key, tasks);
    },

    getAllDailyTaskKeys() {
        // Get all keys that match the daily tasks prefix
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.keys.DAILY_TASKS_PREFIX)) {
                keys.push(key);
            }
        }
        return keys;
    },

    clearOldDailyTasks(daysToKeep = 30) {
        // Remove daily task entries older than the specified number of days
        const today = new Date();
        const allKeys = this.getAllDailyTaskKeys();

        allKeys.forEach(key => {
            // Extract date from key (format: todayTasks_DateString)
            const dateStr = key.substring(this.keys.DAILY_TASKS_PREFIX.length);
            const taskDate = new Date(dateStr);

            // Skip invalid dates
            if (isNaN(taskDate.getTime())) return;

            // Calculate age in days
            const ageInDays = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));

            if (ageInDays > daysToKeep) {
                localStorage.removeItem(key);
            }
        });
    },

    clearAllDailyTasks() {
        // Remove all daily task entries
        const allKeys = this.getAllDailyTaskKeys();
        allKeys.forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

// Initialize storage on load
Storage.init();

