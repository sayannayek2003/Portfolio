/**
 * Sayan Nayek Portfolio - Interactive Engine
 * Handles Canvas particles, Typewriter, Theme Switching, Filtering,
 * Animated Metrics, Modals, Clipboard Toast, and Playable Snake Game.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initTypewriter();
  initNavbar();
  initSkillFilters();
  initMetricsCounter();
  initCurrentYear();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('sayan_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('sayan_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CANVAS PARTICLE CONSTELLATION
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 100 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.65)' : 'rgba(2, 132, 199, 0.65)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(56, 189, 248, ${alpha * 0.18})`
            : `rgba(2, 132, 199, ${alpha * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = [
    'Computer Science Engineer',
    'Data Science & ML Practitioner',
    'Power BI & Analytics Developer',
    'Java & Algorithmic Problem Solver',
    '5-Star HackerRank Coder'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. NAVIGATION BAR & ACTIVE SCROLL TRACKER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // Active section spy on scroll
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Header background shadow
    if (scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   5. FILTERABLE SKILLS TABS
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. ANIMATED STATS / METRICS COUNTER
   ========================================================================== */
function initMetricsCounter() {
  const metricsRibbon = document.querySelector('.metrics-ribbon');
  const numbers = document.querySelectorAll('.metric-number');
  if (!metricsRibbon || numbers.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        numbers.forEach(num => {
          const target = +num.getAttribute('data-target');
          let count = 0;
          const duration = 1600;
          const increment = Math.ceil(target / (duration / 25));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              num.textContent = target;
              clearInterval(timer);
            } else {
              num.textContent = count;
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(metricsRibbon);
}

/* ==========================================================================
   7. PROJECT DETAILS MODAL
   ========================================================================== */
function openProjectModal(projectKey) {
  const modal = document.getElementById('project-modal');
  const contentContainer = document.getElementById('modal-content');
  if (!modal || !contentContainer) return;

  let modalHtml = '';

  if (projectKey === 'segmentation') {
    modalHtml = `
      <div class="modal-project-header">
        <span class="badge badge-accent">Unsupervised Machine Learning</span>
        <h2 style="margin: 0.75rem 0 0.5rem; font-size: 1.75rem;">Customer Segmentation with K-Means</h2>
        <p style="color: var(--text-muted);">Comprehensive data science pipeline for behavioral customer clustering.</p>
      </div>

      <div style="margin: 1.5rem 0; padding: 1.25rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 0.65rem;"><i class="fa-solid fa-code-branch"></i> Project Architecture & Pipeline</h4>
        <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
          <li><strong>Data Ingestion & Cleaning:</strong> Loaded tabular consumer demographic and purchasing datasets, processed null values, and standardized numerical scales using NumPy & Pandas.</li>
          <li><strong>Exploratory Data Analysis:</strong> Built distribution plots, bivariate correlations, and pairplots with Matplotlib & Seaborn to uncover spending score vs annual income traits.</li>
          <li><strong>Mathematical Optimization:</strong> Computed Within-Cluster Sum of Squares (WCSS) across cluster values ($K = 1$ to $10$) to pinpoint the Elbow point at $K = 5$.</li>
          <li><strong>Cluster Profiling:</strong> Grouped users into 5 distinct personas: High-Income Big Spenders (VIPs), Budget Shoppers, Balanced Spenders, High-Income Savers, and Low-Income Spenders.</li>
        </ul>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="https://github.com/sayannayek2003" target="_blank" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i> View GitHub Repository
        </a>
        <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()">Close Window</button>
      </div>
    `;
  } else if (projectKey === 'crypto') {
    modalHtml = `
      <div class="modal-project-header">
        <span class="badge badge-cyan">Financial Analytics & BI</span>
        <h2 style="margin: 0.75rem 0 0.5rem; font-size: 1.75rem;">Cryptocurrency Market Intelligence Dashboard</h2>
        <p style="color: var(--text-muted);">Dynamic Power BI reporting suite with custom DAX calculations and dark neon visual theme.</p>
      </div>

      <div style="margin: 1.5rem 0; padding: 1.25rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 0.65rem;"><i class="fa-solid fa-chart-line"></i> Key Analytics & DAX Measures</h4>
        <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
          <li><strong>Dynamic KPI Engine:</strong> Created DAX measures for 24h Volume, Total Market Capitalization, 52-Week High, and Average Price by selected timeframe.</li>
          <li><strong>Volatility & Moving Averages:</strong> Formulated 7-day and 30-day Simple Moving Averages (SMA) to isolate market trend directions from high-frequency noise.</li>
          <li><strong>Interactive Slicers:</strong> Configured cross-filtering slicers allowing users to drill down by coin symbol (BTC, ETH, SOL, etc.) and calendar date range.</li>
          <li><strong>Neon UI/UX Theme:</strong> Hand-crafted dark theme with custom color palettes, glowing borders, and high contrast for executive and investor presentations.</li>
        </ul>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="https://github.com/sayannayek2003" target="_blank" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i> View Project Code
        </a>
        <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()">Close Window</button>
      </div>
    `;
  }

  contentContainer.innerHTML = modalHtml;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.closest('.modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   8. PLAYABLE SNAKE GAME (JAVA SWING / DSA LINKED LIST SIMULATION)
   ========================================================================== */
let snakeGameInterval = null;
let snakeGameRunning = false;
let snakeScore = 0;
let snakeHighScore = 0;

function openSnakeModal() {
  const modal = document.getElementById('snake-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  restartSnakeGame();
}

function closeSnakeModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.closest('.modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('snake-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (snakeGameInterval) {
      clearInterval(snakeGameInterval);
      snakeGameRunning = false;
    }
  }
}

function restartSnakeGame() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (snakeGameInterval) clearInterval(snakeGameInterval);

  const gridSize = 20;
  const tileCountX = canvas.width / gridSize;
  const tileCountY = canvas.height / gridSize;

  // Linked list simulation: snake body as chain of node coordinates
  let snake = [
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 }
  ];

  let food = { x: 15, y: 7 };
  let dx = 1;
  let dy = 0;
  snakeScore = 0;
  snakeGameRunning = true;

  document.getElementById('snake-score').textContent = snakeScore;

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };
    // Ensure food does not spawn inside the snake body
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        placeFood();
        break;
      }
    }
  }

  function handleKeydown(e) {
    if (!snakeGameRunning) return;
    const key = e.key.toLowerCase();

    if ((key === 'arrowup' || key === 'w') && dy === 0) {
      dx = 0; dy = -1; e.preventDefault();
    } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
      dx = 0; dy = 1; e.preventDefault();
    } else if ((key === 'arrowleft' || key === 'a') && dx === 0) {
      dx = -1; dy = 0; e.preventDefault();
    } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
      dx = 1; dy = 0; e.preventDefault();
    }
  }

  window.removeEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleKeydown);

  function gameLoop() {
    // Calculate new head node (O(1) insertion)
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision checks
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
      gameOver();
      return;
    }

    // Self collision checks
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }

    // Add new head
    snake.unshift(head);

    // Food consumption check
    if (head.x === food.x && head.y === food.y) {
      snakeScore += 10;
      document.getElementById('snake-score').textContent = snakeScore;
      if (snakeScore > snakeHighScore) {
        snakeHighScore = snakeScore;
        document.getElementById('snake-high-score').textContent = snakeHighScore;
      }
      placeFood();
    } else {
      // Remove tail (O(1) linked-list deletion)
      snake.pop();
    }

    // Render Game
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake body
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f2fe';
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
      ctx.shadowBlur = 0;
    });
  }

  function gameOver() {
    clearInterval(snakeGameInterval);
    snakeGameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Final Score: ${snakeScore}`, canvas.width / 2, canvas.height / 2 + 18);
    ctx.fillText('Press "Restart Game" to play again', canvas.width / 2, canvas.height / 2 + 42);
  }

  snakeGameInterval = setInterval(gameLoop, 110);
}

/* ==========================================================================
   9. CONTACT FORM HANDLER & COPY TO CLIPBOARD
   ========================================================================== */
function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage || 'Copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMessage || 'Copied to clipboard!');
  });
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    showToast('Please fill out all fields.');
    return;
  }

  // Construct mailto link as direct action
  const mailtoUrl = `mailto:tapunayek2003@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

  window.location.href = mailtoUrl;

  showToast('Preparing email client...');
  document.getElementById('contact-form').reset();
}

/* Toast Message Utility */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* Dynamic Copyright Year */
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
