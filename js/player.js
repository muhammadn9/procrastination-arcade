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

        // Body (main color from cosmetics)
        ctx.fillStyle = this.color;
        ctx.fillRect(px + 10, py + 8, 12, 16);

        // Head
        ctx.fillStyle = '#FFD1A3'; // Skin tone
        ctx.fillRect(px + 8, py + 4, 16, 12);

        // Eyes based on direction
        ctx.fillStyle = '#000000';
        switch(this.direction) {
            case 'up':
                // Eyes looking up
                ctx.fillRect(px + 10, py + 6, 3, 2);
                ctx.fillRect(px + 19, py + 6, 3, 2);
                break;
            case 'down':
                // Eyes looking down
                ctx.fillRect(px + 10, py + 10, 3, 2);
                ctx.fillRect(px + 19, py + 10, 3, 2);
                break;
            case 'left':
                // Eyes looking left
                ctx.fillRect(px + 9, py + 8, 3, 2);
                ctx.fillRect(px + 16, py + 8, 3, 2);
                break;
            case 'right':
                // Eyes looking right
                ctx.fillRect(px + 14, py + 8, 3, 2);
                ctx.fillRect(px + 21, py + 8, 3, 2);
                break;
        }

        // Legs with walking animation
        ctx.fillStyle = this.color;
        if (this.direction === 'left' || this.direction === 'right') {
            // Side-walking legs
            ctx.fillRect(px + 10, py + 24 + (frame % 2 === 0 ? 0 : 2), 5, 8);
            ctx.fillRect(px + 17, py + 24 + (frame % 2 === 1 ? 0 : 2), 5, 8);
        } else {
            // Front/back legs
            ctx.fillRect(px + 10, py + 24 + (frame % 2), 5, 8);
            ctx.fillRect(px + 17, py + 24 + ((frame + 1) % 2), 5, 8);
        }

        // Arms with walking animation
        if (frame > 0) {
            ctx.fillStyle = '#FFD1A3';
            const armOffset = frame === 2 ? 2 : 1;
            if (this.direction === 'left') {
                ctx.fillRect(px + 6, py + 12 + armOffset, 4, 8);
                ctx.fillRect(px + 22, py + 12 - armOffset, 4, 8);
            } else if (this.direction === 'right') {
                ctx.fillRect(px + 22, py + 12 + armOffset, 4, 8);
                ctx.fillRect(px + 6, py + 12 - armOffset, 4, 8);
            } else {
                ctx.fillRect(px + 6, py + 10 + armOffset, 4, 10);
                ctx.fillRect(px + 22, py + 10 - armOffset, 4, 10);
            }
        }

        // Hat if equipped
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        if (cosmetics.activeHat) {
            ctx.fillStyle = '#ffd93d';
            ctx.fillRect(px + 6, py, 20, 4);
            ctx.fillRect(px + 8, py + 4, 16, 2);
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
