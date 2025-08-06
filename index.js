/* ===== PROFESSIONAL PORTFOLIO JS ===== */

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Clear any hash from URL on page load to prevent auto-scroll
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    
    initNavigation();
    initExperienceTabs();
    initGithubProjects(); // This now loads manual projects
    initDiscordCopy();
    initScrollAnimations();
    initSmoothScrolling();
});

/* ===== NAVIGATION ===== */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            }
        }
    });
}

/* ===== EXPERIENCE TABS ===== */
function initExperienceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            if (tabPanels[index]) {
                tabPanels[index].classList.add('active');
            }
        });
    });
    
    // Set first tab as active by default
    if (tabButtons[0] && tabPanels[0]) {
        tabButtons[0].classList.add('active');
        tabPanels[0].classList.add('active');
    }
}

/* ===== MANUAL PROJECTS ===== */
function initGithubProjects() {
    const projectsContainer = document.getElementById('github-projects');
    
    if (!projectsContainer) return;
    
    // Show loading state briefly for smooth transition
    projectsContainer.innerHTML = `
        <div class="project-loading">
            <div class="loading-spinner"></div>
            <p>Loading featured projects...</p>
        </div>
    `;
    
    // Load projects after a brief delay for better UX
    setTimeout(() => {
        displayManualProjects(projectsContainer);
    }, 800);
}

function displayManualProjects(container) {
    const projects = [
        {
            title: 'Quicacademy',
            description: 'AI-powered educational platform with intelligent content generation and personalized learning.',
            role: 'Lead Full Stack Developer',
            icon: 'fas fa-graduation-cap'
        },
        {
            title: 'TASKIT',
            description: 'A comprehensive task management application with real-time collaboration capabilities.',
            role: 'Full Stack Developer',
            icon: 'fas fa-tasks'
        },
        {
            title: 'ScreenSquad',
            description: 'Movie discovery platform with reviews and personalized recommendations.',
            role: 'Frontend Developer', 
            icon: 'fas fa-film'
        },
        {
            title: 'PADSIRTRW',
            description: 'Community management system for neighborhood associations.',
            role: 'Project Manager',
            icon: 'fas fa-users'
        }
    ];

    container.innerHTML = `
        <div class="projects-overview">
            ${projects.map(project => `
                <div class="project-overview-card">
                    <div class="project-icon">
                        <i class="${project.icon}"></i>
                    </div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <span class="project-role">${project.role}</span>
                </div>
            `).join('')}
        </div>
        <div class="projects-cta">
            <a href="projects.html" class="btn btn-primary">
                View All Projects
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

/* ===== SMOOTH SCROLLING ===== */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, targetId);
            }
        });
    });
}

/* ===== DISCORD COPY FUNCTIONALITY ===== */
function initDiscordCopy() {
    const discordLinks = document.querySelectorAll('.social-link[href*="discord"]');
    const discordUsername = "rayendra_nagata";
    
    discordLinks.forEach(link => {
        // Create tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'discord-tooltip';
        tooltip.textContent = `Click to copy: ${discordUsername}`;
        link.appendChild(tooltip);
        
        // Show/hide tooltip on hover
        link.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        link.addEventListener('mouseleave', () => {
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                tooltip.textContent = `Click to copy: ${discordUsername}`;
                tooltip.style.borderColor = 'var(--border-color)';
            }, 1000);
        });
        
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Try modern clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(discordUsername);
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = discordUsername;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }
                
                showCopyNotification(`Discord username "${discordUsername}" copied to clipboard!`);
                
                // Update tooltip
                if (tooltip) {
                    tooltip.textContent = 'Copied!';
                    tooltip.style.borderColor = 'var(--accent-primary)';
                }
            } catch (err) {
                console.error('Failed to copy Discord username:', err);
                showCopyNotification('Failed to copy Discord username', 'error');
            }
        });
    });
}

function showCopyNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    if (type === 'error') {
        notification.style.borderColor = '#ff6b6b';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class and observe elements
    document.querySelectorAll('.hero-content, .about-content, .experience-content, .project-overview-card, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}
