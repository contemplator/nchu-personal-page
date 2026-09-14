/**
 * Leo Lin (林庭弘) - 個人網頁核心邏輯
 * 包含：動態即時時間時鐘、12/24小時切換、科技背景動態粒子
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initBackgroundCanvas();
});

/* ==========================================================================
   即時時間時鐘功能 (Live Clock Component)
   ========================================================================== */
function initClock() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const periodEl = document.getElementById('period');
  const fullDateEl = document.getElementById('full-date');
  const dayOfWeekEl = document.getElementById('day-of-week');
  const secondsBarEl = document.getElementById('seconds-bar');
  const formatToggleBtn = document.getElementById('format-toggle-btn');

  let is24HourFormat = true;

  // 星期對照表
  const weekDays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    let period = '';

    if (!is24HourFormat) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }

    // 格式化數字補零
    const pad = (num) => String(num).padStart(2, '0');

    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
    periodEl.textContent = period;

    // 日期格式化 (YYYY 年 MM 月 DD 日)
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    fullDateEl.textContent = `${year} 年 ${month} 月 ${date} 日`;

    // 星期
    dayOfWeekEl.textContent = weekDays[now.getDay()];

    // 分鐘進度條 (0% - 100%)
    const progressPercent = ((seconds + milliseconds / 1000) / 60) * 100;
    secondsBarEl.style.width = `${progressPercent.toFixed(1)}%`;
  }

  // 切換 12H / 24H 格式
  formatToggleBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatToggleBtn.textContent = is24HourFormat ? '24H' : '12H';
    updateClock();
  });

  // 立即執行一次，並以 100ms 頻率平滑更新
  updateClock();
  setInterval(updateClock, 100);
}

/* ==========================================================================
   動態科技粒子背景 (Interactive Cyber Particles Canvas)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 繪製粒子連線
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // 更新並繪製粒子
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}
