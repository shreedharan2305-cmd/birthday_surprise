/**
 * NITHYA PRIYA'S (HANUMAN) INTERACTIVE BIRTHDAY SURPRISE
 * Complete vanilla JavaScript implementation
 * Features:
 * - Central Audio Controller (BGM, sound effects, video priority coordination)
 * - Interactive 3D Envelope & progressive letter unfold
 * - 6-Photo digital scrapbook carousel
 * - 3-Video reel player with intelligent pause/resume coordination
 * - Canvas particle system (floating petals, butterflies, sparkles)
 * - Confetti celebrate burst & hug interaction
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentPage: 1,
    totalPages: 5,
    isMusicPlaying: false,
    bgmPosition: 0,
    wasBgmPlayingBeforeVideo: false,
    envelopeOpened: false,
    currentScrapbookIndex: 0,
    totalScrapbookItems: 6,
    currentVideoIndex: 0,
    totalVideos: 3,
    audioInitialized: false
  };

  // DOM Elements
  const elements = {
    appContainer: document.getElementById('app-container'),
    pages: document.querySelectorAll('.page-section'),
    pageIndicator: document.getElementById('page-indicator'),
    navDots: document.querySelectorAll('.nav-dots .dot'),
    btnNavPrev: document.getElementById('nav-btn-prev'),
    btnNavNext: document.getElementById('nav-btn-next'),
    
    // Music Controls
    btnMusicToggle: document.getElementById('music-toggle-btn'),
    musicIcon: document.getElementById('music-icon'),
    musicLabel: document.getElementById('music-label'),
    soundWave: document.getElementById('sound-wave'),
    
    // Page 1 Elements
    btnOpenSurprise: document.getElementById('btn-open-surprise'),
    
    // Page 2 Elements (Envelope & Letter)
    envelope: document.getElementById('envelope'),
    letterPaper: document.getElementById('letter-paper'),
    letterParas: document.querySelectorAll('.letter-para'),
    letterSig: document.querySelector('.letter-signature'),
    postLetterAction: document.getElementById('post-letter-action'),
    btnAfterLetter: document.getElementById('btn-after-letter'),
    
    // Page 3 Elements (Scrapbook)
    scrapbookSlides: document.querySelectorAll('.scrapbook-slide'),
    memoryTabs: document.querySelectorAll('.memory-tab'),
    btnScrapPrev: document.getElementById('btn-scrap-prev'),
    btnScrapNext: document.getElementById('btn-scrap-next'),
    scrapCounter: document.getElementById('scrap-counter'),
    btnGoToVideos: document.getElementById('btn-go-to-videos'),
    
    // Page 4 Elements (Videos)
    videoCards: document.querySelectorAll('.video-card-frame'),
    videoTabs: document.querySelectorAll('.v-tab-btn'),
    videoPlayers: document.querySelectorAll('.scrapbook-video'),
    btnVPrev: document.getElementById('btn-v-prev'),
    btnVNext: document.getElementById('btn-v-next'),
    videoCounter: document.getElementById('video-counter'),
    btnGoToFinal: document.getElementById('btn-go-to-final'),
    
    // Page 5 Elements (Final Screen)
    btnReplay: document.getElementById('btn-replay'),
    btnHug: document.getElementById('btn-hug'),
    hugToast: document.getElementById('hug-toast'),
    
    // Canvas
    canvas: document.getElementById('ambient-canvas')
  };

  // ==============================================================
  // AUDIO CONTROLLER (BGM + SOUND EFFECTS + VIDEO COORDINATION)
  // ==============================================================
  class CentralAudioController {
    constructor() {
      this.bgm = new Audio('assets/music/bgm.wav');
      this.bgm.loop = true;
      this.bgm.volume = 0.42;

      this.clickSound = new Audio('assets/sounds/button_click.wav');
      this.clickSound.volume = 0.55;

      this.envelopeSound = new Audio('assets/sounds/envelope_open.wav');
      this.envelopeSound.volume = 0.7;

      this.paperRustle = new Audio('assets/sounds/paper_rustle.wav');
      this.paperRustle.volume = 0.6;

      // Web Audio API context fallback
      this.audioCtx = null;

      // Handle BGM errors gracefully
      this.bgm.addEventListener('error', () => {
        console.warn('Audio file loading issue; falling back to Web Audio synthesis if needed.');
      });
    }

    initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      state.audioInitialized = true;
    }

    playClick() {
      this.initContext();
      try {
        this.clickSound.currentTime = 0;
        const playPromise = this.clickSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => this.synthClick());
        }
      } catch (e) {
        this.synthClick();
      }
    }

    playEnvelopeOpen() {
      this.initContext();
      try {
        this.envelopeSound.currentTime = 0;
        const playPromise = this.envelopeSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => this.synthEnvelope());
        }
      } catch (e) {
        this.synthEnvelope();
      }
    }

    playPaperRustle() {
      this.initContext();
      try {
        this.paperRustle.currentTime = 0;
        this.paperRustle.play().catch(() => {});
      } catch (e) {}
    }

    startBgm() {
      this.initContext();
      try {
        const playPromise = this.bgm.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              state.isMusicPlaying = true;
              this.updateMusicUI(true);
            })
            .catch((err) => {
              console.log('Autoplay restriction prevented audio start:', err);
              state.isMusicPlaying = false;
              this.updateMusicUI(false);
            });
        }
      } catch (e) {
        console.log('BGM play error:', e);
      }
    }

    pauseBgm() {
      try {
        this.bgm.pause();
        state.isMusicPlaying = false;
        this.updateMusicUI(false);
      } catch (e) {}
    }

    toggleBgm() {
      this.playClick();
      if (state.isMusicPlaying) {
        this.pauseBgm();
      } else {
        this.startBgm();
      }
    }

    onVideoPlay() {
      // Pause BGM when video begins playing, remember previous state
      if (state.isMusicPlaying) {
        state.wasBgmPlayingBeforeVideo = true;
        this.pauseBgm();
      }
    }

    onVideoPauseOrEnd() {
      // Check if any other video is currently playing
      let isAnyVideoActive = false;
      elements.videoPlayers.forEach((v) => {
        if (!v.paused && !v.ended) isAnyVideoActive = true;
      });

      // If no video is playing and music was playing previously, restore BGM
      if (!isAnyVideoActive && state.wasBgmPlayingBeforeVideo) {
        state.wasBgmPlayingBeforeVideo = false;
        this.startBgm();
      }
    }

    updateMusicUI(isPlaying) {
      if (isPlaying) {
        elements.btnMusicToggle.classList.add('playing');
        elements.musicIcon.textContent = '🎵';
        elements.musicLabel.textContent = 'Music: On';
      } else {
        elements.btnMusicToggle.classList.remove('playing');
        elements.musicIcon.textContent = '🔇';
        elements.musicLabel.textContent = 'Music: Off';
      }
    }

    // Web Audio Fallbacks
    synthClick() {
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
      } catch (e) {}
    }

    synthEnvelope() {
      if (!this.audioCtx) return;
      try {
        // Synthesize paper swoosh with white noise + filter
        const bufferSize = this.audioCtx.sampleRate * 0.4;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.4);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();
      } catch (e) {}
    }
  }

  const audio = new CentralAudioController();

  // ==============================================================
  // NAVIGATION CONTROLLER
  // ==============================================================
  function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > state.totalPages || pageNumber === state.currentPage) {
      return;
    }

    audio.playClick();

    // If leaving video page, pause all videos
    if (state.currentPage === 4) {
      pauseAllVideos();
    }

    // Update active section
    elements.pages.forEach((p) => {
      const pNum = parseInt(p.dataset.page, 10);
      if (pNum === pageNumber) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    state.currentPage = pageNumber;
    updateNavControls();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNavControls() {
    // Update indicator
    elements.pageIndicator.textContent = `${state.currentPage} / ${state.totalPages}`;

    // Update bottom dots
    elements.navDots.forEach((dot) => {
      const pNum = parseInt(dot.dataset.page, 10);
      if (pNum === state.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Next / Prev buttons
    elements.btnNavPrev.disabled = state.currentPage === 1;
    elements.btnNavNext.disabled = state.currentPage === state.totalPages;
  }

  // ==============================================================
  // INTERACTIVE 3D ENVELOPE & LETTER SEQUENCE
  // ==============================================================
  function openEnvelope() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    // Play sounds
    audio.playEnvelopeOpen();
    setTimeout(() => audio.playPaperRustle(), 400);

    // Envelope flap 3D animation
    elements.envelope.classList.add('opened');

    // Create heart sparkle burst
    createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);

    // Progressive letter content reveal
    const paras = Array.from(elements.letterParas);
    paras.forEach((para, idx) => {
      setTimeout(() => {
        para.classList.add('revealed');
      }, 500 + idx * 300);
    });

    // Reveal signature after paragraphs
    const sigDelay = 500 + paras.length * 300 + 350;
    setTimeout(() => {
      if (elements.letterSig) {
        elements.letterSig.classList.add('revealed');
      }
      // Show post-letter next button
      elements.postLetterAction.classList.remove('hidden');
    }, sigDelay);
  }

  // ==============================================================
  // SCRAPBOOK CAROUSEL (6 INDIVIDUAL DESIGNS)
  // ==============================================================
  function showScrapbookSlide(index) {
    if (index < 0 || index >= state.totalScrapbookItems) return;
    state.currentScrapbookIndex = index;

    elements.scrapbookSlides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    elements.memoryTabs.forEach((tab, idx) => {
      if (idx === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    elements.scrapCounter.textContent = `${index + 1} of ${state.totalScrapbookItems}`;
  }

  // ==============================================================
  // VIDEO REEL PLAYER (3 UPLOADED VIDEOS)
  // ==============================================================
  function showVideoCard(index) {
    if (index < 0 || index >= state.totalVideos) return;

    // Pause currently playing videos before switching
    pauseAllVideos();

    state.currentVideoIndex = index;

    elements.videoCards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    elements.videoTabs.forEach((tab, idx) => {
      if (idx === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    elements.videoCounter.textContent = `Reel ${index + 1} of ${state.totalVideos}`;
  }

  function pauseAllVideos() {
    elements.videoPlayers.forEach((video) => {
      if (!video.paused) {
        video.pause();
      }
    });
    audio.onVideoPauseOrEnd();
  }

  // Setup video audio coordination
  function setupVideoListeners() {
    elements.videoPlayers.forEach((video) => {
      video.addEventListener('play', () => {
        // Stop any other video that might be playing
        elements.videoPlayers.forEach((other) => {
          if (other !== video && !other.paused) {
            other.pause();
          }
        });
        audio.onVideoPlay();
      });

      video.addEventListener('pause', () => {
        audio.onVideoPauseOrEnd();
      });

      video.addEventListener('ended', () => {
        audio.onVideoPauseOrEnd();
      });
    });
  }

  // ==============================================================
  // AMBIENT PARTICLE SYSTEM (FALLING PETALS, BUTTERFLIES, SPARKLES)
  // ==============================================================
  class AmbientCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.resize();
      this.initParticles();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    initParticles() {
      const count = window.innerWidth < 600 ? 22 : 36;
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle() {
      const types = ['petal', 'sparkle', 'heart'];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        type: type,
        opacity: Math.random() * 0.4 + 0.4,
        color: type === 'sparkle' ? '#FFD54F' : (Math.random() > 0.5 ? '#F48FB1' : '#CE93D8')
      };
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.015) * 0.8 + p.speedX;
        p.rotation += p.rotationSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;

        if (p.type === 'petal') {
          // Draw delicate floral petal
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, 2 * Math.PI);
          this.ctx.fill();
        } else if (p.type === 'sparkle') {
          // Draw cute golden 4-point star
          this.ctx.fillStyle = p.color;
          const s = p.size * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(0, -s);
          this.ctx.lineTo(s * 0.3, -s * 0.3);
          this.ctx.lineTo(s, 0);
          this.ctx.lineTo(s * 0.3, s * 0.3);
          this.ctx.lineTo(0, s);
          this.ctx.lineTo(-s * 0.3, s * 0.3);
          this.ctx.lineTo(-s, 0);
          this.ctx.lineTo(-s * 0.3, -s * 0.3);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          // Draw mini heart
          this.ctx.fillStyle = p.color;
          const h = p.size * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(0, h * 0.3);
          this.ctx.bezierCurveTo(-h, -h * 0.5, -h * 1.5, h * 0.5, 0, h * 1.5);
          this.ctx.bezierCurveTo(h * 1.5, h * 0.5, h, -h * 0.5, 0, h * 0.3);
          this.ctx.fill();
        }

        this.ctx.restore();

        // Respawn when falling off bottom
        if (p.y > this.height + 20) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
      }

      requestAnimationFrame(this.animate);
    }
  }

  // Sparkle Burst function for celebrations
  function createSparkleBurst(cx, cy) {
    const burstCount = 20;
    const colors = ['#FF4081', '#E040FB', '#FFD54F', '#69F0AE', '#40C4FF'];
    for (let i = 0; i < burstCount; i++) {
      const el = document.createElement('div');
      el.className = 'floating-sticker';
      el.textContent = ['💖', '✨', '🌸', '⭐', '🎉'][i % 5];
      el.style.left = `${cx + (Math.random() - 0.5) * 160}px`;
      el.style.top = `${cy + (Math.random() - 0.5) * 160}px`;
      el.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
      el.style.opacity = '1';
      document.body.appendChild(el);

      setTimeout(() => {
        el.style.transform = `translate(${(Math.random() - 0.5) * 200}px, -${Math.random() * 120 + 40}px) scale(1.4)`;
        el.style.opacity = '0';
      }, 50);

      setTimeout(() => el.remove(), 1300);
    }
  }

  // ==============================================================
  // EVENT LISTENERS INITIALIZATION
  // ==============================================================
  function setupEventListeners() {
    // Unlock audio context on first user click anywhere
    document.addEventListener('click', () => audio.initContext(), { once: true });
    document.addEventListener('touchstart', () => audio.initContext(), { once: true });

    // Music toggle button
    elements.btnMusicToggle.addEventListener('click', () => {
      audio.toggleBgm();
    });

    // Page 1: Open surprise button
    elements.btnOpenSurprise.addEventListener('click', () => {
      audio.startBgm();
      goToPage(2);
    });

    // Page 2: Envelope click
    elements.envelope.addEventListener('click', openEnvelope);
    elements.envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openEnvelope();
      }
    });

    // Page 2: Post letter next button
    elements.btnAfterLetter.addEventListener('click', () => {
      goToPage(3);
    });

    // Page 3: Scrapbook controls
    elements.btnScrapPrev.addEventListener('click', () => {
      audio.playClick();
      const prev = state.currentScrapbookIndex > 0 ? state.currentScrapbookIndex - 1 : state.totalScrapbookItems - 1;
      showScrapbookSlide(prev);
    });

    elements.btnScrapNext.addEventListener('click', () => {
      audio.playClick();
      const next = state.currentScrapbookIndex < state.totalScrapbookItems - 1 ? state.currentScrapbookIndex + 1 : 0;
      showScrapbookSlide(next);
    });

    elements.memoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        audio.playClick();
        showScrapbookSlide(parseInt(tab.dataset.index, 10));
      });
    });

    elements.btnGoToVideos.addEventListener('click', () => {
      goToPage(4);
    });

    // Page 4: Video controls
    elements.btnVPrev.addEventListener('click', () => {
      audio.playClick();
      const prev = state.currentVideoIndex > 0 ? state.currentVideoIndex - 1 : state.totalVideos - 1;
      showVideoCard(prev);
    });

    elements.btnVNext.addEventListener('click', () => {
      audio.playClick();
      const next = state.currentVideoIndex < state.totalVideos - 1 ? state.currentVideoIndex + 1 : 0;
      showVideoCard(next);
    });

    elements.videoTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        audio.playClick();
        showVideoCard(parseInt(tab.dataset.v, 10));
      });
    });

    elements.btnGoToFinal.addEventListener('click', () => {
      goToPage(5);
    });

    // Page 5: Final screen actions
    elements.btnReplay.addEventListener('click', () => {
      goToPage(1);
    });

    elements.btnHug.addEventListener('click', () => {
      audio.playClick();
      elements.hugToast.classList.add('show');
      createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.4);
      setTimeout(() => {
        elements.hugToast.classList.remove('show');
      }, 3500);
    });

    // Persistent Bottom Navigation Controls
    elements.btnNavPrev.addEventListener('click', () => {
      goToPage(state.currentPage - 1);
    });

    elements.btnNavNext.addEventListener('click', () => {
      goToPage(state.currentPage + 1);
    });

    elements.navDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToPage(parseInt(dot.dataset.page, 10));
      });
    });

    // Setup Video listeners
    setupVideoListeners();

    // Initialize Canvas
    if (elements.canvas) {
      new AmbientCanvas(elements.canvas);
    }
  }

  // Initialize website on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateNavControls();
  });

})();
