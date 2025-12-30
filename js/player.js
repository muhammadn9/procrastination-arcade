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
        this.speed = 150; // pixels per second
        this.direction = 'down'; // up, down, left, right
        this.color = Storage.get(Storage.keys.COSMETICS).activeColor;

        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.15; // seconds per frame
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
        // Draw player sprite (placeholder for now)
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        // Draw direction indicator (simple triangle)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        switch(this.direction) {
            case 'up':
                ctx.moveTo(this.x, this.y - this.height / 4);
                ctx.lineTo(this.x - 6, this.y - this.height / 4 + 8);
                ctx.lineTo(this.x + 6, this.y - this.height / 4 + 8);
                break;
            case 'down':
                ctx.moveTo(this.x, this.y + this.height / 4);
                ctx.lineTo(this.x - 6, this.y + this.height / 4 - 8);
                ctx.lineTo(this.x + 6, this.y + this.height / 4 - 8);
                break;
            case 'left':
                ctx.moveTo(this.x - this.width / 4, this.y);
                ctx.lineTo(this.x - this.width / 4 + 8, this.y - 6);
                ctx.lineTo(this.x - this.width / 4 + 8, this.y + 6);
                break;
            case 'right':
                ctx.moveTo(this.x + this.width / 4, this.y);
                ctx.lineTo(this.x + this.width / 4 - 8, this.y - 6);
                ctx.lineTo(this.x + this.width / 4 - 8, this.y + 6);
                break;
        }
        ctx.closePath();
        ctx.fill();

        // Draw hat if equipped (placeholder)
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        if (cosmetics.activeHat) {
            ctx.fillStyle = '#ffd93d';
            ctx.fillRect(
                this.x - this.width / 3,
                this.y - this.height / 2 - 8,
                this.width * 0.66,
                8
            );
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

