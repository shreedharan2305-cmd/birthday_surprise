# 🌸 Nithya Priya's (Hanuman) Interactive Birthday Surprise Website

A dreamy, floral scrapbook-themed interactive birthday experience created with love and playful nostalgia for **Nithya Priya** (nickname: **Hanuman**).

---

## ✨ Features & Highlights

1. **Magical Birthday Welcome Screen**
   - Floating pastel flower petals, gentle butterflies, and golden sparkles.
   - Animated birthday cake with flickering candles.
   - Nostalgic memories department badge: *"Established in 2017, powered by friendship, unlimited mokka jokes, and lifetime torture! 😂"*
   - *"Since 2017 – still tolerating each other!"*

2. **Interactive 3D Letter from Envelope**
   - Pastel pink/lavender envelope addressed to: *"For my favourite headache – Hanuman ❤️"*
   - Gentle unsealing swoosh and paper rustle sounds.
   - Smooth 3D flap unsealing & upward sliding letter animation.
   - Progressive handwritten reveal of the exact confirmed Tanglish/Tamil birthday letter.
   - Floating hearts, stars, and scrapbook stickers.

3. **Digital Photo Scrapbook (6 Chapters)**
   - All 6 uploaded photographs transformed into individual scrapbook designs (`scrapbook_1.png` to `scrapbook_6.png`).
   - Washi tape strips, postage stamps, floral blooms, and handwritten captions.
   - Smooth carousel with category tabs: *Princess ✨, Little Days 🌸, School Vibes 🌿, Saree Swag 💖, Twirl Queen 💃, Besties Forever ❤️*.

4. **Video Reels (Videos 1, 2, and 3)**
   - Displays all three uploaded video reels in portrait 9:16 layout without cropping or distortion.
   - Preserves original video audio.
   - Floral scrapbook borders and fun captions for each reel.

5. **Intelligent Coordinated Audio System**
   - Dreamy kalimba/music-box instrumental background music (`assets/music/bgm.wav`).
   - Button click sounds & envelope opening effects.
   - **Video Audio Priority**: Automatically pauses background music when any video starts playing, and smoothly resumes it when paused or finished.
   - Autoplay resilient with Web Audio API synthesis fallback.
   - Persistent music toggle with sound-wave animation in the top bar.

6. **Final Birthday Screen**
   - Big celebration screen with cake illustration.
   - *"Once again, Happy Birthday, Hanuman! ❤️"*
   - *"Keep smiling, keep shining, and never stop being the crazy person you are! 😂"*
   - Interactive buttons: *"Replay Our Memories 🔄"* and *"Send a Birthday Hug 🤗❤️"* with confetti explosion.

---

## 📁 Project Structure

```
birthday-surprise/
│
├── index.html                   # Main single-page application structure
├── style.css                    # Dreamy floral scrapbook styling & animations
├── script.js                    # Vanilla JS: Audio controller, transitions, particle canvas
├── README.md                    # Documentation & setup guide
│
└── assets/
    ├── photos/
    │   ├── photo_1.jpg ... photo_6.jpg     # Original uploaded photographs
    │   └── scrapbook_1.png ... 6.png       # 6 Individual scrapbook compositions
    ├── videos/
    │   ├── video_1.mp4                     # Video Reel 1
    │   ├── video_2.mp4                     # Video Reel 2
    │   └── video_3.mp4                     # Video Reel 3
    ├── music/
    │   └── bgm.wav                         # Dreamy looping background track (53.3s)
    ├── sounds/
    │   ├── button_click.wav                # Soft satisfying click
    │   ├── envelope_open.wav               # Realistic paper unsealing swoosh
    │   └── paper_rustle.wav                # Parchment unfold sound
    ├── flowers/
    │   ├── petal.svg                       # Floating petal SVG
    │   └── flower_sprig.svg                # Corner botanical bouquet SVG
    └── stickers/
        ├── butterfly.svg                   # Fluttering pastel butterfly SVG
        └── cake.svg                        # Tiered birthday cake with candles SVG
```

---

## 🚀 How to Run Locally

Because the website uses local media files (audio, videos, and images), modern browsers require a standard local static web server to prevent `file://` CORS restrictions on audio/video playback.

### Option 1: Python HTTP Server (Recommended)
Open a terminal in the `birthday-surprise` directory and run:
```bash
python -m http.server 8000
```
Then visit: [http://localhost:8000](http://localhost:8000)

### Option 2: Node.js (npx serve or live-server)
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🌐 How to Deploy Publicly (One Click & Free)

The website is 100% static (HTML, CSS, Vanilla JS, and local media assets) and can be hosted on any static hosting platform.

### Deploying to Netlify
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `birthday-surprise/` folder directly onto the page.
3. Your site is live instantly with a public URL! (You can customize the domain name to something like `happy-birthday-hanuman.netlify.app`).

### Deploying to GitHub Pages
1. Push the `birthday-surprise` folder contents to a GitHub repository (e.g., `hanuman-birthday`).
2. Go to repository **Settings** → **Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your website will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🎵 Replacing or Customizing Media

- **Photos**: Placed in `assets/photos/`. Original photos are `photo_1.jpg` to `photo_6.jpg`.
- **Videos**: Placed in `assets/videos/`. Video files are `video_1.mp4`, `video_2.mp4`, `video_3.mp4`.
- **Music**: Place any MP3 or WAV file in `assets/music/bgm.wav` (or update the filename in `script.js`).
- **Sound Effects**: Placed in `assets/sounds/` for click, envelope opening, and rustling.
