/**
 * INUNDAMAP - LANDING PAGE JAVASCRIPT
 * Version: 1.0
 * Description: Interactive functionality for InundaMap landing page
 */

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce function to limit function calls
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for scroll events
 */
const throttle = (func, limit) => {
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
};

// ==================== DOM ELEMENTS ====================

const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const alertBanner = document.getElementById('alert-banner');
const alertClose = document.querySelector('.alert-close');
const backToTop = document.getElementById('back-to-top');
const statNumbers = document.querySelectorAll('.stat__number');
const segmentTabs = document.querySelectorAll('.segment-tab');
const segmentPanels = document.querySelectorAll('.segment-panel');
const filterButtons = document.querySelectorAll('.filter-btn');
const mapSearchInput = document.getElementById('map-search-input');

// ==================== MOBILE NAVIGATION ====================

/**
 * Toggle mobile navigation menu
 */
const toggleMobileNav = () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const hamburgerLines = navToggle.querySelectorAll('.hamburger');
    if (navMenu.classList.contains('active')) {
        hamburgerLines[0].style.transform = 'rotate(45deg) translateY(8px)';
        hamburgerLines[1].style.opacity = '0';
        hamburgerLines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        hamburgerLines[0].style.transform = '';
        hamburgerLines[1].style.opacity = '1';
        hamburgerLines[2].style.transform = '';
    }
};

if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
}

/**
 * Close mobile menu when clicking nav links
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
});

/**
 * Close mobile menu when clicking outside
 */
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleMobileNav();
    }
});

// ==================== HEADER SCROLL EFFECTS ====================

/**
 * Add/remove header shadow on scroll
 */
const handleHeaderScroll = throttle(() => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleHeaderScroll);

// ==================== SMOOTH SCROLLING ====================

/**
 * Smooth scroll to sections
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore empty anchors
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ALERT BANNER ====================

/**
 * Close alert banner
 */
if (alertClose) {
    alertClose.addEventListener('click', () => {
        alertBanner.style.display = 'none';
        sessionStorage.setItem('alertClosed', 'true');
    });
}

/**
 * Check if alert was previously closed
 */
if (sessionStorage.getItem('alertClosed') === 'true') {
    if (alertBanner) {
        alertBanner.style.display = 'none';
    }
}

// ==================== ANIMATED STATISTICS ====================

/**
 * Animate stat numbers on scroll
 */
const animateStats = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
};

/**
 * Animate number from 0 to target
 */
const animateNumber = (element, target) => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateNumber();
};

// Initialize stat animation
if (statNumbers.length > 0) {
    animateStats();
}

// ==================== SEGMENT TABS ====================

/**
 * Switch between user segment tabs
 */
segmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetSegment = tab.dataset.segment;
        
        // Remove active class from all tabs
        segmentTabs.forEach(t => t.classList.remove('segment-tab--active'));
        
        // Add active class to clicked tab
        tab.classList.add('segment-tab--active');
        
        // Hide all panels
        segmentPanels.forEach(panel => {
            panel.classList.remove('segment-panel--active');
        });
        
        // Show target panel
        const targetPanel = document.querySelector(`[data-panel="${targetSegment}"]`);
        if (targetPanel) {
            targetPanel.classList.add('segment-panel--active');
        }
    });
});

// ==================== MAP FILTERS ====================

/**
 * Handle map filter buttons
 */
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Toggle active state
        filterButtons.forEach(btn => {
            if (btn === button) {
                btn.classList.toggle('filter-btn--active');
            } else if (filter !== 'all') {
                btn.classList.remove('filter-btn--active');
            }
        });
        
        // If "all" button clicked, remove active from others
        if (filter === 'all') {
            filterButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('filter-btn--active');
                }
            });
        }
        
        // Apply filter (simulated - would integrate with actual map API)
        applyMapFilter(filter);
    });
});

/**
 * Apply filter to map (simulated)
 */
const applyMapFilter = (filter) => {
    console.log(`Applying filter: ${filter}`);
    
    // In production, this would filter the actual map markers
    const infoCards = document.querySelectorAll('.info-card');
    
    if (filter === 'all') {
        infoCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    infoCards.forEach(card => {
        const cardType = Array.from(card.classList).find(cls => cls.includes('info-card--'));
        const cardFilter = cardType ? cardType.split('--')[1] : '';
        
        // Map filter types to card types
        const filterMap = {
            'high': 'alert',
            'medium': 'report',
            'low': 'report',
            'shelters': 'shelter'
        };
        
        if (filterMap[filter] === cardFilter || filter === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// ==================== MAP SEARCH ====================

/**
 * Handle map search input
 */
if (mapSearchInput) {
    const handleMapSearch = debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        console.log(`Searching for: ${query}`);
        
        // In production, this would query the actual map API
        // For now, we'll simulate filtering info cards
        const infoCards = document.querySelectorAll('.info-card');
        
        if (query === '') {
            infoCards.forEach(card => card.style.display = 'block');
            return;
        }
        
        infoCards.forEach(card => {
            const title = card.querySelector('.info-card__title').textContent.toLowerCase();
            const description = card.querySelector('.info-card__description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300);
    
    mapSearchInput.addEventListener('input', handleMapSearch);
}

// ==================== GOOGLE MAPS INTEGRATION (SIMULATED) ====================

/**
 * Initialize Google Maps
 * In production, this would use the actual Google Maps API
 */
const initMap = () => {
    console.log('Initializing map...');
    
    // This is a placeholder. In production, you would initialize the actual map:
    /*
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -12.0464, lng: -77.0428 }, // Lima, Peru
        zoom: 8,
        styles: customMapStyles // Optional custom styling
    });
    
    // Add markers for alerts, shelters, etc.
    const markers = [
        {
            position: { lat: -5.1945, lng: -80.6328 }, // Piura
            type: 'alert',
            title: 'Alerta de inundación - Piura'
        },
        // ... more markers
    ];
    
    markers.forEach(markerData => {
        const marker = new google.maps.Marker({
            position: markerData.position,
            map: map,
            title: markerData.title,
            icon: getMarkerIcon(markerData.type)
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(markerData)
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
    */
};

/**
 * Simulate map loading
 */
setTimeout(() => {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #0A4C8C 0%, #6ECDE7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                <div style="text-align: center;">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" style="margin-bottom: 1rem;">
                        <path d="M32 8C22 8 14 16 14 26c0 15 18 30 18 30s18-15 18-30c0-10-8-18-18-18zm0 24c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    </svg>
                    <p>Mapa interactivo disponible<br/>Google Maps se integrará aquí</p>
                </div>
            </div>
        `;
    }
}, 1000);

// ==================== BACK TO TOP BUTTON ====================

/**
 * Show/hide back to top button
 */
const handleBackToTop = throttle(() => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 100);

window.addEventListener('scroll', handleBackToTop);

/**
 * Scroll to top on button click
 */
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================

/**
 * Add fade-in animation to elements on scroll
 */
const observeElements = () => {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe info cards
    document.querySelectorAll('.info-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
};

// Initialize animations
observeElements();

// ==================== FORM VALIDATION (IF NEEDED) ====================

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format (Peru)
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^(\+51|0)?[9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// ==================== PERFORMANCE OPTIMIZATION ====================

/**
 * Lazy load images
 */
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize lazy loading if needed
// lazyLoadImages();

// ==================== ERROR HANDLING ====================

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send errors to a logging service
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==================== INITIALIZATION ====================

/**
 * Initialize app when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('InundaMap landing page initialized');
    
    // Run initial checks
    handleHeaderScroll();
    handleBackToTop();
    
    // Log environment info
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Resolution:', `${window.screen.width}x${window.screen.height}`);
});

/**
 * Handle page load complete
 */
window.addEventListener('load', () => {
    console.log('Page fully loaded');
    // Initialize map or other heavy resources here
    initMap();
});

// ==================== ANALYTICS (PLACEHOLDER) ====================

/**
 * Track user interactions
 * In production, integrate with Google Analytics, Mixpanel, etc.
 */
const trackEvent = (category, action, label) => {
    console.log('Event tracked:', { category, action, label });
    
    // Example Google Analytics integration:
    // gtag('event', action, {
    //     'event_category': category,
    //     'event_label': label
    // });
};

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const label = e.target.textContent.trim();
        trackEvent('Button', 'Click', label);
    });
});

// Track navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const section = e.target.getAttribute('href');
        trackEvent('Navigation', 'Click', section);
    });
});

// ==================== SERVICE WORKER (OPTIONAL) ====================

/**
 * Register service worker for offline functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ==================== EXPORTS (IF USING MODULES) ====================

// If you're using ES6 modules, you can export functions:
// export { initMap, trackEvent, isValidEmail, isValidPhone };