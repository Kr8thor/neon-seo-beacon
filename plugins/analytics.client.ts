export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Initialize analytics if GA4 ID is provided
  if (config.public.googleAnalyticsId) {
    useHead({
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalyticsId}`,
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.public.googleAnalyticsId}');
          `
        }
      ]
    })
  }
  
  // Provide analytics functions
  return {
    provide: {
      analytics: {
        track: (eventName: string, parameters?: Record<string, any>) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters)
          }
        },
        page: (pageName: string) => {
          if (typeof gtag !== 'undefined') {
            gtag('config', config.public.googleAnalyticsId, {
              page_title: pageName,
              page_location: window.location.href
            })
          }
        }
      }
    }
  }
})