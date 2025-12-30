// ========================================
// ASSET LOADER
// Handles sprite loading with progress tracking
// ========================================

const Loader = {
    assets: {
        // Placeholder sprites - will be replaced with actual pixel art
        playerSprite: null,
        taskMachineSprite: null,
        mirrorSprite: null,
        rouletteSprite: null,
        couchSprite: null
    },

    totalAssets: 0,
    loadedAssets: 0,
    loadingComplete: false,

    // Initialize and load all assets
    async init() {
        this.totalAssets = 5; // Number of sprite sheets to load
        this.updateProgress(0);

        // For now, we'll use placeholder colored rectangles
        // Later, replace with actual sprite loading
        await this.loadPlaceholders();

        this.loadingComplete = true;
        this.onLoadComplete();
    },

    // Load placeholder assets (for MVP - replace with real sprites later)
    async loadPlaceholders() {
        // Simulate loading time for each asset
        const loadDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Player placeholder
        await loadDelay(200);
        this.assets.playerSprite = this.createPlaceholder(32, 32, '#FF6B9D');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);

        // Task Machine placeholder
        await loadDelay(200);
        this.assets.taskMachineSprite = this.createPlaceholder(64, 64, '#C06C84');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);

        // Mirror placeholder
        await loadDelay(200);
        this.assets.mirrorSprite = this.createPlaceholder(64, 64, '#6C5B7B');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);

        // Roulette placeholder
        await loadDelay(200);
        this.assets.rouletteSprite = this.createPlaceholder(64, 64, '#ffd93d');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);

        // Couch placeholder
        await loadDelay(200);
        this.assets.couchSprite = this.createPlaceholder(80, 48, '#355C7D');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
    },

    // Create colored placeholder canvas
    createPlaceholder(width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw colored rectangle with border
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        return canvas;
    },

    // Load actual image sprite (for later use with real pixel art)
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    // Update loading progress
    updateProgress(percentage) {
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');

        if (loadingBar) {
            loadingBar.style.width = percentage + '%';
        }

        if (loadingText) {
            const messages = [
                'Loading pixels...',
                'Initializing procrastination...',
                'Spawning tasks...',
                'Calibrating guilt...',
                'Ready to avoid work!'
            ];
            const messageIndex = Math.min(Math.floor(percentage / 20), messages.length - 1);
            loadingText.textContent = messages[messageIndex];
        }
    },

    // Called when loading is complete
    onLoadComplete() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const gameContainer = document.getElementById('game-container');

            loadingScreen.classList.add('fade-out');

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                gameContainer.classList.remove('hidden');

                // Start the game
                if (window.Game) {
                    Game.init();
                }
            }, 500);
        }, 300);
    }
};

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Loader.init());
} else {
    Loader.init();
}

