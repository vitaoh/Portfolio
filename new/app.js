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

    setupNavigation() {
        if (!this.navToggle || !this.navMenu) {
            console.error('Navigation elements not found');
            return;
        }

        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log('Toggle clicked, current state:', this.isMenuOpen);

            this.isMenuOpen = !this.isMenuOpen;

            if (this.isMenuOpen) {
                this.navMenu.classList.add('active');
                this.navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

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

    setupScrollEffects() {
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

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

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkills();
                    }
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.about-card, .vision-goal, .project-card, .skills-section, .contact-item');

        animatedElements.forEach((element, index) => {
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

    setupSmoothScrolling() {
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

                    this.closeMenu();

                    console.log(`Scrolling to ${targetId}`);
                }
            });
        });
    }

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
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeWriter, 1500);
    }

    setupContactForm() {
        if (!this.contactForm) {
            console.error('Contact form not found');
            return;
        }

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(this.contactForm);
            const data = Object.fromEntries(formData);

            if (this.validateForm(data)) {
                this.submitForm(data);
            }
        });

        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                input.classList.remove('error');
                this.removeFieldError(input);
            });
        });
    }

    validateForm(data) {
        let isValid = true;

        this.clearFormErrors();

        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Por favor, insira um email válido');
            isValid = false;
        }

        if (!data.subject || data.subject.trim().length < 3) {
            this.showFieldError('subject', 'Assunto deve ter pelo menos 3 caracteres');
            isValid = false;
        }

        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Mensagem deve ter pelo menos 10 caracteres');
            isValid = false;
        }

        return isValid;
    }

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

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');

        field.classList.add('error');

        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--space-4)';

        formGroup.appendChild(errorDiv);
    }

    removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        if (errorMessage) {
            errorMessage.remove();
        }

        field.classList.remove('error');
    }

    clearFormErrors() {
        const errorMessages = this.contactForm.querySelectorAll('.error-message');
        const errorFields = this.contactForm.querySelectorAll('.error');

        errorMessages.forEach(error => error.remove());
        errorFields.forEach(field => field.classList.remove('error'));
    }

    async submitForm(data) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            this.showSuccessMessage('✅ Formulário validado com sucesso! Redirecionando para seu cliente de email...');

            await new Promise(resolve => setTimeout(resolve, 1000));

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

            window.location.href = mailtoLink;

            setTimeout(() => {
                this.contactForm.reset();
                this.showSuccessMessage('📧 Cliente de email aberto! Se não abriu automaticamente, envie um email para: herculinvictorr@gmail.com');
            }, 2000);

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('❌ Erro ao processar o formulário. Entre em contato diretamente: [herculinvictorr@gmail.com](mailto:herculinvictorr@gmail.com) ou (16) 99785-8363');
        } finally {
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    showSuccessMessage(message) {
        this.showFormMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showFormMessage(message, 'error');
    }

    showFormMessage(message, type) {
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status status--${type}`;
        messageDiv.innerHTML = message;
        messageDiv.style.marginBottom = 'var(--space-16)';
        messageDiv.style.padding = 'var(--space-12)';
        messageDiv.style.borderRadius = 'var(--radius-base)';
        messageDiv.style.fontWeight = 'var(--font-weight-medium)';

        this.contactForm.insertBefore(messageDiv, this.contactForm.firstChild);

        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

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

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio...');
    const portfolio = new Portfolio();

    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        if (window.innerWidth > 768 && navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

const preloadCriticalResources = () => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
};

preloadCriticalResources();