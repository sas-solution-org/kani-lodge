// ===== MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all main functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    initSmoothScrolling();
    
    console.log('🌍 Kany Lodges & Camps website loaded successfully!');
});

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Enhanced navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Scroll indicator animation only - removed problematic parallax
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const opacity = Math.max(0, 1 - scrolled / 300);
            scrollIndicator.style.opacity = opacity;
        });
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hover effects for cards
    const cards = document.querySelectorAll('.lodge-card, .value-card, .gallery-item, .testimonial');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Image hover effects
    const imageContainers = document.querySelectorAll('.image-content, .lodge-image, .main-image');
    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img) {
            container.addEventListener('mouseenter', function() {
                img.style.transform = 'scale(1.05)';
            });

            container.addEventListener('mouseleave', function() {
                img.style.transform = 'scale(1)';
            });
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 99;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events for better performance
window.addEventListener('scroll', throttle(function() {
    // Scroll-dependent functionality here
}, 16)); // ~60fps

// ===== LOADING OPTIMIZATION =====

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can add error reporting here
});

// ===== PERFORMANCE MONITORING =====

// Simple performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`🚀 Page load time: ${loadTime}ms`);
        
        // Log Core Web Vitals if available
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`📊 LCP: ${entry.startTime}ms`);
                    }
                });
            });
            
            observer.observe({entryTypes: ['largest-contentful-paint']});
        }
    }, 0);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Focus management for mobile menu
function manageFocus() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const focusableElements = navMenu?.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                // Focus first focusable element when menu opens
                if (focusableElements && focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        });
    }
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// Keyboard navigation for gallery and lightbox
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.lightbox.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
});

// ===== BROWSER COMPATIBILITY =====

// Check for modern browser features
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        webp: checkWebPSupport(),
        localStorage: typeof Storage !== 'undefined'
    };
    
    console.log('🔍 Browser features:', features);
    
    // Add fallbacks for older browsers
    if (!features.intersectionObserver) {
        // Fallback for older browsers without IntersectionObserver
        console.warn('IntersectionObserver not supported, using fallback');
        // Add polyfill or alternative implementation
    }
}

function checkWebPSupport() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Initialize browser compatibility checks
document.addEventListener('DOMContentLoaded', checkBrowserSupport);

// ===== MODULE EXPORTS (if using ES6 modules) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initScrollEffects,
        initAnimations,
        initSmoothScrolling,
        debounce,
        throttle
    };
}