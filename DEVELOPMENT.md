# 🎮 Procrastination Arcade - Development Guide

## 🏗 Architecture Overview

The game is built with vanilla JavaScript using a modular architecture:

### Core Systems

1. **Game Loop** (`game.js`)
   - Main `requestAnimationFrame` loop
   - Delta-time updates for consistent gameplay
   - Screen shake effects
   - Orchestrates all systems

2. **Player** (`player.js`)
   - Movement with WASD/arrows
   - Animation states (up/down/left/right)
   - Collision bounds
   - Cosmetic rendering (colors, hats)

3. **World** (`world.js`)
   - Object management
   - Collision detection
   - Grid rendering
   - Interactive zones

4. **Controls** (`controls.js`)
   - Keyboard input
   - Mobile touch/joystick
   - Dual input system

5. **Storage** (`storage.js`)
   - LocalStorage abstraction
   - Simple key naming: `xp`, `level`, `streak`, etc.
   - XP/level progression logic
   - Cosmetic unlock system

6. **Tasks** (`tasks.js`)
   - 50+ categorized tasks
   - Random selection
   - Custom task support
   - Share text generation

7. **Dialogue** (`dialogue.js`)
   - NPC personality system
   - Hardcoded responses
   - Context-aware messages

8. **UI** (`ui.js`)
   - HUD updates
   - Modal system
   - Particle effects
   - Task completion flow

9. **Loader** (`loader.js`)
   - Asset loading
   - Progress tracking
   - Placeholder sprites

## 🎨 Adding Pixel Art

### Step 1: Download Sprites

**Recommended Sources:**
- [Kenney.nl](https://kenney.nl/assets) - Micro Roguelike, Abstract Platformer
- [itch.io](https://itch.io/game-assets/free/tag-pixel-art) - Free pixel art packs
- [OpenGameArt.org](https://opengameart.org/)

### Step 2: Organize Assets

Place sprites in `assets/sprites/`:
```
assets/sprites/
├── player.png
├── task-machine.png
├── mirror.png
├── roulette.png
├── couch.png
├── hats/
│   ├── cap.png
│   ├── crown.png
│   └── wizard.png
└── pets/
    ├── blob.png
    ├── cat.png
    └── ghost.png
```

### Step 3: Update Loader

In `js/loader.js`, replace `loadPlaceholders()` with actual image loading:

```javascript
async loadAssets() {
    try {
        this.assets.playerSprite = await this.loadImage('assets/sprites/player.png');
        this.loadedAssets++;
        this.updateProgress((this.loadedAssets / this.totalAssets) * 100);
        
        // Repeat for other sprites...
    } catch (error) {
        console.error('Failed to load assets:', error);
        // Fallback to placeholders
        await this.loadPlaceholders();
    }
}
```

### Step 4: Update Draw Functions

In `js/player.js`, replace colored rectangle with sprite:

```javascript
draw(ctx) {
    const sprite = Loader.assets.playerSprite;
    if (sprite) {
        ctx.drawImage(
            sprite,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    } else {
        // Fallback to placeholder
        ctx.fillStyle = this.color;
        ctx.fillRect(...);
    }
}
```

## 🔊 Adding Sound Effects

### Step 1: Get Free Sounds

**Sources:**
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [SFXR](https://sfxr.me/) - Generate retro sounds

### Step 2: Create Sound Manager

Create `js/sound.js`:

```javascript
const Sound = {
    sounds: {},
    muted: false,
    
    init() {
        this.sounds.taskComplete = new Audio('assets/sounds/complete.wav');
        this.sounds.levelUp = new Audio('assets/sounds/levelup.wav');
        this.sounds.interact = new Audio('assets/sounds/blip.wav');
    },
    
    play(soundName) {
        if (this.muted || !this.sounds[soundName]) return;
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
    }
};
```

### Step 3: Add to index.html

```html
<script src="js/sound.js"></script>
```

### Step 4: Trigger Sounds

In `js/ui.js`:

```javascript
handleTaskCompletion(status, task) {
    // Existing code...
    Sound.play('taskComplete');
    
    if (result.leveledUp) {
        Sound.play('levelUp');
    }
}
```

## 🐾 Adding Pet Animations

In `js/world.js`, add pet following logic:

```javascript
class Pet {
    constructor(type, target) {
        this.type = type;
        this.target = target; // Player reference
        this.x = target.x;
        this.y = target.y;
        this.offset = 40; // Distance behind player
        this.followSpeed = 0.1; // Smooth following
    }
    
    update(deltaTime) {
        // Calculate desired position (behind player)
        const angle = Math.atan2(
            this.target.y - this.y,
            this.target.x - this.x
        );
        const desiredX = this.target.x - Math.cos(angle) * this.offset;
        const desiredY = this.target.y - Math.sin(angle) * this.offset;
        
        // Smooth lerp to desired position
        this.x += (desiredX - this.x) * this.followSpeed;
        this.y += (desiredY - this.y) * this.followSpeed;
    }
    
    draw(ctx) {
        // Draw pet sprite
        ctx.fillStyle = '#4ecca3';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

Add to Game.init():

```javascript
const cosmetics = Storage.get(Storage.keys.COSMETICS);
if (cosmetics.activePet) {
    this.pet = new Pet(cosmetics.activePet, this.player);
}
```

## 📊 Analytics (Privacy-Friendly)

Track stats without external services:

```javascript
// In storage.js
getAnalytics() {
    const history = this.get(this.keys.HISTORY);
    const now = new Date();
    const daysSinceStart = Math.floor(
        (now - new Date(history.startDate)) / (1000 * 60 * 60 * 24)
    );
    
    return {
        totalTasks: history.totalCompleted + history.totalHalfCompleted + history.totalLied,
        avgTasksPerDay: (totalTasks / daysSinceStart).toFixed(1),
        honestRate: (history.totalCompleted / totalTasks * 100).toFixed(1),
        favoriteCategory: this.getMostUsedCategory()
    };
}
```

## 🎮 Gameplay Balancing

### XP Curve

Current formula: `100 * level * (level + 1) / 2`

| Level | XP Required | XP Total |
|-------|-------------|----------|
| 1→2   | 100         | 100      |
| 2→3   | 250         | 350      |
| 3→4   | 450         | 800      |
| 4→5   | 700         | 1500     |
| 5→6   | 1000        | 2500     |

### Task Completion Rewards

- ✅ Completed: **15 XP** (honest, full effort)
- 😐 Half: **8 XP** (honest, partial effort)
- ❌ Lied: **2 XP** (pity points for honesty)

### Cosmetic Unlocks

- **Colors**: Every 2 levels (Levels 2, 4, 6, 8...)
- **Hats**: Levels 3, 5, 8, 12, 16, 20
- **Pets**: Levels 7, 14, 21, 30

## 🧪 Testing Checklist

- [ ] Player movement (keyboard)
- [ ] Player movement (mobile joystick)
- [ ] Interaction with all NPCs
- [ ] Task acceptance and completion
- [ ] XP gain and level up
- [ ] Streak tracking (change device date to test)
- [ ] LocalStorage persistence (refresh page)
- [ ] Custom task addition
- [ ] Share text generation
- [ ] Cosmetic unlocks
- [ ] Mobile responsiveness
- [ ] Keyboard navigation (Tab, Enter)

## 🐛 Common Issues

### Canvas Blurry on High DPI

Already handled in `resizeCanvas()` with `devicePixelRatio`.

### Modal Not Closing on Mobile

Ensure touch events have `e.preventDefault()` in button handlers.

### LocalStorage Full

LocalStorage has ~5-10MB limit. Current usage: ~50KB. Monitor with:

```javascript
console.log(JSON.stringify(localStorage).length + ' bytes used');
```

### Game Loop Performance

Target: 60 FPS. Current optimizations:
- Delta-time updates
- Minimal canvas clears
- Simple collision detection

Monitor with:
```javascript
console.log('FPS:', (1 / deltaTime).toFixed(0));
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Push to GitHub
2. Settings → Pages → Source: `main` branch `/root`
3. Done! Live at `username.github.io/procrastination-arcade`

### Netlify

1. Drag & drop project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Instant deploy!

### Vercel

```bash
npm install -g vercel
cd procrastination-arcade
vercel
```

## 📝 Future Ideas

- [ ] Multiple save slots
- [ ] Import/export progress
- [ ] Dark/light mode toggle
- [ ] Custom color themes
- [ ] Weekly challenges
- [ ] Achievement system
- [ ] Leaderboard (local only)
- [ ] Task templates
- [ ] Pomodoro timer integration
- [ ] Seasonal events
- [ ] More NPCs (Coffee Machine, Bookshelf, etc.)
- [ ] Room customization
- [ ] Day/night cycle

## 💬 Philosophy

This game is intentionally simple. No webpack, no npm, no build process. Just open `index.html` and play.

The goal is **vibe coding** - make it fun, make it work, make it yours.

---

**Happy coding! Now go procrastinate productively.**

