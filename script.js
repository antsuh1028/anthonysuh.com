// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if the gradient animation is working
  const computedStyle = window.getComputedStyle(document.body);
  const hasAnimation = computedStyle.getPropertyValue("animation");

  console.log("Current body animation: ", hasAnimation);

  // If the animation isn't applied, add it manually
  if (!hasAnimation || hasAnimation === "none") {
    console.log("No animation detected, applying manually...");
    document.body.style.background =
      "linear-gradient(-45deg, #f5f7fa, #d8e2f3, #c3cfe2, #e2e8f0)";
    document.body.style.backgroundSize = "400% 400%";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.animation = "gradient-animation 15s ease infinite";
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Typewriter effect for hero section
  const typingTextElement = document.getElementById("typing-text");
  if (typingTextElement) {
    const texts = [
      "Web Developer",
      "Software Engineer",
      "CS Student at UCI",
      "Problem Solver",
      "Tech Enthusiast",
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;

    function typeEffect() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, newTextDelay);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeEffect, 500);
      } else {
        setTimeout(typeEffect, isDeleting ? erasingDelay : typingDelay);
      }
    }

    // Start the typing effect
    setTimeout(typeEffect, 1000);
  }

  // Modified scroll effect - only updates the opacity of content but doesn't interfere with gradient
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Optional: fade effect for the hero section
    const heroContent = document.querySelector(".hero-content");
    if (heroContent && scrollPosition < windowHeight) {
      const opacity = 1 - (scrollPosition / windowHeight) * 0.5;
      heroContent.style.opacity = Math.max(0.5, opacity);
    }
  });

  // Optional: Animate skill items when they come into view
  const animateOnScroll = function () {
    const skillCategories = document.querySelectorAll(".skills-category");

    skillCategories.forEach((category) => {
      const categoryPosition = category.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (categoryPosition < screenPosition) {
        category.style.opacity = "1";
        category.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state for skill categories
  document.querySelectorAll(".skills-category").forEach((category) => {
    category.style.opacity = "0";
    category.style.transform = "translateY(20px)";
    category.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  // Run the animation check on scroll
  window.addEventListener("scroll", animateOnScroll);

  // Run it once on load
  animateOnScroll();

  // Particles background for hero section
  setupParticles();

  // Custom cursor for hero section
  setupCustomCursor();
});

// Particles background effect
function setupParticles() {
  const particlesContainer = document.getElementById("particles-js");
  if (!particlesContainer) return;

  const canvas = document.createElement("canvas");
  particlesContainer.appendChild(canvas);
  canvas.width = particlesContainer.offsetWidth;
  canvas.height = particlesContainer.offsetHeight;

  // Get canvas context
  const ctx = canvas.getContext("2d");

  // Particles array
  let particles = [];

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `rgba(0, 120, 255, ${Math.random() * 0.3 + 0.1})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }

      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function init() {
    particles = [];
    const particleCount = Math.min(
      Math.floor((canvas.width * canvas.height) / 10000),
      100
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Connect particles with lines
  function connect() {
    const maxDistance = 150;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Draw line with opacity based on distance
          const opacity = 1 - distance / maxDistance;
          ctx.strokeStyle = `rgba(0, 120, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connect();
    requestAnimationFrame(animate);
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    canvas.width = particlesContainer.offsetWidth;
    canvas.height = particlesContainer.offsetHeight;
    init();
  });

  // Mouse interaction
  let mouse = {
    x: null,
    y: null,
    radius: 100,
  };

  canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    // Repel particles from mouse
    for (let i = 0; i < particles.length; i++) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceX = (dx / distance) * 2;
        const forceY = (dy / distance) * 2;
        particles[i].x += forceX;
        particles[i].y += forceY;
      }
    }
  });

  // Start animation
  init();
  animate();
}
