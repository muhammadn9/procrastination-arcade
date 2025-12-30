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
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Setup canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize systems
        Controls.init();
        UI.init();

        // Create player at center
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);

        // Create world
        this.world = new World();

        // Start game loop
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);

        console.log('🎮 Procrastination Arcade initialized!');
    },

    // Resize canvas to fit window
    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Adjust for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = container.clientWidth + 'px';
        this.canvas.style.height = container.clientHeight + 'px';

        if (this.world) {
            this.world.resize(this.canvas.width, this.canvas.height);
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

            UI.showModal('FATE HAS SPOKEN', resultContent, buttons);
        }, 2000);
    },

    // Pause game
    pause() {
        this.running = false;
    },

    // Resume game
    resume() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
};

// Add spin animation to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

