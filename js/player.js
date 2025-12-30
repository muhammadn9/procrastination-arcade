// ========================================
}
    }
        Storage.set(Storage.keys.COSMETICS, cosmetics);
        cosmetics.activeColor = color;
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        this.color = color;
    setColor(color) {
    // Update player color

    }
        };
            centerY: this.y
            centerX: this.x,
            height: this.height,
            width: this.width,
            y: this.y - this.height / 2,
            x: this.x - this.width / 2,
        return {
    getBounds() {
    // Get bounding box for collision

    }
        }
            );
                8
                this.width * 0.66,
                this.y - this.height / 2 - 8,
                this.x - this.width / 3,
            ctx.fillRect(
            ctx.fillStyle = '#ffd93d';
        if (cosmetics.activeHat) {
        const cosmetics = Storage.get(Storage.keys.COSMETICS);
        // Draw hat if equipped (placeholder)

        ctx.fill();
        ctx.closePath();
        }
                break;
                ctx.lineTo(this.x + this.width / 4 - 8, this.y + 6);
                ctx.lineTo(this.x + this.width / 4 - 8, this.y - 6);
                ctx.moveTo(this.x + this.width / 4, this.y);
            case 'right':
                break;
                ctx.lineTo(this.x - this.width / 4 + 8, this.y + 6);
                ctx.lineTo(this.x - this.width / 4 + 8, this.y - 6);
                ctx.moveTo(this.x - this.width / 4, this.y);
            case 'left':
                break;
                ctx.lineTo(this.x + 6, this.y + this.height / 4 - 8);
                ctx.lineTo(this.x - 6, this.y + this.height / 4 - 8);
                ctx.moveTo(this.x, this.y + this.height / 4);
            case 'down':
                break;
                ctx.lineTo(this.x + 6, this.y - this.height / 4 + 8);
                ctx.lineTo(this.x - 6, this.y - this.height / 4 + 8);
                ctx.moveTo(this.x, this.y - this.height / 4);
            case 'up':
        switch(this.direction) {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        // Draw direction indicator (simple triangle)

        );
            this.height
            this.width,
            this.y - this.height / 2,
            this.x - this.width / 2,
        ctx.strokeRect(
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        // Draw border

        );
            this.height
            this.width,
            this.y - this.height / 2,
            this.x - this.width / 2,
        ctx.fillRect(
        ctx.fillStyle = this.color;
        // Draw player sprite (placeholder for now)
    draw(ctx) {
    // Draw player

    }
        this.y = Math.max(this.height / 2, Math.min(this.y, Game.canvas.height - this.height / 2));
        this.x = Math.max(this.width / 2, Math.min(this.x, Game.canvas.width - this.width / 2));
        // Keep player in bounds

        }
            this.animTimer = 0;
            this.animFrame = 0;
        } else {
            }
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            if (this.animTimer >= this.animSpeed) {
            this.animTimer += deltaTime;
            // Update animation

            }
                this.direction = movement.y > 0 ? 'down' : 'up';
            } else {
                this.direction = movement.x > 0 ? 'right' : 'left';
            if (Math.abs(movement.x) > Math.abs(movement.y)) {
            // Update direction

            this.y += movement.y * this.speed * deltaTime;
            this.x += movement.x * this.speed * deltaTime;
        if (movement.x !== 0 || movement.y !== 0) {
        // Move player
    update(deltaTime, movement) {
    // Update player position and animation

    }
        this.animSpeed = 0.15; // seconds per frame
        this.animTimer = 0;
        this.animFrame = 0;
        // Animation

        this.color = Storage.get(Storage.keys.COSMETICS).activeColor;
        this.direction = 'down'; // up, down, left, right
        this.speed = 150; // pixels per second
        this.height = 32;
        this.width = 32;
        this.y = y;
        this.x = x;
    constructor(x, y) {
class Player {

// ========================================
// Handles player movement, animation, and state
// PLAYER CLASS

