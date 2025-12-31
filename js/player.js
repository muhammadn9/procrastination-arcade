// ========================================
// PLAYER CLASS
// Handles player movement, animation, and state
// ========================================

class Player {
    // Drawing constants for player sprite
    static BODY_OFFSET_X = 10;
    static BODY_OFFSET_Y = 8;
    static BODY_WIDTH = 12;
    static BODY_HEIGHT = 16;
    
    static HEAD_OFFSET_X = 8;
    static HEAD_OFFSET_Y = 4;
    static HEAD_WIDTH = 16;
    static HEAD_HEIGHT = 12;
    
    static EYE_WIDTH = 3;
    static EYE_HEIGHT = 2;
    static EYE_LEFT_X = 10;
    static EYE_RIGHT_X = 19;
    static EYE_UP_Y = 6;
    static EYE_DOWN_Y = 10;
    static EYE_SIDE_Y = 8;
    static EYE_SIDE_LEFT_LEFT_X = 9;
    static EYE_SIDE_LEFT_RIGHT_X = 16;
    static EYE_SIDE_RIGHT_LEFT_X = 14;
    static EYE_SIDE_RIGHT_RIGHT_X = 21;
    
    static LEG_LEFT_X = 10;
    static LEG_RIGHT_X = 17;
    static LEG_Y = 24;
    static LEG_WIDTH = 5;
    static LEG_HEIGHT = 8;
    static LEG_WALK_OFFSET = 2;
    
    static ARM_LEFT_X = 6;
    static ARM_RIGHT_X = 22;
    static ARM_Y = 12;
    static ARM_FRONT_BACK_Y = 10;
    static ARM_WIDTH = 4;
    static ARM_SIDE_HEIGHT = 8;
    static ARM_FRONT_BACK_HEIGHT = 10;
    
    static HAT_OFFSET_X = 6;
    static HAT_OFFSET_Y = 0;
    static HAT_WIDTH = 20;
    static HAT_HEIGHT = 4;
    static HAT_BAND_OFFSET_X = 8;
    static HAT_BAND_OFFSET_Y = 4;
    static HAT_BAND_WIDTH = 16;
    static HAT_BAND_HEIGHT = 2;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 250; // V2: Increased from 150 to 250
        this.direction = 'down'; // up, down, left, right
        this.color = Storage.get(Storage.keys.COSMETICS).activeColor;

        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.12; // V2: Faster animation (was 0.15)
    }

    // Update player position and animation
    update(deltaTime, movement) {
        // Move player
        if (movement.x !== 0 || movement.y !== 0) {
            this.x += movement.x * this.speed * deltaTime;
            this.y += movement.y * this.speed * deltaTime;

            // Update direction
            if (Math.abs(movement.x) > Math.abs(movement.y)) {
                this.direction = movement.x > 0 ? 'right' : 'left';
            } else {
                this.direction = movement.y > 0 ? 'down' : 'up';
            }

            // Update animation
            this.animTimer += deltaTime;
            if (this.animTimer >= this.animSpeed) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 4;
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }

        // Keep player in bounds
        this.x = Math.max(this.width / 2, Math.min(this.x, Game.canvas.width - this.width / 2));
        this.y = Math.max(this.height / 2, Math.min(this.y, Game.canvas.height - this.height / 2));
    }

    // Draw player
    draw(ctx) {
        const px = Math.floor(this.x - this.width / 2);
        const py = Math.floor(this.y - this.height / 2);
        const frame = this.animFrame;

        // Body (main color from cosmetics)
        ctx.fillStyle = this.color;
        ctx.fillRect(px + Player.BODY_OFFSET_X, py + Player.BODY_OFFSET_Y, Player.BODY_WIDTH, Player.BODY_HEIGHT);

        // Head
        ctx.fillStyle = '#FFD1A3'; // Skin tone
        ctx.fillRect(px + Player.HEAD_OFFSET_X, py + Player.HEAD_OFFSET_Y, Player.HEAD_WIDTH, Player.HEAD_HEIGHT);

        // Eyes based on direction
        ctx.fillStyle = '#000000';
        switch(this.direction) {
            case 'up':
                // Eyes looking up
                ctx.fillRect(px + Player.EYE_LEFT_X, py + Player.EYE_UP_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                ctx.fillRect(px + Player.EYE_RIGHT_X, py + Player.EYE_UP_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                break;
            case 'down':
                // Eyes looking down
                ctx.fillRect(px + Player.EYE_LEFT_X, py + Player.EYE_DOWN_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                ctx.fillRect(px + Player.EYE_RIGHT_X, py + Player.EYE_DOWN_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                break;
            case 'left':
                // Eyes looking left
                ctx.fillRect(px + Player.EYE_SIDE_LEFT_LEFT_X, py + Player.EYE_SIDE_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                ctx.fillRect(px + Player.EYE_SIDE_LEFT_RIGHT_X, py + Player.EYE_SIDE_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                break;
            case 'right':
                // Eyes looking right
                ctx.fillRect(px + Player.EYE_SIDE_RIGHT_LEFT_X, py + Player.EYE_SIDE_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                ctx.fillRect(px + Player.EYE_SIDE_RIGHT_RIGHT_X, py + Player.EYE_SIDE_Y, Player.EYE_WIDTH, Player.EYE_HEIGHT);
                break;
        }

        // Legs with walking animation
        ctx.fillStyle = this.color;
        if (this.direction === 'left' || this.direction === 'right') {
            // Side-walking legs
            ctx.fillRect(px + Player.LEG_LEFT_X, py + Player.LEG_Y + (frame % 2 === 0 ? 0 : Player.LEG_WALK_OFFSET), Player.LEG_WIDTH, Player.LEG_HEIGHT);
            ctx.fillRect(px + Player.LEG_RIGHT_X, py + Player.LEG_Y + (frame % 2 === 1 ? 0 : Player.LEG_WALK_OFFSET), Player.LEG_WIDTH, Player.LEG_HEIGHT);
        } else {
            // Front/back legs
            ctx.fillRect(px + Player.LEG_LEFT_X, py + Player.LEG_Y + (frame % 2), Player.LEG_WIDTH, Player.LEG_HEIGHT);
            ctx.fillRect(px + Player.LEG_RIGHT_X, py + Player.LEG_Y + ((frame + 1) % 2), Player.LEG_WIDTH, Player.LEG_HEIGHT);
        }

        // Arms with walking animation (always rendered; neutral when idle)
        ctx.fillStyle = '#FFD1A3';
        const armOffset = frame === 0 ? 0 : (frame === 2 ? 2 : 1);
        if (this.direction === 'left') {
            ctx.fillRect(px + Player.ARM_LEFT_X, py + Player.ARM_Y + armOffset, Player.ARM_WIDTH, Player.ARM_SIDE_HEIGHT);
            ctx.fillRect(px + Player.ARM_RIGHT_X, py + Player.ARM_Y - armOffset, Player.ARM_WIDTH, Player.ARM_SIDE_HEIGHT);
        } else if (this.direction === 'right') {
            ctx.fillRect(px + Player.ARM_RIGHT_X, py + Player.ARM_Y + armOffset, Player.ARM_WIDTH, Player.ARM_SIDE_HEIGHT);
            ctx.fillRect(px + Player.ARM_LEFT_X, py + Player.ARM_Y - armOffset, Player.ARM_WIDTH, Player.ARM_SIDE_HEIGHT);
        } else {
            ctx.fillRect(px + Player.ARM_LEFT_X, py + Player.ARM_FRONT_BACK_Y + armOffset, Player.ARM_WIDTH, Player.ARM_FRONT_BACK_HEIGHT);
            ctx.fillRect(px + Player.ARM_RIGHT_X, py + Player.ARM_FRONT_BACK_Y - armOffset, Player.ARM_WIDTH, Player.ARM_FRONT_BACK_HEIGHT);
        }

        // Hat if equipped
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        if (cosmetics.activeHat) {
            ctx.fillStyle = '#ffd93d';
            ctx.fillRect(px + Player.HAT_OFFSET_X, py + Player.HAT_OFFSET_Y, Player.HAT_WIDTH, Player.HAT_HEIGHT);
            ctx.fillRect(px + Player.HAT_BAND_OFFSET_X, py + Player.HAT_BAND_OFFSET_Y, Player.HAT_BAND_WIDTH, Player.HAT_BAND_HEIGHT);
        }
    }

    // Get bounding box for collision
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
            centerX: this.x,
            centerY: this.y
        };
    }

    // Update player color
    setColor(color) {
        this.color = color;
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        cosmetics.activeColor = color;
        Storage.set(Storage.keys.COSMETICS, cosmetics);
    }
}
