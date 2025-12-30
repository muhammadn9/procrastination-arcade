// ========================================
}
    Loader.init();
} else {
    document.addEventListener('DOMContentLoaded', () => Loader.init());
if (document.readyState === 'loading') {
// Start loading when DOM is ready

};
    }
        }, 300);
            }, 500);
                }
                    Game.init();
                if (window.Game) {
                // Start the game

                gameContainer.classList.remove('hidden');
                loadingScreen.style.display = 'none';
            setTimeout(() => {

            loadingScreen.classList.add('fade-out');

            const gameContainer = document.getElementById('game-container');
            const loadingScreen = document.getElementById('loading-screen');
        setTimeout(() => {
    onLoadComplete() {
    // Called when loading is complete

    },
        }
            loadingText.textContent = messages[messageIndex];
            const messageIndex = Math.min(Math.floor(percentage / 20), messages.length - 1);
            ];
                'Ready to avoid work!'
                'Calibrating guilt...',
                'Spawning tasks...',
                'Initializing procrastination...',
                'Loading pixels...',
            const messages = [
        if (loadingText) {

        }
            loadingBar.style.width = percentage + '%';
        if (loadingBar) {

        const loadingText = document.getElementById('loading-text');
        const loadingBar = document.getElementById('loading-bar');
    updateProgress(percentage) {
    // Update loading progress

    },
        });
            img.src = src;
            img.onerror = reject;
            img.onload = () => resolve(img);
            const img = new Image();
        return new Promise((resolve, reject) => {
    loadImage(src) {
    // Load actual image sprite (for later use with real pixel art)

    },
        return canvas;

        ctx.strokeRect(1, 1, width - 2, height - 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color;
        // Draw colored rectangle with border

        const ctx = canvas.getContext('2d');
        canvas.height = height;
        canvas.width = width;
        const canvas = document.createElement('canvas');
    createPlaceholder(width, height, color) {
    // Create colored placeholder canvas

    },
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        this.loadedAssets++;
        this.assets.couchSprite = this.createPlaceholder(80, 48, '#355C7D');
        await loadDelay(200);
        // Couch placeholder

        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        this.loadedAssets++;
        this.assets.rouletteSprite = this.createPlaceholder(64, 64, '#ffd93d');
        await loadDelay(200);
        // Roulette placeholder

        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        this.loadedAssets++;
        this.assets.mirrorSprite = this.createPlaceholder(64, 64, '#6C5B7B');
        await loadDelay(200);
        // Mirror placeholder

        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        this.loadedAssets++;
        this.assets.taskMachineSprite = this.createPlaceholder(64, 64, '#C06C84');
        await loadDelay(200);
        // Task Machine placeholder

        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        this.loadedAssets++;
        this.assets.playerSprite = this.createPlaceholder(32, 32, '#FF6B9D');
        await loadDelay(200);
        // Player placeholder

        const loadDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        // Simulate loading time for each asset
    async loadPlaceholders() {
    // Load placeholder assets (for MVP - replace with real sprites later)

    },
        this.onLoadComplete();
        this.loadingComplete = true;

        await this.loadPlaceholders();
        // Later, replace with actual sprite loading
        // For now, we'll use placeholder colored rectangles

        this.updateProgress(0);
        this.totalAssets = 5; // Number of sprite sheets to load
    async init() {
    // Initialize and load all assets

    loadingComplete: false,
    loadedAssets: 0,
    totalAssets: 0,

    },
        couchSprite: null
        rouletteSprite: null,
        mirrorSprite: null,
        taskMachineSprite: null,
        playerSprite: null,
        // Placeholder sprites - will be replaced with actual pixel art
    assets: {
const Loader = {

// ========================================
// Handles sprite loading with progress tracking
// ASSET LOADER

