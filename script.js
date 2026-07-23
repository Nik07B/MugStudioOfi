/* =========================================
   1. CONFIGURACIÓN DE FIREBASE (TU PROYECTO REAL)
   ========================================= */
const firebaseConfig = {
    apiKey: "AIzaSyA8i8ab4XUNjlSlsTiKul8MkKL-LhektyQ",
    authDomain: "mugstudio-277f7.firebaseapp.com",
    projectId: "mugstudio-277f7",
    storageBucket: "mugstudio-277f7.firebasestorage.app",
    messagingSenderId: "1:416057837858:web:5f0fd759b1a6b94b03bd7b",
    appId: "G-FLJGCR1RCG"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

/* =========================================
   2. SELECCIÓN DE ELEMENTOS DEL DOM
   ========================================= */
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const modal = document.getElementById('modalAuth');
const openLoginBtn = document.getElementById('openLogin');
const closeLoginBtn = document.getElementById('closeModal');
const authForm = document.getElementById('authForm');
const toggleAuthBtn = document.getElementById('toggleAuth');
const modalTitle = document.getElementById('modalTitle');
const nameGroup = document.getElementById('nameGroup');
const backToTopBtn = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');
const menuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const loader = document.getElementById('loader');
const progressBar = document.getElementById("progress-bar");
const repeatPasswordGroup = document.getElementById('repeatPasswordGroup');
const passInput = document.getElementById('register-password');
const repeatPassInput = document.getElementById('repeat-password');

let isLogin = true; 

/* =========================================
   3. MODO OSCURO / NOCHE
   ========================================= */
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        if (isDark) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

/* =========================================
   4. SISTEMA DE USUARIOS (FIREBASE REAL)
   ========================================= */
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = authForm.querySelector('input[type="email"]').value;
        const password = passInput.value;
        const repeatPassword = repeatPassInput.value;

        if (isLogin) {
            // --- LOGIN ---
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Si el usuario entra pero no está verificado, le avisamos
                    if (!userCredential.user.emailVerified) {
                        alert("Recuerda verificar tu correo electrónico para poder realizar pedidos.");
                    }
                    modal.style.display = 'none';
                    authForm.reset();
                })
                .catch(err => alert("Error al entrar: " + err.message));
        } else {
            // --- REGISTRO ---
            // 1. Validar que las contraseñas coincidan
            if (password !== repeatPassword) {
                alert("¡Las contraseñas no coinciden! Por favor, verifícalas.");
                return;
            }

            // 2. Crear el usuario en Firebase
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // 3. Enviar el correo de verificación inmediatamente
                    userCredential.user.sendEmailVerification().then(() => {
                        alert("¡Cuenta creada con éxito! Te enviamos un correo de verificación a " + email + ". Debes confirmar tu cuenta para poder realizar pedidos.");
                        
                        // 4. Cerrar sesión y limpiar
                        auth.signOut(); 
                        modal.style.display = 'none';
                        authForm.reset();
                    });
                })
                .catch(err => alert("Error al registrar: " + err.message));
        }
    });
}

// Observador de sesión para proteger el configurador
auth.onAuthStateChanged((user) => {
    const authMsg = document.getElementById('auth-required-msg');
    const orderForm = document.getElementById('order-form-container');
    
    if (user) {
        // CASO 1: El usuario está logueado... ¿Pero verificó su mail?
        if (user.emailVerified) {
            // SÍ está verificado: Mostramos el formulario de pedido
            if (authMsg) authMsg.style.display = 'none';
            if (orderForm) orderForm.style.display = 'block';
            if (openLoginBtn) {
                openLoginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Salir';
                openLoginBtn.onclick = () => auth.signOut();
            }
        } else {
            // NO está verificado: Mostramos mensaje con botón de REENVIAR
            if (authMsg) {
                authMsg.style.display = 'block';
                authMsg.innerHTML = `
                    <i class="fas fa-envelope-open-text" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 15px;"></i>
                    <h3 style="font-size: 1.3rem; margin-bottom: 10px;">Verifica tu Email</h3>
                    <p style="font-size: 0.95rem; margin-bottom: 20px; opacity: 0.8;">Enviamos un enlace a <b>${user.email}</b></p>
                    
                    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                        <!-- AÑADIMOS LA CLASE btn-secundario AQUÍ -->
                        <button onclick="resendVerification()" class="btn-mini" style="background-color: #2ecc71;">
                            <i class="fas fa-sync-alt"></i> Reenviar Correo
                        </button>
            
                        <!-- AÑADIMOS LA CLASE btn-secundario AQUÍ -->
                        <button onclick="auth.signOut()" class="btn-mini" style="background-color: #e74c3c;">
                            Cerrar Sesión
                        </button>
                    </div>
                `;
            }
            if (orderForm) orderForm.style.display = 'none';
            if (openLoginBtn) {
                openLoginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Salir';
                openLoginBtn.onclick = () => auth.signOut();
            }
        }
    } else {
        // CASO 2: El usuario no está logueado
        if (authMsg) {
            authMsg.style.display = 'block';
            authMsg.innerHTML = `
                <i class="fas fa-lock"></i>
                <h3>Contenido Protegido</h3>
                <p>Debes iniciar sesión para pedir tu taza.</p>
                <button onclick="modal.style.display='flex'" class="cta-button">Ingresar / Registrarme</button>
            `;
        }
        if (orderForm) orderForm.style.display = 'none';
        if (openLoginBtn) {
            openLoginBtn.innerHTML = 'Ingresar';
            openLoginBtn.onclick = () => { modal.style.display = 'flex'; };
        }
    }
});

/* =========================================
   5. CONFIGURADOR DE PRECIOS Y WHATSAPP
   ========================================= */
function actualizarTotal() {
    const select = document.getElementById('tipo-taza');
    const cantidadInput = document.getElementById('cantidad-tazas');
    const totalDisplay = document.getElementById('precio-total');

    if (select && cantidadInput && totalDisplay) {
        const precioUnitario = select.options[select.selectedIndex].getAttribute('data-precio');
        const cantidad = cantidadInput.value;
        const total = precioUnitario * cantidad;
        totalDisplay.innerText = `$${total.toLocaleString('es-AR')}`;
    }
}

function enviarPedido() {
    const tipo = document.getElementById('tipo-taza').value;
    const cantidad = document.getElementById('cantidad-tazas').value;
    const ubicacion = document.getElementById('ubicacion-cliente').value;
    const pago = document.getElementById('metodo-pago').value;
    const detalle = document.getElementById('detalle-diseno').value;
    const total = document.getElementById('precio-total').innerText;
    
    const miNumero = "541130872609"; 

    if (!ubicacion || !detalle) {
        alert("Por favor completa tu ubicación y el detalle del diseño.");
        return;
    }

    // DISEÑO DEL MENSAJE PROFESIONAL
    const mensaje = encodeURIComponent(
`*MUGSTUDIO - NUEVO PEDIDO*
---------------------------------------

*DETALLES DEL PRODUCTO*
• *Material:* ${tipo}
• *Cantidad:* ${cantidad} unidad/es

*DISEÑO PERSONALIZADO*
"${detalle}"

*DATOS DE ENTREGA*
• *Ubicación:* ${ubicacion}

*MÉTODO DE PAGO*
• ${pago}

---------------------------------------
  *TOTAL ESTIMADO: ${total}*
---------------------------------------

¡Hola! Vi tu página web y quiero confirmar este pedido. ¿Cómo seguimos?`
    );

    window.open(`https://wa.me/${miNumero}?text=${mensaje}`, '_blank');
}

/* =========================================
   6. INTERACCIONES DE INTERFAZ
   ========================================= */

// Modal Abrir/Cerrar/Toggle
if (closeLoginBtn) closeLoginBtn.onclick = () => modal.style.display = 'none';

if (toggleAuthBtn) {
    toggleAuthBtn.onclick = (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        
        // Título y visibilidad del nombre
        modalTitle.innerText = isLogin ? "Iniciar Sesión" : "Crear Cuenta";
        nameGroup.style.display = isLogin ? "none" : "block";

        // --- REPETIR CONTRASEÑA ---
        if (repeatPasswordGroup) {
            repeatPasswordGroup.style.display = isLogin ? "none" : "block";
        }
        if (repeatPassInput) {
            repeatPassInput.required = !isLogin; 
        }

        // --- OCULTAR/MOSTRAR "OLVIDÉ MI CONTRASEÑA" ---
        const forgotGroup = document.getElementById('forgotPasswordGroup');
        if (forgotGroup) {
            // Si es login se muestra (block), si es registro se oculta (none)
            forgotGroup.style.display = isLogin ? "block" : "none";
        }

        toggleAuthBtn.innerText = isLogin ? "Regístrate aquí" : "Ya tengo cuenta";
    };
}


// Menú Móvil
if (menuBtn) {
    menuBtn.onclick = () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    };
}

// Scroll: Navbar, Botón Arriba, Barra de Progreso
window.onscroll = function() {
    // Barra de progreso
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }

    // Navbar Dinámica
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Botón Volver Arriba
    if (window.scrollY > 400) {
        if (backToTopBtn) backToTopBtn.classList.add('show');
    } else {
        if (backToTopBtn) backToTopBtn.classList.remove('show');
    }
};

if (backToTopBtn) {
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FAQ Acordeón
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        document.querySelectorAll('.faq-item').forEach(other => { if(other !== item) other.classList.remove('active'); });
        item.classList.toggle('active');
    });
});

// Lightbox Galería
document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `<div class="lightbox-content"><span class="close-lightbox">&times;</span><img src="${imgSrc}"></div>`;
        document.body.appendChild(lightbox);
        lightbox.onclick = (e) => { if(e.target.className.includes('overlay') || e.target.className.includes('close')) lightbox.remove(); };
    });
});

// Animaciones Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Efecto Foco en Pedido
const heroBtn = document.querySelector('.hero .cta-button');
const configCard = document.querySelector('.config-card');
if (heroBtn && configCard) {
    heroBtn.addEventListener('click', () => {
        setTimeout(() => {
            configCard.classList.add('focus-highlight');
            setTimeout(() => configCard.classList.remove('focus-highlight'), 2000);
        }, 800); 
    });
}

// Quitar Loader y Carga Inicial
window.addEventListener('load', () => {
    if (loader) {
        setTimeout(() => { loader.classList.add('loader-hidden'); }, 1000);
    }
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('active');
});

// Suavizar todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' });
    });
});

/* =========================================
   FUNCIÓN PARA REENVIAR EL EMAIL
   ========================================= */
function resendVerification() {
    const user = auth.currentUser;

    if (user) {
        user.sendEmailVerification()
            .then(() => {
                alert("¡Correo de verificación reenviado! Revisa tu bandeja de entrada y SPAM.");
            })
            .catch((error) => {
                if (error.code === 'auth/too-many-requests') {
                    alert("Has intentado demasiadas veces. Espera unos minutos antes de pedir otro correo.");
                } else {
                    alert("Error: " + error.message);
                }
            });
    } else {
        alert("Sesión no encontrada. Por favor reingresa.");
    }
}

/* =========================================
   RECUPERAR CONTRASEÑA
   ========================================= */
const forgotPassBtn = document.getElementById('forgotPassword');

if (forgotPassBtn) {
    forgotPassBtn.onclick = (e) => {
        e.preventDefault();
        const email = authForm.querySelector('input[type="email"]').value;

        if (!email) {
            alert("Por favor, escribe tu correo electrónico primero para poder enviarte el link de recuperación.");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("¡Mail de recuperación enviado! Revisa tu casilla (y SPAM) para restablecer tu clave.");
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    };
}