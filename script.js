// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.project-card, .skill-category, .stat, .contact-item').forEach(el => {
    observer.observe(el);
});

// ============================================
// SKILL PROGRESS ANIMATION
// ============================================

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const parent = bar.closest('.skill-item');
        const isInView = parent.getBoundingClientRect().top < window.innerHeight;
        
        if (isInView && !bar.classList.contains('animated')) {
            const width = bar.style.width;
            bar.style.width = '0';
            bar.classList.add('animated');
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 100);
        }
    });
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// ============================================
// SMOOTH SCROLL & PAGE INTERACTIONS
// ============================================

// Animate numbers on stats
const stats = document.querySelectorAll('.stat h3');
const animatedStats = new Set();

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats.has(entry.target)) {
            animateCount(entry.target);
            animatedStats.add(entry.target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

function animateCount(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// ============================================
// ADD ANIMATION STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .project-card,
    .skill-category,
    .stat,
    .contact-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .project-card.animate-in,
    .skill-category.animate-in,
    .stat.animate-in,
    .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('mousemove', (e) => {
    const floatingBox = document.querySelector('.floating-box');
    
    if (floatingBox) {
        const x = (e.clientX / window.innerWidth) * 20 - 10;
        const y = (e.clientY / window.innerHeight) * 20 - 10;
        
        floatingBox.style.transform = `translateY(-30px) rotateX(${y}deg) rotateY(${x}deg)`;
    }
});

// ============================================
// DARK MODE TOGGLE (Optional Feature)
// ============================================

function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('title', 'Toggle Dark Mode');
    
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ec4899, #d946ef);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    `;
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const darkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', darkMode);
        darkModeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    darkModeToggle.addEventListener('mouseenter', () => {
        darkModeToggle.style.transform = 'scale(1.1)';
    });
    
    darkModeToggle.addEventListener('mouseleave', () => {
        darkModeToggle.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(darkModeToggle);
}

// Initialize dark mode on page load
window.addEventListener('load', initDarkMode);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollToTop() {
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ec4899, #d946ef);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
        z-index: 999;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    `;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTop.style.display = 'flex';
        } else {
            scrollToTop.style.display = 'none';
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollToTop.addEventListener('mouseenter', () => {
        scrollToTop.style.transform = 'scale(1.1)';
    });
    
    scrollToTop.addEventListener('mouseleave', () => {
        scrollToTop.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(scrollToTop);
}

window.addEventListener('load', initScrollToTop);

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ============================================
// PRELOADER (Optional)
// ============================================

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// ============================================
// THEME SETTINGS (Modal, accessible from nav)
// Replaces the floating widget with a settings modal triggered by the settings button in the nav.
// ============================================

function initThemeSwitcher() {
    // Theme definitions - default modern teal theme first
    const themes = {
        teal: {
            primary: '#06b6d4',
            secondary: '#0891b2',
            accent: '#00e5ff'
        },
        blue: {
            primary: '#0066FF',
            secondary: '#6600FF',
            accent: '#FF0066'
        },
        green: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#f59e0b'
        },
        orange: {
            primary: '#f97316',
            secondary: '#ea580c',
            accent: '#fb923c'
        }
    };

    // Create modal markup (hidden by default)
    const modal = document.createElement('div');
    modal.className = 'theme-modal';
    modal.innerHTML = `
        <div class="theme-modal-content" role="dialog" aria-modal="true" aria-label="Theme settings">
            <div class="theme-modal-header">
                <h3>Theme Settings</h3>
                <button class="close-theme-modal" aria-label="Close settings">&times;</button>
            </div>
            <div class="theme-toggle">
                <button class="theme-btn" data-theme="teal" title="Teal Theme">�</button>
                <button class="theme-btn" data-theme="blue" title="Blue Theme">🔵</button>
                <button class="theme-btn" data-theme="green" title="Green Theme">🌿</button>
                <button class="theme-btn" data-theme="orange" title="Orange Theme">🟠</button>
            </div>
            <p class="theme-note">Theme preference will be saved to your browser.</p>
        </div>
    `;

    // Modal styles - modern magenta gradient design
    const style = document.createElement('style');
    style.textContent = `
        .theme-modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); z-index: 1200; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; backdrop-filter: blur(4px); }
        .theme-modal.open { opacity: 1; pointer-events: auto; }
        .theme-modal-content { width: 360px; max-width: 90%; background: linear-gradient(135deg, #1a0a2e 0%, #16213e 100%); padding: 24px; border-radius: 16px; border: 1.5px solid; border-image: linear-gradient(135deg, #ec4899, #d946ef) 1; box-shadow: 0 20px 60px rgba(236,72,153,0.3), inset 0 1px 0 rgba(255,255,255,0.08); color: var(--text-light); }
        .theme-modal-header { display:flex; justify-content:space-between; align-items:center; gap: 1rem; margin-bottom: 16px; }
        .theme-modal-header h3 { margin:0; color: var(--text-dark); font-size: 1.25rem; font-weight: 700; background: linear-gradient(90deg, #ec4899, #d946ef); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .close-theme-modal { background: transparent; border: none; color: #ec4899; font-size: 1.6rem; cursor: pointer; transition: transform 0.2s ease; }
        .close-theme-modal:hover { transform: rotate(90deg); }
        .theme-toggle { display:flex; gap: 12px; margin-top: 16px; justify-content: center; }
        .theme-btn { width:50px; height:50px; border-radius: 12px; border: 1.5px solid; border-color: rgba(236,72,153,0.3); background: rgba(236,72,153,0.08); cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center; transition: all 0.2s ease; }
        .theme-btn:hover { border-color: #ec4899; background: rgba(236,72,153,0.15); transform: translateY(-4px); box-shadow: 0 8px 20px rgba(236,72,153,0.25); }
        .theme-btn.active { border-color: #d946ef; background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(217,70,239,0.2)); box-shadow: 0 0 0 3px rgba(236,72,153,0.2); transform: translateY(-2px); }
        .theme-note { text-align:center; font-size:0.85rem; color: #9ca3af; margin-top: 16px; }
        @media (max-width:480px) { .theme-modal-content { width: 300px; padding: 20px; } .theme-btn { width:44px; height:44px; } }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Helpers
    function setTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        localStorage.setItem('selectedTheme', themeName);

        // update active state on buttons
        modal.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = modal.querySelector(`[data-theme="${themeName}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // attach click handlers
    modal.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.getAttribute('data-theme');
            setTheme(t);
        });
    });

    // open/close wiring
    const settingsBtn = document.getElementById('settingsBtn');
    const closeBtn = modal.querySelector('.close-theme-modal');

    function openModal() { modal.classList.add('open'); }
    function closeModal() { modal.classList.remove('open'); }

    settingsBtn?.addEventListener('click', () => {
        // toggle modal
        if (modal.classList.contains('open')) closeModal(); else openModal();
    });

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Load saved theme or default to teal
    const savedTheme = localStorage.getItem('selectedTheme') || 'teal';
    setTheme(savedTheme);
}

// Initialize theme settings on page load (does not show a floating widget)
window.addEventListener('load', initThemeSwitcher);

console.log('%c👋 Welcome to Sharan\'s Portfolio! ', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cLooking at the code? I\'d love to work with you! Get in touch at sharan2004fire@gmail.com', 'font-size: 14px; color: #64748b;');
