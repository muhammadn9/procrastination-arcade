// ========================================
// CONTROLS SYSTEM
// Handles keyboard and mobile touch input
// ========================================

const Controls = {
    // Input state
    keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        interact: false
    },

    // Mobile joystick state
    joystick: {
        active: false,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        touchId: null
    },

    isMobile: false,

    // Initialize controls
    init() {
        this.isMobile = this.detectMobile();

        // Setup keyboard controls
        this.setupKeyboard();

        // Setup mobile controls if needed
        if (this.isMobile) {
            this.setupMobile();
            document.getElementById('mobile-controls').classList.remove('hidden');
        }
    },

    // Detect if device is mobile
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth < 768;
    },

    // Setup keyboard event listeners
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    },

    // Handle key down
    handleKeyDown(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.keys.up = true;
                e.preventDefault();
                break;
            case 's':
            case 'arrowdown':
                this.keys.down = true;
                e.preventDefault();
                break;
            case 'a':
            case 'arrowleft':
                this.keys.left = true;
                e.preventDefault();
                break;
            case 'd':
            case 'arrowright':
                this.keys.right = true;
                e.preventDefault();
                break;
            case 'e':
            case ' ':
            case 'enter':
                if (!this.keys.interact) { // Prevent key repeat
                    this.keys.interact = true;
                    if (window.Game) {
                        Game.handleInteract();
                    }
                }
                e.preventDefault();
                break;
        }
    },

    // Handle key up
    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.keys.up = false;
                break;
            case 's':
            case 'arrowdown':
                this.keys.down = false;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.left = false;
                break;
            case 'd':
            case 'arrowright':
                this.keys.right = false;
                break;
            case 'e':
            case ' ':
            case 'enter':
                this.keys.interact = false;
                break;
        }
    },

    // Setup mobile touch controls
    setupMobile() {
        const joystickContainer = document.getElementById('joystick-container');
        const joystickStick = document.getElementById('joystick-stick');
        const interactButton = document.getElementById('interact-button');

        // Joystick touch events
        joystickContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = joystickContainer.getBoundingClientRect();

            this.joystick.active = true;
            this.joystick.touchId = touch.identifier;
            this.joystick.startX = rect.left + rect.width / 2;
            this.joystick.startY = rect.top + rect.height / 2;

            this.updateJoystick(touch.clientX, touch.clientY);
        });

        joystickContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.joystick.active) return;

            const touch = Array.from(e.touches).find(t => t.identifier === this.joystick.touchId);
            if (touch) {
                this.updateJoystick(touch.clientX, touch.clientY);
            }
        });

        joystickContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.resetJoystick();
        });

        // Interact button
        interactButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.interact = true;
            if (window.Game) {
                Game.handleInteract();
            }
        });

        interactButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.interact = false;
        });
    },

    // Update joystick position and calculate direction
    updateJoystick(touchX, touchY) {
        const maxDistance = 50; // Maximum joystick movement

        // Calculate offset from center
        let deltaX = touchX - this.joystick.startX;
        let deltaY = touchY - this.joystick.startY;

        // Calculate distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Constrain to circle
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }

        // Update visual position
        const joystickStick = document.getElementById('joystick-stick');
        joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

        // Update normalized direction (-1 to 1)
        this.joystick.x = deltaX / maxDistance;
        this.joystick.y = deltaY / maxDistance;

        // Update key states based on joystick
        const threshold = 0.3;
        this.keys.left = this.joystick.x < -threshold;
        this.keys.right = this.joystick.x > threshold;
        this.keys.up = this.joystick.y < -threshold;
        this.keys.down = this.joystick.y > threshold;
    },

    // Reset joystick to center
    resetJoystick() {
        this.joystick.active = false;
        this.joystick.x = 0;
        this.joystick.y = 0;
        this.joystick.touchId = null;

        const joystickStick = document.getElementById('joystick-stick');
        joystickStick.style.transform = 'translate(-50%, -50%)';

        // Reset movement keys
        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;
    },

    // Get movement vector
    getMovementVector() {
        let x = 0;
        let y = 0;

        if (this.keys.left) x -= 1;
        if (this.keys.right) x += 1;
        if (this.keys.up) y -= 1;
        if (this.keys.down) y += 1;

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }
};

