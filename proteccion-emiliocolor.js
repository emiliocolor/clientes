/**
 * ====================================================
 * SISTEMA DE PROTECCIÓN DE CÓDIGO FUENTE - EMILIOCOLOR®
 * Archivo: proteccion-emiliocolor.js
 * Versión: 1.1.0
 * Fecha: ${new Date().toISOString().split('T')[0]}
 * ====================================================
 * Este script protege el contenido de EmilioColor® mediante:
 * 1. Bloqueo de clic derecho
 * 2. Bloqueo de teclas de acceso rápido
 * 3. Detección inteligente de DevTools
 * ====================================================
 */

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN - CON AJUSTES PERSONALIZABLES
    // ============================================
    const CONFIG = {
        empresa: 'EmilioColor®',
        sitioWeb: 'https://emiliocolor.com',
        
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
            maxIntentos: 5,
            excluirDispositivosMoviles: true // Nueva opción
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
    // DETECCIÓN DE DISPOSITIVO
    // ============================================
    function esDispositivoMovil() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const anchoPantalla = window.innerWidth;
        
        // Detección por User Agent
        const esMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        
        // Detección por tamaño de pantalla (ajustable según necesidades)
        const esMobilePorTamano = anchoPantalla <= 768;
        
        // Detección por características táctiles
        const tienePantallaTactil = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Es móvil si cumple alguna condición (y preferiblemente varias)
        return (esMobileUA || esMobilePorTamano) && tienePantallaTactil;
    }
    
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
    // 3. FUNCIÓN: DETECCIÓN MEJORADA DE DEVTOOLS
    // ============================================
    function detectarDevTools() {
        if (!CONFIG.proteccion.detectarDevTools) return;
        
        // Si está configurado para excluir móviles y es un dispositivo móvil, no activar detección
        if (CONFIG.proteccion.excluirDispositivosMoviles && esDispositivoMovil()) {
            console.log('📱 Detección de DevTools desactivada para dispositivos móviles');
            return;
        }
        
        function verificarDevTools() {
            // Método 1: Diferencia de dimensiones (solo para desktop)
            let porDimensiones = false;
            
            // Solo aplicar método de dimensiones en dispositivos no móviles
            if (!esDispositivoMovil()) {
                const anchoDiferencia = Math.abs(window.outerWidth - window.innerWidth);
                const altoDiferencia = Math.abs(window.outerHeight - window.innerHeight);
                
                porDimensiones = anchoDiferencia > CONFIG.proteccion.umbralDevTools || 
                                 altoDiferencia > CONFIG.proteccion.umbralDevTools;
            }
            
            // Método 2: Tiempo de debugger (funciona en ambos)
            const tiempoInicio = performance.now();
            debugger;
            const tiempoFin = performance.now();
            const tiempoDebugger = tiempoFin - tiempoInicio;
            
            // Umbral más alto para móviles que suelen ser más lentos
            const umbralDebugger = esDispositivoMovil() ? 200 : 100;
            const porDebugger = tiempoDebugger > umbralDebugger;
            
            // Método 3: Verificación de consola (solo desktop)
            let porConsole = false;
            if (!esDispositivoMovil()) {
                const consola = {
                    get isOpen() {
                        const element = document.createElement('div');
                        Object.defineProperty(element, 'id', {
                            get: function() {
                                porConsole = true;
                                return '';
                            }
                        });
                        console.log(element);
                        return porConsole;
                    }
                };
                consola.isOpen;
            }
            
            // Solo activar si estamos en desktop y hay indicios reales
            const esDesktop = !esDispositivoMovil();
            const devToolsDetectado = (esDesktop && (porDimensiones || porDebugger || porConsole)) || 
                                      (!esDesktop && porDebugger); // En móviles solo por debugger
            
            if (devToolsDetectado && !devToolsAbierto) {
                devToolsAbierto = true;
                intentosDevTools++;
                
                console.log(`%c⚠️ HERRAMIENTAS DETECTADOS (${esDispositivoMovil() ? 'Móvil' : 'Desktop'}) ⚠️`, 
                           `color: ${CONFIG.colores.peligro}; font-size: 14px; font-weight: bold;`);
                console.log(`%cIntento #${intentosDevTools} registrado`, 
                           `color: ${CONFIG.colores.primario}; font-size: 12px;`);
                
                // Mostrar notificación solo si no es un falso positivo en móvil
                if (!(esDispositivoMovil() && !porDebugger)) {
                    mostrarNotificacionSeguridad(CONFIG.mensajes.devToolsDetectado);
                }
                
                if (CONFIG.proteccion.registroIntentos) {
                    localStorage.setItem('ec_devtools_intentos', intentosDevTools.toString());
                    localStorage.setItem('ec_devtools_ultimo', new Date().toISOString());
                    localStorage.setItem('ec_devtools_dispositivo', esDispositivoMovil() ? 'movil' : 'desktop');
                }
                
                // Redirección solo después de múltiples intentos en desktop
                if (intentosDevTools >= CONFIG.proteccion.maxIntentos && !esDispositivoMovil()) {
                    setTimeout(() => {
                        console.log('%c🔀 REDIRIGIENDO POR SEGURIDAD', 
                                   `color: ${CONFIG.colores.peligro}; font-size: 16px; font-weight: bold;`);
                        window.location.href = CONFIG.sitioWeb;
                    }, 2000);
                }
                
            } else if (!devToolsDetectado) {
                devToolsAbierto = false;
            }
        }
        
        // Intervalo de verificación más espaciado para móviles
        const intervalo = esDispositivoMovil() ? 2000 : 1000;
        setInterval(verificarDevTools, intervalo);
        
        console.log(`✅ Detección de DevTools: ACTIVADA (${esDispositivoMovil() ? 'Modo Móvil' : 'Modo Desktop'})`);
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
                    <span>
                        <i class="fas fa-mobile-alt" style="margin-right: 3px;"></i>
                        ${esDispositivoMovil() ? 'Móvil' : 'Desktop'}
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
            userAgent: navigator.userAgent.substring(0, 100),
            dispositivo: esDispositivoMovil() ? 'movil' : 'desktop'
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
        console.log(`%cSISTEMA DE PROTECCIÓN ${CONFIG.empresa} ACTIVADO`, 
                   `background: linear-gradient(90deg, ${CONFIG.colores.primario}, ${CONFIG.colores.oscuro}); 
                    color: white; 
                    font-size: 20px; 
                    padding: 15px; 
                    border-radius: 0;
                    font-weight: bold;
                    text-align: center;`);
        
        console.log(`%cDispositivo detectado: ${esDispositivoMovil() ? 'Móvil' : 'Desktop'}`, 
                   `color: ${CONFIG.colores.primario}; font-weight: bold;`);
        
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
        const fechaInicio = new Date().toLocaleString('es-MX');
        localStorage.setItem('ec_proteccion_iniciada', fechaInicio);
        localStorage.setItem('ec_proteccion_dispositivo', esDispositivoMovil() ? 'movil' : 'desktop');
        
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
        esDispositivoMovil: esDispositivoMovil,
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
            },
            esDispositivoMovil: esDispositivoMovil
        }
    };
})();
