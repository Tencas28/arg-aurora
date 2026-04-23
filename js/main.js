/* ============================================
   PROYECTO AURORA ARG - Script Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    // Detectar en qué página estamos
    const body = document.body;

    if (body.classList.contains('terminal-page')) {
        initTerminal();
    } else if (body.classList.contains('files-page')) {
        initFiles();
    } else if (body.classList.contains('transmission-page')) {
        initTransmission();
    } else if (body.classList.contains('final-page')) {
        initFinal();
    }

    // Inicializar easter eggs globales
    initGlobalEasterEggs();
}

/* ======================
   TERMINAL (index.html)
   ====================== */
function initTerminal() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordCursor = document.getElementById('passwordCursor');
    const feedbackLine = document.getElementById('feedbackLine');
    const terminalBody = document.getElementById('terminalBody');

    let currentPassword = '';
    const correctPassword = 'AURORA'; // También aceptamos variantes
    const validPasswords = ['AURORA', 'aurora', 'Aurora'];

    // Capturar teclas
    document.addEventListener('keydown', (e) => {
        // Solo procesar si estamos en la terminal
        if (!document.body.classList.contains('terminal-page')) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            checkPassword();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            currentPassword = currentPassword.slice(0, -1);
            updatePasswordDisplay();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            currentPassword += e.key;
            updatePasswordDisplay();
            // Efecto de sonido visual: pequeño flicker
            if (passwordCursor) {
                passwordCursor.style.color = '#00ff41';
                setTimeout(() => {
                    passwordCursor.style.color = '';
                }, 50);
            }
        }
    });

    function updatePasswordDisplay() {
        if (passwordDisplay) {
            // Mostrar asteriscos en lugar de la contraseña real
            passwordDisplay.textContent = '●'.repeat(currentPassword.length);
        }
    }

    function checkPassword() {
        if (validPasswords.includes(currentPassword)) {
            // Contraseña correcta
            if (feedbackLine) {
                feedbackLine.innerHTML =
                    '<span class="prompt">[SISTEMA]</span> <span class="feedback-success">Autenticación exitosa. Acceso concedido.</span>';
            }
            // Redirigir después de un breve delay
            setTimeout(() => {
                // Efecto de "glitch out" antes de redirigir
                if (terminalBody) {
                    terminalBody.style.animation = 'glitch-out 0.5s forwards';
                }
                setTimeout(() => {
                    window.location.href = 'archivos.html';
                }, 400);
            }, 1200);
        } else {
            // Contraseña incorrecta
            if (feedbackLine) {
                feedbackLine.innerHTML =
                    '<span class="prompt warning">[ERROR]</span> <span class="feedback-error">Acceso denegado. Credenciales inválidas.</span>';
                // Efecto de shake
                feedbackLine.classList.add('feedback-error');
                setTimeout(() => {
                    feedbackLine.classList.remove('feedback-error');
                }, 500);
            }
            currentPassword = '';
            updatePasswordDisplay();
            // Efecto de glitch en la pantalla
            triggerScreenShake();
        }
    }

    function triggerScreenShake() {
        const container = document.querySelector('.terminal-container');
        if (container) {
            container.style.transform = 'translateX(-5px)';
            setTimeout(() => { container.style.transform = 'translateX(5px)'; }, 50);
            setTimeout(() => { container.style.transform = 'translateX(-3px)'; }, 100);
            setTimeout(() => { container.style.transform = 'translateX(3px)'; }, 150);
            setTimeout(() => { container.style.transform = 'translateX(0)'; }, 200);
        }
    }

    // Click counter para easter egg (5 clicks en el terminal body)
    let clickCount = 0;
    if (terminalBody) {
        terminalBody.addEventListener('click', (e) => {
            // No contar clicks en líneas específicas
            clickCount++;
            if (clickCount >= 5 && clickCount < 6) {
                // Revelar pista sutil
                const hiddenClue = document.querySelector('.hidden-clue');
                if (hiddenClue) {
                    hiddenClue.style.color = 'var(--accent)';
                    hiddenClue.style.textShadow = '0 0 8px var(--accent-glow)';
                    hiddenClue.style.opacity = '1';
                    hiddenClue.style.transition = 'all 1s ease';
                }
            }
            if (clickCount > 10) {
                clickCount = 0; // Reiniciar
                const hiddenClue = document.querySelector('.hidden-clue');
                if (hiddenClue) {
                    hiddenClue.style.color = 'rgba(0, 255, 65, 0.04)';
                    hiddenClue.style.textShadow = 'none';
                }
            }
        });
    }
}

/* ======================
   ARCHIVOS (archivos.html)
   ====================== */
function initFiles() {
    // Revelar texto redactado al hacer hover (ya está en CSS)
    // Efecto de "descubrimiento" al hacer clic en el archivo corrupto
    const corruptedFile = document.querySelector('.file-card.corrupted');
    if (corruptedFile) {
        corruptedFile.addEventListener('click', function () {
            this.classList.toggle('revealed');
            const corruptedText = this.querySelector('.corrupted-text');
            if (corruptedText && this.classList.contains('revealed')) {
                // Decodificar binario a texto
                const binary = corruptedText.textContent.trim();
                try {
                    const decoded = binary
                        .split(' ')
                        .map(b => String.fromCharCode(parseInt(b, 2)))
                        .join('');
                    corruptedText.textContent = decoded;
                    corruptedText.style.color = 'var(--accent)';
                    corruptedText.style.textShadow = '0 0 8px var(--accent-glow)';
                } catch (err) {
                    // Si falla, mostrar igual
                    corruptedText.style.color = 'var(--accent)';
                }
            }
        });
    }

    // Efecto sutil: al pasar el mouse por la pista de navegación
    const navHint = document.querySelector('.navigation-hint');
    if (navHint) {
        navHint.addEventListener('mouseenter', () => {
            navHint.style.color = 'var(--accent)';
            navHint.style.textShadow = '0 0 10px var(--accent-glow)';
        });
        navHint.addEventListener('mouseleave', () => {
            navHint.style.color = 'var(--text-dim)';
            navHint.style.textShadow = 'none';
        });
    }

    // Contador de archivos "descubiertos"
    let discoveredCount = 0;
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            if (!this.dataset.discovered) {
                this.dataset.discovered = 'true';
                discoveredCount++;
                if (discoveredCount >= 4) {
                    // Todos descubiertos: mostrar mensaje sutil
                    const hint = document.querySelector('.navigation-hint p:first-child');
                    if (hint) {
                        hint.textContent = '▸ Has revisado todos los archivos. La señal te espera en /transmision.';
                        hint.style.color = 'var(--accent)';
                    }
                }
            }
        });
    });
}

/* ======================
   TRANSMISIÓN (transmision.html)
   ====================== */
function initTransmission() {
    // Canvas de señal visual
    const canvas = document.getElementById('signalCanvas');
    if (canvas) {
        initSignalCanvas(canvas);
    }

    // Zona interactiva de sintonización
    const interactiveZone = document.getElementById('interactiveZone');
    const progressFill = document.getElementById('progressFill');
    const tuningPercent = document.getElementById('tuningPercent');
    const finalReveal = document.getElementById('finalReveal');

    let tuningProgress = 0;
    let isTuning = false;
    let tuningInterval = null;

    if (interactiveZone) {
        // Al hacer clic y mantener, la barra avanza
        interactiveZone.addEventListener('mousedown', startTuning);
        interactiveZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startTuning();
        });

        interactiveZone.addEventListener('mouseup', stopTuning);
        interactiveZone.addEventListener('mouseleave', stopTuning);
        interactiveZone.addEventListener('touchend', stopTuning);
        interactiveZone.addEventListener('touchcancel', stopTuning);

        // También permitir clicks rápidos repetidos
        interactiveZone.addEventListener('click', (e) => {
            if (!isTuning) {
                tuningProgress = Math.min(100, tuningProgress + 8);
                updateTuningUI();
            }
        });
    }

    function startTuning() {
        isTuning = true;
        interactiveZone.classList.add('active');
        tuningInterval = setInterval(() => {
            tuningProgress = Math.min(100, tuningProgress + 1.5);
            updateTuningUI();
            if (tuningProgress >= 100) {
                stopTuning();
                revealTransmission();
            }
        }, 50);
    }

    function stopTuning() {
        isTuning = false;
        interactiveZone.classList.remove('active');
        if (tuningInterval) {
            clearInterval(tuningInterval);
            tuningInterval = null;
        }
        // Si el progreso es bajo, decae lentamente
        if (tuningProgress < 100 && tuningProgress > 0) {
            const decayInterval = setInterval(() => {
                tuningProgress = Math.max(0, tuningProgress - 0.8);
                updateTuningUI();
                if (tuningProgress <= 0) {
                    clearInterval(decayInterval);
                }
            }, 100);
        }
    }

    function updateTuningUI() {
        if (progressFill) {
            progressFill.style.width = tuningProgress + '%';
        }
        if (tuningPercent) {
            tuningPercent.textContent = Math.round(tuningProgress) + '%';
        }
        // Cambiar color según progreso
        if (tuningProgress > 75 && progressFill) {
            progressFill.style.background =
                'linear-gradient(90deg, #00ff41, #00ff88, #ffffff, #00ff88, #00ff41)';
            progressFill.style.boxShadow = '0 0 20px var(--accent-glow), 0 0 40px rgba(0,255,65,0.5)';
        }
    }

    function revealTransmission() {
        if (finalReveal && !finalReveal.classList.contains('revealed')) {
            finalReveal.classList.add('revealed');
            // Efecto de destello en la pantalla
            const messageBox = document.getElementById('messageBox');
            if (messageBox) {
                messageBox.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.4)';
                setTimeout(() => {
                    messageBox.style.boxShadow = '';
                }, 2000);
            }
            // Cambiar texto de la zona interactiva
            const tuningText = document.querySelector('.tuning-text');
            if (tuningText) {
                tuningText.textContent = '[ SEÑAL SINTONIZADA - MENSAJE RECIBIDO ]';
                tuningText.style.color = 'var(--accent)';
                tuningText.style.textShadow = '0 0 15px var(--accent-glow)';
            }
            // Actualizar barras de frecuencia
            const freqBars = document.querySelectorAll('.freq-bar');
            freqBars.forEach(bar => bar.classList.add('active'));
        }
    }

    // Canvas: onda de señal animada
    function initSignalCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let offset = 0;

        function drawSignal() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#00ff41';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 8;
            ctx.beginPath();

            const midY = canvas.height / 2;
            for (let x = 0; x < canvas.width; x++) {
                const y =
                    midY +
                    Math.sin((x + offset) * 0.05) * 20 +
                    Math.sin((x + offset) * 0.13) * 10 +
                    Math.sin((x + offset) * 0.027) * 25 +
                    (Math.random() - 0.5) * 8;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
            offset += 0.8;

            requestAnimationFrame(drawSignal);
        }

        drawSignal();

        // Redimensionar canvas al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    }
}

/* ======================
   FINAL (final.html)
   ====================== */
function initFinal() {
    // Crear partículas flotantes
    const particlesContainer = document.getElementById('particlesContainer');
    if (particlesContainer) {
        createParticles(particlesContainer);
    }

    // Efecto al hacer clic en el sello
    const seal = document.querySelector('.seal-circle');
    if (seal) {
        seal.addEventListener('click', () => {
            seal.style.animation = 'none';
            seal.offsetHeight; // Trigger reflow
            seal.style.animation = 'seal-pulse 0.5s ease-in-out 3';
            // Mini explosión de partículas
            createBurstParticles(seal);
        });
    }
}

function createParticles(container) {
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background-color: rgba(0, 255, 65, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 8}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }

    // Añadir keyframes dinámicamente si no existen
    if (!document.getElementById('particle-keyframes')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-keyframes';
        styleSheet.textContent = `
            @keyframes float-particle {
                0% { transform: translateY(100vh) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-10vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

function createBurstParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const burstCount = 20;

    for (let i = 0; i < burstCount; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / burstCount;
        const distance = 40 + Math.random() * 60;
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background-color: #00ff41;
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 1;
        `;
        document.body.appendChild(particle);

        requestAnimationFrame(() => {
            particle.style.left = `${centerX + Math.cos(angle) * distance}px`;
            particle.style.top = `${centerY + Math.sin(angle) * distance}px`;
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
        });

        setTimeout(() => {
            particle.remove();
        }, 900);
    }
}

/* ======================
   EASTER EGGS GLOBALES
   ====================== */
function initGlobalEasterEggs() {
    // Secuencia Konami Code simplificada: ↑ ↑ ↓ ↓ ← → ← →
    let konamiProgress = 0;
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
    ];

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiProgress]) {
            konamiProgress++;
            if (konamiProgress >= konamiSequence.length) {
                activateKonamiEasterEgg();
                konamiProgress = 0;
            }
        } else {
            konamiProgress = 0;
        }
    });

    function activateKonamiEasterEgg() {
        // Efecto global: invertir colores brevemente
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        document.body.style.transition = 'filter 0.5s ease';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 1500);

        // Mostrar mensaje oculto en consola
        console.log('%c🔍 PROYECTO AURORA %c| %cHas encontrado un secreto. La verdad se revela a los curiosos.',
            'color: #00ff41; font-size: 1.2em;', '', 'color: #ccc;');
        console.log('%cCoordenadas adicionales: AR 20h 15m 30s | DEC +40° 12\' 00"',
            'color: #ffaa00; font-style: italic;');
    }
}

/* ======================
   GLITCH OUT ANIMATION (CSS)
   ====================== */
// Añadir keyframe de glitch-out dinámicamente
(function addGlitchOutKeyframe() {
    if (!document.getElementById('glitch-out-style')) {
        const style = document.createElement('style');
        style.id = 'glitch-out-style';
        style.textContent = `
            @keyframes glitch-out {
                0% { opacity: 1; transform: translateX(0); }
                20% { opacity: 0.8; transform: translateX(-15px); }
                40% { opacity: 0.9; transform: translateX(15px); }
                60% { opacity: 0.4; transform: translateX(-8px); }
                80% { opacity: 0.2; transform: translateX(8px); }
                100% { opacity: 0; transform: translateX(0) scale(0.95); }
            }
        `;
        document.head.appendChild(style);
    }
})();

console.log('%c🛡️ PROYECTO AURORA - Sistema de archivos clasificados v2.7',
    'color: #00ff41; font-family: monospace;');
console.log('%cAcceso monitorizado. La curiosidad es el primer paso hacia la verdad.',
    'color: #80c080; font-family: monospace;');