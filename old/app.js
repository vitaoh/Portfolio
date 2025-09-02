// Victor's Portfolio Interactive Features - Fixed Version

class Portfolio {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contactForm = document.getElementById('contact-form');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAll();
            });
        } else {
            this.setupAll();
        }
    }
    
    setupAll() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupContactForm();
        this.setupSkillsAnimation();
        this.setupSmoothScrolling();
        this.setupTypingAnimation();
        console.log('Portfolio initialized successfully');
    }
    
    // Navigation functionality - Fixed
    setupNavigation() {
        if (!this.navToggle || !this.navMenu) {
            console.error('Navigation elements not found');
            return;
        }
        
        // Mobile menu toggle - Fixed
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Toggle clicked, current state:', this.isMenuOpen);
            
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.isMenuOpen) {
                this.navMenu.classList.add('active');
                this.navToggle.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            } else {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on links - Fixed
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default here, let smooth scrolling handle it
                this.closeMenu();
            });
        });
        
        // Close mobile menu when clicking outside - Fixed
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Scroll effects for navbar
    setupScrollEffects() {
        let ticking = false;
        
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class to navbar
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Update active navigation link
            this.updateActiveNavLink();
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    // Update active navigation link based on scroll position - Fixed
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for skills animation
                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkills();
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.about-card, .vision-goal, .project-card, .skills-section, .contact-item');
        
        animatedElements.forEach((element, index) => {
            // Add animation classes with staggered delays
            if (element.classList.contains('about-card')) {
                element.classList.add('fade-in');
                element.style.animationDelay = `${index * 0.2}s`;
            } else if (element.classList.contains('vision-goal')) {
                element.classList.add('fade-in');
                element.style.animationDelay = `${index * 0.3}s`;
            } else if (element.classList.contains('project-card')) {
                element.classList.add('slide-in-left');
                element.style.animationDelay = `${index * 0.2}s`;
            } else if (element.classList.contains('contact-item')) {
                element.classList.add('slide-in-right');
                element.style.animationDelay = `${index * 0.1}s`;
            } else {
                element.classList.add('fade-in');
            }
            
            observer.observe(element);
        });
    }
    
    // Animate skills progress bars
    setupSkillsAnimation() {
        this.skillsAnimated = false;
    }
    
    animateSkills() {
        if (this.skillsAnimated) return;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = `${width}%`;
                bar.setAttribute('data-animated', 'true');
            }, index * 200);
        });
        
        this.skillsAnimated = true;
    }
    
    // Smooth scrolling for navigation links - Fixed
    setupSmoothScrolling() {
        // Handle all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMenu();
                    
                    console.log(`Scrolling to ${targetId}`);
                }
            });
        });
    }
    
    // Typing animation setup
    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove typing cursor after animation
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1500);
    }
    
    // Contact form handling - Fixed
    setupContactForm() {
        if (!this.contactForm) {
            console.error('Contact form not found');
            return;
        }
        
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (this.validateForm(data)) {
                this.submitForm(data);
            }
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Remove error styling while typing
                input.classList.remove('error');
                this.removeFieldError(input);
            });
        });
    }
    
    // Form validation
    validateForm(data) {
        let isValid = true;
        
        // Clear previous errors
        this.clearFormErrors();
        
        // Validate name
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Por favor, insira um email válido');
            isValid = false;
        }
        
        // Validate subject
        if (!data.subject || data.subject.trim().length < 3) {
            this.showFieldError('subject', 'Assunto deve ter pelo menos 3 caracteres');
            isValid = false;
        }
        
        // Validate message
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Mensagem deve ter pelo menos 10 caracteres');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    this.showFieldError(fieldName, 'Nome deve ter pelo menos 2 caracteres');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(fieldName, 'Por favor, insira um email válido');
                    return false;
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    this.showFieldError(fieldName, 'Assunto deve ter pelo menos 3 caracteres');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showFieldError(fieldName, 'Mensagem deve ter pelo menos 10 caracteres');
                    return false;
                }
                break;
        }
        
        this.removeFieldError(field);
        return true;
    }
    
    // Show field error
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--space-4)';
        
        formGroup.appendChild(errorDiv);
    }
    
    // Remove field error
    removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        field.classList.remove('error');
    }
    
    // Clear all form errors
    clearFormErrors() {
        const errorMessages = this.contactForm.querySelectorAll('.error-message');
        const errorFields = this.contactForm.querySelectorAll('.error');
        
        errorMessages.forEach(error => error.remove());
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    // Submit form - Fixed with better feedback
    async submitForm(data) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Create success message immediately
            this.showSuccessMessage('✅ Formulário validado com sucesso! Redirecionando para seu cliente de email...');
            
            // Wait a moment for user to see the message
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create mailto link
            const subject = encodeURIComponent(data.subject);
            const body = encodeURIComponent(
                `Olá Victor!\n\n` +
                `Nome: ${data.name}\n` +
                `Email: ${data.email}\n\n` +
                `Mensagem:\n${data.message}\n\n` +
                `---\n` +
                `Enviado através do seu portfólio`
            );
            const mailtoLink = `mailto:herculinvictorr@gmail.com?subject=${subject}&body=${body}`;
            
            // Open default email client
            window.location.href = mailtoLink;
            
            // Reset form after a delay
            setTimeout(() => {
                this.contactForm.reset();
                this.showSuccessMessage('📧 Cliente de email aberto! Se não abriu automaticamente, envie um email para: herculinvictorr@gmail.com');
            }, 2000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('❌ Erro ao processar o formulário. Entre em contato diretamente: herculinvictorr@gmail.com ou (16) 99785-8363');
        } finally {
            // Reset button
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }
    
    // Show success message - Fixed
    showSuccessMessage(message) {
        this.showFormMessage(message, 'success');
    }
    
    // Show error message - Fixed
    showErrorMessage(message) {
        this.showFormMessage(message, 'error');
    }
    
    // Show form message - Fixed
    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status status--${type}`;
        messageDiv.innerHTML = message; // Use innerHTML to support emojis
        messageDiv.style.marginBottom = 'var(--space-16)';
        messageDiv.style.padding = 'var(--space-12)';
        messageDiv.style.borderRadius = 'var(--radius-base)';
        messageDiv.style.fontWeight = 'var(--font-weight-medium)';
        
        // Insert at the top of the form
        this.contactForm.insertBefore(messageDiv, this.contactForm.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto remove after 8 seconds for success, 10 for error
        const timeout = type === 'success' ? 8000 : 10000;
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, timeout);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio...');
    const portfolio = new Portfolio();
    
    // Add global error handling
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
    
    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any heavy animations when page is not visible
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Handle resize events for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile menu on resize
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 768 && navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
};

// Call preload function
preloadCriticalResources();