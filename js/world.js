// ========================================
// WORLD CLASS
// Manages game world, objects, and interactions
// ========================================

class World {
    constructor(canvasWidth, canvasHeight) {
        this.objects = [];
        this.setupObjects(canvasWidth, canvasHeight);
    }

    // Setup interactive objects in the world
    setupObjects(canvasWidth, canvasHeight) {
        // Task Machine (top-left area)
        this.objects.push({
            id: 'taskMachine',
            name: 'Task Machine',
            x: 150,
            y: 150,
            width: 64,
            height: 64,
            color: '#C06C84',
            interactDistance: 50,
            onInteract: () => Game.showTaskMachine()
        });

        // Mirror (top-right area)
        this.objects.push({
            id: 'mirror',
            name: 'Mirror',
            x: canvasWidth - 150,
            y: 150,
            width: 64,
            height: 64,
            color: '#6C5B7B',
            interactDistance: 50,
            onInteract: () => Game.showMirror()
        });

        // Roulette Wheel (center)
        this.objects.push({
            id: 'roulette',
            name: 'Roulette Wheel',
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            width: 64,
            height: 64,
            color: '#ffd93d',
            interactDistance: 50,
            onInteract: () => Game.showRoulette()
        });

        // Couch (bottom area) - Does nothing on purpose
        this.objects.push({
            id: 'couch',
            name: 'Couch',
            x: canvasWidth / 2,
            y: canvasHeight - 100,
            width: 80,
            height: 48,
            color: '#355C7D',
            interactDistance: 50,
            onInteract: () => {} // Silent. Always.
        });
    }

    // Update world
    update(deltaTime) {
        // World updates (if needed)
    }

    // Draw world
    draw(ctx) {
        // Get canvas dimensions from the canvas element
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;

        // Draw floor
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Draw grid pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 32;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw objects
        this.objects.forEach(obj => {
            this.drawObject(ctx, obj);
        });
    }

    // Draw individual object
    drawObject(ctx, obj) {
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(obj.x, obj.y + obj.height / 2 + 5, obj.width / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw object
        ctx.fillStyle = obj.color;
        ctx.fillRect(
            obj.x - obj.width / 2,
            obj.y - obj.height / 2,
            obj.width,
            obj.height
        );

        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            obj.x - obj.width / 2,
            obj.y - obj.height / 2,
            obj.width,
            obj.height
        );

        // Draw label
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(obj.name.toUpperCase(), obj.x, obj.y - obj.height / 2 - 10);
    }

    // Check if player is near any object
    checkInteraction(player) {
        const playerBounds = player.getBounds();

        for (let obj of this.objects) {
            const distance = this.getDistance(
                playerBounds.centerX,
                playerBounds.centerY,
                obj.x,
                obj.y
            );

            if (distance <= obj.interactDistance) {
                return obj;
            }
        }

        return null;
    }

    // Calculate distance between two points
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Resize world when canvas resizes
    resize(width, height) {
        // Reposition objects based on new dimensions
        this.objects.forEach(obj => {
            if (obj.id === 'mirror') {
                obj.x = width - 150;
            } else if (obj.id === 'roulette') {
                obj.x = width / 2;
                obj.y = height / 2;
            } else if (obj.id === 'couch') {
                obj.x = width / 2;
                obj.y = height - 100;
            }
        });
    }
}

