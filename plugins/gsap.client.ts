// GSAP Plugin for Advanced Animations
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (process.client && typeof window !== "undefined") {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Set GSAP defaults for consistent animations
    gsap.defaults({
      duration: 0.6,
      ease: "power2.out",
    });

    // Custom animation helpers
    const animationHelpers = {
      // Fade in from bottom
      fadeInUp: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
          element,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            delay,
            duration: 0.8,
            ease: "power3.out",
          },
        );
      },

      // Scale in animation
      scaleIn: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
          element,
          {
            scale: 0.8,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            delay,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
        );
      },

      // Slide in from left
      slideInLeft: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
          element,
          {
            x: -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            delay,
            duration: 0.8,
            ease: "power3.out",
          },
        );
      },

      // Slide in from right
      slideInRight: (element: string | Element, delay = 0) => {
        return gsap.fromTo(
          element,
          {
            x: 100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            delay,
            duration: 0.8,
            ease: "power3.out",
          },
        );
      },

      // Stagger animation for multiple elements
      staggerFadeIn: (elements: string | NodeList, stagger = 0.1) => {
        return gsap.fromTo(
          elements,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger,
            ease: "power2.out",
          },
        );
      },

      // Counter animation
      counterUp: (
        element: string | Element,
        endValue: number,
        duration = 2,
      ) => {
        const obj = { val: 0 };
        return gsap.to(obj, {
          val: endValue,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (typeof element === "string") {
              const el = document.querySelector(element);
              if (el) el.textContent = Math.round(obj.val).toString();
            } else {
              element.textContent = Math.round(obj.val).toString();
            }
          },
        });
      },

      // Morphing button effect
      morphButton: (button: string | Element) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
        })
          .to(button, {
            scale: 1.05,
            duration: 0.2,
            ease: "back.out(2)",
          })
          .to(button, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
          });
        return tl;
      },

      // Floating animation
      float: (element: string | Element, intensity = 10) => {
        return gsap.to(element, {
          y: intensity,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      },

      // Glow pulse effect
      glowPulse: (element: string | Element) => {
        return gsap.to(element, {
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)",
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      },
    };

    // Make GSAP and helpers available globally
    return {
      provide: {
        gsap,
        ScrollTrigger,
        animate: animationHelpers,
      },
    };
  }

  // Return empty object for server-side
  return {};
});

// TypeScript declarations for better IDE support
declare module "#app" {
  interface NuxtApp {
    $gsap: typeof gsap;
    $ScrollTrigger: typeof ScrollTrigger;
    $animate: any;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $gsap: typeof gsap;
    $ScrollTrigger: typeof ScrollTrigger;
    $animate: any;
  }
}
