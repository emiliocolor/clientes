/**
 * script-herramientas.js
 * Carga dinámica de header y footer para todas las páginas de herramientas de EmilioColor
 * 
 * USO:
 * 1. En cada página HTML, añadir en el body:
 *    <div id="dynamic-header"></div>
 *    <div id="dynamic-footer"></div>
 * 
 * 2. Incluir este script al final del body:
 *    <script src="script-herramientas.js"></script>
 */

// HTML del Header
const HEADER_HTML = `
<header class="main-header">
    <div class="header-container">
        <a href="https://emiliocolor.com" target="_blank" class="header-logo">
            <img src="https://emiliocolor.com/img-logos/logo_transparente_alargado.png" alt="EmilioColor Logo">
        </a>
        
        <nav class="header-nav">
            <a href="https://emiliocolor.com/herramientas/inicio" class="header-nav-link active">
<i class="fas fa-reply"></i>
                <span>Regresar a herramientas</span>
            </a>
        </nav>
    </div>
</header>
`;

// HTML del Footer
const FOOTER_HTML = `
<footer class="main-footer">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-logo">
                <img src="https://emiliocolor.com/img-logos/logo_transparente_alargado_leyenda.png" alt="EmilioColor Logo">
            </div>
            
            <div class="footer-nav">
                <h4>Navegación Rápida</h4>
                <a href="https://emiliocolor.com/#inicio" class="footer-nav-link">
                    <i class="fas fa-home"></i> Inicio
                </a>
                <a href="https://emiliocolor.com/#novedades" class="footer-nav-link">
                    <i class="fas fa-newspaper"></i> Novedades
                </a>
                <a href="https://emiliocolor.com/#divisiones" class="footer-nav-link">
                    <i class="fas fa-sitemap"></i> Divisiones
                </a>
                <a href="https://emiliocolor.com/#verification" class="footer-nav-link">
                    <i class="fas fa-info-circle"></i> Info. Adicional
                </a>
                <a href="https://emiliocolor.com/#apoyos" class="footer-nav-link">
                    <i class="fas fa-hands-helping"></i> Apoyos Sociales
                </a>
                <a href="https://emiliocolor.com/#proyectos" class="footer-nav-link">
                    <i class="fas fa-lightbulb"></i> Proyectos
                </a>
                <a href="https://emiliocolor.com/#marcas" class="footer-nav-link">
                    <i class="fas fa-tags"></i> Nuestras Marcas
                </a>
                <a href="https://emiliocolor.com/#contacto" class="footer-nav-link">
                    <i class="fas fa-envelope"></i> Contacto
                </a>
            </div>

            <div class="footer-contact">
                <h4>Contacto Directo</h4>
                <p><i class="fas fa-envelope"></i> emiliocolormexico@gmail.com</p>
                <p><i class="fas fa-phone-alt"></i> +52 56 5533 3139</p>
                <p><i class="fab fa-whatsapp"></i> +52 56 5533 3139</p>
                <p><i class="fas fa-map-marker-alt"></i> Operando desde México</p>
                <p><i class="fas fa-clock"></i>Lun–Vie, 09:00–21:00 | Sáb–Dom, 10:00–20:00</p>
            </div>
            
            <div class="footer-social">
                <h4>Síguenos</h4>
                <div class="footer-social-links">
                    <a href="https://www.facebook.com/profile.php?id=61558765116854" class="social-link" aria-label="Facebook EmilioColor">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/emiliocolorcom/" class="social-link" aria-label="Instagram EmilioColor">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/525655333139" class="social-link" aria-label="WhatsApp EmilioColor">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="mailto:emiliocolormexico@gmail.com" class="social-link" aria-label="Email EmilioColor">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>
                <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">Conecta con nosotros para las últimas novedades</p>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>© 2025 EmilioColor® | Todos los derechos reservados.</p>
            <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">Tecnología, Educación, Transportes, Papelería - Soluciones a tu medida</p>
        </div>
    </div>
</footer>
`;

// Función para cargar componentes dinámicos
function loadDynamicComponents() {
    // Cargar Header
    const headerContainer = document.getElementById('dynamic-header');
    if (headerContainer) {
        headerContainer.innerHTML = HEADER_HTML;
    }
    
    // Cargar Footer
    const footerContainer = document.getElementById('dynamic-footer');
    if (footerContainer) {
        footerContainer.innerHTML = FOOTER_HTML;
    }
    
    // Ajustar padding del body según el header
    adjustBodyPadding();
}

// Función para ajustar el padding del body
function adjustBodyPadding() {
    // Esperar un poco a que se renderice el header
    setTimeout(() => {
        if (window.innerWidth <= 768) {
            document.body.style.paddingTop = '120px';
        } else {
            document.body.style.paddingTop = '80px';
        }
    }, 50);
}

// Función para inicializar componentes interactivos del header/footer
function initInteractiveComponents() {
    // Inicializar tooltips si es necesario
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined') {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Ajustar padding en redimensionamiento
    window.addEventListener('resize', adjustBodyPadding);
}

// Función principal de inicialización
function initDynamicLayout() {
    // Cargar componentes
    loadDynamicComponents();
    
    // Inicializar componentes interactivos
    initInteractiveComponents();
    
    // Configurar navegación activa automáticamente
    setTimeout(setActiveNavigation, 100);
}

// Función para establecer automáticamente la navegación activa
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-nav-link, .footer-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Para la página de herramientas
        if (currentPath.includes('herramientas') && link.getAttribute('href')?.includes('herramientas/inicio')) {
            link.classList.add('active');
        }
        // Para otras páginas (puedes personalizar según tu estructura)
        else if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicLayout);
} else {
    initDynamicLayout();
}

// Exportar funciones si es necesario (para módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDynamicComponents,
        initDynamicLayout
    };

}
<script src="https://emiliocolor.com/proteccion-emiliocolor.js"></script>
