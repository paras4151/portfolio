// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* Preloader Engine */
window.addEventListener('DOMContentLoaded', () => {
  const counterEl = document.querySelector('.preloader-counter');
  let count = 0;
  
  const counterInterval = setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    if (count >= 100) {
      count = 100;
      clearInterval(counterInterval);
      
      // Hide preloader with luxury curve
      const preloaderTl = gsap.timeline();
      
      // Text slide out
      preloaderTl.to('.preloader-title, .preloader-top, .preloader-bottom', {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.1
      });
      
      preloaderTl.to('#preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        onComplete: () => {
          document.getElementById('preloader').style.display = 'none';
          initMainAnimations();
        }
      });
    }
    counterEl.textContent = count.toString().padStart(3, '0');
  }, 35);
});

/* Custom Cursor & Follower Morphing */
const cursor = document.getElementById('custom-cursor');
const follower = document.getElementById('custom-cursor-follower');
const followerText = follower.querySelector('span');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant cursor position
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.05
  });
});

// Follower smooth lagging
gsap.ticker.add(() => {
  const dt = 1.0 - Math.pow(0.85, gsap.ticker.deltaRatio());
  followerX += (mouseX - followerX) * dt;
  followerY += (mouseY - followerY) * dt;
  
  gsap.set(follower, {
    x: followerX,
    y: followerY
  });
});

// Interactive elements hover triggers
document.addEventListener('mouseover', (e) => {
  // Find closest tag with custom cursor classes
  const hoverTag = e.target.closest('.cursor-hover-tag');
  const dragTag = e.target.closest('.cursor-hover-drag-tag');
  
  if (hoverTag) {
    const cursorText = hoverTag.getAttribute('data-cursor-text');
    if (cursorText === 'Explore' || cursorText === 'View Profile') {
      document.body.classList.add('cursor-hover-project');
      followerText.textContent = cursorText;
    } else {
      document.body.classList.add('cursor-hover-link');
      followerText.textContent = '';
    }
  } else if (dragTag) {
    const cursorText = dragTag.getAttribute('data-cursor-text');
    document.body.classList.add('cursor-hover-drag');
    followerText.textContent = cursorText;
  }
});

document.addEventListener('mouseout', (e) => {
  const hoverTag = e.target.closest('.cursor-hover-tag');
  const dragTag = e.target.closest('.cursor-hover-drag-tag');
  
  if (!hoverTag && !dragTag) {
    document.body.classList.remove('cursor-hover-project', 'cursor-hover-link', 'cursor-hover-drag');
  }
});

/* Hero Background Vector Particles */
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 65;
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.originalRadius = this.radius;
      this.alpha = Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Repel from mouse cursor
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
      
      // Out of bounds reset
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 200, 76, ${this.alpha})`; // Accent Color
      ctx.fill();
    }
  }
  
  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* Scroll Progress Bar */
gsap.to('#scroll-progress', {
  width: '100%',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.1
  }
});

/* Heading Reveals (SplitType + ScrollTrigger) */
function initMainAnimations() {
  // Hero reveal
  gsap.from('#hero-reveal-1, #hero-reveal-2, #hero-reveal-3', {
    y: 120,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    stagger: 0.15
  });
  
  gsap.from('.hero-subheading', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    delay: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.hero-ctas', {
    y: 20,
    opacity: 0,
    duration: 1,
    delay: 1.1,
    ease: 'power3.out'
  });

  // Split section headings
  const splitTitles = document.querySelectorAll('.section-title');
  splitTitles.forEach(title => {
    const split = new SplitType(title, { types: 'words, chars' });
    gsap.from(split.chars, {
      opacity: 0.1,
      y: 20,
      stagger: 0.03,
      duration: 1.2,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        end: 'top 40%',
        scrub: true
      }
    });
  });

  // Parallax project images
  const projectImgs = document.querySelectorAll('.project-image-wrapper img');
  projectImgs.forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.project-item'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Timeline glow and stickies
  const timelineGlow = document.querySelector('.timeline-line-glow');
  if (timelineGlow) {
    gsap.to(timelineGlow, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 20%',
        end: 'bottom 80%',
        scrub: true
      }
    });
  }

  // Active state updates for timeline dots
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => item.classList.add('active'),
      onEnterBack: () => item.classList.add('active'),
      onLeave: () => item.classList.remove('active'),
      onLeaveBack: () => item.classList.remove('active')
    });
  });

  // Sticky navbar transparency adjustment
  ScrollTrigger.create({
    start: 'top -50px',
    onEnter: () => {
      gsap.to('header', {
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(10px)',
        paddingTop: '1.2rem',
        paddingBottom: '1.2rem',
        borderBottom: '1px solid var(--color-border)',
        duration: 0.4
      });
    },
    onLeaveBack: () => {
      gsap.to('header', {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid transparent',
        duration: 0.4
      });
    }
  });

  // Nav Links active highlights
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      },
      onEnterBack: () => {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* Interactive Magnetic Button Effect */
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic pull coordinates
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  btn.addEventListener('mouseleave', () => {
    // Elastic release back to center
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.45)'
    });
  });
});

/* Skills Orbit Ecosystem Motion */
const orbitContainer = document.querySelector('.skills-orbit-container');
const orbitingNodes = document.querySelectorAll('.orbiting-node');

if (orbitContainer) {
  let angleOffset = 0;
  let rotationSpeed = 0.003; // Base auto-rotation speed
  let targetRotationSpeed = 0.003;
  let isDragging = false;
  let startX = 0;
  
  // Map positioning dynamically
  function updateOrbitPositions() {
    orbitingNodes.forEach(node => {
      const radius = parseFloat(node.getAttribute('data-radius'));
      const baseAngle = parseFloat(node.getAttribute('data-angle'));
      const currentAngleRad = ((baseAngle + angleOffset) * Math.PI) / 180;
      
      const x = Math.cos(currentAngleRad) * radius;
      const y = Math.sin(currentAngleRad) * radius;
      
      gsap.set(node, {
        x: `calc(50% + ${x}px)`,
        y: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)'
      });
    });
  }
  
  // Animation ticker for orbits
  gsap.ticker.add(() => {
    rotationSpeed += (targetRotationSpeed - rotationSpeed) * 0.08;
    angleOffset += rotationSpeed * 180 / Math.PI;
    updateOrbitPositions();
  });
  
  // Mouse interactions to affect orbit speed and control
  orbitContainer.addEventListener('mouseenter', () => {
    targetRotationSpeed = 0.008; // Speeds up on hover
  });
  
  orbitContainer.addEventListener('mouseleave', () => {
    targetRotationSpeed = 0.003; // Slows back down
  });
  
  // Draggable orbits via mouse dragging
  orbitContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    startX = e.clientX;
    angleOffset += deltaX * 0.25; // Directly rotates based on drag
  });
}
