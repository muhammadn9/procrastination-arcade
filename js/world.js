// ========================================
// WORLD CLASS
// Manages game world, objects, and interactions
// ========================================

class World {
    constructor(canvasWidth, canvasHeight) {
        this.objects = [];
        this.setupObjects(canvasWidth, canvasHeight);
    }

    // Setup interactive objects in custom home layout
    setupObjects(canvasWidth, canvasHeight) {
        const w = canvasWidth;
        const h = canvasHeight;

        // LIVING ROOM (Red area - Top Left) - Couch & TV
        this.objects.push({
            id: 'couch',
            name: 'Couch',
            x: w * 0.15,
            y: h * 0.25,
            width: 100,
            height: 60,
            color: '#D32F2F', // Red
            interactDistance: 50,
            onInteract: () => {} // Silent couch
        });

        this.objects.push({
            id: 'tv',
            name: 'TV',
            x: w * 0.15,
            y: h * 0.12,
            width: 80,
            height: 50,
            color: '#1a1a1a',
            interactDistance: 50,
            onInteract: () => Game.showRoulette()
        });

        // KITCHEN (Blue area - Top Right) - Fridge
        this.objects.push({
            id: 'fridge',
            name: 'Fridge',
            x: w * 0.85,
            y: h * 0.2,
            width: 60,
            height: 80,
            color: '#1976D2', // Blue
            interactDistance: 50,
            onInteract: () => Game.showTaskMachine()
        });

        // BEDROOM (Green area - Bottom Left) - Bed
        this.objects.push({
            id: 'bed',
            name: 'Bed',
            x: w * 0.15,
            y: h * 0.8,
            width: 120,
            height: 80,
            color: '#388E3C', // Green
            interactDistance: 50,
            onInteract: () => Game.showMirror()
        });

        // DESK/CLOSET AREA (Pink area - Bottom Right)
        this.objects.push({
            id: 'desk',
            name: 'Desk',
            x: w * 0.75,
            y: h * 0.8,
            width: 80,
            height: 60,
            color: '#E91E63', // Pink
            interactDistance: 50,
            onInteract: () => Game.showDeskTaskLog() // V2: New desk task logging
        });

        this.objects.push({
            id: 'closet',
            name: 'Closet',
            x: w * 0.9,
            y: h * 0.8,
            width: 60,
            height: 80,
            color: '#C2185B', // Darker pink
            interactDistance: 50,
            onInteract: () => UI.showCustomizationMenu()
        });

        // BATHROOM (White area - Center) - Mirror
        this.objects.push({
            id: 'mirror',
            name: 'Mirror',
            x: w * 0.85,
            y: h * 0.5,
            width: 60,
            height: 80,
            color: '#F5F5F5', // White/Light gray
            interactDistance: 50,
            onInteract: () => Game.showMirror()
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

        // V2: Draw room backgrounds based on home layout
        // Living Room (Red - Top Left)
        ctx.fillStyle = 'rgba(211, 47, 47, 0.1)';
        ctx.fillRect(0, 0, width/2, height/2);

        // Kitchen (Blue - Top Right)
        ctx.fillStyle = 'rgba(25, 118, 210, 0.1)';
        ctx.fillRect(width/2, 0, width/2, height/2);

        // Bedroom (Green - Bottom Left)
        ctx.fillStyle = 'rgba(56, 142, 60, 0.1)';
        ctx.fillRect(0, height/2, width/2, height/2);

        // Desk Area (Pink - Bottom Right)
        ctx.fillStyle = 'rgba(233, 30, 99, 0.1)';
        ctx.fillRect(width/2, height/2, width/2, height/2);

        // Bathroom (White - Center)
        ctx.fillStyle = 'rgba(245, 245, 245, 0.15)';
        ctx.fillRect(width*0.7, height*0.35, width*0.25, height*0.3);

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
