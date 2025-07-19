// ===== GALLERY JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initLightbox();
    initMasonry();
    
    console.log('🖼️ Gallery functionality loaded successfully!');
});

// ===== GALLERY FILTER =====
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(galleryItems, filter);
        });
    });

    // Initial filter setup
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    filterGalleryItems(galleryItems, activeFilter);
}

function filterGalleryItems(items, filter) {
    items.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Staggered animation
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// ===== LIGHTBOX =====
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.video)');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (!lightbox) return;

    let currentIndex = 0;
    let visibleItems = [];

    // Update visible items based on current filter
    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => {
            return window.getComputedStyle(item).display !== 'none' && !item.classList.contains('video');
        });
    }

    // Open lightbox
    function openLightbox(index) {
        updateVisibleItems();
        currentIndex = index;
        
        if (visibleItems[currentIndex]) {
            const item = visibleItems[currentIndex];
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = overlay?.querySelector('h3')?.textContent || '';
            lightboxDescription.textContent = overlay?.querySelector('p')?.textContent || '';
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            lightboxClose.focus();
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        updateVisibleItems();
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % visibleItems.length;
        } else {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        }
        
        openLightbox(currentIndex);
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            const itemIndex = visibleItems.indexOf(this);
            if (itemIndex !== -1) {
                openLightbox(itemIndex);
            }
        });

        // Add keyboard support for gallery items
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Open image in lightbox');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Lightbox controls
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext?.addEventListener('click', () => navigateLightbox('next'));

    // Click outside to close
    lightbox?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateLightbox('next');
                break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox?.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox?.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                navigateLightbox('prev');
            } else {
                navigateLightbox('next');
            }
        }
    }
}

// ===== VIDEO HANDLING =====
function initVideoGallery() {
    const videoItems = document.querySelectorAll('.gallery-item.video');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // For demo purposes, we'll show an alert
            // In a real implementation, you'd open a video player or modal
            const title = this.querySelector('.gallery-overlay h3')?.textContent || 'Video';
            
            // Create video modal (simplified example)
            showVideoModal(title);
        });
    });
}

function showVideoModal(title) {
    // Create a simple video modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
        text-align: center;
        position: relative;
    `;
    
    content.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #6B8E23;">${title}</h3>
        <p style="margin-bottom: 2rem; color: #666;">
            Cette fonctionnalité sera bientôt disponible.<br>
            Les vidéos seront intégrées via YouTube ou Vimeo.
        </p>
        <button class="btn-primary" onclick="this.closest('.video-modal').remove(); document.body.style.overflow = '';">
            Fermer
        </button>
        <button style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;" onclick="this.closest('.video-modal').remove(); document.body.style.overflow = '';">
            ×
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// ===== MASONRY LAYOUT =====
function initMasonry() {
    const gallery = document.querySelector('.gallery-masonry');
    if (!gallery) return;

    // Simple masonry-like effect using CSS Grid
    // For more complex layouts, consider using a library like Masonry.js
    
    function updateMasonryLayout() {
        const items = gallery.querySelectorAll('.gallery-item');
        const gap = 24; // 1.5rem in pixels
        
        // Reset heights
        items.forEach(item => {
            item.style.height = 'auto';
        });
        
        // For larger screens, create varied heights for visual interest
        if (window.innerWidth > 768) {
            items.forEach((item, index) => {
                // Randomly assign different heights for visual variety
                const heights = [250, 300, 350, 280, 320];
                const randomHeight = heights[index % heights.length];
                
                const img = item.querySelector('img');
                if (img) {
                    img.style.height = randomHeight + 'px';
                }
            });
        }
    }

    // Update layout on load and resize
    updateMasonryLayout();
    window.addEventListener('resize', debounce(updateMasonryLayout, 250));
    
    // Update layout when filter changes
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(updateMasonryLayout, 500); // Wait for filter animation
        });
    });
}

// ===== IMAGE LAZY LOADING =====
function initGalleryLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    // Load image
                    img.addEventListener('load', function() {
                        this.style.opacity = '1';
                    });
                    
                    // If image is already cached
                    if (img.complete) {
                        img.style.opacity = '1';
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== GALLERY SEARCH =====
function initGallerySearch() {
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher dans la galerie...';
    searchInput.className = 'gallery-search';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 2px solid #E0E0E0;
        border-radius: 8px;
        font-size: 1rem;
        margin: 0 auto 2rem auto;
        display: block;
        transition: border-color 0.3s ease;
    `;
    
    const filterContainer = document.querySelector('.gallery-filter .container');
    if (filterContainer) {
        filterContainer.appendChild(searchInput);
    }
    
    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.gallery-overlay h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.gallery-overlay p')?.textContent.toLowerCase() || '';
            const altText = item.querySelector('img')?.alt.toLowerCase() || '';
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          altText.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update masonry layout after search
        setTimeout(() => {
            if (window.updateMasonryLayout) {
                window.updateMasonryLayout();
            }
        }, 100);
    }, 300));
    
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#6B8E23';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#E0E0E0';
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function (if not already available from main.js)
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initVideoGallery();
    initGalleryLazyLoading();
    initGallerySearch();
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Announce filter changes to screen readers
function announceFilterChange(filterName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    
    announcement.textContent = `Filtre ${filterName} appliqué à la galerie`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add announcement to filter buttons
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterName = this.textContent;
            announceFilterChange(filterName);
        });
    });
});

// ===== PERFORMANCE OPTIMIZATION =====

// Preload next/previous images in lightbox
function preloadAdjacentImages(currentIndex, visibleItems) {
    const preloadNext = (currentIndex + 1) % visibleItems.length;
    const preloadPrev = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    
    [preloadNext, preloadPrev].forEach(index => {
        if (visibleItems[index]) {
            const img = new Image();
            img.src = visibleItems[index].querySelector('img').src;
        }
    });
}

// ===== MODULE EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGalleryFilter,
        initLightbox,
        initMasonry,
        initVideoGallery,
        initGalleryLazyLoading,
        initGallerySearch
    };
}