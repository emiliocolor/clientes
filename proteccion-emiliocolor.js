/**
 * ====================================================
 * SISTEMA DE PROTECCIÓN DE CÓDIGO FUENTE - EMILIOCOLOR®
 * Archivo: proteccion-emiliocolor.js
 * Versión: 1.0.0
 * Fecha: ${new Date().toISOString().split('T')[0]}
 * ====================================================
 * Este script protege el contenido de EmilioColor® mediante:
 * 1. Bloqueo de clic derecho
 * 2. Bloqueo de teclas de acceso rápido
 * 3. Detección de herramientas de desarrollo
 * 4. Marca de agua digital visible e invisible
 * ====================================================
 */

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN - CON AJUSTES PERSONALIZABLES
    // ============================================
    const CONFIG = {
        
        colores: {
            primario: '#284596',
            secundario: '#1d4ed8',
            blanco: '#ffffffff',
            oscuro: '#0d1d50',
            exito: '#10b981',
            peligro: '#ef4444'
        },
        
        proteccion: {
            detectarDevTools: true,
            mostrarNotificaciones: true,
            protegerImagenes: true,
            registroIntentos: true,
            umbralDevTools: 160,
            maxIntentos: 3
        },
        
        mensajes: {
            clicDerecho: 'Acceso restringido por políticas de seguridad de EmilioColor®',
            teclasBloqueadas: 'Acceso al código fuente restringido',
            devToolsDetectado: 'Herramientas de desarrollo detectadas',
            marcaAgua: `© ${new Date().getFullYear()} EmilioColor® | Contenido protegido`
        }
    };
    
    // ============================================
    // VARIABLES DEL SISTEMA
    // ============================================
    let devToolsAbierto = false;
    let intentosDevTools = 0;
    let notificacionActiva = false;
    
    // ============================================
    // 1. FUNCIÓN: BLOQUEO DE CLIC DERECHO
    // ============================================
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
    
    // ============================================
    // 2. FUNCIÓN: BLOQUEO DE TECLAS DE ACCESO
    // ============================================
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
    
    // ============================================
    // 3. FUNCIÓN: DETECCIÓN DE DEVTOOLS
    // ============================================
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
    
    // ============================================
    // 4. FUNCIÓN: MARCA DE AGUA DIGITAL
    // ============================================
    function agregarMarcaAgua() {
        const marcaAguaVisible = document.createElement('div');
        marcaAguaVisible.id = 'ec-marca-agua-visible';
        marcaAguaVisible.innerHTML = `
            <div style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, 
                    ${CONFIG.colores.primario}99 0%, 
                    ${CONFIG.colores.oscuro}99 100%);
                color: white;
                text-align: center;
                padding: 10px 20px;
                font-size: 0.8rem;
                z-index: 9998;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                user-select: none;
                pointer-events: none;
            ">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-copyright" style="opacity: 0.9;"></i>
                    ${new Date().getFullYear()} ${CONFIG.empresa}
                </span>
                
                 <span style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-shield-alt" style="color: ${CONFIG.colores.blanco};"></i>
                    Sistema de Protección para Código
                </span>
            </div>
        `;
        
        const marcaAguaInvisible = document.createElement('div');
        marcaAguaInvisible.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
        `;
        
        const fechaActual = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        marcaAguaInvisible.innerHTML = `
            <!-- 
            =====================================================================
            SISTEMA DE PROTECCIÓN DE CONTENIDO - ${CONFIG.empresa}
            =====================================================================
            Propietario: ${CONFIG.empresa}
            Copyright: © ${new Date().getFullYear()} - Todos los derechos reservados
            Sitio: ${window.location.hostname}
            Fecha: ${fechaActual}
            
            Información de contacto:
            Email: ${CONFIG.email}
            Teléfono: ${CONFIG.telefono}
            Sitio web: ${CONFIG.sitioWeb}
            
            Documentación legal:
            Términos y condiciones: ${CONFIG.politica}
            
            ADVERTENCIA LEGAL:
            Este código fuente, diseño, imágenes y contenido están protegidos por
            derechos de autor y leyes de propiedad intelectual nacionales e
            internacionales. Queda estrictamente prohibida la reproducción,
            distribución, modificación o cualquier uso no autorizado.
            
            Las violaciones serán perseguidas legalmente conforme a la Ley Federal
            del Derecho de Autor y otras legislaciones aplicables.
            =====================================================================
            -->
        `;
        
        if (CONFIG.proteccion.protegerImagenes) {
            function protegerImagenes() {
                const imagenes = document.querySelectorAll('img:not([src*="logo"]):not([src*="favicon"]):not(.protegida)');
                
                imagenes.forEach(imagen => {
                    if (imagen.width > 150 && imagen.height > 150) {
                        imagen.classList.add('protegida');
                        
                        imagen.style.cssText += `
                            position: relative;
                            background-image: 
                                linear-gradient(45deg, 
                                    transparent 49%, 
                                    rgba(40, 69, 150, 0.02) 50%, 
                                    transparent 51%),
                                linear-gradient(-45deg, 
                                    transparent 49%, 
                                    rgba(40, 69, 150, 0.02) 50%, 
                                    transparent 51%);
                            background-size: 20px 20px;
                        `;
                    }
                });
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', protegerImagenes);
            } else {
                protegerImagenes();
            }
            
            setInterval(protegerImagenes, 5000);
        }
        
        console.log(`%c🛡️  ${CONFIG.empresa.toUpperCase()} - SISTEMA DE PROTECCIÓN ACTIVO`, 
                   `background: ${CONFIG.colores.primario}; 
                    color: white; 
                    font-size: 18px; 
                    padding: 12px 20px; 
                    border-radius: 0;
                    font-weight: bold;
                    letter-spacing: 1px;`);
        
        console.log(`%c📍 Contacto: ${CONFIG.email} | 📱 ${CONFIG.telefono}`, 
                   `color: ${CONFIG.colores.secundario}; 
                    font-size: 14px; 
                    padding: 5px 10px;
                    background: rgba(40, 69, 150, 0.1);`);
        
        document.body.appendChild(marcaAguaVisible);
        document.body.appendChild(marcaAguaInvisible);
        
        console.log('✅ Marca de agua digital: ACTIVADA');
    }
    
    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
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
    
    function cargarRecursosNecesarios() {
        if (!document.querySelector('link[href*="font-awesome"]') && 
            !document.querySelector('link[href*="fontawesome"]')) {
            const linkFA = document.createElement('link');
            linkFA.rel = 'stylesheet';
            linkFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(linkFA);
        }
    }
    
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
    
    // ==========================
    // INICIALIZACIÓN DEL SISTEMA
    // ==========================
    function inicializarProteccion() {
        console.log(`%c🚀 INICIANDO SISTEMA DE PROTECCIÓN ${CONFIG.empresa}`, 
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
    
    // ===================
    // EJECUCIÓN PRINCIPAL
    // ===================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarProteccion);
    } else {
        inicializarProteccion();
    }
    
    // ============================
    // EXPOSICIÓN PARA USO AVANZADO
    // ============================
    window.EmilioColorProteccion = {
        config: CONFIG,
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
    };
})();