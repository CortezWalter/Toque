// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
        initializeThemeToggle();
        initializeSmoothScrolling();
        initializeAnimations();
        initializeProgressBars();
        initializeTabs();
        initializeCarousel();
        initializeVideoButtons();
        initializeMobileMenu();
        initializeScrollEffects();
});

// ===== FUNCIONALIDAD DEL SWITCH DE MODO CLARO/OSCURO =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Agregar evento click al botón de cambio de tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Cambiar el tema
        body.setAttribute('data-theme', newTheme);
        
        // Guardar la preferencia
        localStorage.setItem('theme', newTheme);
        
        // Actualizar el ícono
        updateThemeIcon(newTheme);
        
        // Agregar animación de transición
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remover la transición después de que termine
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

// Función para actualizar el ícono del tema
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'light') {
        icon.className = 'fas fa-moon';
        icon.setAttribute('title', 'Cambiar a modo oscuro');
    } else {
        icon.className = 'fas fa-sun';
        icon.setAttribute('title', 'Cambiar a modo claro');
    }
}

// ===== SCROLL SUAVE PARA NAVEGACIÓN =====
function initializeSmoothScrolling() {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calcular la posición del elemento objetivo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Hacer scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
}

// ===== ANIMACIONES AL HACER SCROLL =====
function initializeAnimations() {
    // Crear un observer para detectar cuando los elementos entran en el viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    const animatedElements = document.querySelectorAll(`
        .section-title,
        .section-content,
        .service-card,
        .pricing-card,
        .testimonial-card,
        .blog-card,
        .feature-item,
        .progress-item
    `);
    
    animatedElements.forEach(element => {
        element.classList.add('loading');
        observer.observe(element);
    });
}

// ===== BARRAS DE PROGRESO ANIMADAS =====
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Animar la barra de progreso
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 500);
                
                // Dejar de observar este elemento
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// ===== FUNCIONALIDAD DE PESTAÑAS =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y paneles
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el panel correspondiente
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// ===== CARRUSEL DE TESTIMONIOS =====
function initializeCarousel() {
    const indicators = document.querySelectorAll('.indicator');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Función para mostrar el testimonio actual
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            if (i === index) {
                card.style.display = 'block';
                card.classList.add('animate-fade-in-up');
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-fade-in-up');
            }
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // Agregar eventos a los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    // Auto-rotación del carrusel
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    // Mostrar el primer testimonio
    showTestimonial(0);
}

// ===== BOTONES DE VIDEO =====
function initializeVideoButtons() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoContainer = this.closest('.video-container');
            const videoImage = videoContainer.querySelector('img');
            
            // Crear un modal simple para el video
            const modal = document.createElement('div');
            modal.className = 'video-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            `;
            
            // Agregar estilos al modal
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                position: relative;
                max-width: 800px;
                width: 90%;
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            `;
            
            const closeButton = modal.querySelector('.close-modal');
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 30px;
                color: white;
                cursor: pointer;
                z-index: 10001;
                background-color: rgba(0, 0, 0, 0.5);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const videoWrapper = modal.querySelector('.video-wrapper');
            videoWrapper.style.cssText = `
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%;
            `;
            
            const iframe = modal.querySelector('iframe');
            iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            `;
            
            document.body.appendChild(modal);
            
            // Animar la aparición del modal
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
            
            // Función para cerrar el modal
            function closeModal() {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
            
            // Eventos para cerrar el modal
            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Cerrar con tecla Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        });
    });
}

// ===== MENÚ MÓVIL =====
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');

    if (!hamburger || !mobileMenu || !closeMenu) return;

    hamburger.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Sincronizar el theme toggle del menú móvil
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const mainThemeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (mobileThemeToggle && mainThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            mainThemeToggle.click();
        });

        // Observar cambios en el tema para actualizar el ícono del menú móvil
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = body.getAttribute('data-theme');
                    updateMobileThemeIcon(newTheme);
                }
            });
        });

        observer.observe(body, { attributes: true });
    }
}

function updateMobileThemeIcon(theme) {
    const mobileIcon = document.querySelector('#mobileThemeToggle i');
    if (mobileIcon) {
        if (theme === 'light') {
            mobileIcon.className = 'fas fa-moon';
        } else {
            mobileIcon.className = 'fas fa-sun';
        }
    }
}


// Función para cerrar el menú móvil
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navButtons.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Agregar/quitar clase scrolled al header
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // Efecto parallax en la sección de precios
        const pricingSection = document.querySelector('.pricing-section');
        if (pricingSection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            pricingSection.style.backgroundPosition = `center ${rate}px`;
        }
    });
}

// ===== EFECTOS HOVER MEJORADOS =====
document.addEventListener('DOMContentLoaded', function() {
    // Efecto hover para las tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efecto hover para las tarjetas de precios
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
    });
    
    // Efecto hover para los botones
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// ===== CONTADOR ANIMADO =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// ===== LAZY LOADING DE IMÁGENES =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== VALIDACIÓN DE FORMULARIOS (si se agregan) =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// ===== UTILIDADES =====
// Función para debounce (limitar la frecuencia de ejecución)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Función para throttle (limitar la frecuencia de ejecución)
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

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // Aquí podrías enviar el error a un servicio de monitoreo
});

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
// Usar requestAnimationFrame para animaciones suaves
function smoothAnimation(callback) {
    function animate() {
        callback();
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== COMPATIBILIDAD CON NAVEGADORES ANTIGUOS =====
// Polyfill para IntersectionObserver
if (!('IntersectionObserver' in window)) {
    // Cargar polyfill dinámicamente
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}

// ===== INICIALIZACIÓN FINAL =====
// Asegurar que todo esté cargado antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

function initializeAll() {
    console.log('🚀 Cetech - Página web inicializada correctamente');
    console.log('📱 Modo responsive activado');
    console.log('🌙 Switch de tema claro/oscuro disponible');
    console.log('✨ Animaciones y efectos activados');
}
