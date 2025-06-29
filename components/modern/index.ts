// Temporarily disable advanced UI components with TypeScript errors
export default {
  // Comment out problematic modern components
  // CustomCursor: () => import('~/components/modern/CustomCursor.vue'),
  // FloatingElements: () => import('~/components/modern/FloatingElements.vue'),
  // InteractiveChart: () => import('~/components/modern/InteractiveChart.vue'),
  // NotificationSystem: () => import('~/components/modern/NotificationSystem.vue'),

  // Keep working basic components
  LoadingAnimation: () => import("~/components/modern/LoadingAnimation.vue"),
  Dashboard: () => import("~/components/modern/Dashboard.vue"),
  LandingPage: () => import("~/components/modern/LandingPage.vue"),
};
