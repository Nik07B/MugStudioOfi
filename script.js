/* =========================================
   1. MODO OSCURO / CLARO
   ========================================= */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Al cargar la página, verificamos si el usuario ya tenía una preferencia
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Cambiamos el icono y guardamos la preferencia en el navegador
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});


/* =========================================
   2. LÓGICA DEL MODAL (LOGIN / REGISTRO)
   ========================================= */
const modal = document.getElementById('modalAuth');
const openBtn = document.getElementById('openLogin');
const closeBtn = document.getElementById('closeModal');
const toggleBtn = document.getElementById('toggleAuth');
const modalTitle = document.getElementById('modalTitle');
const nameGroup = document.getElementById('nameGroup');
const authForm = document.getElementById('authForm');

// Abrir modal
openBtn.onclick = () => {
    modal.style.display = 'flex';
};

// Cerrar modal al darle a la X
closeBtn.onclick = () => {
    modal.style.display = 'none';
};

// Cerrar modal al hacer clic fuera del cuadro blanco
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Cambiar entre Login y Registro dentro del modal
let isLogin = true;
toggleBtn.onclick = (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    if (isLogin) {
        modalTitle.innerText = "Iniciar Sesión";
        nameGroup.style.display = "none";
        toggleBtn.innerText = "Regístrate aquí";
    } else {
        modalTitle.innerText = "Crear Cuenta";
        nameGroup.style.display = "block";
        toggleBtn.innerText = "Ya tengo cuenta";
    }
};

// Simulación de envío de formulario
authForm.onsubmit = (e) => {
    e.preventDefault();
    alert("¡Gracias por interactuar! Esta es una simulación de inicio de sesión.");
    modal.style.display = 'none';
};


/* =========================================
   3. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================= */
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        
        // Cerramos otros que estén abiertos (opcional)
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Abrimos o cerramos el actual
        item.classList.toggle('active');
    });
});


/* =========================================
   4. ANIMACIONES DE ENTRADA (REVEAL ON SCROLL)
   ========================================= */
const observerOptions = {
    threshold: 0.15 // Se activa cuando el 15% del elemento es visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Aplicamos el observador a todos los elementos con la clase .reveal
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


/* =========================================
   5. AJUSTE DE SCROLL SUAVE
   ========================================= */
// Este código asegura que al hacer clic en los enlaces del menú, 
// el scroll sea suave y no quede tapado por el menú fijo.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Compensación de la altura del Nav
                behavior: 'smooth'
            });
        }
    });
});

/* =========================================
   6. INICIALIZACIÓN
   ========================================= */
window.addEventListener('load', () => {
    // Forzamos la animación del Hero apenas carga la página
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('active');
    }
});

const menuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.onclick = () => {
    navLinks.classList.toggle('active');
    // Cambia el icono de barras por una X
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
};

document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="${imgSrc}">
            </div>
        `;
        document.body.appendChild(lightbox);
        
        lightbox.onclick = (e) => {
            if(e.target.className === 'lightbox-overlay' || e.target.className === 'close-lightbox') {
                lightbox.remove();
            }
        };
    });
});