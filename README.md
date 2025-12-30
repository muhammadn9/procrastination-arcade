# 🎮 Procrastination Arcade

A chaotic, arcade-style productivity game where avoiding work becomes... work?

## 🔥 What Is This?

An honest-to-goodness arcade game that tricks you into being productive. Control a pixel character, interact with sarcastic NPCs, get random tasks, track your honesty, and unlock cosmetic rewards. It's procrastination with purpose.

## ✨ Features

- **2D Top-Down Arcade Gameplay** - Move around, interact with objects, avoid responsibility (ironically)
- **Task Roulette** - 50+ categorized productive tasks (Clean, Learn, Move, Focus, Life Admin)
- **Daily Honesty Check** - Mirror NPC asks "Were you productive today?" (honesty counts)
- **Three Distinct NPCs** with unique personalities:
  - **Task Machine** (robotic/cynical)
  - **Mirror** (philosophical/guilt-trippy)
  - **Roulette Wheel** (chaotic/manic)
  - **Couch** (completely silent, on purpose)
- **Progression System** - Earn XP, level up, unlock cosmetics (colors, hats, pets, decorations)
- **Self-Reporting** - Did it / Half-did it / Lied to yourself (we track the lying)
- **Shareable Accomplishments** - "Today I completed..." text with sarcastic stats
- **Mobile & Desktop** - Touch controls + keyboard support
- **Accessibility** - Keyboard navigation, focus indicators, ARIA labels

## 🎮 Controls

### Desktop
- **WASD / Arrow Keys** - Move character
- **E / Space / Enter** - Interact with objects
- **Tab** - Navigate menus

### Mobile
- **Virtual Joystick** - Move character
- **Interact Button** - Interact with objects
- **Touch** - Navigate menus

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/procrastination-arcade.git
   cd procrastination-arcade
   ```

2. **Open in browser**
   ```bash
   open index.html
   # or just double-click index.html
   ```

3. **Deploy to GitHub Pages** (optional)
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` / `root`
   - Your game will be live at `https://yourusername.github.io/procrastination-arcade`

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks, no build tools)
- **Game Engine**: HTML5 Canvas API
- **Storage**: LocalStorage (no backend required)
- **Fonts**: Google Fonts (Press Start 2P)
- **Assets**: Free pixel art from Kenney.nl & itch.io (placeholders for now)

## 📁 Project Structure

```
procrastination-arcade/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles
│   └── loading.css        # Loading screen styles
├── js/
│   ├── game.js            # Core game loop
│   ├── player.js          # Player class
│   ├── world.js           # World & objects
│   ├── tasks.js           # Task system (50+ tasks)
│   ├── storage.js         # LocalStorage management
│   ├── dialogue.js        # NPC personalities
│   ├── controls.js        # Input handling
│   ├── loader.js          # Asset loading
│   └── ui.js              # HUD & modals
├── assets/
│   └── sprites/           # Pixel art assets (add your own)
└── README.md
```

## 🎨 Customization

### Adding Custom Tasks

In-game: Interact with Task Machine → "Add Custom Task"

Or edit `js/tasks.js`:
```javascript
{
    text: "Your custom task here",
    duration: "⏱️", // ⏱️ quick, ⏰ medium, ⌛ longer
    category: "focus", // clean, learn, move, focus, lifeAdmin
    unlockLevel: 1
}
```

### Changing Colors

Edit `css/style.css`:
```css
:root {
    --color-primary: #FF6B9D;   /* Pink */
    --color-secondary: #C06C84; /* Rose */
    --color-tertiary: #6C5B7B;  /* Purple */
    --color-dark: #355C7D;      /* Navy */
}
```

### Adding Real Pixel Art

1. Download sprites from [Kenney.nl](https://kenney.nl/assets) or [itch.io](https://itch.io/game-assets/free/tag-pixel-art)
2. Place in `assets/sprites/`
3. Update `js/loader.js` to load your sprites
4. Modify draw functions in `player.js` and `world.js`

## 🎯 Roadmap

- [x] Core game loop with movement
- [x] Interactive objects & collision
- [x] Task system with 50+ tasks
- [x] Daily productivity check-in
- [x] XP & leveling system
- [x] Cosmetic unlocks
- [x] Mobile touch controls
- [x] Share feature
- [ ] Replace placeholders with pixel art
- [ ] Sound effects (optional)
- [ ] Pet following animations
- [ ] Room decorations
- [ ] More NPC dialogue variations
- [ ] Custom task categories

## 🐛 Known Issues

- Sprites are currently colored placeholders (pixel art coming soon)
- No sound effects yet (silent arcade vibes)
- Pet animations are simplified (just follow player)

## 🤝 Contributing

This is a solo vibe-coded project, but suggestions welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR with a sarcastic description

## 📄 License

MIT License - Do whatever you want with this. Make productivity games. Make procrastination simulators. The world is your arcade.

## 🙏 Credits

- **Font**: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38
- **Pixel Art**: [Kenney.nl](https://kenney.nl), [itch.io](https://itch.io/game-assets/free)
- **Inspiration**: Every productivity app that failed to stop my procrastination

## 💬 Philosophy

> "The best productivity system is the one you actually use. Even if it's a game about avoiding work."

---

**Made with ☕ and existential dread**

Questions? Found a bug? Want to share your lying probability stats? Open an issue!

