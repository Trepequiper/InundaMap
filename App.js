
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

// ====================  Navigacion para el movil ====================

const toggleMobileNav = () => {
    navMenu.classList.toggle('active');
    
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


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
});

ment.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleMobileNav();
    }
});

const handleHeaderScroll = throttle(() => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleHeaderScroll);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
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


if (alertClose) {
    alertClose.addEventListener('click', () => {
        alertBanner.style.display = 'none';
        sessionStorage.setItem('alertClosed', 'true');
    });
}


if (sessionStorage.getItem('alertClosed') === 'true') {
    if (alertBanner) {
        alertBanner.style.display = 'none';
    }
}

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

if (statNumbers.length > 0) {
    animateStats();
}

segmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetSegment = tab.dataset.segment;
        
        segmentTabs.forEach(t => t.classList.remove('segment-tab--active'));
        
        tab.classList.add('segment-tab--active');
        
        segmentPanels.forEach(panel => {
            panel.classList.remove('segment-panel--active');
        });
        
        const targetPanel = document.querySelector(`[data-panel="${targetSegment}"]`);
        if (targetPanel) {
            targetPanel.classList.add('segment-panel--active');
        }
    });
});


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        filterButtons.forEach(btn => {
            if (btn === button) {
                btn.classList.toggle('filter-btn--active');
            } else if (filter !== 'all') {
                btn.classList.remove('filter-btn--active');
            }
        });
        
        if (filter === 'all') {
            filterButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('filter-btn--active');
                }
            });
        }
        
        applyMapFilter(filter);
    });
});


const applyMapFilter = (filter) => {
    console.log(`Applying filter: ${filter}`);
    
    const infoCards = document.querySelectorAll('.info-card');
    
    if (filter === 'all') {
        infoCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    infoCards.forEach(card => {
        const cardType = Array.from(card.classList).find(cls => cls.includes('info-card--'));
        const cardFilter = cardType ? cardType.split('--')[1] : '';
        
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


if (mapSearchInput) {
    const handleMapSearch = debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        console.log(`Searching for: ${query}`);
    
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


const initMap = () => {
    console.log('Initializing map...');
};


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


const handleBackToTop = throttle(() => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 100);

window.addEventListener('scroll', handleBackToTop);


if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

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
    
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('.info-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
};

observeElements();


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^(\+51|0)?[9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};


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


window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});


window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});


document.addEventListener('DOMContentLoaded', () => {
    console.log('InundaMap landing page initialized');
    
    handleHeaderScroll();
    handleBackToTop();
    
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Resolution:', `${window.screen.width}x${window.screen.height}`);
});

window.addEventListener('load', () => {
    console.log('Page fully loaded');
    initMap();
});

const trackEvent = (category, action, label) => {
    console.log('Event tracked:', { category, action, label });

};

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const label = e.target.textContent.trim();
        trackEvent('Button', 'Click', label);
    });
});

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