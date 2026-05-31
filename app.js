/**
 * Pianissimo Zaragoza - Lógica de la aplicación web
 * Desarrollado con simuladores de plugins de WordPress (Secciones 3.4.1 y 3.4.2)
 */

// Estado global de la aplicación
const AppState = {
    activeSection: 'sec-inicio',
    isLoggedIn: false,
    currentUser: null,
    isMaintenanceMode: false,
    isCaptchaVerified: false,
    audioCtx: null,
    activeOscillators: {},
    pianosReservados: []
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización de SPA Enrutador y Navegación
    initNavigation();
    
    // 2. Reading Progress Bar (Plugin Reading Progress Bar)
    initProgressBar();
    
    // 3. Simulación de Geolocalización (Plugin Lead info / Geolocation IP)
    initGeolocation();
    
    // 4. Captcha 4WP (Plugin CAPTCHA 4WP)
    initCaptcha();
    
    // 5. bbPress Foro (Creación de temas)
    initbbPressForum();
    
    // 6. BuddyPress Registro / Login (Colorlib Login Customizer)
    initBuddyPress();
    
    // 7. Joinchat Widget (WhatsApp)
    initJoinchat();
    
    // 8. Yoast SEO Auditor (Análisis dinámico de sección)
    initYoastSEO();
    
    // 9. LightStart Maintenance Screen (Plugin Mantenimiento)
    initMaintenanceMode();
    
    // 10. Catálogo Filtros
    initCatalogFilters();

    // 11. Espacio Docentes (Mini-teclado interactivo)
    initDocentesChords();

    // 12. Piano Virtual Jugable (Zona Lúdica)
    initPianoVirtual();

    // 13. Formulario Contacto CF7
    initContactForm();

    // 14. Easy Table of Contents
    initTableOfContents();

    // Cargar perfil desde localStorage si existe
    checkStoredSession();
});

/* ================= 1. NAVEGACIÓN SPA ================= */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-menu .nav-item, .dropdown-link, .footer-links a.nav-link');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetSectionId = item.getAttribute('data-target');
            if (targetSectionId) {
                e.preventDefault();
                switchSection(targetSectionId);
                
                // Si la navegación viene de un submenú, cerramos el dropdown
                const dropdown = item.closest('.dropdown-menu');
                if (dropdown) {
                    dropdown.style.display = 'none';
                    setTimeout(() => dropdown.removeAttribute('style'), 100);
                }
            }
        });
    });

    document.getElementById('logo-home').addEventListener('click', (e) => {
        e.preventDefault();
        switchSection('sec-inicio');
    });
}

function switchSection(sectionId) {
    // Desactivar todas las secciones
    document.querySelectorAll('.app-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Activar sección destino
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        AppState.activeSection = sectionId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Actualizar clase activa en cabecera
    document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
        item.classList.remove('active');
        const target = item.getAttribute('data-target');
        if (target === sectionId) {
            item.classList.add('active');
        }
    });

    // Relanzar auditoría Yoast SEO de la sección visible
    runYoastSEOAudit(sectionId);
}

/* ================= 2. READING PROGRESS BAR ================= */
function initProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        } else {
            progressBar.style.width = '0%';
        }
    });
}

/* ================= 3. GEOLOCALIZACIÓN Y IP ================= */
function initGeolocation() {
    const detailsEl = document.getElementById('geo-location-details');
    const flagEl = document.getElementById('geo-flag');
    
    setTimeout(() => {
        // Simulación premium de geocodificación de Zaragoza basada en los requisitos
        detailsEl.innerHTML = `
            <strong>Ubicación Geocodificada:</strong> Zaragoza, España<br>
            <strong>IP Localizada:</strong> 84.120.45.12 (Zaragoza Sur)<br>
            <strong>Latitud:</strong> 41.6488 | <strong>Longitud:</strong> -0.8891<br>
            <strong>Idioma del lead:</strong> Castellano (es-ES)
        `;
        flagEl.textContent = '🇪🇸';
    }, 1500);
}

/* ================= 4. CAPTCHA 4WP (Cuenta G) ================= */
function initCaptcha() {
    const btn = document.getElementById('captcha-checkbox-btn');
    btn.addEventListener('click', () => {
        if (!AppState.isCaptchaVerified) {
            AppState.isCaptchaVerified = true;
            btn.classList.add('verified');
        } else {
            AppState.isCaptchaVerified = false;
            btn.classList.remove('verified');
        }
    });
}

/* ================= 5. bbPress FORO SIMULADO ================= */
function initbbPressForum() {
    const btnNewTopic = document.getElementById('btn-new-topic');
    const formBox = document.getElementById('new-topic-form-box');
    const btnCancel = document.getElementById('btn-cancel-topic');
    const form = document.getElementById('forum-topic-form');
    const topicsContainer = document.getElementById('forum-topics-container');

    btnNewTopic.addEventListener('click', () => {
        formBox.classList.add('active');
        document.getElementById('forum-subject').focus();
    });

    btnCancel.addEventListener('click', () => {
        formBox.classList.remove('active');
        form.reset();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('forum-subject').value;
        const author = AppState.isLoggedIn ? AppState.currentUser.name : 'Carlos Granados';
        
        // Crear fila del nuevo tema
        const row = document.createElement('div');
        row.className = 'topic-row';
        row.innerHTML = `
            <div class="topic-info">
                <h4>${subject}</h4>
                <p>Iniciado por <strong>${author}</strong> en <em>Consultas de Clientes</em></p>
            </div>
            <div class="topic-replies">
                <strong>0</strong> respuestas
            </div>
            <div class="topic-last-post">
                <p>Hace un momento</p>
                <p>por <em>${author}</em></p>
            </div>
        `;
        
        topicsContainer.prepend(row);
        
        // Efecto visual
        row.style.background = '#242430';
        setTimeout(() => row.style.background = '', 2000);
        
        formBox.classList.remove('active');
        form.reset();
        alert('¡Tema publicado en el foro bbPress con éxito!');
    });
}

/* ================= 6. BuddyPress Y COLORLIB LOGIN ================= */
function initBuddyPress() {
    const formLogin = document.getElementById('colorlib-form-login');
    const formRegister = document.getElementById('colorlib-form-register');
    const headerLoginBtn = document.getElementById('header-login-btn');
    const btnLogout = document.getElementById('btn-logout');

    headerLoginBtn.addEventListener('click', () => {
        switchSection('sec-comunidad');
        document.getElementById('login-username').focus();
    });

    // Formulario de login
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        
        // Simular inicio de sesión
        loginUser({
            username: username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: 'Pianista Aficionado'
        });
    });

    // Formulario de registro
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const username = document.getElementById('reg-username').value;
        
        loginUser({
            username: username,
            name: name,
            role: 'Miembro Nuevo'
        });
    });

    btnLogout.addEventListener('click', () => {
        logoutUser();
    });
}

function loginUser(userData) {
    AppState.isLoggedIn = true;
    AppState.currentUser = userData;
    
    // Guardar en localStorage
    localStorage.setItem('pianissimo_user', JSON.stringify(userData));

    // Cambiar cabecera
    document.getElementById('logged-out-view').style.display = 'none';
    document.getElementById('logged-in-view').style.display = 'block';
    document.getElementById('user-display-name').textContent = userData.name;
    document.getElementById('avatar-char').textContent = userData.name.charAt(0).toUpperCase();

    // Cambiar sección comunidad
    document.getElementById('colorlib-login-box').style.display = 'none';
    document.getElementById('buddy-profile-box').style.display = 'flex';
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-role').textContent = userData.role;
    document.getElementById('profile-avatar-large').textContent = userData.name.charAt(0).toUpperCase();

    // Agregar nuevo miembro al widget lateral de BuddyPress
    const membersList = document.getElementById('buddypress-members');
    const newItem = document.createElement('div');
    newItem.className = 'member-item';
    newItem.id = 'buddypress-user-item';
    newItem.innerHTML = `
        <div class="user-avatar" style="background:var(--gold); color:var(--bg-primary);">${userData.name.charAt(0).toUpperCase()}</div>
        <div>
            <div class="member-name">${userData.name}</div>
            <div class="member-role">${userData.role}</div>
        </div>
        <div class="member-status"></div>
    `;
    membersList.prepend(newItem);
}

function logoutUser() {
    AppState.isLoggedIn = false;
    AppState.currentUser = null;
    localStorage.removeItem('pianissimo_user');

    // Cambiar cabecera
    document.getElementById('logged-out-view').style.display = 'block';
    document.getElementById('logged-in-view').style.display = 'none';

    // Cambiar sección comunidad
    document.getElementById('colorlib-login-box').style.display = 'block';
    document.getElementById('buddy-profile-box').style.display = 'none';
    
    // Resetear formularios
    document.getElementById('colorlib-form-login').reset();
    document.getElementById('colorlib-form-register').reset();

    // Remover del widget lateral
    const userItem = document.getElementById('buddypress-user-item');
    if (userItem) userItem.remove();
}

function checkStoredSession() {
    const stored = localStorage.getItem('pianissimo_user');
    if (stored) {
        try {
            const userData = JSON.parse(stored);
            loginUser(userData);
        } catch (e) {
            localStorage.removeItem('pianissimo_user');
        }
    }
}

function toggleLoginTabs(mode) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('colorlib-form-login');
    const formRegister = document.getElementById('colorlib-form-register');

    if (mode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'flex';
        formRegister.style.display = 'none';
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.style.display = 'none';
        formRegister.style.display = 'flex';
    }
}

window.toggleLoginTabs = toggleLoginTabs; // Exponer a HTML

/* ================= 7. JOINCHAT WIDGET (WhatsApp) ================= */
function initJoinchat() {
    const trigger = document.getElementById('joinchat-btn-trigger');
    const bubble = document.getElementById('joinchat-chat-bubble');

    trigger.addEventListener('click', () => {
        bubble.classList.toggle('active');
    });

    // Auto-mostrar la burbuja de chat después de 5 segundos para wowear
    setTimeout(() => {
        if (!bubble.classList.contains('active')) {
            bubble.classList.add('active');
        }
    }, 5000);
}

/* ================= 8. YOAST SEO AUDITOR ================= */
function initYoastSEO() {
    const btn = document.getElementById('yoast-widget-btn');
    const panel = document.getElementById('yoast-sidebar-panel');
    const closeBtn = document.getElementById('yoast-close-btn');

    btn.addEventListener('click', () => {
        panel.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
}

function runYoastSEOAudit(sectionId) {
    const overallLight = document.getElementById('yoast-overall-light');
    const metaDescIndicator = document.getElementById('yoast-meta-desc');

    if (sectionId === 'sec-inicio') {
        overallLight.style.background = '#28a745'; // Green
        if (metaDescIndicator) metaDescIndicator.className = 'yoast-indicator green';
    } else if (sectionId === 'sec-contacto') {
        overallLight.style.background = '#28a745';
        if (metaDescIndicator) metaDescIndicator.className = 'yoast-indicator green';
    } else if (sectionId === 'sec-ludicas') {
        overallLight.style.background = '#ffc107'; // Orange
        if (metaDescIndicator) metaDescIndicator.className = 'yoast-indicator orange';
    } else {
        overallLight.style.background = '#28a745';
        if (metaDescIndicator) metaDescIndicator.className = 'yoast-indicator green';
    }
}

/* ================= 9. LIGHTSTART MANTENIMIENTO ================= */
function initMaintenanceMode() {
    const overlay = document.getElementById('maintenance-overlay');
    const toggleBtn = document.getElementById('yoast-toggle-maintenance-btn');
    const bypassBtn = document.getElementById('btn-bypass-maintenance');

    // Manejar toggle desde el panel Yoast Admin
    toggleBtn.addEventListener('click', () => {
        AppState.isMaintenanceMode = true;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Botón de bypass del programador
    bypassBtn.addEventListener('click', () => {
        AppState.isMaintenanceMode = false;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Iniciar el temporizador regresivo de la pantalla de mantenimiento (LightStart)
    startCountdown();
}

function startCountdown() {
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    let totalSecs = 2 * 24 * 3600 + 14 * 3600 + 45 * 60 + 30; // 2d 14h 45m 30s

    setInterval(() => {
        if (totalSecs > 0) {
            totalSecs--;
            
            const d = Math.floor(totalSecs / (24 * 3600));
            const h = Math.floor((totalSecs % (24 * 3600)) / 3600);
            const m = Math.floor((totalSecs % 3600) / 60);
            const s = totalSecs % 60;

            if (cdDays) cdDays.textContent = String(d).padStart(2, '0');
            if (cdHours) cdHours.textContent = String(h).padStart(2, '0');
            if (cdMins) cdMins.textContent = String(m).padStart(2, '0');
            if (cdSecs) cdSecs.textContent = String(s).padStart(2, '0');
        }
    }, 1000);
}

/* ================= 10. FILTROS DE CATÁLOGO ================= */
function initCatalogFilters() {
    const filters = document.querySelectorAll('.catalog-filters .filter-btn');
    const cards = document.querySelectorAll('#pianos-container .piano-card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function comprarPiano(pianoName, pianoPrice) {
    AppState.pianosReservados.push({ name: pianoName, price: pianoPrice });
    alert(`🎹 Has solicitado la reserva y prueba de: ${pianoName} en Zaragoza.\n\nTe hemos enviado un correo de validación a tu dirección de contacto.\nPrecio del instrumento: ${pianoPrice}.`);
}

window.comprarPiano = comprarPiano; // Exponer globalmente

/* ================= 11. ESPACIO DOCENTES: ACORDES ================= */
function initDocentesChords() {
    const bubbles = document.querySelectorAll('.chords-visualizer .chord-bubble');
    
    const chordsData = {
        C: {
            text: 'Notas activas: C4 (Do), E4 (Mi), G4 (Sol) y C5 (Do2)',
            keys: [0, 2, 4, 7]
        },
        Am: {
            text: 'Notas activas: E4 (Mi), A4 (La) y C5 (Do)',
            keys: [2, 5, 7]
        },
        G: {
            text: 'Notas activas: D4 (Re), G4 (Sol) y B4 (Si)',
            keys: [1, 4, 6]
        },
        F: {
            text: 'Notas activas: F4 (Fa), A4 (La) y C5 (Do)',
            keys: [3, 5, 7]
        }
    };

    bubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            bubbles.forEach(b => b.classList.remove('active'));
            bubble.classList.add('active');

            const chordKey = bubble.getAttribute('data-chord');
            const data = chordsData[chordKey];

            // Actualizar texto
            document.getElementById('chord-display-text').textContent = data.text;

            // Resetear mini teclado
            document.querySelectorAll('#mini-piano-chords .mini-key').forEach(k => {
                k.classList.remove('active');
            });

            // Activar teclas indicadas
            data.keys.forEach(index => {
                const keyEl = document.getElementById(`mkey-${index}`);
                if (keyEl) keyEl.classList.add('active');
            });

            // Tocar sonido del acorde sintetizado
            playChordSintetizador(data.keys);
        });
    });
}

function playChordSintetizador(keyIndices) {
    // Inicializar Web Audio en interacción
    initAudioContext();
    if (!AppState.audioCtx) return;

    // Frecuencias relativas del mini teclado (Do, Re, Mi, Fa, Sol, La, Si, Do2)
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    keyIndices.forEach((idx, offset) => {
        if (frequencies[idx]) {
            // Tocar cada nota en arpegio ultra rápido
            setTimeout(() => {
                playTone(frequencies[idx], 'triangle', 0.8, 0.4);
            }, offset * 40);
        }
    });
}

/* ================= 12. PIANO DIGITAL JUGABLE (LÚDICAS) ================= */
function initPianoVirtual() {
    const keys = document.querySelectorAll('.piano-keyboard-container .piano-key');
    const chkGuides = document.getElementById('chk-key-guides');
    const oscSelector = document.getElementById('piano-osc-type');

    // Guías de teclado visuales
    chkGuides.addEventListener('change', () => {
        document.querySelectorAll('.key-label').forEach(lbl => {
            lbl.style.display = chkGuides.checked ? 'block' : 'none';
        });
    });

    // Eventos del ratón para cada tecla
    keys.forEach(key => {
        const noteFreq = parseFloat(key.getAttribute('data-note'));
        
        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            playKey(key, noteFreq);
        });
        
        key.addEventListener('mouseup', () => stopKey(key));
        key.addEventListener('mouseleave', () => stopKey(key));
    });

    // Mapeo del teclado de la computadora
    const keyMap = {};
    keys.forEach(key => {
        const char = key.getAttribute('data-char').toUpperCase();
        const freq = parseFloat(key.getAttribute('data-note'));
        keyMap[char] = { element: key, freq: freq };
    });

    // Escuchar teclado
    window.addEventListener('keydown', (e) => {
        // Evitar que toque si está escribiendo en algún input/formulario
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        const char = e.key.toUpperCase();
        if (keyMap[char] && !keyMap[char].isPressed) {
            keyMap[char].isPressed = true;
            playKey(keyMap[char].element, keyMap[char].freq);
        }
    });

    window.addEventListener('keyup', (e) => {
        const char = e.key.toUpperCase();
        if (keyMap[char]) {
            keyMap[char].isPressed = false;
            stopKey(keyMap[char].element);
        }
    });
}

function initAudioContext() {
    if (!AppState.audioCtx) {
        AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (AppState.audioCtx.state === 'suspended') {
        AppState.audioCtx.resume();
    }
}

function playKey(keyElement, frequency) {
    keyElement.classList.add('active');
    
    initAudioContext();
    if (!AppState.audioCtx) return;

    // Obtener timbre seleccionado
    const oscType = document.getElementById('piano-osc-type').value;

    // Si ya está sonando esta frecuencia, la detenemos antes
    if (AppState.activeOscillators[frequency]) {
        try { AppState.activeOscillators[frequency].osc.stop(); } catch(e){}
    }

    const osc = AppState.audioCtx.createOscillator();
    const gainNode = AppState.audioCtx.createGain();
    
    osc.type = oscType;
    osc.frequency.setValueAtTime(frequency, AppState.audioCtx.currentTime);
    
    // Sonido piano decaído (envolvente)
    gainNode.gain.setValueAtTime(0.35, AppState.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, AppState.audioCtx.currentTime + 1.8);
    
    osc.connect(gainNode);
    gainNode.connect(AppState.audioCtx.destination);
    
    osc.start();
    
    // Guardar referencia para poder silenciar al levantar
    AppState.activeOscillators[frequency] = {
        osc: osc,
        gain: gainNode
    };
}

function stopKey(keyElement) {
    keyElement.classList.remove('active');
    const frequency = parseFloat(keyElement.getAttribute('data-note'));
    
    if (AppState.activeOscillators[frequency]) {
        const currentGain = AppState.activeOscillators[frequency].gain;
        const osc = AppState.activeOscillators[frequency].osc;
        
        // Silenciar rápido al soltar la tecla (efecto apagador de piano)
        if (AppState.audioCtx) {
            try {
                currentGain.gain.cancelScheduledValues(AppState.audioCtx.currentTime);
                currentGain.gain.setValueAtTime(currentGain.gain.value, AppState.audioCtx.currentTime);
                currentGain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + 0.15);
                setTimeout(() => {
                    try { osc.stop(); } catch(e){}
                }, 160);
            } catch(e) {}
        }
        delete AppState.activeOscillators[frequency];
    }
}

function playTone(frequency, type, gainVal, duration) {
    if (!AppState.audioCtx) return;
    
    const osc = AppState.audioCtx.createOscillator();
    const gainNode = AppState.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, AppState.audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, AppState.audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(AppState.audioCtx.destination);
    
    osc.start();
    osc.stop(AppState.audioCtx.currentTime + duration);
}

/* ================= 13. FORMULARIO CONTACT FORM 7 SIMULADO ================= */
function initContactForm() {
    const form = document.getElementById('pianissimo-cf7-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Validar Captcha 4WP
        if (!AppState.isCaptchaVerified) {
            alert('⚠️ Validación CAPTCHA fallida: Por favor, marca la casilla "No soy un robot" del CAPTCHA 4WP antes de enviar.');
            return;
        }

        const name = document.getElementById('cf7-name').value;
        const email = document.getElementById('cf7-email').value;
        const subject = document.getElementById('cf7-subject').value;
        const message = document.getElementById('cf7-message').value;

        // 2. Simulación de Filtro Akismet Anti-Spam
        if (name.toUpperCase().includes('SPAMMER') || email === 'spam@spam.com' || message.toLowerCase().includes('viagra') || message.toLowerCase().includes('casino')) {
            alert('⚠️ Filtro Akismet Anti-Spam detectado:\nEl mensaje ha sido retenido y bloqueado automáticamente por contener elementos maliciosos o palabras prohibidas de spam.');
            return;
        }

        // Enviar con éxito
        alert(`¡Mensaje Enviado con éxito via Contact Form 7!
        
👤 Remitente: ${name}
📧 Email: ${email}
🎹 Asunto: ${subject}

📍 Datos de Ubicación recopilados:
- País del lead: España 🇪🇸
- IP de origen: 84.120.45.12 (Zaragoza)
- Receptor: granadoslastral@iesandalan.es

Recibirás respuesta en menos de 24 horas laborables en tu bandeja de entrada.`);

        form.reset();
        AppState.isCaptchaVerified = false;
        document.getElementById('captcha-checkbox-btn').classList.remove('verified');
    });
}

/* ================= 14. EASY TABLE OF CONTENTS COLLAPSIBLE ================= */
function initTableOfContents() {
    const toggle = document.getElementById('toc-toggle');
    const itemsList = document.getElementById('toc-items');
    const icon = document.getElementById('toc-icon');

    toggle.addEventListener('click', () => {
        if (itemsList.style.display === 'none') {
            itemsList.style.display = 'flex';
            icon.textContent = '▲';
        } else {
            itemsList.style.display = 'none';
            icon.textContent = '▼';
        }
    });

    // Interceptar clics en los enlaces del TOC para redirigir a la pestaña SPA correcta si es necesario
    document.querySelectorAll('.toc-item a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#sec-')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                switchSection(sectionId);
            }
        });
    });
}
