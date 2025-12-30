// ========================================
// UI MANAGER
// Handles HUD updates and modal dialogs
// ========================================

const UI = {
    currentTask: null,
    particles: [],

    // Initialize UI
    init() {
        this.updateHUD();

        // Setup customize button after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setupCustomizeButton();
        }, 100);
    },

    // Setup customize button click handler
    setupCustomizeButton() {
        const customizeBtn = document.getElementById('customize-button');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => {
                this.showCustomizationMenu();
            });
        }
    },

    // Update HUD elements
    updateHUD() {
        const xp = Storage.get(Storage.keys.XP);
        const level = Storage.get(Storage.keys.LEVEL);
        const streak = Storage.get(Storage.keys.STREAK);

        // Update level
        document.getElementById('player-level').textContent = level;

        // Update XP bar
        const xpForNextLevel = Storage.getXPForLevel(level + 1);
        const xpForCurrentLevel = Storage.getXPForLevel(level);
        const xpProgress = xp - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        const percentage = (xpProgress / xpNeeded) * 100;

        document.getElementById('xp-bar').style.width = percentage + '%';
        document.getElementById('xp-text').textContent = `${xp} / ${xpForNextLevel}`;

        // Update streak
        document.getElementById('streak-count').textContent = streak;
    },

    // Show/hide interaction prompt
    showInteractionPrompt(show, objectName = '') {
        const prompt = document.getElementById('interaction-prompt');
        const interactButton = document.getElementById('interact-button');

        if (show) {
            prompt.classList.remove('hidden');
            if (interactButton) {
                interactButton.disabled = false;
            }
        } else {
            prompt.classList.add('hidden');
            if (interactButton) {
                interactButton.disabled = true;
            }
        }
    },

    // Show active task in HUD
    showActiveTask(taskText) {
        this.currentTask = taskText;
        const activeTaskEl = document.getElementById('active-task');
        const taskTextEl = document.getElementById('task-text');

        taskTextEl.textContent = taskText;
        activeTaskEl.classList.remove('hidden');
    },

    // Hide active task
    hideActiveTask() {
        this.currentTask = null;
        document.getElementById('active-task').classList.add('hidden');
    },

    // Show modal with content
    showModal(title, content, buttons) {
        const overlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');

        let html = `<h2 class="modal-title">${title}</h2>`;
        html += `<div class="modal-text">${content}</div>`;

        if (buttons && buttons.length > 0) {
            html += '<div class="modal-buttons">';
            buttons.forEach((btn, index) => {
                html += `<button class="btn ${btn.class || ''}" data-action="${index}">${btn.text}</button>`;
            });
            html += '</div>';
        }

        modalContent.innerHTML = html;
        overlay.classList.remove('hidden');

        // Add button click handlers
        const btnElements = modalContent.querySelectorAll('button');
        btnElements.forEach((btnEl, index) => {
            btnEl.addEventListener('click', () => {
                if (buttons[index].onClick) {
                    buttons[index].onClick();
                }
                this.hideModal();
            });

            // Focus first button
            if (index === 0) {
                btnEl.focus();
            }
        });
    },

    // Hide modal
    hideModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.add('hidden');
    },

    // Show task completion dialog
    showTaskCompletion(task) {
        const content = `
            <p>Task: <strong>${task.text}</strong></p>
            <p>How'd it go?</p>
        `;

        const buttons = [
            {
                text: '✅ Did it!',
                class: 'btn-success',
                onClick: () => this.handleTaskCompletion('completed', task)
            },
            {
                text: '😐 Half-did it',
                class: 'btn-warning',
                onClick: () => this.handleTaskCompletion('half', task)
            },
            {
                text: '❌ Lied to myself',
                class: 'btn-danger',
                onClick: () => this.handleTaskCompletion('lied', task)
            }
        ];

        this.showModal('REPORT BACK', content, buttons);
    },

    // Handle task completion
    handleTaskCompletion(status, task) {
        // Award XP
        let xp = 0;
        if (status === 'completed') xp = 15;
        else if (status === 'half') xp = 8;
        else if (status === 'lied') xp = 2;

        const result = Storage.addXP(xp);
        Storage.recordTaskCompletion(status);

        // Show response dialogue
        const response = Dialogue.getTaskMachineResponse(status);
        this.showFeedback(response, xp, result.leveledUp);

        // Update HUD
        this.updateHUD();
        this.hideActiveTask();

        // Show share option if completed
        if (status === 'completed') {
            setTimeout(() => {
                this.showShareOption(task.text);
            }, 2000);
        }
    },

    // Show feedback message
    showFeedback(message, xp, leveledUp) {
        let content = `<p>${message}</p><p>+${xp} XP</p>`;

        if (leveledUp) {
            content += `<p style="color: #ffd93d;">🎉 LEVEL UP! 🎉</p>`;
            this.createScreenShake();
        }

        this.showModal('TASK COMPLETE', content, [
            { text: 'Nice', onClick: () => {} }
        ]);

        // Create particle effect
        this.createParticles(Game.canvas.width / 2, Game.canvas.height / 2);
    },

    // Show share option
    showShareOption(taskText) {
        const shareText = Tasks.generateShareText(taskText);

        const content = `
            <p>Want to share your accomplishment?</p>
            <textarea readonly style="width: 100%; height: 120px; margin: 16px 0; padding: 8px; font-family: monospace; font-size: 10px;">${shareText}</textarea>
        `;

        this.showModal('SHARE YOUR PROGRESS', content, [
            {
                text: '📋 Copy to Clipboard',
                class: 'btn-success',
                onClick: () => {
                    navigator.clipboard.writeText(shareText).then(() => {
                        alert('Copied to clipboard!');
                    });
                }
            },
            {
                text: 'Nah',
                onClick: () => {}
            }
        ]);
    },

    // Show customization menu
    showCustomizationMenu() {
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        const level = Storage.get(Storage.keys.LEVEL);

        let colorsHTML = '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 16px 0;">';
        cosmetics.unlockedColors.forEach(color => {
            const isActive = color === cosmetics.activeColor;
            colorsHTML += `
                <button
                    class="color-swatch ${isActive ? 'active' : ''}"
                    data-color="${color}"
                    style="
                        width: 50px;
                        height: 50px;
                        background-color: ${color};
                        border: 3px solid ${isActive ? '#ffd93d' : '#ffffff'};
                        cursor: pointer;
                        box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
                    "
                ></button>
            `;
        });
        colorsHTML += '</div>';

        let hatsHTML = '<p style="font-size: 10px; color: #b0b0b0; margin-top: 16px;">Hats: ';
        if (cosmetics.unlockedHats.length > 0) {
            hatsHTML += cosmetics.unlockedHats.join(', ');
        } else {
            hatsHTML += 'None unlocked yet (Level 3+)';
        }
        hatsHTML += '</p>';

        let petsHTML = '<p style="font-size: 10px; color: #b0b0b0;">Pets: ';
        if (cosmetics.unlockedPets.length > 0) {
            petsHTML += cosmetics.unlockedPets.join(', ');
        } else {
            petsHTML += 'None unlocked yet (Level 7+)';
        }
        petsHTML += '</p>';

        const content = `
            <p style="font-size: 10px;">Choose your player color:</p>
            ${colorsHTML}
            ${hatsHTML}
            ${petsHTML}
            <p style="font-size: 8px; color: #6C5B7B; margin-top: 16px;">
                Level up to unlock more cosmetics!
            </p>
        `;

        this.showModal('CUSTOMIZE', content, [
            { text: 'Done', onClick: () => {} }
        ]);

        // Add color swatch click handlers
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                const color = e.target.getAttribute('data-color');
                this.changePlayerColor(color);

                // Update active state
                swatches.forEach(s => s.style.border = '3px solid #ffffff');
                e.target.style.border = '3px solid #ffd93d';
            });
        });
    },

    // Change player color
    changePlayerColor(color) {
        if (Game.player) {
            Game.player.setColor(color);
        }
    },

    // Create particle effect
    createParticles(x, y) {
        const colors = ['#FF6B9D', '#4ecca3', '#ffd93d', '#C06C84'];

        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 2
            });
        }
    },

    // Update and draw particles
    updateParticles(deltaTime, ctx) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.vy += 500 * deltaTime; // Gravity
            p.life -= deltaTime;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw particle
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    },

    // Create screen shake effect
    createScreenShake() {
        if (Game.screenShake) return;
        Game.screenShake = {
            duration: 0.5,
            intensity: 10,
            time: 0
        };
    }
};

