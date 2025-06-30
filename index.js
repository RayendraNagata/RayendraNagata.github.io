// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (href === '#' || href === '' || href.length <= 1) {
            return;
        }
        
        // Skip if this is the discord link (let discord handler manage it)
        if (this.id === 'discord-link') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Three.js background animation
const scene = new THREE.Scene();
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create particles
const geometry = new THREE.BufferGeometry();
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;

    colors[i] = Math.random();
    colors[i + 1] = Math.random() * 0.5 + 0.5;
    colors[i + 2] = 1;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add floating particles to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        hero.appendChild(particle);
    }
}

createParticles();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Discord tooltip functionality
function initDiscordTooltip() {
    const discordLink = document.getElementById('discord-link');
    
    if (!discordLink) {
        console.error('Discord link element not found!');
        return;
    }
    
    console.log('Discord tooltip initialized');
    let tooltip = null;
    let tooltipTimeout = null;

    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'discord-tooltip';
        
        const username = discordLink.getAttribute('data-username');
        tooltip.innerHTML = `
            <div class="username">${username}</div>
            <div class="copy-hint">Click to copy username</div>
        `;
        
        document.body.appendChild(tooltip);
        return tooltip;
    }

    function showCopyNotification(username) {
        console.log('Showing copy notification for:', username);
        
        // Remove existing notification if any
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="icon">✅</div>
            <div class="text">
                <div class="title">Discord Username Copied!</div>
                <div class="subtitle">${username}</div>
            </div>
        `;

        document.body.appendChild(notification);
        console.log('Notification element created and added to body');

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
            console.log('Show class added to notification');
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                    console.log('Notification removed');
                }
            }, 400);
        }, 3000);
    }

    function showTooltip(e) {
        if (!tooltip) {
            tooltip = createTooltip();
        }

        clearTimeout(tooltipTimeout);
        
        // Force a reflow to ensure tooltip dimensions are calculated
        tooltip.style.display = 'block';
        tooltip.offsetHeight; // Trigger reflow
        
        const rect = discordLink.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
        tooltip.style.top = (rect.top - tooltipRect.height - 15) + 'px';
        
        tooltip.classList.add('show');
    }

    function hideTooltip() {
        if (tooltip) {
            tooltipTimeout = setTimeout(() => {
                tooltip.classList.remove('show');
            }, 100);
        }
    }

    function copyUsername(e) {
        e.preventDefault();
        const username = discordLink.getAttribute('data-username');
        
        // Function to show notification
        const showNotification = () => {
            showCopyNotification(username);
            
            // Update tooltip text temporarily
            if (tooltip) {
                const originalHTML = tooltip.innerHTML;
                tooltip.innerHTML = `
                    <div class="username">✅ Copied!</div>
                    <div class="copy-hint">${username}</div>
                `;
                
                setTimeout(() => {
                    if (tooltip) {
                        tooltip.innerHTML = originalHTML;
                    }
                }, 2000);
            }
        };
        
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(username).then(() => {
                showNotification();
            }).catch(() => {
                // Fallback if clipboard API fails
                fallbackCopy(username, showNotification);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopy(username, showNotification);
        }
    }
    
    function fallbackCopy(text, callback) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                callback();
            } else {
                console.log('Copy failed');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }

    discordLink.addEventListener('mouseenter', showTooltip);
    discordLink.addEventListener('mouseleave', hideTooltip);
    discordLink.addEventListener('click', copyUsername);
}

// Initialize Discord tooltip when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all elements are properly loaded
    setTimeout(() => {
        const discordLink = document.getElementById('discord-link');
        if (discordLink) {
            initDiscordTooltip();
        } else {
            console.error('Discord link not found');
        }
    }, 100);
});

// Alternative initialization for older browsers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDiscordTooltip, 100);
    });
} else {
    // DOM already loaded
    setTimeout(initDiscordTooltip, 100);
}

// Observe elements for animation
document.querySelectorAll('.stat-item, .skill-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});