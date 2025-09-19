// Lazy Loading Utility
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.backgroundObserver = null;
    this.animationObserver = null;
    this.unicornStudioLoaded = false;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupImageObserver();
      this.setupBackgroundObserver();
      this.setupAnimationObserver();
      this.observeElements();
    } else {
      // Fallback for older browsers - load everything immediately
      this.loadAllImages();
      this.loadAllBackgrounds();
      this.loadAllAnimations();
    }
  }

  setupImageObserver() {
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before element enters viewport
      threshold: 0.01
    });
  }

  setupBackgroundObserver() {
    this.backgroundObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadBackground(entry.target);
          this.backgroundObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading 100px before element enters viewport
      threshold: 0.01
    });
  }

  setupAnimationObserver() {
    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadUnicornStudio(entry.target);
          this.animationObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '300px 0px', // Start loading 300px before element enters viewport (increased for faster loading)
      threshold: 0.01
    });
  }

  observeElements() {
    // Observe lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));

    // Observe lazy backgrounds
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(element => this.backgroundObserver.observe(element));

    // Observe lazy animations
    const lazyAnimations = document.querySelectorAll('[data-unicorn-studio]');
    lazyAnimations.forEach(element => this.animationObserver.observe(element));
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
      
      // Add fade-in effect
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      img.onload = () => {
        img.style.opacity = '1';
      };
    }
  }

  loadBackground(element) {
    const bgUrl = element.getAttribute('data-bg');
    if (bgUrl) {
      // Create a new image to preload the background
      const img = new Image();
      img.onload = () => {
        element.style.backgroundImage = `url(${bgUrl})`;
        element.removeAttribute('data-bg');
        element.classList.add('bg-loaded');
        
        // Add fade-in effect for background
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 50);
      };
      img.src = bgUrl;
    }
  }

  loadUnicornStudio(element) {
    const projectId = element.getAttribute('data-unicorn-studio');
    if (!projectId) return;
    
    // Add loading state
    element.classList.add('animation-loading');
    
    // If UnicornStudio is already loaded, just initialize the project
    if (this.unicornStudioLoaded && window.UnicornStudio) {
      this.initializeUnicornProject(element, projectId);
      return;
    }
    
    // Load UnicornStudio script if not already loaded
    if (!this.unicornStudioLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true; // Load asynchronously for better performance
      
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
        this.unicornStudioLoaded = true;
        
        // Initialize all pending projects
        const pendingElements = document.querySelectorAll('[data-unicorn-studio]');
        pendingElements.forEach(el => {
          const id = el.getAttribute('data-unicorn-studio');
          if (id) this.initializeUnicornProject(el, id);
        });
      };
      
      script.onerror = () => {
        console.warn('Failed to load UnicornStudio animation');
        element.classList.remove('animation-loading');
        element.classList.add('animation-error');
      };
      
      document.head.appendChild(script);
    }
  }
  
  initializeUnicornProject(element, projectId) {
    // Add the project div
    const projectDiv = document.createElement('div');
    projectDiv.setAttribute('data-us-project', projectId);
    projectDiv.className = 'absolute w-full h-full left-0 top-0 -z-10';
    element.appendChild(projectDiv);
    
    // Clean up
    element.removeAttribute('data-unicorn-studio');
    element.classList.remove('animation-loading');
    element.classList.add('animation-loaded');
    
    // Add a small delay to ensure animation starts smoothly
    setTimeout(() => {
      element.style.opacity = '1';
    }, 100);
  }

  // Fallback methods for older browsers
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }

  loadAllBackgrounds() {
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(element => this.loadBackground(element));
  }

  loadAllAnimations() {
    const lazyAnimations = document.querySelectorAll('[data-unicorn-studio]');
    lazyAnimations.forEach(element => this.loadUnicornStudio(element));
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LazyLoader();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LazyLoader());
} else {
  new LazyLoader();
}
