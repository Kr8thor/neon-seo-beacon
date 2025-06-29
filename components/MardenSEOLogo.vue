<template>
  <div class="marden-logo-container relative" ref="logoContainer">
    <!-- Floating Particles Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's',
        }"
        :class="particle.animation"
      ></div>
    </div>

    <!-- Main Logo -->
    <div
      class="relative z-10 flex items-center justify-center space-x-3"
      ref="logoMain"
    >
      <!-- Animated Logo Icon -->
      <div class="logo-icon relative" ref="logoIcon">
        <!-- Outer Ring with Pulse -->
        <div
          class="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-ping"
        ></div>

        <!-- Main Icon Circle -->
        <div
          class="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-lg flex items-center justify-center overflow-hidden"
        >
          <!-- Animated Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"
          ></div>

          <!-- Icon Content -->
          <div
            class="relative z-10 text-white font-bold text-xl tracking-wider"
          >
            M
          </div>

          <!-- Sparkle Effects -->
          <div
            class="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-80 animate-twinkle"
          ></div>
          <div
            class="absolute bottom-3 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-twinkle-delayed"
          ></div>
        </div>
      </div>

      <!-- Animated Text -->
      <div class="logo-text" ref="logoText">
        <h1
          class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-white dark:via-blue-300 dark:to-purple-300"
        >
          <!-- Animated Letters -->
          <span
            v-for="(letter, index) in logoLetters"
            :key="index"
            class="inline-block letter-animation"
            :style="{ animationDelay: index * 0.1 + 's' }"
            @mouseenter="animateLetter($event)"
          >
            {{ letter }}
          </span>
        </h1>

        <!-- Tagline with Typewriter Effect -->
        <p
          class="mt-2 text-lg text-gray-600 dark:text-gray-300 font-medium"
          ref="tagline"
        >
          <span class="typewriter">{{ currentTagline }}</span>
          <span class="cursor animate-pulse">|</span>
        </p>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="floating-elements absolute inset-0 pointer-events-none">
      <!-- SEO Keywords Floating -->
      <div
        v-for="keyword in floatingKeywords"
        :key="keyword.id"
        class="absolute text-xs font-medium text-blue-500/40 dark:text-blue-400/40 animate-float"
        :style="{
          left: keyword.x + '%',
          top: keyword.y + '%',
          animationDelay: keyword.delay + 's',
          animationDuration: keyword.duration + 's',
        }"
      >
        {{ keyword.text }}
      </div>
    </div>

    <!-- Interactive Hover Effect -->
    <div
      class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none"
      ref="hoverOverlay"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  animation: string;
}

interface FloatingKeyword {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const logoContainer = ref<HTMLElement>();
const logoMain = ref<HTMLElement>();
const logoIcon = ref<HTMLElement>();
const logoText = ref<HTMLElement>();
const tagline = ref<HTMLElement>();
const hoverOverlay = ref<HTMLElement>();

// Logo text configuration
const logoLetters = ref("MardenSEO".split(""));
const taglines = [
  "Premium SEO Solutions",
  "Boosting Your Rankings",
  "Digital Growth Partner",
  "SEO Excellence",
];
const currentTagline = ref("");
const currentTaglineIndex = ref(0);

// Particle system
const particles = ref<Particle[]>([]);
const floatingKeywords = ref<FloatingKeyword[]>([]);

// Animation state
let animationFrameId: number;
let typewriterInterval: ReturnType<typeof setInterval>;

// Initialize particles
const createParticles = () => {
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    animation: Math.random() > 0.5 ? "animate-float-slow" : "animate-drift",
  }));
};

// Initialize floating keywords
const createFloatingKeywords = () => {
  const keywords = [
    "SEO",
    "Rankings",
    "Analytics",
    "Keywords",
    "Content",
    "Speed",
    "UX",
  ];

  floatingKeywords.value = keywords.map((text, i) => ({
    id: i,
    text,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 60,
    delay: i * 0.5,
    duration: 8 + Math.random() * 4,
  }));
};

// Typewriter effect for tagline
const typewriterEffect = () => {
  const targetText = taglines[currentTaglineIndex.value];
  let currentText = "";
  let charIndex = 0;

  const type = () => {
    if (charIndex < targetText.length) {
      currentText += targetText[charIndex];
      currentTagline.value = currentText;
      charIndex++;
      setTimeout(type, 100 + Math.random() * 100);
    } else {
      setTimeout(() => {
        // Clear text
        const clear = () => {
          if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
            currentTagline.value = currentText;
            setTimeout(clear, 50);
          } else {
            // Move to next tagline
            currentTaglineIndex.value =
              (currentTaglineIndex.value + 1) % taglines.length;
            setTimeout(typewriterEffect, 500);
          }
        };
        setTimeout(clear, 2000);
      }, 1000);
    }
  };

  type();
};

// Letter hover animation
const animateLetter = (event: MouseEvent) => {
  const letter = event.target as HTMLElement;
  letter.style.transform = "scale(1.2) rotate(5deg)";
  letter.style.color = "#3b82f6";

  setTimeout(() => {
    letter.style.transform = "";
    letter.style.color = "";
  }, 300);
};

// GSAP animations (if available)
const initGSAPAnimations = () => {
  if (typeof window !== "undefined" && window.gsap) {
    const { gsap } = window;

    // Logo entrance animation
    gsap.from(logoIcon.value, {
      duration: 1,
      scale: 0,
      rotation: 180,
      ease: "back.out(1.7)",
    });

    gsap.from(logoText.value?.querySelectorAll(".letter-animation"), {
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.3,
    });

    // Floating animation for icon
    gsap.to(logoIcon.value, {
      duration: 3,
      y: -10,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Sparkle rotation
    gsap.to(logoIcon.value?.querySelector(".animate-shimmer"), {
      duration: 2,
      backgroundPosition: "200% center",
      repeat: -1,
      ease: "none",
    });
  }
};

// Mouse interaction effects
const handleMouseMove = (event: MouseEvent) => {
  if (!logoContainer.value) return;

  const rect = logoContainer.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  // Subtle parallax effect
  if (logoIcon.value) {
    const moveX = (x - 0.5) * 10;
    const moveY = (y - 0.5) * 10;
    logoIcon.value.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
};

// Intersection Observer for reveal animation
const observeVisibility = () => {
  if (!logoContainer.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          initGSAPAnimations();
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(logoContainer.value);

  return observer;
};

onMounted(() => {
  createParticles();
  createFloatingKeywords();
  typewriterEffect();

  const observer = observeVisibility();

  // Add mouse interaction
  logoContainer.value?.addEventListener("mousemove", handleMouseMove);

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
    }
    observer?.disconnect();
    logoContainer.value?.removeEventListener("mousemove", handleMouseMove);
  });
});
</script>

<style scoped>
.marden-logo-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Custom animations */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

@keyframes twinkle-delayed {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes drift {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  33% {
    transform: translate(10px, -10px) rotate(3deg);
  }
  66% {
    transform: translate(-5px, 5px) rotate(-2deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.8;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation classes */
.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.animate-twinkle {
  animation: twinkle 2s infinite;
}

.animate-twinkle-delayed {
  animation: twinkle-delayed 2.5s infinite;
}

.animate-float-slow {
  animation: float-slow 4s infinite;
}

.animate-drift {
  animation: drift 6s infinite;
}

.animate-float {
  animation: float 8s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}

/* Letter animations */
.letter-animation {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
}

.letter-animation:hover {
  transform: scale(1.1) rotate(5deg);
  color: #3b82f6;
}

/* Typewriter cursor */
.cursor {
  color: #3b82f6;
  font-weight: normal;
}

/* Responsive design */
@media (max-width: 768px) {
  .marden-logo-container {
    padding: 1rem;
  }

  .logo-icon .w-16 {
    width: 3rem;
    height: 3rem;
  }

  .text-4xl {
    font-size: 2rem;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .floating-elements {
    opacity: 0.6;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-shimmer,
  .animate-twinkle,
  .animate-twinkle-delayed,
  .animate-float-slow,
  .animate-drift,
  .animate-float,
  .animate-ping {
    animation: none !important;
  }

  .letter-animation {
    transition: none !important;
  }
}
</style>
