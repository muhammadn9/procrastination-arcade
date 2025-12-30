// ========================================
// TASK SYSTEM
// 50+ categorized tasks with easy expansion
// ========================================

const Tasks = {
    // Task categories with base tasks
    categories: {
        clean: [
            { text: "Wash 3 dishes in your sink", duration: "⏱️", unlockLevel: 1 },
            { text: "Make your bed right now", duration: "⏱️", unlockLevel: 1 },
            { text: "Clear one surface (desk, table, counter)", duration: "⏱️", unlockLevel: 1 },
            { text: "Take out the trash or recycling", duration: "⏱️", unlockLevel: 1 },
            { text: "Wipe down your bathroom sink", duration: "⏱️", unlockLevel: 1 },
            { text: "Organize one drawer", duration: "⏰", unlockLevel: 2 },
            { text: "Vacuum or sweep one room", duration: "⏰", unlockLevel: 2 },
            { text: "Clean your computer keyboard", duration: "⏱️", unlockLevel: 1 },
            { text: "Wash your water bottle or coffee mug", duration: "⏱️", unlockLevel: 1 },
            { text: "Dust one shelf or surface", duration: "⏱️", unlockLevel: 1 },
            { text: "Sort through old papers and recycle", duration: "⏰", unlockLevel: 3 },
            { text: "Clean your phone screen", duration: "⏱️", unlockLevel: 1 }
        ],

        learn: [
            { text: "Read 2 pages of any book", duration: "⏱️", unlockLevel: 1 },
            { text: "Watch a 5-minute educational video", duration: "⏱️", unlockLevel: 1 },
            { text: "Learn 3 new words in another language", duration: "⏱️", unlockLevel: 1 },
            { text: "Read one article about something interesting", duration: "⏰", unlockLevel: 2 },
            { text: "Listen to 10 minutes of a podcast", duration: "⏰", unlockLevel: 1 },
            { text: "Practice a skill for 5 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Read the news for 5 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Watch a TED talk", duration: "⏰", unlockLevel: 2 },
            { text: "Learn one new fact and share it with someone", duration: "⏱️", unlockLevel: 1 },
            { text: "Read about a topic you know nothing about", duration: "⏰", unlockLevel: 2 },
            { text: "Take notes on something you learned today", duration: "⏱️", unlockLevel: 1 },
            { text: "Research one thing you've been curious about", duration: "⏰", unlockLevel: 2 }
        ],

        move: [
            { text: "Stand up and stretch for 3 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Do 10 jumping jacks", duration: "⏱️", unlockLevel: 1 },
            { text: "Walk around your space for 5 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Do 5 push-ups (or wall push-ups)", duration: "⏱️", unlockLevel: 1 },
            { text: "Touch your toes 10 times", duration: "⏱️", unlockLevel: 1 },
            { text: "Dance to one full song", duration: "⏱️", unlockLevel: 1 },
            { text: "Do 20 seconds of planking", duration: "⏱️", unlockLevel: 1 },
            { text: "Walk up and down stairs twice", duration: "⏱️", unlockLevel: 1 },
            { text: "Do 10 squats", duration: "⏱️", unlockLevel: 1 },
            { text: "Stretch your neck and shoulders", duration: "⏱️", unlockLevel: 1 },
            { text: "Go outside for 5 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Do arm circles for 1 minute", duration: "⏱️", unlockLevel: 1 }
        ],

        focus: [
            { text: "Write 3 sentences about anything", duration: "⏱️", unlockLevel: 1 },
            { text: "List 5 things you're grateful for", duration: "⏱️", unlockLevel: 1 },
            { text: "Meditate or breathe deeply for 2 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Brain dump: write down everything on your mind", duration: "⏰", unlockLevel: 2 },
            { text: "Plan tomorrow's top 3 priorities", duration: "⏱️", unlockLevel: 1 },
            { text: "Journal about your day so far", duration: "⏰", unlockLevel: 2 },
            { text: "Set one small goal for today", duration: "⏱️", unlockLevel: 1 },
            { text: "Doodle or sketch for 5 minutes", duration: "⏱️", unlockLevel: 1 },
            { text: "Close your eyes and count to 50", duration: "⏱️", unlockLevel: 1 },
            { text: "Write down one problem and one solution", duration: "⏱️", unlockLevel: 1 },
            { text: "Describe your perfect day in detail", duration: "⏰", unlockLevel: 2 },
            { text: "Free write for 5 minutes without stopping", duration: "⏱️", unlockLevel: 1 }
        ],

        lifeAdmin: [
            { text: "Delete 10 old photos from your phone", duration: "⏱️", unlockLevel: 1 },
            { text: "Unsubscribe from 3 unwanted emails", duration: "⏱️", unlockLevel: 1 },
            { text: "Reply to one message you've been avoiding", duration: "⏱️", unlockLevel: 1 },
            { text: "Pay one bill or check your account", duration: "⏰", unlockLevel: 2 },
            { text: "Schedule one appointment you've been delaying", duration: "⏰", unlockLevel: 3 },
            { text: "Update one password to something secure", duration: "⏱️", unlockLevel: 1 },
            { text: "Clear 20 unread emails", duration: "⏰", unlockLevel: 2 },
            { text: "Backup one important file", duration: "⏱️", unlockLevel: 1 },
            { text: "Add one event to your calendar", duration: "⏱️", unlockLevel: 1 },
            { text: "Check your to-do list and cross off completed items", duration: "⏱️", unlockLevel: 1 },
            { text: "Organize your phone's home screen", duration: "⏱️", unlockLevel: 1 },
            { text: "Delete 5 unused apps", duration: "⏱️", unlockLevel: 1 },
            { text: "Clear your browser tabs", duration: "⏱️", unlockLevel: 1 },
            { text: "Make a quick shopping list", duration: "⏱️", unlockLevel: 1 }
        }
    },

    // Get all available tasks (base + custom)
    getAllTasks() {
        const customTasks = Storage.get(Storage.keys.CUSTOM_TASKS) || [];
        const playerLevel = Storage.get(Storage.keys.LEVEL);

        // Flatten all base tasks
        let allBaseTasks = [];
        Object.keys(this.categories).forEach(category => {
            const categoryTasks = this.categories[category]
                .filter(task => task.unlockLevel <= playerLevel)
                .map(task => ({
                    ...task,
                    category,
                    id: `${category}_${allBaseTasks.length}`
                }));
            allBaseTasks = [...allBaseTasks, ...categoryTasks];
        });

        return [...allBaseTasks, ...customTasks];
    },

    // Get tasks by category
    getTasksByCategory(category) {
        const playerLevel = Storage.get(Storage.keys.LEVEL);
        return this.categories[category]
            .filter(task => task.unlockLevel <= playerLevel)
            .map((task, index) => ({
                ...task,
                category,
                id: `${category}_${index}`
            }));
    },

    // Get random task with weighted selection
    getRandomTask() {
        const allTasks = this.getAllTasks();

        if (allTasks.length === 0) {
            return {
                id: 'default',
                category: 'focus',
                text: "Take a deep breath and try again",
                duration: "⏱️",
                unlockLevel: 1
            };
        }

        // Simple random selection (can add weights later if needed)
        const randomIndex = Math.floor(Math.random() * allTasks.length);
        return allTasks[randomIndex];
    },

    // Get random task from specific category
    getRandomTaskFromCategory(category) {
        const categoryTasks = this.getTasksByCategory(category);

        if (categoryTasks.length === 0) {
            return this.getRandomTask();
        }

        const randomIndex = Math.floor(Math.random() * categoryTasks.length);
        return categoryTasks[randomIndex];
    },

    // Validate custom task
    validateCustomTask(taskData) {
        if (!taskData.text || taskData.text.trim().length < 5) {
            return { valid: false, error: "Task must be at least 5 characters" };
        }

        if (!taskData.category || !this.categories[taskData.category]) {
            return { valid: false, error: "Invalid category" };
        }

        if (!taskData.duration) {
            return { valid: false, error: "Duration icon required" };
        }

        return { valid: true };
    },

    // Add custom task
    addCustomTask(text, category, duration) {
        const taskData = {
            text: text.trim(),
            category,
            duration,
            unlockLevel: 1
        };

        const validation = this.validateCustomTask(taskData);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        Storage.addCustomTask(taskData);
        return { success: true };
    },

    // Delete custom task
    deleteCustomTask(taskId) {
        Storage.deleteCustomTask(taskId);
    },

    // Get task statistics
    getStats() {
        const history = Storage.get(Storage.keys.HISTORY);
        const total = history.totalCompleted + history.totalHalfCompleted + history.totalLied;

        return {
            total,
            completed: history.totalCompleted,
            half: history.totalHalfCompleted,
            lied: history.totalLied,
            completionRate: total > 0 ? Math.round((history.totalCompleted / total) * 100) : 0,
            lyingProbability: total > 0 ? Math.round((history.totalLied / total) * 100) : 0
        };
    },

    // Generate shareable text
    generateShareText(taskText) {
        const stats = this.getStats();
        const streak = Storage.get(Storage.keys.STREAK);

        let shareText = `Today I completed: "${taskText}"\n\n`;

        // Add sarcastic lying probability
        if (stats.lyingProbability > 50) {
            shareText += `Lying probability: ${stats.lyingProbability}% (impressive)\n`;
        } else if (stats.lyingProbability > 20) {
            shareText += `Lying probability: ${stats.lyingProbability}% (not bad)\n`;
        } else {
            shareText += `Lying probability: ${stats.lyingProbability}% (surprisingly honest)\n`;
        }

        // Add streak if exists
        if (streak > 0) {
            shareText += `Productivity streak: ${streak} day${streak > 1 ? 's' : ''} 🔥\n`;
        }

        shareText += `\nProcrastination Arcade - Where avoiding work is... work?`;

        return shareText;
    }
};

