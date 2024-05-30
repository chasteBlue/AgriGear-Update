document.addEventListener('DOMContentLoaded', () => {
    const sliderButtons = document.querySelectorAll('.slider');

    function resetModes() {
        document.body.classList.remove('default-mode', 'dark-mode', 'grayscale-mode', 'protanopia-mode', 'tritanopia-mode');
        document.body.style.filter = '';
        localStorage.removeItem('default-mode');
        localStorage.removeItem('dark-mode');
        localStorage.removeItem('grayscale-mode');
        localStorage.removeItem('protanopia-mode');
        localStorage.removeItem('tritanopia-mode');
    }

    function toggleMode(mode) {
        const modeClass = `${mode}-mode`;
        const modeActive = document.body.classList.contains(modeClass);

        resetModes();

        if (!modeActive) {
            document.body.classList.add(modeClass);
            localStorage.setItem(modeClass, 'enabled');
            if (modeClass === 'protanopia-mode') {
                document.body.style.filter = 'url(#protanopia-filter)';
            } else if (modeClass === 'tritanopia-mode') {
                document.body.style.filter = 'url(#tritanopia-filter)';
            }
        } else {
            localStorage.setItem(modeClass, 'disabled');
        }
    }

    sliderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isToggled = button.classList.contains('toggled');

            // Deactivate all sliders
            sliderButtons.forEach(btn => btn.classList.remove('toggled'));

            if (!isToggled) {
                button.classList.add('toggled');
            } else {
                button.classList.remove('toggled');
            }

            // Toggle mode based on the clicked slider
            if (button.id === 'default-mode-toggle') {
                toggleMode('default');
            } else if (button.id === 'dark-mode-toggle') {
                toggleMode('dark');
            } else if (button.id === 'grayscale-toggle') {
                toggleMode('grayscale');
            } else if (button.id === 'protanopia-toggle') {
                toggleMode('protanopia');
            } else if (button.id === 'tritanopia-toggle') {
                toggleMode('tritanopia');
            }
        });
    });

    // Check local storage for mode preferences
    if (localStorage.getItem('default-mode') === 'enabled') {
        document.body.classList.add('default-mode');
        document.getElementById('default-mode-toggle').classList.add('toggled');
    }

    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').classList.add('toggled');
    }

    if (localStorage.getItem('grayscale-mode') === 'enabled') {
        document.body.classList.add('grayscale-mode');
        document.getElementById('grayscale-toggle').classList.add('toggled');
    }

    if (localStorage.getItem('protanopia-mode') === 'enabled') {
        document.body.classList.add('protanopia-mode');
        document.body.style.filter = 'url(#protanopia-filter)';
        document.getElementById('protanopia-toggle').classList.add('toggled');
    }

    if (localStorage.getItem('tritanopia-mode') === 'enabled') {
        document.body.classList.add('tritanopia-mode');
        document.body.style.filter = 'url(#tritanopia-filter)';
        document.getElementById('tritanopia-toggle').classList.add('toggled');
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const ttsToggle = document.getElementById('tts-toggle');
    const speakButtons = document.querySelectorAll('.speak-button');
    const stopButtons = document.querySelectorAll('.stop-button');
    const contentTexts = document.querySelectorAll('.content-text p');

    function initializeTTS() {
        const ttsEnabled = localStorage.getItem('tts-enabled') === 'true';
        if (ttsToggle) {
            ttsToggle.checked = ttsEnabled;
        }
        speakButtons.forEach(button => button.classList.toggle('hidden', !ttsEnabled));
        stopButtons.forEach(button => button.classList.toggle('hidden', !ttsEnabled));
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Sorry, your browser does not support text-to-speech.');
        }
    }

    function stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    if (ttsToggle) {
        ttsToggle.addEventListener('change', () => {
            const isEnabled = ttsToggle.checked;
            speakButtons.forEach(button => button.classList.toggle('hidden', !isEnabled));
            stopButtons.forEach(button => button.classList.toggle('hidden', !isEnabled));
            localStorage.setItem('tts-enabled', isEnabled);
        });
    }

    speakButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const text = contentTexts[index].textContent;
            if (text.trim() !== "") {
                speak(text);
            } else {
                alert('There is no content to read.');
            }
        });
    });

    stopButtons.forEach((button) => {
        button.addEventListener('click', () => {
            stopSpeaking();
        });
    });

    initializeTTS();
});



