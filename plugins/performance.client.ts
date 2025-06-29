export default defineNuxtPlugin(() => {
  // Preload critical resources
  if (typeof window !== "undefined") {
    // Prefetch important pages
    const prefetchPages = ["/dashboard", "/pricing", "/auth/login"];

    // Use requestIdleCallback for non-critical prefetching
    const prefetchWhenIdle = () => {
      prefetchPages.forEach((page) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = page;
        document.head.appendChild(link);
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchWhenIdle);
    } else {
      setTimeout(prefetchWhenIdle, 2000);
    }

    // Optimize images loading
    const images = document.querySelectorAll("img[data-src]");
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || "";
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }

    // Optimize font loading
    if ("fonts" in document) {
      const fontFamilies = ["Inter"];
      fontFamilies.forEach((family) => {
        document.fonts.load(`1em ${family}`).catch(() => {
          // Fallback if font loading fails
          console.warn(`Failed to load font: ${family}`);
        });
      });
    }
  }
});
