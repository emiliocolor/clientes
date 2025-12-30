/**
 * ====================================================
 * SISTEMA INTEGRADO DE LAYOUT Y PROTECCIÓN - EMILIOCOLOR®
 * Archivo: script-emiliocolor-integrado.js
 * Versión: 1.0.0
 * Fecha: ${new Date().toISOString().split('T')[0]}
 * ====================================================
 * Este script integra:
 * 1. Carga dinámica de header y footer
 * 2. Sistema de protección de código fuente
 * ====================================================
 */

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN GLOBAL
    // ============================================
    const CONFIG = {
        empresa: 'EmilioColor®',
        sitioWeb: 'https://emiliocolor.com',
        
        // Colores de la marca
        colores: {
            primario: '#284596',
            secundario: '#1d4ed8',
            blanco: '#ffffffff',
            oscuro: '#0d1d50',
            exito: '#10b981',
            peligro: '#ef4444'
        },
        
        // Configuración de protección
        proteccion: {
            detectarDevTools: true,
            mostrarNotificaciones: true,
            protegerImagenes: true,
            registroIntentos: true,
            umbralDevTools: 160,
            maxIntentos: 3
        },
        
        // Mensajes del sistema
        mensajes: {
            clicDerecho: 'Acceso restringido por políticas de seguridad de EmilioColor®',
            teclasBloqueadas: 'Acceso al código fuente restringido',
            devToolsDetectado: 'Herramientas de desarrollo detectadas',
            marcaAgua: `© ${new Date().getFullYear()} EmilioColor® | Contenido protegido`
        }
    };
    
    // ============================================
    // HTML DEL HEADER
    // ============================================
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

    // ============================================
    // HTML DEL FOOTER
    // ============================================
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

    // ============================================
    // VARIABLES DEL SISTEMA
    // ============================================
    let devToolsAbierto = false;
    let intentosDevTools = 0;
    let notificacionActiva = false;

    // ============================================
    // FUNCIONES DE LAYOUT DINÁMICO
    // ============================================
    
    /**
     * Carga los componentes dinámicos (header y footer)
     */
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
        
        // Ajustar padding del body
        adjustBodyPadding();
    }
    
    /**
     * Ajusta el padding del body según el header
     */
    function adjustBodyPadding() {
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                document.body.style.paddingTop = '120px';
            } else {
                document.body.style.paddingTop = '80px';
            }
        }, 50);
    }
    
    /**
     * Inicializa componentes interactivos
     */
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
    
    /**
     * Establece la navegación activa automáticamente
     */
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.header-nav-link, .footer-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Para la página de herramientas
            if (currentPath.includes('herramientas') && link.getAttribute('href')?.includes('herramientas/inicio')) {
                link.classList.add('active');
            }
            // Para otras páginas
            else if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Función principal de inicialización del layout
     */
    function initDynamicLayout() {
        // Cargar componentes
        loadDynamicComponents();
        
        // Inicializar componentes interactivos
        initInteractiveComponents();
        
        // Configurar navegación activa automáticamente
        setTimeout(setActiveNavigation, 100);
    }

    // ============================================
    // FUNCIONES DE PROTECCIÓN
    // ============================================
    
    /**
     * Bloqueo de clic derecho
     */
    function bloquearClicDerecho() {
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (CONFIG.proteccion.mostrarNotificaciones) {
                mostrarAdvertenciaClicDerecho();
            }
            
            console.log('%c🚫 ACCESO BLOQUEADO 🚫', 
                       `color: ${CONFIG.colores.peligro}; font-size: 16px; font-weight: bold;`);
            console.log('%cClic derecho bloqueado por seguridad.', 
                       `color: ${CONFIG.colores.primario}; font-size: 12px;`);
            
            return false;
        });
        
        console.log('✅ Bloqueo de clic derecho: ACTIVADO');
    }
    
    /**
     * Muestra advertencia de clic derecho
     */
    function mostrarAdvertenciaClicDerecho() {
        const overlay = document.createElement('div');
        overlay.id = 'ec-overlay-clic';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;
        
        const advertencia = document.createElement('div');
        advertencia.style.cssText = `
            background: linear-gradient(135deg, 
                ${CONFIG.colores.primario} 0%, 
                ${CONFIG.colores.oscuro} 100%);
            color: white;
            padding: 40px;
            border-radius: 0;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.5s ease;
        `;
        
        advertencia.innerHTML = `
            <div style="margin-bottom: 25px;">
                <i class="fas fa-shield-alt" 
                   style="font-size: 3.5rem; color: ${CONFIG.colores.blanco};"></i>
            </div>
            <h3 style="margin: 0 0 15px 0; font-size: 1.8rem; color: white;">
                Acceso Restringido
            </h3>
            <p style="margin: 0 0 20px 0; font-size: 1rem; opacity: 0.9; line-height: 1.5;">
                ${CONFIG.mensajes.clicDerecho}
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
                    <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                    Este sitio web está protegido por el sistema de protección para código de ${CONFIG.empresa}
                </p>
            </div>
            <p style="font-size: 0.85rem; opacity: 0.7; margin-top: 25px;">
                <i class="fas fa-clock" style="margin-right: 5px;"></i>
                Esta advertencia desaparecerá en 3 segundos
            </p>
        `;
        
        overlay.appendChild(advertencia);
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 500);
            }
        }, 3000);
    }
    
    /**
     * Bloqueo de teclas de acceso
     */
    function bloquearTeclasAcceso() {
        document.addEventListener('keydown', function(event) {
            const ctrlPresionado = event.ctrlKey || event.metaKey;
            const shiftPresionado = event.shiftKey;
            const tecla = event.key.toLowerCase();
            
            const combinacionesBloqueadas = [
                // Ctrl+U - Ver código fuente
                (ctrlPresionado && tecla === 'u'),
                
                // Ctrl+Shift+I - Herramientas de desarrollo
                (ctrlPresionado && shiftPresionado && tecla === 'i'),
                
                // Ctrl+Shift+J - Consola JavaScript
                (ctrlPresionado && shiftPresionado && tecla === 'j'),
                
                // Ctrl+Shift+C - Inspector de elementos
                (ctrlPresionado && shiftPresionado && tecla === 'c'),
                
                // F12 - Herramientas de desarrollo
                (tecla === 'f12'),
                
                // Opción adicional: Ctrl+Shift+K (Firefox)
                (ctrlPresionado && shiftPresionado && tecla === 'k')
            ];
            
            if (combinacionesBloqueadas.some(combinacion => combinacion)) {
                event.preventDefault();
                event.stopPropagation();
                
                mostrarNotificacionSeguridad(CONFIG.mensajes.teclasBloqueadas);
                
                if (CONFIG.proteccion.registroIntentos) {
                    registrarIntento('teclas_acceso', tecla);
                }
                
                return false;
            }
        });
        
        console.log('✅ Bloqueo de teclas de acceso: ACTIVADO');
    }
    
    /**
     * Detección de DevTools
     */
    function detectarDevTools() {
        if (!CONFIG.proteccion.detectarDevTools) return;
        
        function verificarDevTools() {
            const anchoDiferencia = Math.abs(window.outerWidth - window.innerWidth);
            const altoDiferencia = Math.abs(window.outerHeight - window.innerHeight);
            
            const porDimensiones = anchoDiferencia > CONFIG.proteccion.umbralDevTools || 
                                   altoDiferencia > CONFIG.proteccion.umbralDevTools;
            
            const tiempoInicio = performance.now();
            debugger;
            const tiempoFin = performance.now();
            const tiempoDebugger = tiempoFin - tiempoInicio;
            const porDebugger = tiempoDebugger > 100;
            
            if ((porDimensiones || porDebugger) && !devToolsAbierto) {
                devToolsAbierto = true;
                intentosDevTools++;
                
                mostrarNotificacionSeguridad(CONFIG.mensajes.devToolsDetectado);
                
                console.log('%c⚠️ HERRAMIENTAS DETECTADAS ⚠️', 
                           `color: ${CONFIG.colores.peligro}; font-size: 14px; font-weight: bold;`);
                console.log(`%cIntento #${intentosDevTools} registrado`, 
                           `color: ${CONFIG.colores.primario}; font-size: 12px;`);
                
                if (CONFIG.proteccion.registroIntentos) {
                    localStorage.setItem('ec_devtools_intentos', intentosDevTools.toString());
                    localStorage.setItem('ec_devtools_ultimo', new Date().toISOString());
                }
                
                if (intentosDevTools >= CONFIG.proteccion.maxIntentos) {
                    setTimeout(() => {
                        console.log('%c🔀 REDIRIGIENDO POR SEGURIDAD', 
                                   `color: ${CONFIG.colores.peligro}; font-size: 16px; font-weight: bold;`);
                        window.location.href = CONFIG.sitioWeb;
                    }, 2000);
                }
                
            } else if (!porDimensiones && !porDebugger) {
                devToolsAbierto = false;
            }
        }
        
        setInterval(verificarDevTools, 1000);
        
        console.log('✅ Detección de DevTools: ACTIVADA');
    }
    
    /**
     * Muestra notificaciones de seguridad
     */
    function mostrarNotificacionSeguridad(mensaje) {
        if (notificacionActiva || !CONFIG.proteccion.mostrarNotificaciones) return;
        
        notificacionActiva = true;
        
        const notificacion = document.createElement('div');
        notificacion.id = 'ec-notificacion-seguridad';
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, 
                ${CONFIG.colores.primario} 0%, 
                ${CONFIG.colores.oscuro} 100%);
            color: white;
            padding: 18px 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
            z-index: 9999;
            max-width: 450px;
            min-width: 300px;
            animation: slideInNotification 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: flex;
            align-items: center;
            gap: 15px;
            border-radius: 0;
            font-family: 'Poppins', sans-serif;
        `;
        
        notificacion.innerHTML = `
            <div style="
                background: ${CONFIG.colores.peligro};
                width: 50px;
                height: 50px;
                border-radius: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                flex-shrink: 0;
            ">
                <i class="fas fa-lock"></i>
            </div>
            <div style="flex: 1;">
                <div style="
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                    color: white;
                ">
                    Seguridad ${CONFIG.empresa}
                </div>
                <div style="
                    font-size: 0.9rem;
                    opacity: 0.9;
                    line-height: 1.4;
                ">
                    ${mensaje}
                </div>
                <div style="
                    margin-top: 10px;
                    font-size: 0.75rem;
                    opacity: 0.7;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <span>
                        <i class="fas fa-clock" style="margin-right: 3px;"></i>
                        ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span>
                        <i class="fas fa-user-shield" style="margin-right: 3px;"></i>
                        Sistema activo
                    </span>
                </div>
            </div>
            <button id="ec-cerrar-notificacion" style="
                background: transparent;
                border: none;
                color: white;
                opacity: 0.7;
                cursor: pointer;
                font-size: 1rem;
                padding: 5px;
                transition: opacity 0.2s;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notificacion);
        
        agregarAnimacionesCSS();
        
        const btnCerrar = document.getElementById('ec-cerrar-notificacion');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', function() {
                notificacion.style.animation = 'slideOutNotification 0.3s ease';
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.parentNode.removeChild(notificacion);
                    }
                    notificacionActiva = false;
                }, 300);
            });
        }
        
        setTimeout(() => {
            if (notificacion.parentNode && notificacion.style.animation !== 'slideOutNotification 0.3s ease') {
                notificacion.style.animation = 'slideOutNotification 0.3s ease';
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.parentNode.removeChild(notificacion);
                    }
                    notificacionActiva = false;
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Agrega animaciones CSS necesarias
     */
    function agregarAnimacionesCSS() {
        if (!document.querySelector('#ec-animaciones')) {
            const estilos = document.createElement('style');
            estilos.id = 'ec-animaciones';
            estilos.textContent = `
                @keyframes slideInNotification {
                    from {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutNotification {
                    from {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%) translateY(-20px);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateY(-30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(estilos);
        }
    }
    
    /**
     * Registra intentos de acceso
     */
    function registrarIntento(tipo, detalle) {
        const registro = {
            tipo: tipo,
            detalle: detalle,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        console.log(`%c📝 INTENTO REGISTRADO: ${tipo}`, 
                   `color: ${CONFIG.colores.peligro}; font-weight: bold;`);
        console.table(registro);
        
        if (CONFIG.proteccion.registroIntentos) {
            const registrosPrevios = JSON.parse(localStorage.getItem('ec_registros_seguridad') || '[]');
            registrosPrevios.push(registro);
            
            if (registrosPrevios.length > 50) {
                registrosPrevios.shift();
            }
            
            localStorage.setItem('ec_registros_seguridad', JSON.stringify(registrosPrevios));
        }
    }
    
    /**
     * Carga recursos necesarios (Font Awesome)
     */
    function cargarRecursosNecesarios() {
        if (!document.querySelector('link[href*="font-awesome"]') && 
            !document.querySelector('link[href*="fontawesome"]')) {
            const linkFA = document.createElement('link');
            linkFA.rel = 'stylesheet';
            linkFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(linkFA);
        }
    }
    
    /**
     * Verifica modo administrador
     */
    function verificarModoAdministrador() {
        const claveAdmin = localStorage.getItem('ec_clave_admin');
        const claveEspecial = 'EC' + new Date().getFullYear() + '!#Admin';
        
        if (claveAdmin === claveEspecial) {
            console.log('%c🔓 MODO ADMINISTRADOR ACTIVADO - PROTECCIÓN DESACTIVADA', 
                       `color: ${CONFIG.colores.exito}; font-size: 16px; font-weight: bold;`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Agrega marca de agua al documento
     */
    function agregarMarcaAgua() {
        const marcaAgua = document.createElement('div');
        marcaAgua.id = 'ec-marca-agua';
        marcaAgua.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            color: rgba(0, 0, 0, 0.2);
            font-size: 0.7rem;
            z-index: 9998;
            user-select: none;
            pointer-events: none;
            font-family: monospace;
        `;
        marcaAgua.textContent = CONFIG.mensajes.marcaAgua;
        document.body.appendChild(marcaAgua);
    }
    
    // ============================================
    // INICIALIZACIÓN DEL SISTEMA INTEGRADO
    // ============================================
    
    /**
     * Inicializa el sistema de protección
     */
    function inicializarProteccion() {
        console.log(`%c🚀 INICIANDO SISTEMA INTEGRADO ${CONFIG.empresa}`, 
                   `background: linear-gradient(90deg, ${CONFIG.colores.primario}, ${CONFIG.colores.oscuro}); 
                    color: white; 
                    font-size: 20px; 
                    padding: 15px; 
                    border-radius: 0;
                    font-weight: bold;
                    text-align: center;`);
        
        if (verificarModoAdministrador()) {
            console.log('%cLa protección está desactivada para este usuario.', 
                       'color: #10b981; font-weight: bold;');
            return;
        }
        
        cargarRecursosNecesarios();
        
        intentosDevTools = parseInt(localStorage.getItem('ec_devtools_intentos') || '0');
        
        bloquearClicDerecho();
        bloquearTeclasAcceso();
        detectarDevTools();
        agregarMarcaAgua();
        
        const fechaInicio = new Date().toLocaleString('es-MX');
        localStorage.setItem('ec_proteccion_iniciada', fechaInicio);
        
        console.log(`%c✅ SISTEMA DE PROTECCIÓN ACTIVO DESDE: ${fechaInicio}`, 
                   `color: ${CONFIG.colores.exito}; font-weight: bold;`);
        console.log('====================================================');
    }
    
    /**
     * Función principal de inicialización
     */
    function inicializarSistemaCompleto() {
        // 1. Inicializar layout dinámico
        initDynamicLayout();
        
        // 2. Inicializar sistema de protección
        inicializarProteccion();
        
        console.log('%c✅ SISTEMA INTEGRADO INICIALIZADO CORRECTAMENTE', 
                   'color: #10b981; font-weight: bold; font-size: 14px;');
    }

    // ============================================
    // EJECUCIÓN PRINCIPAL
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistemaCompleto);
    } else {
        inicializarSistemaCompleto();
    }

    // ============================================
    // EXPOSICIÓN PARA USO AVANZADO
    // ============================================
    window.EmilioColorSistema = {
        config: CONFIG,
        layout: {
            cargarComponentes: loadDynamicComponents,
            ajustarPadding: adjustBodyPadding
        },
        proteccion: {
            estado: {
                devToolsAbierto: () => devToolsAbierto,
                intentosDevTools: () => intentosDevTools,
                desactivarProteccion: function(clave) {
                    if (clave === 'EC' + new Date().getFullYear() + '!#Admin') {
                        localStorage.setItem('ec_clave_admin', clave);
                        location.reload();
                        return true;
                    }
                    return false;
                },
                obtenerRegistros: function() {
                    return JSON.parse(localStorage.getItem('ec_registros_seguridad') || '[]');
                }
            }
        }
    };

})();
