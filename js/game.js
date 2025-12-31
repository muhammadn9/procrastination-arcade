// ========================================
// MAIN GAME CLASS
// Core game loop and orchestration
// ========================================

const Game = {
    canvas: null,
    ctx: null,
    player: null,
    world: null,
    lastTime: 0,
    running: false,
    nearObject: null,
    screenShake: null,

    // Initialize game
    init() {
        console.log('🎮 Game.init() called');

        this.canvas = document.getElementById('game-canvas');
        console.log('Canvas element:', this.canvas);

        if (!this.canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas context:', this.ctx);

        // Setup canvas
        this.resizeCanvas();
        console.log('Canvas resized:', this.canvas.width, 'x', this.canvas.height);

        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize systems
        try {
            console.log('Initializing Controls...');
            Controls.init();

            console.log('Initializing UI...');
            UI.init();

            // Create player at center
            console.log('Creating player...');
            this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
            console.log('Player created at:', this.player.x, this.player.y);

            // Create world with canvas dimensions
            console.log('Creating world...');
            this.world = new World(this.canvas.width, this.canvas.height);
            console.log('World created with', this.world.objects.length, 'objects');

            // Start game loop
            this.running = true;
            this.lastTime = performance.now();
            console.log('Starting game loop...');
            this.gameLoop(this.lastTime);

            console.log('✅ Procrastination Arcade initialized!');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    },

    // Resize canvas to fit window
    resizeCanvas() {
        const container = document.getElementById('game-container');

        if (!container) {
            console.error('❌ Game container not found!');
            return;
        }

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Set canvas internal size
        this.canvas.width = width;
        this.canvas.height = height;

        // Set canvas display size (same as internal for now, simpler)
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        console.log('Canvas resized to:', width, 'x', height);

        if (this.world) {
            this.world.resize(width, height);
        }
    },

    // Main game loop
    gameLoop(currentTime) {
        if (!this.running) return;

        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update
        this.update(deltaTime);

        // Draw
        this.draw();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    },

    // Update game state
    update(deltaTime) {
        // Get player movement
        const movement = Controls.getMovementVector();

        // Update player
        this.player.update(deltaTime, movement);

        // Update world
        this.world.update(deltaTime);

        // Check for nearby objects
        this.nearObject = this.world.checkInteraction(this.player);
        UI.showInteractionPrompt(this.nearObject !== null);

        // Update screen shake
        if (this.screenShake) {
            this.screenShake.time += deltaTime;
            if (this.screenShake.time >= this.screenShake.duration) {
                this.screenShake = null;
            }
        }
    },

    // Draw game
    draw() {
        // Debug: Check if draw is being called
        if (!this._drawLogged) {
            console.log('🎨 Draw method called');
            console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
            console.log('Context:', this.ctx);
            this._drawLogged = true;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply screen shake
        this.ctx.save();
        if (this.screenShake) {
            const progress = this.screenShake.time / this.screenShake.duration;
            const intensity = this.screenShake.intensity * (1 - progress);
            const shakeX = (Math.random() - 0.5) * intensity;
            const shakeY = (Math.random() - 0.5) * intensity;
            this.ctx.translate(shakeX, shakeY);
        }

        // Draw world
        this.world.draw(this.ctx);

        // Draw player
        this.player.draw(this.ctx);

        // Draw particles
        UI.updateParticles(1/60, this.ctx);

        this.ctx.restore();
    },

    // Handle interaction
    handleInteract() {
        if (this.nearObject) {
            this.nearObject.onInteract();
        }
    },

    // Show Task Machine interaction
    showTaskMachine() {
        const greeting = Dialogue.getTaskMachineGreeting();
        const task = Tasks.getRandomTask();

        const content = `
            <p>${greeting}</p>
            <br>
            <p><strong>${task.text}</strong></p>
            <p>Duration: ${task.duration} Category: ${task.category.toUpperCase()}</p>
        `;

        const buttons = [
            {
                text: 'Accept Task',
                class: 'btn-primary',
                onClick: () => {
                    UI.showActiveTask(task.text);
                    setTimeout(() => {
                        UI.showTaskCompletion(task);
                    }, 100);
                }
            },
            {
                text: 'Nope',
                onClick: () => {}
            }
        ];

        UI.showModal('TASK MACHINE', content, buttons);
    },

    // Show Mirror interaction
    showMirror() {
        if (!Storage.canCheckInToday()) {
            const content = `
                <p>You've already reflected today.</p>
                <p>Come back tomorrow for your daily check-in.</p>
            `;
            UI.showModal('MIRROR', content, [
                { text: 'OK', onClick: () => {} }
            ]);
            return;
        }

        const greeting = Dialogue.getMirrorGreeting();

        const content = `<p>${greeting}</p><br><p>Were you productive today?</p>`;

        const buttons = [
            {
                text: 'Yes',
                class: 'btn-success',
                onClick: () => this.handleMirrorResponse('yes')
            },
            {
                text: 'Kinda',
                class: 'btn-warning',
                onClick: () => this.handleMirrorResponse('kinda')
            },
            {
                text: 'No',
                class: 'btn-danger',
                onClick: () => this.handleMirrorResponse('no')
            }
        ];

        UI.showModal('MIRROR', content, buttons);
    },

    // Handle mirror response
    handleMirrorResponse(answer) {
        const wasProductive = answer === 'yes';
        const result = Storage.updateStreak(wasProductive);
        const response = Dialogue.getMirrorResponse(answer, result.newStreak);

        const content = `
            <p>${response}</p>
            <br>
            <p>Current Streak: ${result.newStreak} day${result.newStreak !== 1 ? 's' : ''} 🔥</p>
        `;

        UI.showModal('REFLECTION', content, [
            { text: 'Thanks', onClick: () => {} }
        ]);

        UI.updateHUD();
    },

    // Show Roulette interaction
    showRoulette() {
        const greeting = Dialogue.getRouletteGreeting();

        const content = `<p>${greeting}</p>`;

        const buttons = [
            {
                text: '🎰 SPIN IT!',
                class: 'btn-primary',
                onClick: () => this.spinRoulette()
            },
            {
                text: 'Maybe later',
                onClick: () => {}
            }
        ];

        UI.showModal('ROULETTE WHEEL', content, buttons);
    },

    // Spin roulette (with visual animation placeholder)
    spinRoulette() {
        const spinText = Dialogue.getRouletteSpinning();
        const content = `<p style="animation: spin 1s linear infinite;">🎰</p><p>${spinText}</p>`;

        UI.showModal('SPINNING...', content, []);

        // Simulate spin duration
        setTimeout(() => {
            const task = Tasks.getRandomTask();
            const landed = Dialogue.getRouletteLanded();

            const resultContent = `
                <p>${landed}</p>
                <br>
                <p><strong>${task.text}</strong></p>
                <p>Duration: ${task.duration} Category: ${task.category.toUpperCase()}</p>
            `;

            const buttons = [
                {
                    text: 'Accept Fate',
                    class: 'btn-primary',
                    onClick: () => {
                        UI.showActiveTask(task.text);
                        setTimeout(() => {
                            UI.showTaskCompletion(task);
                        }, 100);
                    }
                },
                {
                    text: 'Defy Destiny',
                    onClick: () => {}
                }
            ];

            UI.showModal('ROULETTE RESULT', resultContent, buttons);
        }, 2000);
    },

    // V2: Show Desk Task Logging Interface
    showDeskTaskLog() {
        const today = new Date().toDateString();
        const todayTasks = Storage.get('todayTasks_' + today) || [];

        const taskListParts = [];
        taskListParts.push('<div style="max-height: 200px; overflow-y: auto; margin: 16px 0; text-align: left;">');
        if (todayTasks.length === 0) {
            taskListParts.push('<p style="color: #b0b0b0; font-size: 10px;">No tasks logged today yet. Start being productive!</p>');
        } else {
            todayTasks.forEach((task, index) => {
                taskListParts.push(`
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; margin: 4px 0; font-size: 10px; border-left: 3px solid #4ecca3;">
                        <strong>${index + 1}.</strong> ${task.text}
                        <div style="color: #4ecca3; font-size: 8px; margin-top: 4px;">
                            ✓ Done at ${task.time}
                        </div>
                    </div>
                `);
            });
        }
        taskListParts.push('</div>');
        const taskListHTML = taskListParts.join('');

        const content = `
            <p style="margin-bottom: 12px;">📝 What did you accomplish today?</p>
            ${taskListHTML}
            <input
                type="text"
                id="desk-task-input"
                placeholder="e.g., Finished project proposal, Cleaned desk..."
                style="width: 100%; padding: 8px; margin: 16px 0; font-family: monospace; font-size: 12px; background: #2a2a3e; color: white; border: 2px solid #4ecca3; box-sizing: border-box;"
                maxlength="100"
            />
            <p style="font-size: 8px; color: #b0b0b0;">Press Enter or click button to log task</p>
        `;

        const buttons = [
            {
                text: '✅ Log Task (+5 XP)',
                class: 'btn-success',
                onClick: () => this.logDeskTask()
            },
            {
                text: '📜 View History',
                onClick: () => this.showTaskHistory()
            },
            {
                text: 'Close',
                onClick: () => {}
            }
        ];

        UI.showModal('DESK - TASK LOG', content, buttons);

        // Focus input and add Enter key handler
        setTimeout(() => {
            const input = document.getElementById('desk-task-input');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.logDeskTask();
                    }
                });
            }
        }, 100);
    },

    // V2: Log a task at the desk
    logDeskTask() {
        const input = document.getElementById('desk-task-input');
        if (!input || !input.value.trim()) {
            UI.showModal('ERROR', 'Please enter a task to log!', [
                { text: 'OK', onClick: () => {} }
            ]);
            return;
        }

        const today = new Date().toDateString();
        const todayTasks = Storage.get('todayTasks_' + today) || [];

        todayTasks.push({
            text: input.value.trim(),
            time: new Date().toLocaleTimeString(),
            date: today
        });

        Storage.set('todayTasks_' + today, todayTasks);

        // Add XP reward
        const result = Storage.addXP(5);
        UI.updateHUD();

        // Show success message
        if (result.leveledUp) {
            UI.showModal('LEVEL UP!', `Task logged! +5 XP<br>🎉 LEVEL UP! You're now level ${result.newLevel}!`, [
                { text: 'Awesome!', onClick: () => {} }
            ]);
            UI.celebrateLevelUp(result.newLevel);
        } else {
            // Reopen the modal with updated list
            this.showDeskTaskLog();
        }
    },

    // V2: Show task history across multiple days
    showTaskHistory() {
        const last7Days = [];
        const today = new Date();

        // Get last 7 days of tasks
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const tasks = Storage.get('todayTasks_' + dateStr) || [];

            if (tasks.length > 0) {
                last7Days.push({
                    date: dateStr,
                    tasks: tasks
                });
            }
        }

        let historyHTML = '<div style="max-height: 300px; overflow-y: auto; text-align: left;">';

        if (last7Days.length === 0) {
            historyHTML += '<p style="color: #b0b0b0; font-size: 10px;">No task history yet. Start logging your accomplishments!</p>';
        } else {
            last7Days.forEach(day => {
                const date = new Date(day.date);
                const dateLabel = day.date === today.toDateString() ? '📅 Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                historyHTML += `
                    <div style="margin-bottom: 16px;">
                        <div style="background: rgba(78, 204, 163, 0.2); padding: 6px; font-size: 10px; font-weight: bold; margin-bottom: 4px;">
                            ${dateLabel} - ${day.tasks.length} task${day.tasks.length > 1 ? 's' : ''}
                        </div>
                `;

                day.tasks.forEach((task, idx) => {
                    historyHTML += `
                        <div style="background: rgba(255,255,255,0.05); padding: 6px; margin: 2px 0 2px 12px; font-size: 9px; border-left: 2px solid #4ecca3;">
                            ${idx + 1}. ${task.text} <span style="color: #888;">(${task.time})</span>
                        </div>
                    `;
                });

                historyHTML += '</div>';
            });
        }

        historyHTML += '</div>';

        const totalTasks = last7Days.reduce((sum, day) => sum + day.tasks.length, 0);

        const content = `
            <p style="margin-bottom: 12px;">📊 Your Recent Accomplishments</p>
            <p style="font-size: 10px; color: #4ecca3; margin-bottom: 12px;">Total: ${totalTasks} tasks logged in the last 7 days</p>
            ${historyHTML}
        `;

        const buttons = [
            {
                text: '← Back to Desk',
                onClick: () => this.showDeskTaskLog()
            },
            {
                text: 'Close',
                onClick: () => {}
            }
        ];

        UI.showModal('TASK HISTORY', content, buttons);
    },
};

console.log('✅ Game object created:', typeof Game, Game);

// Explicitly add to window to ensure global access
window.Game = Game;
console.log('✅ Game added to window:', typeof window.Game, window.Game);

// Add spin animation to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('✅ game.js fully loaded');
