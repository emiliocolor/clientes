        function loadHeader() {
            const headerHTML = `
                <header class="main-header">
                    <div class="header-container">
                        <a href="https://emiliocolor.com" target="_blank" class="header-logo">
                            <img src="https://raw.githubusercontent.com/emiliocolor/clientes/7964bf0b3468b2c6dda633ed93dfd34807f32795/img-logos/logo_transparente_alargado.png" alt="EmilioColor Logo">
                        </a>
                        
                        <nav class="header-nav">
                            <a href="https://emiliocolor.com/" class="header-nav-link active">
                                <i class="fas fa-home"></i>
                                <span>Regresar a inicio</span>
                            </a>
                        </nav>
                    </div>
                </header>
            `;
            document.getElementById('header-container').innerHTML = headerHTML;
        }

        function loadFooter() {
            const footerHTML = `
                <footer class="main-footer">
                    <div class="footer-container">
                        <div class="footer-content">
                            <div class="footer-logo">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/7964bf0b3468b2c6dda633ed93dfd34807f32795/img-logos/logo_transparente_alargado_leyenda.png" alt="EmilioColor Logo">
                            </div>
                            
                            <div class="footer-nav">
                                <h4>Navegación</h4>
                                <a href="https://emiliocolor.com#inicio" class="footer-nav-link" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-home"></i> Inicio
                                </a>
                                <a href="https://emiliocolor.com#servicios" class="footer-nav-link" data-section="tecnologia" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-laptop-code"></i> Tecnología
                                </a>
                                <a href="https://emiliocolor.com#cursos" class="footer-nav-link" data-section="educacion" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-graduation-cap"></i> Educación
                                </a>
                                <a href="https://emiliocolor.com#productos" class="footer-nav-link" data-section="productos" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-pencil-alt"></i> Papelería
                                </a>
                                <a href="https://emiliocolor.com#transportes" class="footer-nav-link" data-section="transportes" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-truck"></i> Transportes
                                </a>
                                <a href="https://emiliocolor.com/#classcloud" class="footer-nav-link" data-section="classcloud" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-cloud"></i> ClassCloud℠
                                </a>
                                <a href="https://emiliocolor.com/#apoyos" class="footer-nav-link" data-section="nosotros">
                                    <i class="fas fa-hands-helping"></i> Apoyos
                                </a>
                                <a href="https://emiliocolor.com/#contactos" class="footer-nav-link" data-section="contacto">
                                    <i class="fas fa-envelope"></i> Contacto
                                </a>
                            </div>

                            <div class="footer-contact">
                                <h4>Contacto</h4>
                                <p><i class="fas fa-envelope"></i> emiliocolormexico@gmail.com</p>
                                <p><i class="fas fa-phone-alt"></i> +52 56 2537 7747</p>
                                <p><i class="fab fa-whatsapp"></i> +52 56 2537 7747</p>
                                <p><i class="fas fa-map-marker-alt"></i> Operando desde México</p>
<br>
<div class="footer-copyright">
    <h4>Copyright</h4>
    <a href="#" 
       class="footer-nav-link" 
       target="_blank" 
       rel="noopener noreferrer">
        <i class="fas fa-file-alt"></i>
        Consultar aviso legal
    </a>
</div>


                            </div>
                            
                            <div class="footer-social">
                                <h4>Síguenos</h4>
                                <div class="footer-social-links">
                                    <a href="https://www.facebook.com/profile.php?id=61558765116854" class="social-link">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.instagram.com/emiliocolormx/" class="social-link">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer-bottom">
                            <p>© 2025 EmilioColor® | Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            `;
            document.getElementById('footer-container').innerHTML = footerHTML;
        }