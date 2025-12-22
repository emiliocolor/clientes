
// Variable para controlar si la sección de cursos ya se cargó
let cursosCargados = false;

const cart = {
    products: [],
    services: [],
    addProduct: function(product) {
        this.products.push(product);
        this.updateCart();
        this.showNotification(`${product.name} agregado al carrito`);
    },
    addService: function(service) {
        this.services.push(service);
        this.updateCart();
        this.showNotification(`${service.name} agregado al carrito`);
    },
    removeItem: function(type, id) {
        if (type === 'product') {
            this.products = this.products.filter(item => item.id !== id);
        } else if (type === 'service') {
            this.services = this.services.filter(item => item.id !== id);
        }
        this.updateCart();
    },
    getTotal: function() {
        let total = 0;
        this.products.forEach(item => total += parseFloat(item.price));
        this.services.forEach(item => total += parseFloat(item.price));
        return total.toFixed(2);
    },
    updateCart: function() {
        const productsCart = document.getElementById('products-cart');
        if (this.products.length === 0) {
            productsCart.innerHTML = '<p class="empty-cart-message">No hay productos en el carrito</p>';
        } else {
            productsCart.innerHTML = '';
            this.products.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded';
                cartItem.innerHTML = `
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">$${item.price} MXN</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-type="product" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                productsCart.appendChild(cartItem);
            });
        }
        
        const servicesCart = document.getElementById('services-cart');
        if (this.services.length === 0) {
            servicesCart.innerHTML = '<p class="empty-cart-message">No hay servicios en el carrito</p>';
        } else {
            servicesCart.innerHTML = '';
            this.services.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded';
                cartItem.innerHTML = `
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">$${item.price} MXN</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-type="service" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                servicesCart.appendChild(cartItem);
            });
        }
        
        document.getElementById('cart-total').textContent = `$${this.getTotal()} MXN`;
        
        localStorage.setItem('emiliocolorCart', JSON.stringify({
            products: this.products,
            services: this.services
        }));
    },
    generatePDF: function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setTextColor(26, 86, 219);
        doc.text('EmilioColor - Resumen de Compra', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const date = new Date();
        doc.text(`Fecha: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 105, 30, { align: 'center' });
        
        let y = 50;
        if (this.products.length > 0) {
            doc.setFontSize(16);
            doc.text('Productos', 14, y);
            y += 10;
            
            const productHeaders = [['Producto', 'Precio']];
            const productData = this.products.map(item => [item.name, `$${item.price} MXN`]);
            
            doc.autoTable({
                startY: y,
                head: productHeaders,
                body: productData,
                theme: 'grid',
                headStyles: { fillColor: [26, 86, 219], textColor: [255, 255, 255] }
            });
            
            y = doc.lastAutoTable.finalY + 10;
        }
        
        if (this.services.length > 0) {
            doc.setFontSize(16);
            doc.text('Servicios', 14, y);
            y += 10;
            
            const serviceHeaders = [['Servicio', 'Precio']];
            const serviceData = this.services.map(item => [item.name, `$${item.price} MXN`]);
            
            doc.autoTable({
                startY: y,
                head: serviceHeaders,
                body: serviceData,
                theme: 'grid',
                headStyles: { fillColor: [26, 86, 219], textColor: [255, 255, 255] }
            });
            
            y = doc.lastAutoTable.finalY + 10;
        }
        
        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text(`Total: $${this.getTotal()} MXN`, 105, y + 10, { align: 'center' });
        
        y += 25;
        
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text('INSTRUCCIONES', 14, y);
        y += 8;
        
        doc.setFontSize(11);
        const instrucciones = [
            'Por favor, ENVIAR ESTE PDF al medio de tu preferencia, JUNTO CON COMPROBANTE DE PAGO.',
            'Correo: emiliocolormexico@gmail.com',
            'Whatsapp 56-2537-7747:',
            'Nos pondremos en contacto contigo para finalizar tu pedido.'
        ];
        instrucciones.forEach(line => {
            doc.text(line, 14, y);
            y += 6;
        });
        
        y += 8;
        doc.setFontSize(18);
        doc.setTextColor(0, 128, 0);
        doc.text('Datos de depósito en tarjeta de crédito:', 105, y, { align: 'center' });

        doc.save(`EmilioColor_Compra_${date.getTime()}.pdf`);
    },
    showNotification: function(message) {
        const notification = document.createElement('div');
        notification.className = 'notification alert alert-success';
        notification.innerHTML = `
            <span>${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    loadFromStorage: function() {
        const savedCart = localStorage.getItem('emiliocolorCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.products = cartData.products || [];
            this.services = cartData.services || [];
            this.updateCart();
        }
    }
};

const sectionManager = {
    init: function() {
        this.showSection(window.location.hash || '#inicio');
        
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('http') || link.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                const sectionId = link.getAttribute('href');
                this.showSection(sectionId);
                history.pushState(null, null, sectionId);
                
                if (sectionId === '#educacion') {
                    loadCursosSection();
                }
            });
        });
        
        window.addEventListener('popstate', () => {
            this.showSection(window.location.hash || '#inicio');
            
            if (window.location.hash === '#educacion') {
                loadCursosSection();
            }
        });
    },
    showSection: function(sectionId) {
        document.querySelectorAll('.main-content > div').forEach(section => {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        });
        
        const targetSection = document.querySelector(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }
        
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === sectionId) {
                link.classList.add('active');
            }
        });
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Función para cargar la sección de cursos
function loadCursosSection() {
    if (cursosCargados) {
        console.log("La sección de cursos ya está cargada");
        return;
    }
    
    const cursosContainer = document.getElementById('educacion-section');
    if (!cursosContainer) {
        console.error("No se encontró el contenedor de cursos");
        return;
    }
    
    console.log("Cargando sección de cursos...");
    
    // Mostrar spinner de carga
    cursosContainer.innerHTML = `
        <div class="rounded-container mb-4">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando cursos...</span>
                </div>
                <p class="mt-3">Cargando cursos...</p>
            </div>
        </div>
    `;
    
    // Intentar cargar desde archivo externo
    fetch('educacion-section.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Archivo no encontrado. Cargando contenido alternativo.');
            }
            return response.text();
        })
        .then(data => {
            cursosContainer.innerHTML = data;
            cursosCargados = true;
            console.log("Sección de cursos cargada desde archivo externo");
            
            // Inicializar la funcionalidad de búsqueda
            if (typeof initCourseSearch === 'function') {
                setTimeout(initCourseSearch, 100);
            }
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
            // Cargar contenido alternativo directamente
            loadCursosContentDirectly();
        });
}

// Función para cargar el contenido de cursos directamente como fallback
function loadCursosContentDirectly() {
    const cursosContainer = document.getElementById('educacion-section');
    if (!cursosContainer) return;
    
    cursosContainer.innerHTML = `
        <div class="rounded-container mb-4">
            <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Cursos Pregrabados</h2>

 <div class="mt-4 mb-3">
    <!-- <audio controls>
        <source src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/cursos_audio.mp3" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
    </audio> -->
</div>

 <!-- <button class="btn btn-outline-primary btn-sm mb-3" 
        onclick="generateGeneralQuotation()" 
        style="border-radius: 0 !important;">
    <i class="fas fa-file-invoice-dollar"></i> Cotización General de Todos los Cursos
</button>  -->

            <div class="alert alert-info small mt-2 mb-3" role="alert">
                Todos incluyen acceso inmediato y de por vida con material descargable.
            </div>
            
            <!-- Filtros de búsqueda y categoría -->
            <div class="row mb-2">
                <div class="col-md-8">
                    <div class="search-container">
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                            <input type="text" id="courseSearch" class="form-control" placeholder="Buscar cursos... (por nombre, categoría o descripción)">
                            <button class="btn btn-outline-secondary square-btn" type="button" id="clearSearch">Limpiar</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div style="border-radius: 0 !important;" class="category-filter-container">
                        <select id="categoryFilter" class="form-select">
                            <option value="">Todas las categorías</option>
                            <option value="Platzi">Platzi</option>
                            <option value="Udemy">Udemy</option>
                            <option value="Varios">Varios</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Desarrollo Personal">Desarrollo Personal</option>
                            <option value="Robótica">Robótica</option>
                            <option value="Domótica">Domótica</option>
                            <option value="Electrónica">Electrónica</option>
                            <option value="Programación">Programación</option>
                            <option value="Ingeniería">Ingeniería</option>
                            <option value="Manufactura">Manufactura</option>
                            <option value="Idiomas">Idiomas</option>
                            <option value="Negocios">Negocios</option>
                            <option value="Música">Música</option>
                        </select>
                    </div>
                </div>
            </div>
            <style>
/* 🔥 Fuerza sin bordes redondeados en todo el bloque de filtros */
.row.mb-2 .form-control,
.row.mb-2 .form-select,
.row.mb-2 .btn,
.row.mb-2 .input-group-text,
.row.mb-2 select {
    border-radius: 0 !important;
}

/* También asegura que los grupos de input no se junten con esquinas redondeadas */
.input-group > .form-control:not(:last-child),
.input-group > .form-control:not(:first-child),
.input-group > .input-group-text:not(:last-child),
.input-group > .input-group-text:not(:first-child),
.input-group > .btn:not(:last-child),
.input-group > .btn:not(:first-child) {
    border-radius: 0 !important;
}

/* Evita que Bootstrap 5.3+ agregue bordes en focus con radios */
.form-control:focus,
.form-select:focus,
.btn:focus {
    border-radius: 0 !important;
    box-shadow: none !important;
}
</style>

            <div id="searchResultsCount" class="small text-muted mt-2"></div>
        <div class="mb-5">
            <h4 class="section-title"><i class="fas fa-book-open"></i> Sección 1/3: Mega Packs Permanentes</h4>
<p class="mb-4">Mega Packs de cursos en diversas áreas como tecnología, programación, ingeniería e informática. Todos los contenidos se entregan completos y en esta sección; se pueden revender.</p>
            <div class="row g-4">
<!-- Curso 1 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Platzi 1" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack de Cursos Profesionales Platzi 1</h5>
                <p class="small">Colección de cursos Platzi sobre tecnología, programación e informática.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Platzi</li>
                    <li><strong>Tamaño:</strong> 14.1 TB</li>
                </ul>
                <p class="product-price fw-bold mt-2">$1400.00 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c1" data-name="Mega Pack Cursos Platzi 1" data-price="1400.00">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Platzi%201%20(1400.00%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c1" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 2 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Platzi 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Platzi 2</h5>
                <p class="small">Segunda parte de la colección de cursos Platzi con más contenido.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Platzi</li>
                    <li><strong>Contenido:</strong> Cursos profesionales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c2" data-name="Mega Pack Cursos Platzi 2" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Platzi%202%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c2" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 3 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Platzi 3" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Platzi 3</h5>
                <p class="small">Tercera parte de la colección Platzi con cursos actualizados.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Platzi</li>
                    <li><strong>Contenido:</strong> Cursos profesionales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c3" data-name="Mega Pack Cursos Platzi 3" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Platzi%203%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c3" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 4 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Platzi 4" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Platzi 4</h5>
                <p class="small">Cuarta parte con más cursos Platzi para tu desarrollo profesional.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Platzi</li>
                    <li><strong>Contenido:</strong> Cursos profesionales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c4" data-name="Mega Pack Cursos Platzi 4" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Platzi%204%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c4" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 5 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Udemy 1" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Udemy 1</h5>
                <p class="small">Colección de cursos Udemy sobre diversos temas profesionales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Udemy</li>
                <li><strong>Equivalencia:</strong> 33 Cursos</li>

                    <li><strong>Contenido:</strong> Java, PHP, Android Studio, Hacking Ético, Python, MySQL, Web Scraping, Desarrollo Web, Ciberseguridad.</li>
                </ul>

                <!-- Precio actualizado
                <p class="product-price fw-bold mt-2 mb-1">
                    <span style="text-decoration: line-through; color: gray;">$1,640.10 MXN</span>
                </p>
                <p class="product-price text-danger fw-bold mb-0" style="font-size: 0.9rem;">50% de descuento</p> -->

                <p class="product-price fw-bold text-primary">$820.10 MXN</p>

                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c5" data-name="Mega Pack Cursos Udemy 1" data-price="820.00">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Udemy%201%20(820.00%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>

                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c5" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Curso 6 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Udemy 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Udemy 2</h5>
                <p class="small">Segunda parte de cursos Udemy con formación especializada.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Udemy</li>
                    <li><strong>Contenido:</strong> Cursos variados</li>
                </ul>
                <p class="product-price fw-bold mt-2">$719.89 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c6" data-name="Mega Pack Cursos Udemy 2" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Udemy%202%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c6" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 7 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Udemy 3" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Udemy 3</h5>
                <p class="small">Tercera parte con más cursos Udemy para tu crecimiento.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Udemy</li>
                    <li><strong>Contenido:</strong> Cursos variados</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c7" data-name="Mega Pack Cursos Udemy 3" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Udemy%203%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c7" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 8 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Varios 1" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Varios 1</h5>
                <p class="small">Colección variada de cursos sobre diferentes temas educativos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                                        <li><strong>Equivalencia:</strong> 9 Cursos</li>
<li><strong>Contenido:</strong> Administración restaurantera, reparación de bicicletas, reparación de celulares, barismo y recetarios corporativos de café, preparación de hamburguesas, elaboración de helados y aguas, y decoraciones con globos.</li>
                </ul>
                <p class="product-price fw-bold mt-2">$223.65 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c8" data-name="Mega Pack Cursos Varios 1" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Varios%201%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c8" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 9 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Varios 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Varios 2</h5>
                <p class="small">Segunda parte de la colección variada de cursos educativos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                                        <li><strong>Equivalencia:</strong> 79 Cursos</li>

                    <li><strong>Contenido:</strong> Cursos diversos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$392.63 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c9" data-name="Mega Pack Cursos Varios 2" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Varios%202%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c9" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 10 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Cursos Varios 3" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Varios 3</h5>
                <p class="small">Tercera parte con más cursos variados para tu aprendizaje.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                    <li><strong>Contenido:</strong> Cursos diversos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c10" data-name="Mega Pack Cursos Varios 3" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Varios%203%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c10" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 11 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Diseño Gráfico" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Diseño Gráfico</h5>
                <p class="small">Colección completa de cursos sobre diseño gráfico y herramientas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Cursos de diseño</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c11" data-name="Mega Pack Diseño Gráfico" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Diseño%20Gráfico%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c11" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 12 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="Mega Pack Esquemático de Celulares" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Esquemático de Celulares</h5>
                <p class="small">Recursos técnicos y esquemáticos para reparación de celulares.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Reparación móvil</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c12" data-name="Mega Pack Esquemático de Celulares" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Esquemático%20de%20Celulares%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c12" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 13 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Mind Valley 1</h5>
                <p class="small">Primera parte de cursos de desarrollo personal de Mind Valley.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Cursos motivacionales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c13" data-name="Mega Pack Mind Valley 1" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Mind%20Valley%201%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c13" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 14 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Mind Valley 2</h5>
                <p class="small">Segunda parte con más cursos de desarrollo personal.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Cursos motivacionales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c14" data-name="Mega Pack Mind Valley 2" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Mind%20Valley%202%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c14" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 15 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Reparación de Celulares</h5>
                <p class="small">Curso completo sobre reparación de celulares y dispositivos móviles.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Reparación móvil</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c15" data-name="Mega Pack Reparación de Celulares" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Reparación%20de%20Celulares%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c15" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 16 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Variados 1</h5>
                <p class="small">Colección con cursos variados sobre múltiples temas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                    <li><strong>Contenido:</strong> Cursos diversos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c16" data-name="Mega Pack Cursos Variados 1" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Variados%201%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c16" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 17 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Variados 2</h5>
                <p class="small">Segunda colección con cursos variados sobre múltiples temas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                    <li><strong>Contenido:</strong> Cursos diversos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c17" data-name="Mega Pack Cursos Variados 2" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Variados%202%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c17" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 18 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/megapacks_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mega Pack Cursos Variados 3</h5>
                <p class="small">Tercera colección con cursos variados sobre múltiples temas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Varios</li>
                    <li><strong>Contenido:</strong> Cursos diversos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.90 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="c18" data-name="Mega Pack Cursos Variados 3" data-price="69.90">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mega%20Pack%20Cursos%20Variados%203%20(69.90%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
                <!-- Botones secundarios -->
                <div class="d-flex gap-2 mt-2 justify-content-center">
                    <a href="#contenido-c18" class="btn btn-secondary btn-sm" style="max-width: 180px;">
                        Conocer contenido
                    </a>
                    <a href="https://emiliocolor.com/#educacion" class="btn btn-outline-secondary btn-sm" style="max-width: 180px;">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
                    <!-- Parte 2/3: Más Mega Packs -->
        <div class="mt-5">
            <h4 class="section-title"><i class="fas fa-book-open"></i> Sección 2/3: Cursos Destacados</h4>
            <p class="mb-4">Continúa explorando nuestra colección de cursos profesionales</p>

<div class="row g-4">
            <!-- Curso 1 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Arduino: Aprende Electrónica y Programación</h5>
                            <p class="small">Domina los fundamentos de Arduino, electrónica y programación desde cero.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Robótica</li>
                                <li><strong>Contenido:</strong> Proyectos prácticos</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd1" data-name="Curso Arduino: Aprende Electrónica y Programación" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Arduino:%20Aprende%20Electrónica%20y%20Programación%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        <!-- Curso 2 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Arduino y Microcontrolador PIC</h5>
                            <p class="small">Aprende a trabajar con Arduino y microcontroladores PIC en proyectos avanzados.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Robótica</li>
                                <li><strong>Contenido:</strong> Proyectos integrados</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd2" data-name="Curso Arduino y Microcontrolador PIC" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Arduino%20y%20Microcontrolador%20PIC%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 3 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Arduino Interactivo: Domina el Control, Movimiento y Comunicación</h5>
                            <p class="small">Controla dispositivos, movimiento y comunicación con Arduino.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Robótica</li>
                                <li><strong>Contenido:</strong> Aplicaciones prácticas</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd3" data-name="Curso Arduino Interactivo: Domina el Control, Movimiento y Comunicación" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Arduino%20Interactivo:%20Domina%20el%20Control,%20Movimiento%20y%20Comunicación%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 4 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Robótica con MATLAB y Arduino: Modelado y Simulación</h5>
                            <p class="small">Modela y simula sistemas robóticos con MATLAB y Arduino.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Robótica</li>
                                <li><strong>Contenido:</strong> Simulaciones avanzadas</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd4" data-name="Curso Robótica con MATLAB y Arduino: Modelado y Simulación" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Robótica%20con%20MATLAB%20y%20Arduino:%20Modelado%20y%20Simulación%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 5 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Robótica y Hardware</h5>
                            <p class="small">Fundamentos de robótica y hardware para proyectos avanzados.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Robótica</li>
                                <li><strong>Contenido:</strong> Componentes electrónicos</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd5" data-name="Curso Robótica y Hardware" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Robótica%20y%20Hardware%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 6 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Sistemas Técnicos en la Edificación</h5>
                            <p class="small">Aprende sobre sistemas técnicos aplicados a la edificación.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Domótica</li>
                                <li><strong>Contenido:</strong> Sistemas integrados</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd6" data-name="Curso Sistemas Técnicos en la Edificación" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Sistemas%20Técnicos%20en%20la%20Edificación%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 7 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Domótica</h5>
                            <p class="small">Automatización del hogar con sistemas inteligentes.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Domótica</li>
                                <li><strong>Contenido:</strong> Hogar inteligente</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd7" data-name="Curso Domótica" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Domótica%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 8 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Electrónica Desde Cero</h5>
                            <p class="small">Fundamentos de electrónica para principiantes.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Electrónica</li>
                                <li><strong>Contenido:</strong> Conceptos básicos</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd8" data-name="Curso Electrónica Desde Cero" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Electrónica%20Desde%20Cero%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 9 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso Electrónica, Robótica, Domótica</h5>
                            <p class="small">Combinación de electrónica, robótica y domótica en un solo curso.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Electrónica</li>
                                <li><strong>Contenido:</strong> Proyectos integrados</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd9" data-name="Curso Electrónica, Robótica, Domótica" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Electrónica,%20Robótica,%20Domótica%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 10 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Programación explicada paso a paso</h5>
                            <p class="small">Aprende programación desde cero con ejemplos prácticos.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Fundamentos</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd10" data-name="Programación explicada paso a paso" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Programación%20explicada%20paso%20a%20paso%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 11 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso principal: Guía para tus primeros pasos</h5>
                            <p class="small">Guía completa para comenzar en el mundo de la tecnología.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Introducción general</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd11" data-name="Curso principal: Guía para tus primeros pasos" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20principal:%20Guía%20para%20tus%20primeros%20pasos%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 12 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Fundamentos de Windows 10 (Informática)</h5>
                            <p class="small">Domina los fundamentos del sistema operativo Windows 10.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Sistema operativo</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd12" data-name="Fundamentos de Windows 10 (Informática)" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Fundamentos%20de%20Windows%2010%20(Informática)%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 13 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Aprende desde cero absoluto hasta trainee</h5>
                            <p class="small">Curso completo desde nivel principiante hasta intermedio.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Ruta de aprendizaje</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd13" data-name="Aprende desde cero absoluto hasta trainee" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Aprende%20desde%20cero%20absoluto%20hasta%20trainee%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 14 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso de accesibilidad web</h5>
                            <p class="small">Aprende a crear sitios web accesibles para todos.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Desarrollo inclusivo</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd14" data-name="Curso de accesibilidad web" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20de%20accesibilidad%20web%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 15 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Diseño responsivo con cajas flexibles (CSS3)</h5>
                            <p class="small">Domina el diseño responsivo con Flexbox en CSS3.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Diseño</li>
                                <li><strong>Contenido:</strong> CSS Flexbox</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd15" data-name="Diseño responsivo con cajas flexibles (CSS3)" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Diseño%20responsivo%20con%20cajas%20flexibles%20(CSS3)%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 16 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>PrimeFaces y Spring Boot: Crea tu primera app web con Java</h5>
                            <p class="small">Desarrollo de aplicaciones web con PrimeFaces y Spring Boot.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Java web</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd16" data-name="PrimeFaces y Spring Boot: Crea tu primera app web con Java" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20PrimeFaces%20y%20Spring%20Boot:%20Crea%20tu%20primera%20app%20web%20con%20Java%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 17 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Curso de diseño web con Bootstrap</h5>
                            <p class="small">Crea sitios web modernos con el framework Bootstrap.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Diseño</li>
                                <li><strong>Contenido:</strong> Diseño responsivo</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd17" data-name="Curso de diseño web con Bootstrap" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20de%20diseño%20web%20con%20Bootstrap%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Curso 18 -->
            <div class="col-md-6">
                <div class="card tool-card p-3">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h5>Crea aplicaciones iOS y Android con Angular</h5>
                            <p class="small">Desarrollo de aplicaciones móviles multiplataforma con Angular.</p>
                            <ul class="small">
                                <li><strong>Categoría:</strong> Programación</li>
                                <li><strong>Contenido:</strong> Mobile cross-platform</li>
                            </ul>
                            <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd18" data-name="Crea aplicaciones iOS y Android con Angular" data-price="59.80">Agregar al carrito</button>
                                <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Crea%20aplicaciones%20iOS%20y%20Android%20con%20Angular%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

<!-- Curso 19 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Aprende 5 lenguajes de programación desde cero</h5>
                <p class="small">Domina los fundamentos de 5 lenguajes de programación populares.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Multi-lenguaje</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd19" data-name="Aprende 5 lenguajes de programación desde cero" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Aprende%205%20lenguajes%20de%20programación%20desde%20cero%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 20 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Comienza a programar en Python desde cero</h5>
                <p class="small">Introducción al lenguaje de programación Python.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Python básico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd20" data-name="Comienza a programar en Python desde cero" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Comienza%20a%20programar%20en%20Python%20desde%20cero%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 21 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Java SE: Taller de programación de cero a trainee</h5>
                <p class="small">Aprende Java Standard Edition desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Java básico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd21" data-name="Java SE: Taller de programación de cero a trainee" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Java%20SE:%20Taller%20de%20programación%20de%20cero%20a%20trainee%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 22 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Colección de libros esenciales de programación</h5>
                <p class="small">Biblioteca digital con los mejores libros de programación.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Recursos bibliográficos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd22" data-name="Colección de libros esenciales de programación" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Colección%20de%20libros%20esenciales%20de%20programación%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 23 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Proceso CRUD con C# y Oracle Database</h5>
                <p class="small">Implementación de operaciones CRUD con C# y Oracle.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Bases de datos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd23" data-name="Proceso CRUD con C# y Oracle Database" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Proceso%20CRUD%20con%20C%23%20y%20Oracle%20Database%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 24 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Proceso CRUD con C# y PostgreSQL</h5>
                <p class="small">Implementación de operaciones CRUD con C# y PostgreSQL.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Bases de datos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd24" data-name="Proceso CRUD con C# y PostgreSQL" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Proceso%20CRUD%20con%20C%23%20y%20PostgreSQL%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 25 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Proceso CRUD con C# y Visual FoxPro</h5>
                <p class="small">Implementación de operaciones CRUD con C# y Visual FoxPro.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Bases de datos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd25" data-name="Proceso CRUD con C# y Visual FoxPro" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Proceso%20CRUD%20con%20C%23%20y%20Visual%20FoxPro%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 26 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                                <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_emiliocolor.png" alt="Programación" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Visual FoxPro - Clases visuales (nueva versión)</h5>
                <p class="small">Programación con Visual FoxPro y su interfaz visual.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Desarrollo legacy</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd26" data-name="Visual FoxPro - Clases visuales (nueva versión)" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Visual%20FoxPro%20-%20Clases%20visuales%20(nueva%20versión)%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 27 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso completo de SolidWorks</h5>
                <p class="small">Domina el diseño 3D con SolidWorks desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Modelado 3D</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd27" data-name="Curso completo de SolidWorks" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20completo%20de%20SolidWorks%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 28 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso completo de AutoCAD</h5>
                <p class="small">Aprende AutoCAD para diseño técnico y arquitectónico.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Dibujo técnico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd28" data-name="Curso completo de AutoCAD" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20completo%20de%20AutoCAD%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 29 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Especialización en AutoCAD Electrical</h5>
                <p class="small">AutoCAD especializado en diseño eléctrico.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Diagramas eléctricos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd29" data-name="Especialización en AutoCAD Electrical" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Especialización%20en%20AutoCAD%20Electrical%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 30 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Minitab para control de calidad</h5>
                <p class="small">Uso de Minitab en procesos de control de calidad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Control estadístico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$69.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd30" data-name="Minitab para control de calidad" data-price="69.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Minitab%20para%20control%20de%20calidad%20(69.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 31 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Control de motores con variadores de frecuencia</h5>
                <p class="small">Control avanzado de motores eléctricos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Automatización</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd31" data-name="Control de motores con variadores de frecuencia" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Control%20de%20motores%20con%20variadores%20de%20frecuencia%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 32 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Fundamentos de mecánica industrial</h5>
                <p class="small">Principios básicos de mecánica aplicada a la industria.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Mecánica aplicada</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd32" data-name="Fundamentos de mecánica industrial" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Fundamentos%20de%20mecánica%20industrial%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 33 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Programación de PLCs industriales</h5>
                <p class="small">Programación de controladores lógicos programables.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Automatización industrial</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd33" data-name="Programación de PLCs industriales" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Programación%20de%20PLCs%20industriales%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 34 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Programación CNC avanzada</h5>
                <p class="small">Programación de máquinas CNC para manufactura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Manufactura</li>
                    <li><strong>Contenido:</strong> Control numérico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd34" data-name="Programación CNC avanzada" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Programación%20CNC%20avanzada%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 35 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Biblioteca de ingeniería</h5>
                <p class="small">Recursos y materiales para estudio de ingeniería.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Recursos educativos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd35" data-name="Biblioteca de ingeniería" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Biblioteca%20de%20ingeniería%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 36 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Core Tools para gestión de calidad</h5>
                <p class="small">Herramientas esenciales para gestión de calidad en manufactura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Manufactura</li>
                    <li><strong>Contenido:</strong> Control de calidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd36" data-name="Core Tools para gestión de calidad" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Core%20Tools%20para%20gestión%20de%20calidad%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 37 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://raw.githubusercontent.com/emiliocolor/clientes/130ecae7f040f4799905c00d709d3d4feda5e9e5/img_productos_servicios/packs_azul_emiliocolor.png" alt="" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Técnicas de balanceo de líneas de producción</h5>
                <p class="small">Optimización de líneas de producción industrial.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Manufactura</li>
                    <li><strong>Contenido:</strong> Optimización</li>
                </ul>
                <p class="product-price fw-bold mt-2">$59.80 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="cd37" data-name="Técnicas de balanceo de líneas de producción" data-price="59.80">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Técnicas%20de%20balanceo%20de%20líneas%20(59.80%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
                <!-- Parte 3/3: Más y Más Mega Packs -->
        <div class="mt-5">
            <h4 class="section-title"><i class="fas fa-book-open"></i> Sección 3/3: Cursos Colección Completa</h4>
            <p class="mb-4">Explora nuestra colección completa de materiales educativos</p>

            <div class="row g-4">
<!-- Curso 1 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/42.png" alt="Diseno Grafico" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Diseno Grafico</h5>
                <p class="small">Aprende los fundamentos del diseno grafico y herramientas profesionales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Fundamentos de diseño</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="42" data-name="Diseno Grafico" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Diseno%20Grafico%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 2 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/43.png" alt="Office" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Office</h5>
                <p class="small">Domina las herramientas de Microsoft Office para productividad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Microsoft Office</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="43" data-name="Office" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Office%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 3 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/44.png" alt="Ingles" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Ingles</h5>
                <p class="small">Curso completo de ingles desde nivel basico hasta avanzado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés completo</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="44" data-name="Ingles" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Ingles%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 4 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/45.png" alt="Curso Excel Completo" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Excel Completo</h5>
                <p class="small">Aprende Excel desde cero hasta nivel avanzado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Excel avanzado</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="45" data-name="Curso Excel Completo" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Excel%20Completo%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 5 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/46.png" alt="Aula Virtual" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Aula Virtual</h5>
                <p class="small">Recursos para crear y gestionar aulas virtuales educativas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Educación virtual</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="46" data-name="Aula Virtual" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Aula%20Virtual%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Curso 47 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/47.png" alt="Hacking Etico" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Hacking Etico</h5>
                <p class="small">Aprende tecnicas de hacking etico y seguridad informatica.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Seguridad informática</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="47" data-name="Hacking Etico" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Hacking%20Etico%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 48 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/48.png" alt="Marketing Digital" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Marketing Digital</h5>
                <p class="small">Estrategias de marketing digital para redes sociales y web.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing online</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="48" data-name="Marketing Digital" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Marketing%20Digital%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 49 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/49.png" alt="Gastronomia" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Gastronomia</h5>
                <p class="small">Curso completo de cocina y tecnicas gastronomicas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Cocina profesional</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="49" data-name="Gastronomia" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Gastronomia%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 50 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/50.png" alt="Super Memoria" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Super Memoria</h5>
                <p class="small">Tecnicas para mejorar la memoria y el aprendizaje acelerado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Técnicas de memorización</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="50" data-name="Super Memoria" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Super%20Memoria%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 51 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/51.png" alt="Produccion Musical" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Produccion Musical</h5>
                <p class="small">Aprende a producir musica con herramientas digitales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Producción audio</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="51" data-name="Produccion Musical" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Produccion%20Musical%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 52 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/52.png" alt="Ingenieria" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Ingenieria</h5>
                <p class="small">Recursos y cursos varios sobre ingenieria.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Varios temas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="52" data-name="Ingenieria" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Ingenieria%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 53 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/53.png" alt="Cursos De Hacking Y Programacion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos De Hacking Y Programacion</h5>
                <p class="small">Coleccion de cursos sobre hacking y programacion.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Varios temas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="53" data-name="Cursos De Hacking Y Programacion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20De%20Hacking%20Y%20Programacion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 54 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/54.png" alt="Autocad Desde Cero - Proyectos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Autocad Desde Cero - Proyectos</h5>
                <p class="small">Aprende AutoCAD desde cero con proyectos practicos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Diseño CAD</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="54" data-name="Autocad Desde Cero - Proyectos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Autocad%20Desde%20Cero%20-%20Proyectos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 55 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/55.png" alt="Arquitectura" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Arquitectura</h5>
                <p class="small">Curso completo sobre fundamentos de arquitectura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Arquitectura</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="55" data-name="Arquitectura" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Arquitectura%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 56 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/56.png" alt="Consola Movil" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Consola Movil</h5>
                <p class="small">Curso sobre desarrollo de aplicaciones para consolas moviles.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Desarrollo móvil</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="56" data-name="Consola Movil" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Consola%20Movil%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 57 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/57.png" alt="Desarrollo Web" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Desarrollo Web</h5>
                <p class="small">Aprende desarrollo web frontend y backend.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Web development</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="57" data-name="Desarrollo Web" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Desarrollo%20Web%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 58 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/58.png" alt="Psicologia" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Psicologia</h5>
                <p class="small">Curso introductorio a la psicologia.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Psicología básica</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="58" data-name="Psicologia" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Psicologia%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 59 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/59.png" alt="Canva De 0 A Pro" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Canva De 0 A Pro</h5>
                <p class="small">Domina Canva para crear disenos profesionales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Diseño gráfico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="59" data-name="Canva De 0 A Pro" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Canva%20De%200%20A%20Pro%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 60 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/60.png" alt="Armado De Pc" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Armado De Pc</h5>
                <p class="small">Aprende a armar y reparar computadoras.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Hardware</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="60" data-name="Armado De Pc" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Armado%20De%20Pc%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 61 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/61.png" alt="Guitarra Acustica" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Guitarra Acustica</h5>
                <p class="small">Curso completo para aprender a tocar guitarra acustica.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Instrumentos musicales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="61" data-name="Guitarra Acustica" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Guitarra%20Acustica%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 62 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/62.png" alt="Pre Universitario" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Pre Universitario</h5>
                <p class="small">Preparacion para examenes universitarios.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Educación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="62" data-name="Pre Universitario" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Pre%20Universitario%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 63 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/63.png" alt="Fotografia" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Fotografia</h5>
                <p class="small">Curso completo de fotografia digital.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Fotografía</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="63" data-name="Fotografia" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Fotografia%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 64 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/64.png" alt="Curso De Dibujo Completo" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Dibujo Completo</h5>
                <p class="small">Aprende tecnicas de dibujo desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Dibujo artístico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="64" data-name="Curso De Dibujo Completo" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Dibujo%20Completo%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 65 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/65.png" alt="Lectura Rapida" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Lectura Rapida</h5>
                <p class="small">Tecnicas para aumentar la velocidad de lectura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Técnicas de estudio</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="65" data-name="Lectura Rapida" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Lectura%20Rapida%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 66 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/66.png" alt="Curso De Argis" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Argis</h5>
                <p class="small">Aprende a usar Argis para sistemas de informacion geografica.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> SIG</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="66" data-name="Curso De Argis" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Argis%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 67 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/67.png" alt="Dibujo A Lapiz De Principiante A Experto" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Dibujo A Lapiz De Principiante A Experto</h5>
                <p class="small">Domina el dibujo a lapiz con tecnicas profesionales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Dibujo artístico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="67" data-name="Dibujo A Lapiz De Principiante A Experto" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Dibujo%20A%20Lapiz%20De%20Principiante%20A%20Experto%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 68 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/68.png" alt="Dibujo E Ilustracion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Dibujo E Ilustracion</h5>
                <p class="small">Curso completo de dibujo e ilustracion digital.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Ilustración digital</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="68" data-name="Dibujo E Ilustracion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Dibujo%20E%20Ilustracion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 69 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/69.png" alt="Como Crear Tu Iman De Prospecto" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Crear Tu Iman De Prospecto</h5>
                <p class="small">Tecnicas de marketing y atraccion de clientes.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="69" data-name="Como Crear Tu Iman De Prospecto" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Crear%20Tu%20Iman%20De%20Prospecto%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Curso 70 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/70.png" alt="Inteligencia Artificial" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Inteligencia Artificial</h5>
                <p class="small">Introduccion a la inteligencia artificial y machine learning.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> IA y ML</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="70" data-name="Inteligencia Artificial" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Inteligencia%20Artificial%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 71 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/71.png" alt="Curso De Adiestramiento Canino" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Adiestramiento Canino</h5>
                <p class="small">Aprende tecnicas profesionales para adiestrar perros.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Adiestramiento</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="71" data-name="Curso De Adiestramiento Canino" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Adiestramiento%20Canino%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 72 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/72.png" alt="Programacion En Java" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Programacion En Java</h5>
                <p class="small">Curso completo de programacion en Java.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Java</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="72" data-name="Programacion En Java" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Programacion%20En%20Java%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 73 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/73.png" alt="Exploring Jazz - Piano Vol I Y II" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Exploring Jazz - Piano Vol I Y II</h5>
                <p class="small">Curso de piano jazz para principiantes y avanzados.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Piano jazz</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="73" data-name="Exploring Jazz - Piano Vol I Y II" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Exploring%20Jazz%20-%20Piano%20Vol%20I%20Y%20II%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 74 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/74.png" alt="Cursos De Corte Y Confeccion 1" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos De Corte Y Confeccion 1</h5>
                <p class="small">Aprende tecnicas de costura y confeccion de ropa.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Costura</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="74" data-name="Cursos De Corte Y Confeccion 1" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20De%20Corte%20Y%20Confeccion%201%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 75 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/75.png" alt="Curso De Barista" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Barista</h5>
                <p class="small">Aprende el arte de preparar cafe como un profesional.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Barismo</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="75" data-name="Curso De Barista" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Barista%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 76 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/76.png" alt="Reparacion De Aires Acondicionados" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Reparacion De Aires Acondicionados</h5>
                <p class="small">Aprende a reparar y mantener sistemas de aire acondicionado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> HVAC</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="76" data-name="Reparacion De Aires Acondicionados" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Reparacion%20De%20Aires%20Acondicionados%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 77 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/77.png" alt="Masterclass Oratoria" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Masterclass Oratoria</h5>
                <p class="small">Mejora tus habilidades de hablar en publico.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Comunicación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="77" data-name="Masterclass Oratoria" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Masterclass%20Oratoria%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 78 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/78.png" alt="Cursos De Hacking Y Programacion 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos De Hacking Y Programacion 2</h5>
                <p class="small">Mas cursos avanzados sobre hacking y programacion.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Hacking</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="78" data-name="Cursos De Hacking Y Programacion 2" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20De%20Hacking%20Y%20Programacion%202%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 79 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/79.png" alt="Curso De Hacking De Frecuencias - S4Vitar" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Hacking De Frecuencias - S4Vitar</h5>
                <p class="small">Curso especializado en hacking de frecuencias.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Seguridad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="79" data-name="Curso De Hacking De Frecuencias - S4Vitar" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Hacking%20De%20Frecuencias%20-%20S4Vitar%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 80 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/80.png" alt="Training Hacking Offensive" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Training Hacking Offensive</h5>
                <p class="small">Entrenamiento en hacking ofensivo y seguridad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Hacking ético</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="80" data-name="Training Hacking Offensive" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Training%20Hacking%20Offensive%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 81 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/81.png" alt="Maestro De La Seduccion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Maestro De La Seduccion</h5>
                <p class="small">Tecnicas de seduccion y relaciones interpersonales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Relaciones</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="81" data-name="Maestro De La Seduccion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Maestro%20De%20La%20Seduccion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 82 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/82.png" alt="Lenguaje De Programacion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Lenguaje De Programacion</h5>
                <p class="small">Curso sobre diversos lenguajes de programacion.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Varios lenguajes</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="82" data-name="Lenguaje De Programacion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Lenguaje%20De%20Programacion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 83 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/83.png" alt="Curso De Computacion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Computacion</h5>
                <p class="small">Fundamentos de computacion para principiantes.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Básicos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="83" data-name="Curso De Computacion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Computacion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 84 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/84.png" alt="Estetica Canina" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Estetica Canina</h5>
                <p class="small">Aprende tecnicas de peluqueria y estetica para perros.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Peluquería canina</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="84" data-name="Estetica Canina" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Estetica%20Canina%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 85 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/85.png" alt="Escuela Masterchef" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Escuela Masterchef</h5>
                <p class="small">Curso de cocina al estilo Masterchef.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Cocina</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="85" data-name="Escuela Masterchef" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Escuela%20Masterchef%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 86 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/86.png" alt="Como Crear Cursos (John Dani)" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Crear Cursos (John Dani)</h5>
                <p class="small">Aprende a crear y vender cursos online.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Creación de cursos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="86" data-name="Como Crear Cursos (John Dani)" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Crear%20Cursos%20(John%20Dani)%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 87 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/87.png" alt="Daygame Mastery (Seduccion)" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Daygame Mastery (Seduccion)</h5>
                <p class="small">Tecnicas avanzadas de seduccion durante el dia.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Relaciones</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="87" data-name="Daygame Mastery (Seduccion)" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Daygame%20Mastery%20(Seduccion)%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 88 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/88.png" alt="Reparacion De Impresoras" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Reparacion De Impresoras</h5>
                <p class="small">Aprende a reparar impresoras de diferentes marcas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Reparación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="88" data-name="Reparacion De Impresoras" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Reparacion%20De%20Impresoras%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 89 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/89.png" alt="Curso De Programacion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Programacion</h5>
                <p class="small">Curso general de programacion para principiantes.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Fundamentos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="89" data-name="Curso De Programacion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Programacion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 90 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/90.png" alt="Curso De Administracion De Restaurantes" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Administracion De Restaurantes</h5>
                <p class="small">Aprende a gestionar y administrar un restaurante.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Gestión</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="90" data-name="Curso De Administracion De Restaurantes" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Administracion%20De%20Restaurantes%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 91 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/91.png" alt="Hablar Para Vender Alvaro Mendoza" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Hablar Para Vender Alvaro Mendoza</h5>
                <p class="small">Tecnicas de venta y persuasion verbal.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Ventas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="91" data-name="Hablar Para Vender Alvaro Mendoza" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Hablar%20Para%20Vender%20Alvaro%20Mendoza%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 92 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/92.png" alt="Master Ventas Luis Eduardo Varon" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Master Ventas Luis Eduardo Varon</h5>
                <p class="small">Curso avanzado de tecnicas de ventas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Técnicas de venta</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="92" data-name="Master Ventas Luis Eduardo Varon" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Master%20Ventas%20Luis%20Eduardo%20Varon%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 93 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/93.png" alt="Mecanica Automotriz Para Principiantes" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mecanica Automotriz Para Principiantes</h5>
                <p class="small">Aprende los fundamentos de mecanica automotriz.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Automotriz</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="93" data-name="Mecanica Automotriz Para Principiantes" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mecanica%20Automotriz%20Para%20Principiantes%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 94 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/94.png" alt="Coleccion Robert Kiyosaki" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Coleccion Robert Kiyosaki</h5>
                <p class="small">Libros y cursos sobre finanzas personales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Finanzas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="94" data-name="Coleccion Robert Kiyosaki" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Coleccion%20Robert%20Kiyosaki%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 95 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/95.png" alt="Como Entender Contabilidad Sin Ser Contador" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Entender Contabilidad Sin Ser Contador</h5>
                <p class="small">Fundamentos de contabilidad para no especialistas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Contabilidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="95" data-name="Como Entender Contabilidad Sin Ser Contador" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Entender%20Contabilidad%20Sin%20Ser%20Contador%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 96 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/96.png" alt="Curso De Ingles Vaughan Basico" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Ingles Vaughan Basico</h5>
                <p class="small">Curso de ingles nivel basico con metodo Vaughan.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés básico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="96" data-name="Curso De Ingles Vaughan Basico" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Ingles%20Vaughan%20Basico%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 97 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/97.png" alt="Curso De Ingles Vaughan Intermedio" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Ingles Vaughan Intermedio</h5>
                <p class="small">Curso de ingles nivel intermedio con metodo Vaughan.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés intermedio</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="97" data-name="Curso De Ingles Vaughan Intermedio" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Ingles%20Vaughan%20Intermedio%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 98 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/98.png" alt="Curso De Ingles Vaughan Avanzado" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Ingles Vaughan Avanzado</h5>
                <p class="small">Curso de ingles nivel avanzado con metodo Vaughan.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés avanzado</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="98" data-name="Curso De Ingles Vaughan Avanzado" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Ingles%20Vaughan%20Avanzado%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 99 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/99.png" alt="Curso Manejo De La Frustracion" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Manejo De La Frustracion</h5>
                <p class="small">Tecnicas para manejar la frustracion y el estres.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Bienestar emocional</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="99" data-name="Curso Manejo De La Frustracion" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Manejo%20De%20La%20Frustracion%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 100 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/100.png" alt="Mi Primera Pagina Web" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mi Primera Pagina Web</h5>
                <p class="small">Aprende a crear tu primera pagina web desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Desarrollo web</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="100" data-name="Mi Primera Pagina Web" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mi%20Primera%20Pagina%20Web%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Curso 101 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/101.png" alt="Reparacion Y Mantenimiento De Herramientas Electricas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Reparacion Y Mantenimiento De Herramientas Electricas</h5>
                <p class="small">Aprende a reparar herramientas electricas comunes.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Reparación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="101" data-name="Reparacion Y Mantenimiento De Herramientas Electricas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Reparacion%20Y%20Mantenimiento%20De%20Herramientas%20Electricas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 102 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/102.png" alt="Especialista En Publicidad Digital" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Especialista En Publicidad Digital</h5>
                <p class="small">Curso avanzado de publicidad en redes sociales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing digital</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="102" data-name="Especialista En Publicidad Digital" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Especialista%20En%20Publicidad%20Digital%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 103 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/103.png" alt="Curso De Jardineria" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Jardineria</h5>
                <p class="small">Aprende tecnicas de jardineria y paisajismo.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Jardinería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="103" data-name="Curso De Jardineria" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Jardineria%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 104 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/104.png" alt="Curso De Adobe Suit" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Adobe Suit</h5>
                <p class="small">Domina las herramientas de Adobe para diseno grafico.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Adobe Suite</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="104" data-name="Curso De Adobe Suit" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Adobe%20Suit%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 105 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/105.png" alt="Carpinteria En Aluminio" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Carpinteria En Aluminio</h5>
                <p class="small">Tecnicas de carpinteria especializada en aluminio.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Manufactura</li>
                    <li><strong>Contenido:</strong> Carpintería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="105" data-name="Carpinteria En Aluminio" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Carpinteria%20En%20Aluminio%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 106 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/106.png" alt="Curso Completo De Instalaciones Electricas Residenciales" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Completo De Instalaciones Electricas Residenciales</h5>
                <p class="small">Aprende a instalar sistemas electricos en viviendas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Instalaciones eléctricas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="106" data-name="Curso Completo De Instalaciones Electricas Residenciales" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Completo%20De%20Instalaciones%20Electricas%20Residenciales%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 107 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/107.png" alt="Tarjetas De Credito Con Inteligencia" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Tarjetas De Credito Con Inteligencia</h5>
                <p class="small">Aprende a manejar tarjetas de credito de forma inteligente.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Finanzas personales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="107" data-name="Tarjetas De Credito Con Inteligencia" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Tarjetas%20De%20Credito%20Con%20Inteligencia%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 108 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/108.png" alt="Master Class Habla Con Poder" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Master Class Habla Con Poder</h5>
                <p class="small">Tecnicas para hablar en publico con confianza.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Oratoria</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="108" data-name="Master Class Habla Con Poder" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Master%20Class%20Habla%20Con%20Poder%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 109 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/109.png" alt="Curso De Confeccion (Crehana)" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Confeccion (Crehana)</h5>
                <p class="small">Tecnicas de costura y confeccion de ropa.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Costura</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="109" data-name="Curso De Confeccion (Crehana)" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Confeccion%20(Crehana)%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 110 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/110.png" alt="Curso De Artesania" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Artesania</h5>
                <p class="small">Aprende diversas tecnicas artesanales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Artesanías</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="110" data-name="Curso De Artesania" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Artesania%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 111 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/111.png" alt="Como Tener Mas Seguidores En Tiktok" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Tener Mas Seguidores En Tiktok</h5>
                <p class="small">Estrategias para crecer en la plataforma TikTok.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Redes sociales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="111" data-name="Como Tener Mas Seguidores En Tiktok" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Tener%20Mas%20Seguidores%20En%20Tiktok%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 112 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/112.png" alt="Presentaciones De Alto Impacto En Power Point [Udemy]" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Presentaciones De Alto Impacto En Power Point [Udemy]</h5>
                <p class="small">Crea presentaciones profesionales en PowerPoint.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> PowerPoint</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="112" data-name="Presentaciones De Alto Impacto En Power Point [Udemy]" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Presentaciones%20De%20Alto%20Impacto%20En%20Power%20Point%20[Udemy]%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 113 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/113.png" alt="Bienes Raices" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Bienes Raices</h5>
                <p class="small">Curso sobre inversion en bienes raices.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Inversiones</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="113" data-name="Bienes Raices" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Bienes%20Raices%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 114 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/114.png" alt="Curso Habla Koreano" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Habla Koreano</h5>
                <p class="small">Aprende coreano desde nivel basico.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Coreano</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="114" data-name="Curso Habla Koreano" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Habla%20Koreano%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 115 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/115.png" alt="En Mantenimiento" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>En Mantenimiento</h5>
                <p class="small">Curso actualmente en mantenimiento.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> No disponible</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="115" data-name="En Mantenimiento" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20En%20Mantenimiento%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 116 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/116.png" alt="Tiktok Ads" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Tiktok Ads</h5>
                <p class="small">Curso sobre publicidad en TikTok.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Publicidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="116" data-name="Tiktok Ads" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Tiktok%20Ads%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 117 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/117.png" alt="Cursos Musicales" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos Musicales</h5>
                <p class="small">Coleccion de cursos sobre teoria y practica musical.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Varios</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="117" data-name="Cursos Musicales" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20Musicales%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 118 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/118.png" alt="Curso Revit 2025" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Revit 2025</h5>
                <p class="small">Aprende a usar Revit para modelado BIM.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Revit</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="118" data-name="Curso Revit 2025" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Revit%202025%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 119 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/119.png" alt="Master En Publicidad" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Master En Publicidad</h5>
                <p class="small">Curso avanzado de estrategias publicitarias.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Publicidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="119" data-name="Master En Publicidad" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Master%20En%20Publicidad%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 120 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/120.png" alt="Hacking Android" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Hacking Android</h5>
                <p class="small">Tecnicas de hacking y seguridad para dispositivos Android.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Seguridad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="120" data-name="Hacking Android" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Hacking%20Android%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 121 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/121.png" alt="Hipnosis Rapida Para El Desarrollo Personal" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Hipnosis Rapida Para El Desarrollo Personal</h5>
                <p class="small">Tecnicas de hipnosis para crecimiento personal.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Hipnosis</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="121" data-name="Hipnosis Rapida Para El Desarrollo Personal" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Hipnosis%20Rapida%20Para%20El%20Desarrollo%20Personal%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 122 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/122.png" alt="Curso Melamina Y Planos 1" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Melamina Y Planos 1</h5>
                <p class="small">Tecnicas de trabajo con melamina y diseno de planos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Carpintería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="122" data-name="Curso Melamina Y Planos 1" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Melamina%20Y%20Planos%201%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 123 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/123.png" alt="Curso Melamina Y Planos 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Melamina Y Planos 2</h5>
                <p class="small">Segunda parte del curso de melamina y planos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Carpintería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="123" data-name="Curso Melamina Y Planos 2" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Melamina%20Y%20Planos%202%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 124 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/124.png" alt="47 Lecciones De Ingles" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>47 Lecciones De Ingles</h5>
                <p class="small">Curso completo de ingles con 47 lecciones.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="124" data-name="47 Lecciones De Ingles" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%2047%20Lecciones%20De%20Ingles%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 125 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/125.png" alt="Curso Melamina Y Planos 3" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Melamina Y Planos 3</h5>
                <p class="small">Tercera parte del curso de melamina y planos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Carpintería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="125" data-name="Curso Melamina Y Planos 3" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Melamina%20Y%20Planos%203%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 126 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/126.png" alt="Deep Web Y Dark Web Curso Completo" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Deep Web Y Dark Web Curso Completo</h5>
                <p class="small">Introduccion a la deep web y dark web con medidas de seguridad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> Seguridad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="126" data-name="Deep Web Y Dark Web Curso Completo" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Deep%20Web%20Y%20Dark%20Web%20Curso%20Completo%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 127 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/127.png" alt="Mecanica De Motos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Mecanica De Motos</h5>
                <p class="small">Aprende a reparar y mantener motocicletas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Ingeniería</li>
                    <li><strong>Contenido:</strong> Mecánica</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="127" data-name="Mecanica De Motos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Mecanica%20De%20Motos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 128 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/128.png" alt="Pintura De Paises Urbanos En Acuarela" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Pintura De Paises Urbanos En Acuarela</h5>
                <p class="small">Tecnicas de pintura en acuarela de paisajes urbanos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Pintura</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="128" data-name="Pintura De Paises Urbanos En Acuarela" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Pintura%20De%20Paises%20Urbanos%20En%20Acuarela%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 129 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/129.png" alt="Curso Chat GPT Sessions" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Chat GPT Sessions</h5>
                <p class="small">Aprende a usar ChatGPT para diversos propositos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Programación</li>
                    <li><strong>Contenido:</strong> IA</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="129" data-name="Curso Chat GPT Sessions" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Chat%20GPT%20Sessions%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 130 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/130.png" alt="Curso De Manejo De Herramientas Electricas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Manejo De Herramientas Electricas</h5>
                <p class="small">Aprende a usar herramientas electricas de forma segura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Herramientas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="130" data-name="Curso De Manejo De Herramientas Electricas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Manejo%20De%20Herramientas%20Electricas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 131 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/131.png" alt="Curso De Nutricion Para Ganar Masa Muscular" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Nutricion Para Ganar Masa Muscular</h5>
                <p class="small">Planificacion nutricional para aumento de masa muscular.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Nutrición</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="131" data-name="Curso De Nutricion Para Ganar Masa Muscular" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Nutricion%20Para%20Ganar%20Masa%20Muscular%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 132 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/132.png" alt="Curso De Matematica Financiera" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Matematica Financiera</h5>
                <p class="small">Fundamentos de matematicas aplicadas a las finanzas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Finanzas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="132" data-name="Curso De Matematica Financiera" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Matematica%20Financiera%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 133 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/133.png" alt="Curso De Inmobiliario Facil" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Inmobiliario Facil</h5>
                <p class="small">Aprende los fundamentos del negocio inmobiliario de forma sencilla.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Bienes raíces</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="133" data-name="Curso De Inmobiliario Facil" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Inmobiliario%20Facil%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 134 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/134.png" alt="Curso De Finanzas En 20S" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Finanzas En 20S</h5>
                <p class="small">Domina las finanzas personales en solo 20 sesiones.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Finanzas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="134" data-name="Curso De Finanzas En 20S" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Finanzas%20En%2020S%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 135 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/135.png" alt="Curso De Reparacion De Play 3, Play4, Xbox" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Reparacion De Play 3, Play4, Xbox</h5>
                <p class="small">Aprende a reparar consolas de videojuegos populares.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Reparación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="135" data-name="Curso De Reparacion De Play 3, Play4, Xbox" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Reparacion%20De%20Play%203,%20Play4,%20Xbox%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 136 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/136.png" alt="Curso De Recortes Digital Para Fotografos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Recortes Digital Para Fotografos</h5>
                <p class="small">Tecnicas profesionales de recorte digital para fotografos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Fotografía</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="136" data-name="Curso De Recortes Digital Para Fotografos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Recortes%20Digital%20Para%20Fotografos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 137 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/137.png" alt="Curso De Implementacion De La Marca" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Implementacion De La Marca</h5>
                <p class="small">Estrategias efectivas para implementar tu marca personal o empresarial.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Branding</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="137" data-name="Curso De Implementacion De La Marca" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Implementacion%20De%20La%20Marca%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 138 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/138.png" alt="Curso De Diseno Grafico En Canva" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Diseno Grafico En Canva</h5>
                <p class="small">Domina el diseno grafico utilizando la plataforma Canva.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Canva</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="138" data-name="Curso De Diseno Grafico En Canva" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Diseno%20Grafico%20En%20Canva%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 139 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/4dee3cfc92b3571b58eab75a4c875f9dfef57125/139.png" alt="Como Mejorar El Comportamiento De Tus Hijos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Mejorar El Comportamiento De Tus Hijos</h5>
                <p class="small">Estrategias efectivas para la educacion y manejo del comportamiento infantil.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Educación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="139" data-name="Como Mejorar El Comportamiento De Tus Hijos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Mejorar%20El%20Comportamiento%20De%20Tus%20Hijos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 140 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/4dee3cfc92b3571b58eab75a4c875f9dfef57125/140.png" alt="Curso De Barista Training Online" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Barista Training Online</h5>
                <p class="small">Conviertete en un experto barista con este curso completo en linea.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Barismo</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="140" data-name="Curso De Barista Training Online" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Barista%20Training%20Online%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 141 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/141.png" alt="Curso De Culturismo Sin Fronteras" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Culturismo Sin Fronteras</h5>
                <p class="small">Entrenamiento completo de culturismo para todos los niveles.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Salud</li>
                    <li><strong>Contenido:</strong> Culturismo</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="141" data-name="Curso De Culturismo Sin Fronteras" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Culturismo%20Sin%20Fronteras%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 142 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/142.png" alt="Curso De Barbershop-Hotmart" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Barbershop-Hotmart</h5>
                <p class="small">Aprende tecnicas profesionales de barberia.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Barbería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="142" data-name="Curso De Barbershop-Hotmart" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Barbershop-Hotmart%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 143 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/143.png" alt="Curso De Aprende Ingles Dialogando" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Aprende Ingles Dialogando</h5>
                <p class="small">Metodo innovador para aprender ingles a traves de dialogos practicos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="143" data-name="Curso De Aprende Ingles Dialogando" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Aprende%20Ingles%20Dialogando%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 144 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/144.png" alt="Curso De Finanzas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Finanzas</h5>
                <p class="small">Domina los conceptos financieros esenciales para tu vida personal y profesional.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Finanzas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="144" data-name="Curso De Finanzas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Finanzas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 145 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/145.png" alt="Curso Javascript ES9, HTML, CSS3 Y Nodejs Desde Cero" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Javascript ES9, HTML, CSS3 Y Nodejs Desde Cero</h5>
                <p class="small">Aprende desarrollo web completo con las ultimas tecnologias.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Desarrollo web</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="145" data-name="Curso Javascript ES9, HTML, CSS3 Y Nodejs Desde Cero" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Javascript%20ES9,%20HTML,%20CSS3%20Y%20Nodejs%20Desde%20Cero%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 146 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/146.png" alt="Curso De Creacion De Punto De Venta" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Creacion De Punto De Venta</h5>
                <p class="small">Aprende a crear y gestionar un punto de venta efectivo.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Ventas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="146" data-name="Curso De Creacion De Punto De Venta" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Creacion%20De%20Punto%20De%20Venta%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 147 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/147.png" alt="Curso De E-Commerce" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De E-Commerce</h5>
                <p class="small">Domina el comercio electronico y aumenta tus ventas en linea.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> E-commerce</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="147" data-name="Curso De E-Commerce" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20E-Commerce%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 148 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/148.png" alt="Curso Social Media Marketing Y Estrategia Digital" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Social Media Marketing Y Estrategia Digital</h5>
                <p class="small">Estrategias avanzadas de marketing en redes sociales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing digital</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="148" data-name="Curso Social Media Marketing Y Estrategia Digital" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Social%20Media%20Marketing%20Y%20Estrategia%20Digital%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 152 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/152.png" alt="Tecnico En Redes De Seguridad" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Tecnico En Redes De Seguridad</h5>
                <p class="small">Conviertete en experto en redes y seguridad informatica.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Seguridad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="152" data-name="Tecnico En Redes De Seguridad" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Tecnico%20En%20Redes%20De%20Seguridad%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 153 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/153.png" alt="Vender O Morir" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Vender O Morir</h5>
                <p class="small">Estrategias radicales para aumentar tus ventas exponencialmente.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Ventas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="153" data-name="Vender O Morir" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Vender%20O%20Morir%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 155 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/155.png" alt="Como Ganar En Criptomonedas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Como Ganar En Criptomonedas</h5>
                <p class="small">Aprende a invertir y ganar con criptomonedas de forma segura.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Criptomonedas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="155" data-name="Como Ganar En Criptomonedas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Como%20Ganar%20En%20Criptomonedas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Curso 156 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/156.png" alt="Curso De Marketing Digital Completo (2024)" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Marketing Digital Completo (2024)</h5>
                <p class="small">El curso mas completo de marketing digital actualizado para 2024.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing Digital</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="156" data-name="Curso De Marketing Digital Completo (2024)" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Marketing%20Digital%20Completo%20(2024)%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 157 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/157.png" alt="Curso Basico De Amigurumis" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Basico De Amigurumis</h5>
                <p class="small">Aprende a crear adorables amigurumis (munecos tejidos) desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Tejido</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="157" data-name="Curso Basico De Amigurumis" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Basico%20De%20Amigurumis%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 159 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/159.png" alt="Curso De Cultivos De Hongos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Cultivos De Hongos</h5>
                <p class="small">Aprende las tecnicas para cultivar hongos comestibles en casa.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Cultivos</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="159" data-name="Curso De Cultivos De Hongos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Cultivos%20De%20Hongos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 160 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/160.png" alt="Cursos De Bellas Artes" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos De Bellas Artes</h5>
                <p class="small">Coleccion completa de cursos de bellas artes y tecnicas artisticas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Arte</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="160" data-name="Cursos De Bellas Artes" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20De%20Bellas%20Artes%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 162 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/162.png" alt="Curso Decoracion De Globos" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Decoracion De Globos</h5>
                <p class="small">Aprende tecnicas profesionales para decoracion con globos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Decoración</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="162" data-name="Curso Decoracion De Globos" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Decoracion%20De%20Globos%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 163 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/163.png" alt="Ingles You Talk Tv" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Ingles You Talk Tv</h5>
                <p class="small">Curso completo de ingles con el metodo You Talk TV.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Inglés</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="163" data-name="Ingles You Talk Tv" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Ingles%20You%20Talk%20Tv%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 164 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/164.png" alt="Copywriting Como Escribir Para Aprender Mas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Copywriting Como Escribir Para Aprender Mas</h5>
                <p class="small">Domina el arte del copywriting para vender mas con tus textos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Redacción</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="164" data-name="Copywriting Como Escribir Para Aprender Mas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Copywriting%20Como%20Escribir%20Para%20Aprender%20Mas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 166 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/166.png" alt="Curso De Illustrator" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Illustrator</h5>
                <p class="small">Aprende Adobe Illustrator desde cero hasta nivel avanzado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Diseño Gráfico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="166" data-name="Curso De Illustrator" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Illustrator%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 167 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/167.png" alt="Curso De Git Y Github" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Git Y Github</h5>
                <p class="small">Aprende el sistema de control de versiones Git y la plataforma GitHub.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Programación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="167" data-name="Curso De Git Y Github" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Git%20Y%20Github%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 168 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/168.png" alt="Git Y Github De Brais Moure" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Git Y Github De Brais Moure</h5>
                <p class="small">Curso completo de Git y GitHub por el experto Brais Moure.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Programación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="168" data-name="Git Y Github De Brais Moure" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Git%20Y%20Github%20De%20Brais%20Moure%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 172 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/172.png" alt="Maestros Leds (Terabox)" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Maestros Leds (Terabox)</h5>
                <p class="small">Curso completo sobre instalacion y mantenimiento de sistemas LED.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Instalación LED</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="172" data-name="Maestros Leds (Terabox)" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Maestros%20Leds%20(Terabox)%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 173 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/173.png" alt="Domina Las Matematicas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Domina Las Matematicas</h5>
                <p class="small">Curso completo para dominar las matematicas desde basico hasta avanzado.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Matemáticas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="173" data-name="Domina Las Matematicas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Domina%20Las%20Matematicas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 175 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/175.png" alt="Curso De Panaderia" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Panaderia</h5>
                <p class="small">Aprende las tecnicas profesionales de panaderia artesanal.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Repostería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="175" data-name="Curso De Panaderia" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Panaderia%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 176 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/176.png" alt="Cursos De Idiomas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Cursos De Idiomas</h5>
                <p class="small">Coleccion de cursos para aprender diferentes idiomas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Idiomas</li>
                    <li><strong>Contenido:</strong> Varios idiomas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="176" data-name="Cursos De Idiomas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Cursos%20De%20Idiomas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 181 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/181.png" alt="Microsoldadura" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Microsoldadura</h5>
                <p class="small">Tecnicas profesionales de microsoldadura para reparacion de dispositivos electronicos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Reparación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="181" data-name="Microsoldadura" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Microsoldadura%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 182 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/182.png" alt="Curso De Electronica Fundamentos De Electricidad Y Electronica" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Electronica Fundamentos De Electricidad Y Electronica</h5>
                <p class="small">Aprende los fundamentos de electricidad y electronica desde cero.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Electrónica</li>
                    <li><strong>Contenido:</strong> Electricidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="182" data-name="Curso De Electronica Fundamentos De Electricidad Y Electronica" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Electronica%20Fundamentos%20De%20Electricidad%20Y%20Electronica%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 183 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/183.png" alt="Curso Diseno Sismico De Losas Y Vigas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Diseno Sismico De Losas Y Vigas</h5>
                <p class="small">Especializacion en diseno sismico de elementos estructurales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Ingeniería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="183" data-name="Curso Diseno Sismico De Losas Y Vigas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Diseno%20Sismico%20De%20Losas%20Y%20Vigas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 184 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/184.png" alt="Curso De Facebook Ads" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Facebook Ads</h5>
                <p class="small">Domina la publicidad en Facebook para potenciar tu negocio.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Publicidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="184" data-name="Curso De Facebook Ads" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Facebook%20Ads%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 185 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/185.png" alt="Curso Practico De Chat GPT" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Practico De Chat GPT</h5>
                <p class="small">Aprende a utilizar ChatGPT de manera practica para productividad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Inteligencia Artificial</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="185" data-name="Curso Practico De Chat GPT" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Practico%20De%20Chat%20GPT%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 188 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/188.png" alt="Curso De Community Manager Completo" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Community Manager Completo</h5>
                <p class="small">Conviertete en un experto Community Manager con este curso completo.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Redes Sociales</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="188" data-name="Curso De Community Manager Completo" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Community%20Manager%20Completo%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 189 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/189.png" alt="Curso De Mercado De Valores" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Mercado De Valores</h5>
                <p class="small">Aprende a invertir en la bolsa de valores de manera inteligente.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Inversiones</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="189" data-name="Curso De Mercado De Valores" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Mercado%20De%20Valores%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 190 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/190.png" alt="Curso De Cerveza Artesanal" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Cerveza Artesanal</h5>
                <p class="small">Aprende a elaborar cerveza artesanal de calidad profesional.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Cervecería</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="190" data-name="Curso De Cerveza Artesanal" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Cerveza%20Artesanal%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 192 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/192.png" alt="Curso Express" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Express</h5>
                <p class="small">Coleccion de cursos rapidos sobre diversos temas practicos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Varios temas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="192" data-name="Curso Express" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Express%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 193 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/193.png" alt="Curso De Yoga" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Yoga</h5>
                <p class="small">Aprende yoga desde cero y mejora tu salud fisica y mental.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Salud</li>
                    <li><strong>Contenido:</strong> Ejercicio</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="193" data-name="Curso De Yoga" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Yoga%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 194 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/194.png" alt="Curso Completo De Elaboracion De Tesis" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Completo De Elaboracion De Tesis</h5>
                <p class="small">Guia completa para la elaboracion de tesis academicas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Académico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="194" data-name="Curso Completo De Elaboracion De Tesis" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Completo%20De%20Elaboracion%20De%20Tesis%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 195 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/195.png" alt="Curso Completo De Office 2021" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Completo De Office 2021</h5>
                <p class="small">Domina todas las herramientas de Microsoft Office 2021.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Ofimática</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="195" data-name="Curso Completo De Office 2021" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Completo%20De%20Office%202021%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 196 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/196.png" alt="Curso De E-Commerce Con Paypal" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De E-Commerce Con Paypal</h5>
                <p class="small">Aprende a configurar y gestionar un e-commerce con PayPal.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Comercio electrónico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="196" data-name="Curso De E-Commerce Con Paypal" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20E-Commerce%20Con%20Paypal%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 197 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/197.png" alt="Curso 'Aprende A Cantar'" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso 'Aprende A Cantar'</h5>
                <p class="small">Tecnicas vocales para aprender a cantar correctamente.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Canto</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="197" data-name="Curso 'Aprende A Cantar'" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20'Aprende%20A%20Cantar'%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 198 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/198.png" alt="Curso De Trading 2" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso De Trading 2</h5>
                <p class="small">Segunda parte del curso avanzado de trading en mercados financieros.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Inversiones</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="198" data-name="Curso De Trading 2" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20De%20Trading%202%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 199 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/199.png" alt="Tecnicas Para Entrenar Tu Creatividad" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Tecnicas Para Entrenar Tu Creatividad</h5>
                <p class="small">Ejercicios y metodos para desarrollar y potenciar tu creatividad.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Creatividad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="199" data-name="Tecnicas Para Entrenar Tu Creatividad" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Tecnicas%20Para%20Entrenar%20Tu%20Creatividad%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 201 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/201.png" alt="Pémark Marketing" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Pémark Marketing</h5>
                <p class="small">Estrategias innovadoras de marketing para el siglo XXI.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="201" data-name="Pémark Marketing" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Pémark%20Marketing%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 202 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/202.png" alt="Lenguaje De Señas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Lenguaje De Señas</h5>
                <p class="small">Aprende lenguaje de señas para comunicacion inclusiva.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Comunicación</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="202" data-name="Lenguaje De Señas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Lenguaje%20De%20Señas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 203 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/203.png" alt="Curso Amazon FBA" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Amazon FBA</h5>
                <p class="small">Guia completa para vender en Amazon con el sistema FBA.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Comercio electrónico</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="203" data-name="Curso Amazon FBA" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Amazon%20FBA%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 204 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/204.png" alt="Curso 'Creacion De Lamparas Con Origami De Papel'" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso 'Creacion De Lamparas Con Origami De Papel'</h5>
                <p class="small">Aprende a crear lamparas decorativas con la tecnica de origami.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Hogar</li>
                    <li><strong>Contenido:</strong> Manualidades</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="204" data-name="Curso 'Creacion De Lamparas Con Origami De Papel'" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20'Creacion%20De%20Lamparas%20Con%20Origami%20De%20Papel'%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 205 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/205.png" alt="Curso 'Como Hacer Un Podcast'" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso 'Como Hacer Un Podcast'</h5>
                <p class="small">Guia completa para crear, grabar y publicar tu propio podcast.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Tecnología</li>
                    <li><strong>Contenido:</strong> Producción de audio</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="205" data-name="Curso 'Como Hacer Un Podcast'" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20'Como%20Hacer%20Un%20Podcast'%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 206 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/206.png" alt="Curso 'Creacion De Libros Pop-Up'" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso 'Creacion De Libros Pop-Up'</h5>
                <p class="small">Aprende a diseñar y crear libros pop-up tridimensionales.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Diseño</li>
                    <li><strong>Contenido:</strong> Manualidades</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="206" data-name="Curso 'Creacion De Libros Pop-Up'" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20'Creacion%20De%20Libros%20Pop-Up'%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 207 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/207.png" alt="Curso Afiliado Master" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Afiliado Master</h5>
                <p class="small">Conviertete en un afiliado exitoso y genera ingresos pasivos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Marketing de afiliados</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="207" data-name="Curso Afiliado Master" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Afiliado%20Master%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 208 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/208.png" alt="Curso Diseno De Negocios- Domestika" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Diseno De Negocios- Domestika</h5>
                <p class="small">Aprende a diseñar modelos de negocio exitosos.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Emprendimiento</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="208" data-name="Curso Diseno De Negocios- Domestika" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Diseno%20De%20Negocios-%20Domestika%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 209 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/209.png" alt="Curso Manejo De Las Emociones" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Manejo De Las Emociones</h5>
                <p class="small">Tecnicas para reconocer y gestionar eficazmente tus emociones.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Desarrollo Personal</li>
                    <li><strong>Contenido:</strong> Inteligencia emocional</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="209" data-name="Curso Manejo De Las Emociones" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Manejo%20De%20Las%20Emociones%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 210 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/210.png" alt="Curso Como Vender Mas Con Whatsapp 2025" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Como Vender Mas Con Whatsapp 2025</h5>
                <p class="small">Estrategias actualizadas para vender mas usando WhatsApp Business.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Ventas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="210" data-name="Curso Como Vender Mas Con Whatsapp 2025" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Como%20Vender%20Mas%20Con%20Whatsapp%202025%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 211 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/211.png" alt="Curso Formula De Ventas Ilimitadas" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Formula De Ventas Ilimitadas</h5>
                <p class="small">Metodo probado para multiplicar tus ventas exponencialmente.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Ventas</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="211" data-name="Curso Formula De Ventas Ilimitadas" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Formula%20De%20Ventas%20Ilimitadas%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 212 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/212.png" alt="Segundo Curso de Contabilidad" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Segundo Curso de Contabilidad</h5>
                <p class="small">Nivel intermedio-avanzado de contabilidad financiera.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Negocios</li>
                    <li><strong>Contenido:</strong> Contabilidad</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="212" data-name="Segundo Curso de Contabilidad" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Segundo%20Curso%20de%20Contabilidad%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Curso 213 -->
<div class="col-md-6">
    <div class="card tool-card p-3">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="product-images">
                    <img src="https://github.com/emiversal/pages/raw/b37a8ff3b8550ab6fa78f7f690d9385a8f59490f/213.png" alt="Curso Tocando Guitarra" class="img-fluid rounded mb-2">
                </div>
            </div>
            <div class="col-md-8">
                <h5>Curso Tocando Guitarra</h5>
                <p class="small">Aprende a tocar guitarra desde cero con lecciones practicas.</p>
                <ul class="small">
                    <li><strong>Categoría:</strong> Música</li>
                    <li><strong>Contenido:</strong> Guitarra</li>
                </ul>
                <p class="product-price fw-bold mt-2">$49.70 MXN</p>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm add-to-cart" data-type="product" data-id="213" data-name="Curso Tocando Guitarra" data-price="49.70">Agregar al carrito</button>
                    <a href="https://wa.me/525625377747?text=Hola,%20estoy%20interesado%20en%20el%20curso:%20Curso%20Tocando%20Guitarra%20(49.70%20MXN)%20de%20EmilioColor®" class="btn btn-success-gradient btn-sm" target="_blank">Comprar ahora</a>
                </div>
            </div>
        </div>
    </div>
</div>
                </div>
            </div>
        </div>
    `;
    
    cursosCargados = true;
    
    // Inicializar la funcionalidad de búsqueda y filtros
    setTimeout(initCourseSearch, 100);
}

// Función para inicializar la búsqueda y filtros de cursos
function initCourseSearch() {
    const courseSearch = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearSearch = document.getElementById('clearSearch');
    const searchResultsCount = document.getElementById('searchResultsCount');
    
    if (!courseSearch || !categoryFilter) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }
    
    function filterCourses() {
        const searchTerm = courseSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const courseCards = document.querySelectorAll('#cursos-container .col-md-6');
        let visibleCount = 0;
        
        courseCards.forEach(card => {
            const title = card.querySelector('h5').textContent.toLowerCase();
            const description = card.querySelector('p.small').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const categoryText = card.querySelector('li:first-child').textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || 
                                title.includes(searchTerm) || 
                                description.includes(searchTerm) ||
                                categoryText.includes(searchTerm);
            
            const matchesCategory = !selectedCategory || category === selectedCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar contador de resultados
        if (searchResultsCount) {
            searchResultsCount.textContent = `${visibleCount} cursos encontrados`;
            
            if (searchTerm || selectedCategory) {
                searchResultsCount.innerHTML += ` 
                    <button class="btn btn-outline-secondary btn-sm ms-2" onclick="clearFilters()">
                        <i class="fas fa-times"></i> Limpiar filtros
                    </button>
                `;
            }
        }
        
        // Mostrar/ocultar secciones basado en si tienen cursos visibles
        const sections = document.querySelectorAll('#cursos-container > div.mt-5, #cursos-container > div.mb-5');
        sections.forEach(section => {
            const visibleCoursesInSection = section.querySelectorAll('.col-md-6[style="display: block"]').length;
            if (visibleCoursesInSection > 0) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }
    
    // Event listeners
    courseSearch.addEventListener('input', filterCourses);
    categoryFilter.addEventListener('change', filterCourses);
    
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            courseSearch.value = '';
            filterCourses();
        });
    }
    
    // Función para limpiar todos los filtros
    window.clearFilters = function() {
        courseSearch.value = '';
        categoryFilter.value = '';
        filterCourses();
    };
    
    // Aplicar filtro inicial si hay parámetros en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('categoria');
    if (categoryParam && categoryFilter.querySelector(`option[value="${categoryParam}"]`)) {
        categoryFilter.value = categoryParam;
        filterCourses();
    }
}

// Función para inicializar la búsqueda de cursos
function initCourseSearch() {
    const courseSearch = document.getElementById('courseSearch');
    const clearSearch = document.getElementById('clearSearch');
    const searchResultsCount = document.getElementById('searchResultsCount');
    const courseCards = document.querySelectorAll('#educacion-section .tool-card');
    
    if (!courseSearch || !clearSearch || !searchResultsCount || courseCards.length === 0) {
        console.log("Elementos de búsqueda no encontrados, reintentando...");
        setTimeout(initCourseSearch, 100);
        return;
    }
    
    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    
    const searchCourses = () => {
        const searchTerm = normalizeText(courseSearch.value);
        let visibleCount = 0;
        
        courseCards.forEach(card => {
            const title = normalizeText(card.querySelector('h5').textContent);
            const description = normalizeText(card.querySelector('p.small').textContent);
            const category = normalizeText(card.querySelector('ul.small li:first-child').textContent);
            
            if (searchTerm === '' || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (searchTerm === '') {
            searchResultsCount.textContent = `Mostrando todos los ${visibleCount} cursos`;
        } else {
            searchResultsCount.textContent = `${visibleCount} cursos encontrados`;
        }
    };
    
    courseSearch.addEventListener('input', searchCourses);
    clearSearch.addEventListener('click', () => {
        courseSearch.value = '';
        searchCourses();
        courseSearch.focus();
    });
    
    searchResultsCount.textContent = `Mostrando todos los ${courseCards.length} cursos`;
}

// Manejador de eventos para el carrito
function dynamicCartHandler(e) {
    if (e.target.matches('.add-to-cart, .add-to-cart *')) {
        const button = e.target.closest('.add-to-cart');
        if (button) {
            const type = button.getAttribute('data-type');
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            
            if (type === 'product') {
                cart.addProduct({ id, name, price });
            } else if (type === 'service') {
                cart.addService({ id, name, price });
            }
        }
    }
    
    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
        const type = button.getAttribute('data-type');
        const id = button.getAttribute('data-id');
        
        cart.removeItem(type, id);
    }
    
    if (e.target.classList.contains('cart-tab')) {
        const tabId = e.target.getAttribute('data-tab');
        
        document.querySelectorAll('.cart-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('btn-primary');
            tab.classList.add('btn-outline-primary');
        });
        
        e.target.classList.add('active');
        e.target.classList.remove('btn-outline-primary');
        e.target.classList.add('btn-primary');
        
        document.querySelectorAll('.cart-items').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    sectionManager.init();
    cart.loadFromStorage();
    
    // Usar el manejador de eventos para el carrito
    document.addEventListener('click', dynamicCartHandler);
    
    document.getElementById('generate-pdf').addEventListener('click', function() {
        const total = parseFloat(cart.getTotal());
        if (total > 0) {
            cart.generatePDF();
        } else {
            alert('El carrito está vacío');
        }
    });

    // Modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Menú móvil
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarContent = document.getElementById('sidebarContent');
    if (sidebarToggle && sidebarContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebarContent.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Cargar la sección de cursos si ya estamos en ella al cargar la página
    if (window.location.hash === '#educacion') {
        loadCursosSection();
    }
});
// Función para generar la cotización general de todos los cursos
function generateGeneralQuotation() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(26, 86, 219);
    doc.text('EmilioColor - Cotización General de Cursos', 105, 20, { align: 'center' });
    
    // Fecha
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const date = new Date();
    doc.text(`Fecha: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 105, 30, { align: 'center' });
    
    let y = 50;
    
    // Resumen de cursos por sección
    doc.setFontSize(16);
    doc.text('Resumen de Cursos por Sección', 14, y);
    y += 15;
    
    const sectionHeaders = [['Sección', 'Cantidad de Cursos', 'Valor Total']];
    const sectionData = [
        ['Mega Packs (Sección 1/3)', '18', '$1,258.20 MXN'],
        ['Cursos Destacados (Sección 2/3)', '37', '$2,212.60 MXN'],
        ['Colección Completa (Sección 3/3)', '153', '$7,604.10 MXN'],
        ['TOTAL GENERAL', '208', '$11,074.90 MXN']
    ];
    
    doc.autoTable({
        startY: y,
        head: sectionHeaders,
        body: sectionData,
        theme: 'grid',
        headStyles: { fillColor: [26, 86, 219], textColor: [255, 255, 255] },
        footStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255] },
        foot: [['', 'TOTAL GENERAL', '$11,074.90 MXN']]
    });
    
    y = doc.lastAutoTable.finalY + 15;
    
    // Información de contacto
    doc.setFontSize(16);
    doc.setTextColor(26, 86, 219);
    doc.text('Para concluir su compra:', 14, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('• Contacte por WhatsApp: 56-2537-7747', 14, y);
    y += 7;
    doc.text('• O envíe un correo a: emiliocolormexico@gmail.com', 14, y);
    y += 15;
    
    // Nota importante
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text('NOTA IMPORTANTE:', 14, y);
    y += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const instrucciones = [
        'Esta cotización incluye acceso a TODOS los cursos disponibles en el catálogo.',
        'Al contactarnos, mencione que está interesado en la "COTIZACIÓN GENERAL"',
        'y adjunte este PDF para agilizar el proceso de compra.',
        'Le proporcionaremos instrucciones para el pago y entrega de los cursos.'
    ];
    
    instrucciones.forEach(line => {
        doc.text(line, 14, y);
        y += 6;
    });
    
    // Guardar el PDF
    doc.save(`EmilioColor_Cotizacion_General_${date.getTime()}.pdf`);
}

// Agregar el botón de cotización general a la sección de cursos
function addGeneralQuotationButton() {
    // Buscar el contenedor de la sección de cursos
    const cursosContainer = document.getElementById('educacion-section');
    if (!cursosContainer) return;
    
    // Buscar el primer contenedor rounded-container
    const roundedContainer = cursosContainer.querySelector('.rounded-container');
    if (!roundedContainer) return;
    
    // Crear el botón de cotización general
    const quotationButton = document.createElement('button');
    quotationButton.className = 'btn btn-warning mb-4';
    quotationButton.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Cotización General de Todos los Cursos';
    quotationButton.onclick = generateGeneralQuotation;
    
    // Insertar el botón después del título de la sección
    const sectionTitle = roundedContainer.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.parentNode.insertBefore(quotationButton, sectionTitle.nextSibling);
    } else {
        // Si no encuentra el título, insertar al principio del contenedor
        roundedContainer.insertBefore(quotationButton, roundedContainer.firstChild);
    }
}