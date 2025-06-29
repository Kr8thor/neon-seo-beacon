import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

interface AnimationOptions {
  duration?: number
  delay?: number
  ease?: string
  stagger?: number
  trigger?: string
  once?: boolean
}

interface ScrollRevealOptions extends AnimationOptions {
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: number
  rotate?: number
  opacity?: number
}

export function useAdvancedAnimations() {
  const { $gsap, $ScrollTrigger, $animate } = useNuxtApp()
  
  // Scroll reveal animation
  const scrollReveal = (
    selector: string | Element | NodeList,
    options: ScrollRevealOptions = {}
  ) => {
    if (!$gsap || !$ScrollTrigger) return
    
    const {
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      distance = 50,
      direction = 'up',
      scale = 1,
      rotate = 0,
      opacity = 0,
      trigger,
      once = true
    } = options
    
    const fromProps: any = { opacity }
    const toProps: any = { opacity: 1, duration, delay, ease }
    
    // Set initial transform based on direction
    switch (direction) {
      case 'up':
        fromProps.y = distance
        toProps.y = 0
        break
      case 'down':
        fromProps.y = -distance
        toProps.y = 0
        break
      case 'left':
        fromProps.x = distance
        toProps.x = 0
        break
      case 'right':
        fromProps.x = -distance
        toProps.x = 0
        break
    }
    
    if (scale !== 1) {
      fromProps.scale = scale
      toProps.scale = 1
    }
    
    if (rotate !== 0) {
      fromProps.rotation = rotate
      toProps.rotation = 0
    }
    
    toProps.scrollTrigger = {
      trigger: trigger || selector,
      start: 'top 85%',
      end: 'bottom 15%',
      toggleActions: once ? 'play none none none' : 'play none none reverse'
    }
    
    return $gsap.fromTo(selector, fromProps, toProps)
  }
  
  // Stagger animation for multiple elements
  const staggerAnimation = (
    selector: string | NodeList,
    options: AnimationOptions & { stagger?: number } = {}
  ) => {
    if (!$gsap) return
    
    const {
      duration = 0.6,
      delay = 0,
      ease = 'power2.out',
      stagger = 0.1
    } = options
    
    return $gsap.fromTo(selector, 
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration, 
        delay, 
        ease, 
        stagger 
      }
    )
  }
  
  // Magnetic button effect
  const magneticEffect = (element: Ref<HTMLElement | undefined>) => {
    if (!element.value) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!$gsap || !element.value) return
      
      const { left, top, width, height } = element.value.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) * 0.2
      const y = (e.clientY - top - height / 2) * 0.2
      
      $gsap.to(element.value, {
        x,
        y,
        duration: 0.1,
        ease: 'power2.out'
      })
    }
    
    const handleMouseLeave = () => {
      if (!$gsap || !element.value) return
      
      $gsap.to(element.value, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    }
    
    element.value.addEventListener('mousemove', handleMouseMove)
    element.value.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      if (element.value) {
        element.value.removeEventListener('mousemove', handleMouseMove)
        element.value.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }
  
  // Parallax scroll effect
  const parallaxScroll = (
    selector: string | Element,
    speed: number = 0.5
  ) => {
    if (!$gsap || !$ScrollTrigger) return
    
    return $gsap.to(selector, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: selector,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  }
  
  // Morphing animation
  const morphAnimation = (
    element: Ref<HTMLElement | undefined>,
    shapes: string[]
  ) => {
    if (!$gsap || !element.value) return
    
    const tl = $gsap.timeline({ repeat: -1, yoyo: true })
    
    shapes.forEach((shape, index) => {
      if (element.value) {
        tl.to(element.value, {
          borderRadius: shape,
          duration: 2,
          ease: 'power2.inOut',
          delay: index * 0.5
        })
      }
    })
    
    return tl
  }
  
  // Text reveal animation
  const textReveal = (
    selector: string | Element,
    options: AnimationOptions = {}
  ) => {
    if (!$gsap) return
    
    const {
      duration = 1,
      delay = 0,
      ease = 'power2.out'
    } = options
    
    const tl = $gsap.timeline({ delay })
    
    tl.fromTo(selector, {
      width: '0%',
      opacity: 0
    }, {
      width: '100%',
      opacity: 1,
      duration,
      ease
    })
    
    return tl
  }
  
  // Counter animation
  const animateCounter = (
    element: Ref<HTMLElement | undefined>,
    endValue: number,
    options: AnimationOptions = {}
  ) => {
    if (!$gsap || !element.value) return
    
    const {
      duration = 2,
      delay = 0,
      ease = 'power2.out'
    } = options
    
    const obj = { val: 0 }
    
    return $gsap.to(obj, {
      val: endValue,
      duration,
      delay,
      ease,
      onUpdate: () => {
        if (element.value) {
          element.value.textContent = Math.round(obj.val).toString()
        }
      }
    })
  }
  
  // Hover animation
  const hoverAnimation = (
    element: Ref<HTMLElement | undefined>,
    hoverProps: any = {},
    normalProps: any = {}
  ) => {
    if (!element.value || !$gsap) return
    
    const defaultHover = {
      scale: 1.05,
      y: -4,
      duration: 0.3,
      ease: 'power2.out'
    }
    
    const defaultNormal = {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    }
    
    const handleMouseEnter = () => {
      if (element.value) {
        $gsap.to(element.value, { ...defaultHover, ...hoverProps })
      }
    }
    
    const handleMouseLeave = () => {
      if (element.value) {
        $gsap.to(element.value, { ...defaultNormal, ...normalProps })
      }
    }
    
    element.value.addEventListener('mouseenter', handleMouseEnter)
    element.value.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      if (element.value) {
        element.value.removeEventListener('mouseenter', handleMouseEnter)
        element.value.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }
  
  // Loading animation
  const loadingAnimation = (selector: string | Element) => {
    if (!$gsap) return
    
    return $gsap.fromTo(selector, {
      opacity: 0,
      scale: 0.8,
      rotation: 180
    }, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
  }
  
  // Page transition
  const pageTransition = (
    outElement: string | Element,
    inElement: string | Element,
    direction: 'left' | 'right' | 'up' | 'down' = 'right'
  ) => {
    if (!$gsap) return
    
    const tl = $gsap.timeline()
    
    const outProps: any = { opacity: 0, duration: 0.3 }
    const inProps: any = { opacity: 1, duration: 0.3 }
    
    switch (direction) {
      case 'left':
        outProps.x = -50
        inProps.x = 0
        $gsap.set(inElement, { x: 50, opacity: 0 })
        break
      case 'right':
        outProps.x = 50
        inProps.x = 0
        $gsap.set(inElement, { x: -50, opacity: 0 })
        break
      case 'up':
        outProps.y = -50
        inProps.y = 0
        $gsap.set(inElement, { y: 50, opacity: 0 })
        break
      case 'down':
        outProps.y = 50
        inProps.y = 0
        $gsap.set(inElement, { y: -50, opacity: 0 })
        break
    }
    
    tl.to(outElement, outProps)
      .to(inElement, inProps)
    
    return tl
  }
  
  return {
    scrollReveal,
    staggerAnimation,
    magneticEffect,
    parallaxScroll,
    morphAnimation,
    textReveal,
    animateCounter,
    hoverAnimation,
    loadingAnimation,
    pageTransition
  }
}

// Custom cursor composable
export function useCustomCursor() {
  const cursorElement = ref<HTMLElement>()
  const isHovering = ref(false)
  const isClicking = ref(false)
  
  const initCursor = () => {
    if (typeof window === 'undefined') return
    
    // Create cursor element
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor fixed pointer-events-none z-50 w-5 h-5 rounded-full bg-blue-500/50 backdrop-blur-sm'
    cursor.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(cursor)
    cursorElement.value = cursor
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }
    
    // Hover handlers
    const handleMouseEnter = () => {
      isHovering.value = true
      cursor.classList.add('hover')
    }
    
    const handleMouseLeave = () => {
      isHovering.value = false
      cursor.classList.remove('hover')
    }
    
    // Click handlers
    const handleMouseDown = () => {
      isClicking.value = true
      cursor.classList.add('click')
    }
    
    const handleMouseUp = () => {
      isClicking.value = false
      cursor.classList.remove('click')
    }
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], .hover-cursor')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor)
      }
    }
  }
  
  const updateCursorState = (state: 'normal' | 'hover' | 'click') => {
    if (!cursorElement.value) return
    
    cursorElement.value.className = 'custom-cursor fixed pointer-events-none z-50 rounded-full backdrop-blur-sm'
    
    switch (state) {
      case 'hover':
        cursorElement.value.className += ' w-10 h-10 bg-blue-500/30 border-2 border-blue-500/80'
        break
      case 'click':
        cursorElement.value.className += ' w-4 h-4 bg-blue-500/80'
        break
      default:
        cursorElement.value.className += ' w-5 h-5 bg-blue-500/50'
    }
    
    cursorElement.value.style.transform = 'translate(-50%, -50%)'
  }
  
  onMounted(() => {
    // Only enable on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      const cleanup = initCursor()
      
      onUnmounted(() => {
        if (cleanup) cleanup()
      })
    }
  })
  
  return {
    cursorElement,
    isHovering,
    isClicking,
    updateCursorState
  }
}

// Intersection Observer for scroll animations
export function useScrollAnimation() {
  const observedElements = ref<Set<Element>>(new Set())
  const observer = ref<IntersectionObserver>()
  
  const observeElement = (element: Element, callback: () => void) => {
    if (!observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
              observer.value?.unobserve(entry.target)
              observedElements.value.delete(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
      )
    }
    
    observer.value.observe(element)
    observedElements.value.add(element)
  }
  
  const observeElements = (selector: string, callback: (element: Element) => void) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      observeElement(element, () => callback(element))
    })
  }
  
  onUnmounted(() => {
    if (observer.value) {
      observedElements.value.forEach((element) => {
        observer.value?.unobserve(element)
      })
      observer.value.disconnect()
    }
  })
  
  return {
    observeElement,
    observeElements
  }
}
