<template>
  <div
    class="floating-elements absolute inset-0 pointer-events-none overflow-hidden"
  >
    <!-- Floating Orbs -->
    <div
      v-for="orb in orbs"
      :key="orb.id"
      class="floating-orb absolute rounded-full blur-xl opacity-30"
      :style="{
        left: orb.x + '%',
        top: orb.y + '%',
        width: orb.size + 'px',
        height: orb.size + 'px',
        background: orb.gradient,
        animationDuration: orb.duration + 's',
        animationDelay: orb.delay + 's',
      }"
    ></div>

    <!-- Geometric Shapes -->
    <div
      v-for="shape in shapes"
      :key="shape.id"
      class="floating-shape absolute opacity-20"
      :style="{
        left: shape.x + '%',
        top: shape.y + '%',
        width: shape.size + 'px',
        height: shape.size + 'px',
        animationDuration: shape.duration + 's',
        animationDelay: shape.delay + 's',
        transform: `rotate(${shape.rotation}deg)`,
      }"
    >
      <svg :width="shape.size" :height="shape.size" viewBox="0 0 100 100">
        <!-- Triangle -->
        <polygon
          v-if="shape.type === 'triangle'"
          points="50,10 90,90 10,90"
          :fill="shape.color"
          :stroke="shape.strokeColor"
          stroke-width="2"
        />

        <!-- Square -->
        <rect
          v-else-if="shape.type === 'square'"
          x="20"
          y="20"
          width="60"
          height="60"
          :fill="shape.color"
          :stroke="shape.strokeColor"
          stroke-width="2"
          rx="8"
        />

        <!-- Hexagon -->
        <polygon
          v-else-if="shape.type === 'hexagon'"
          points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5"
          :fill="shape.color"
          :stroke="shape.strokeColor"
          stroke-width="2"
        />

        <!-- Circle -->
        <circle
          v-else-if="shape.type === 'circle'"
          cx="50"
          cy="50"
          r="30"
          :fill="shape.color"
          :stroke="shape.strokeColor"
          stroke-width="2"
        />

        <!-- Diamond -->
        <polygon
          v-else-if="shape.type === 'diamond'"
          points="50,10 85,50 50,90 15,50"
          :fill="shape.color"
          :stroke="shape.strokeColor"
          stroke-width="2"
        />
      </svg>
    </div>

    <!-- Animated Lines/Connections -->
    <svg
      v-if="showConnections"
      class="connection-lines absolute inset-0 w-full h-full opacity-10"
      :style="{ animationDuration: connectionDuration + 's' }"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
          <stop offset="50%" style="stop-color: #8b5cf6; stop-opacity: 0.5" />
          <stop offset="100%" style="stop-color: #ec4899; stop-opacity: 1" />
        </linearGradient>
      </defs>

      <path
        v-for="line in connectionLines"
        :key="line.id"
        :d="line.path"
        stroke="url(#lineGradient)"
        stroke-width="1"
        fill="none"
        stroke-dasharray="5,5"
        class="animate-dash"
      />
    </svg>

    <!-- Particle Systems -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="floating-particle absolute rounded-full"
      :style="{
        left: particle.x + '%',
        top: particle.y + '%',
        width: particle.size + 'px',
        height: particle.size + 'px',
        backgroundColor: particle.color,
        opacity: particle.opacity,
        animationDuration: particle.duration + 's',
        animationDelay: particle.delay + 's',
      }"
    ></div>

    <!-- Grid Pattern -->
    <div
      v-if="showGrid"
      class="grid-pattern absolute inset-0 opacity-5"
      :style="{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  gradient: string;
  duration: number;
  delay: number;
}

interface FloatingShape {
  id: number;
  type: "triangle" | "square" | "hexagon" | "circle" | "diamond";
  x: number;
  y: number;
  size: number;
  color: string;
  strokeColor: string;
  rotation: number;
  duration: number;
  delay: number;
}

interface ConnectionLine {
  id: number;
  path: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  duration: number;
  delay: number;
}

interface Props {
  density?: "low" | "medium" | "high";
  showOrbs?: boolean;
  showShapes?: boolean;
  showConnections?: boolean;
  showParticles?: boolean;
  showGrid?: boolean;
  gridSize?: number;
  connectionDuration?: number;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  density: "medium",
  showOrbs: true,
  showShapes: true,
  showConnections: false,
  showParticles: true,
  showGrid: false,
  gridSize: 50,
  connectionDuration: 20,
  animated: true,
});

// Reactive data
const orbs = ref<FloatingOrb[]>([]);
const shapes = ref<FloatingShape[]>([]);
const connectionLines = ref<ConnectionLine[]>([]);
const particles = ref<Particle[]>([]);

// Color palettes
const gradients = [
  "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
  "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)",
  "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(236,72,153,0) 70%)",
  "radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0) 70%)",
  "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0) 70%)",
];

const colors = [
  "rgba(59, 130, 246, 0.3)",
  "rgba(139, 92, 246, 0.3)",
  "rgba(236, 72, 153, 0.3)",
  "rgba(34, 197, 94, 0.3)",
  "rgba(251, 191, 36, 0.3)",
];

const strokeColors = [
  "rgba(59, 130, 246, 0.5)",
  "rgba(139, 92, 246, 0.5)",
  "rgba(236, 72, 153, 0.5)",
  "rgba(34, 197, 94, 0.5)",
  "rgba(251, 191, 36, 0.5)",
];

const shapeTypes = [
  "triangle",
  "square",
  "hexagon",
  "circle",
  "diamond",
] as const;

// Density configurations
const densityConfig = {
  low: { orbs: 3, shapes: 5, particles: 8 },
  medium: { orbs: 5, shapes: 8, particles: 12 },
  high: { orbs: 8, shapes: 12, particles: 20 },
};

// Generate random floating orbs
const generateOrbs = () => {
  const config = densityConfig[props.density];
  orbs.value = [];

  for (let i = 0; i < config.orbs; i++) {
    orbs.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      gradient:
        gradients[Math.floor(Math.random() * gradients.length)] ||
        "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    });
  }
};

// Generate random floating shapes
const generateShapes = () => {
  const config = densityConfig[props.density];
  shapes.value = [];

  for (let i = 0; i < config.shapes; i++) {
    shapes.value.push({
      id: i,
      type:
        shapeTypes[Math.floor(Math.random() * shapeTypes.length)] || "circle",
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 30,
      color: colors[Math.floor(Math.random() * colors.length)] || "#667eea",
      strokeColor:
        strokeColors[Math.floor(Math.random() * strokeColors.length)] ||
        "#764ba2",
      rotation: Math.random() * 360,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
    });
  }
};

// Generate connection lines
const generateConnections = () => {
  connectionLines.value = [];

  for (let i = 0; i < 5; i++) {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;

    // Create curved path
    const controlX1 = Math.random() * 100;
    const controlY1 = Math.random() * 100;
    const controlX2 = Math.random() * 100;
    const controlY2 = Math.random() * 100;

    connectionLines.value.push({
      id: i,
      path: `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`,
    });
  }
};

// Generate particles
const generateParticles = () => {
  const config = densityConfig[props.density];
  particles.value = [];

  for (let i = 0; i < config.particles; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)] || "#667eea",
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
    });
  }
};

// Initialize elements
const initializeElements = () => {
  if (props.showOrbs) generateOrbs();
  if (props.showShapes) generateShapes();
  if (props.showConnections) generateConnections();
  if (props.showParticles) generateParticles();
};

// Regenerate elements periodically
let regenerateInterval: NodeJS.Timeout;

const startRegeneration = () => {
  if (props.animated) {
    regenerateInterval = setInterval(() => {
      initializeElements();
    }, 30000); // Regenerate every 30 seconds
  }
};

onMounted(() => {
  initializeElements();
  startRegeneration();
});

onUnmounted(() => {
  if (regenerateInterval) {
    clearInterval(regenerateInterval);
  }
});

// Watch for density changes
watch(
  () => props.density,
  () => {
    initializeElements();
  },
);

defineExpose({
  regenerate: initializeElements,
});
</script>

<style scoped>
.floating-elements {
  z-index: -1;
}

/* Floating animations */
.floating-orb {
  animation: float infinite ease-in-out;
}

.floating-shape {
  animation: floatRotate infinite ease-in-out;
}

.floating-particle {
  animation: particleFloat infinite ease-in-out;
}

.connection-lines {
  animation: connectionPulse infinite ease-in-out;
}

/* Keyframes */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-5px);
  }
  75% {
    transform: translateY(-15px) translateX(-10px);
  }
}

@keyframes floatRotate {
  0%,
  100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) translateX(15px) rotate(90deg);
  }
  50% {
    transform: translateY(-5px) translateX(-10px) rotate(180deg);
  }
  75% {
    transform: translateY(-10px) translateX(-5px) rotate(270deg);
  }
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.2);
  }
}

@keyframes connectionPulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
}

.animate-dash {
  animation: dash 2s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-orb,
  .floating-shape {
    transform: scale(0.7);
  }

  .floating-particle {
    transform: scale(0.5);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .floating-shape,
  .floating-particle,
  .connection-lines,
  .animate-dash {
    animation: none !important;
  }
}

/* Performance optimizations */
.floating-orb,
.floating-shape,
.floating-particle {
  will-change: transform;
  backface-visibility: hidden;
}
</style>
