// ========================================
// PLAYER CLASS
// Handles player movement, animation, and state
// ========================================

class Player {
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

        // Drawing constants for player sprite
        const BODY_OFFSET_X = 10;
        const BODY_OFFSET_Y = 8;
        const BODY_WIDTH = 12;
        const BODY_HEIGHT = 16;
        
        const HEAD_OFFSET_X = 8;
        const HEAD_OFFSET_Y = 4;
        const HEAD_WIDTH = 16;
        const HEAD_HEIGHT = 12;
        
        const EYE_WIDTH = 3;
        const EYE_HEIGHT = 2;
        const EYE_LEFT_X = 10;
        const EYE_RIGHT_X = 19;
        const EYE_UP_Y = 6;
        const EYE_DOWN_Y = 10;
        const EYE_SIDE_Y = 8;
        const EYE_SIDE_LEFT_LEFT_X = 9;
        const EYE_SIDE_LEFT_RIGHT_X = 16;
        const EYE_SIDE_RIGHT_LEFT_X = 14;
        const EYE_SIDE_RIGHT_RIGHT_X = 21;
        
        const LEG_LEFT_X = 10;
        const LEG_RIGHT_X = 17;
        const LEG_Y = 24;
        const LEG_WIDTH = 5;
        const LEG_HEIGHT = 8;
        const LEG_WALK_OFFSET = 2;
        
        const ARM_LEFT_X = 6;
        const ARM_RIGHT_X = 22;
        const ARM_Y = 12;
        const ARM_FRONT_BACK_Y = 10;
        const ARM_WIDTH = 4;
        const ARM_SIDE_HEIGHT = 8;
        const ARM_FRONT_BACK_HEIGHT = 10;
        
        const HAT_OFFSET_X = 6;
        const HAT_OFFSET_Y = 0;
        const HAT_WIDTH = 20;
        const HAT_HEIGHT = 4;
        const HAT_BAND_OFFSET_X = 8;
        const HAT_BAND_OFFSET_Y = 4;
        const HAT_BAND_WIDTH = 16;
        const HAT_BAND_HEIGHT = 2;

        // Body (main color from cosmetics)
        ctx.fillStyle = this.color;
        ctx.fillRect(px + BODY_OFFSET_X, py + BODY_OFFSET_Y, BODY_WIDTH, BODY_HEIGHT);

        // Head
        ctx.fillStyle = '#FFD1A3'; // Skin tone
        ctx.fillRect(px + HEAD_OFFSET_X, py + HEAD_OFFSET_Y, HEAD_WIDTH, HEAD_HEIGHT);

        // Eyes based on direction
        ctx.fillStyle = '#000000';
        switch(this.direction) {
            case 'up':
                // Eyes looking up
                ctx.fillRect(px + EYE_LEFT_X, py + EYE_UP_Y, EYE_WIDTH, EYE_HEIGHT);
                ctx.fillRect(px + EYE_RIGHT_X, py + EYE_UP_Y, EYE_WIDTH, EYE_HEIGHT);
                break;
            case 'down':
                // Eyes looking down
                ctx.fillRect(px + EYE_LEFT_X, py + EYE_DOWN_Y, EYE_WIDTH, EYE_HEIGHT);
                ctx.fillRect(px + EYE_RIGHT_X, py + EYE_DOWN_Y, EYE_WIDTH, EYE_HEIGHT);
                break;
            case 'left':
                // Eyes looking left
                ctx.fillRect(px + EYE_SIDE_LEFT_LEFT_X, py + EYE_SIDE_Y, EYE_WIDTH, EYE_HEIGHT);
                ctx.fillRect(px + EYE_SIDE_LEFT_RIGHT_X, py + EYE_SIDE_Y, EYE_WIDTH, EYE_HEIGHT);
                break;
            case 'right':
                // Eyes looking right
                ctx.fillRect(px + EYE_SIDE_RIGHT_LEFT_X, py + EYE_SIDE_Y, EYE_WIDTH, EYE_HEIGHT);
                ctx.fillRect(px + EYE_SIDE_RIGHT_RIGHT_X, py + EYE_SIDE_Y, EYE_WIDTH, EYE_HEIGHT);
                break;
        }

        // Legs with walking animation
        ctx.fillStyle = this.color;
        if (this.direction === 'left' || this.direction === 'right') {
            // Side-walking legs
            ctx.fillRect(px + LEG_LEFT_X, py + LEG_Y + (frame % 2 === 0 ? 0 : LEG_WALK_OFFSET), LEG_WIDTH, LEG_HEIGHT);
            ctx.fillRect(px + LEG_RIGHT_X, py + LEG_Y + (frame % 2 === 1 ? 0 : LEG_WALK_OFFSET), LEG_WIDTH, LEG_HEIGHT);
        } else {
            // Front/back legs
            ctx.fillRect(px + LEG_LEFT_X, py + LEG_Y + (frame % 2), LEG_WIDTH, LEG_HEIGHT);
            ctx.fillRect(px + LEG_RIGHT_X, py + LEG_Y + ((frame + 1) % 2), LEG_WIDTH, LEG_HEIGHT);
        }

        // Arms with walking animation (always rendered; neutral when idle)
        ctx.fillStyle = '#FFD1A3';
        const armOffset = frame === 0 ? 0 : (frame === 2 ? 2 : 1);
        if (this.direction === 'left') {
            ctx.fillRect(px + ARM_LEFT_X, py + ARM_Y + armOffset, ARM_WIDTH, ARM_SIDE_HEIGHT);
            ctx.fillRect(px + ARM_RIGHT_X, py + ARM_Y - armOffset, ARM_WIDTH, ARM_SIDE_HEIGHT);
        } else if (this.direction === 'right') {
            ctx.fillRect(px + ARM_RIGHT_X, py + ARM_Y + armOffset, ARM_WIDTH, ARM_SIDE_HEIGHT);
            ctx.fillRect(px + ARM_LEFT_X, py + ARM_Y - armOffset, ARM_WIDTH, ARM_SIDE_HEIGHT);
        } else {
            ctx.fillRect(px + ARM_LEFT_X, py + ARM_FRONT_BACK_Y + armOffset, ARM_WIDTH, ARM_FRONT_BACK_HEIGHT);
            ctx.fillRect(px + ARM_RIGHT_X, py + ARM_FRONT_BACK_Y - armOffset, ARM_WIDTH, ARM_FRONT_BACK_HEIGHT);
        }

        // Hat if equipped
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        if (cosmetics.activeHat) {
            ctx.fillStyle = '#ffd93d';
            ctx.fillRect(px + HAT_OFFSET_X, py + HAT_OFFSET_Y, HAT_WIDTH, HAT_HEIGHT);
            ctx.fillRect(px + HAT_BAND_OFFSET_X, py + HAT_BAND_OFFSET_Y, HAT_BAND_WIDTH, HAT_BAND_HEIGHT);
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
