// Control panel event handlers
function initializeControls() {
    // Power button control
    const powerButton = document.getElementById('power-button');
    const statusText = document.getElementById('status-text');
    const efficiencyDisplay = document.getElementById('efficiency-display');

    powerButton.addEventListener('click', function() {
        systemRunning = !systemRunning;
        
        if (systemRunning) {
            this.textContent = 'STOP ENCABULATOR';
            this.className = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-semibold transition-colors';
            statusText.textContent = 'ONLINE';
            statusText.className = 'text-green-400';
            enableControls();
        } else {
            this.textContent = 'START ENCABULATOR';
            this.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold transition-colors';
            statusText.textContent = 'OFFLINE';
            statusText.className = 'text-red-400';
            efficiency = 0;
            bearingsEngaged = false;
            motorSynced = false;
            disableControls();
        }
        updateEfficiency();
    });

    // Flux Capacitor Controls
    const fluxSlider = document.getElementById('flux-slider');
    const fluxValueSpan = document.getElementById('flux-value');
    
    fluxSlider.addEventListener('input', function() {
        fluxValue = parseInt(this.value);
        fluxValueSpan.textContent = fluxValue + '%';
        updateStatusSquare();
        updateEfficiency();
        
        // Flux affects motor frequency
        if (systemRunning && fluxValue > 70) {
            frequency = Math.min(3500, frequency + Math.floor(Math.random() * 10));
            document.getElementById('freq-input').value = frequency;
            document.getElementById('freq-display').textContent = frequency;
        }
    });

    // Quantum Oscillator Controls
    const freqInput = document.getElementById('freq-input');
    
    freqInput.addEventListener('input', function() {
        frequency = parseInt(this.value) || 0;
        document.getElementById('freq-display').textContent = frequency;
        updateWaveform();
        updateEfficiency();
        
        // High frequency affects vane angle
        if (systemRunning && frequency > 3000) {
            pressure = Math.min(999, pressure + Math.floor(Math.random() * 20));
            document.getElementById('pressure-value').textContent = pressure;
        }
    });

    // Plasma Conduit Controls
    const pressureValue = document.getElementById('pressure-value');
    const pressureUp = document.getElementById('pressure-up');
    const pressureDown = document.getElementById('pressure-down');

    pressureUp.addEventListener('click', function() {
        if (!systemRunning) return;
        pressure += Math.floor(Math.random() * 50) + 1;
        pressureValue.textContent = pressure;
        updateStatusSquare();
        updateEfficiency();
    });

    pressureDown.addEventListener('click', function() {
        if (!systemRunning) return;
        pressure = Math.max(0, pressure - Math.floor(Math.random() * 50) - 1);
        pressureValue.textContent = pressure;
        updateStatusSquare();
        updateEfficiency();
    });

    // Initialize other controls
    initializeAxisControls();
    initializeBearingControls();
    initializeMotorControls();
    initializeWaveformControls();
    initializeSystemControls();
}

function initializeAxisControls() {
    const axisButtons = document.querySelectorAll('[id^="axis-"]');
    
    axisButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset all buttons
            axisButtons.forEach(btn => {
                btn.className = 'bg-gray-700 hover:bg-yellow-600 text-white py-2 text-xs';
            });
            
            // Highlight clicked button
            this.className = 'bg-yellow-600 text-black py-2 text-xs font-semibold';
            currentAxis = this.textContent;
            
            // Non-intuitive effect: changes waveform amplitude
            updateWaveform();
            updateEfficiency();
        });
    });
}

function initializeBearingControls() {
    document.getElementById('engage-bearings').addEventListener('click', function() {
        bearingsEngaged = !bearingsEngaged;
        this.textContent = bearingsEngaged ? 'DISENGAGE BEARINGS' : 'ENGAGE BEARINGS';
        this.className = bearingsEngaged ? 
            'w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-sm' :
            'w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm';
        updateEfficiency();
    });
}

function initializeMotorControls() {
    document.getElementById('motor-sync').addEventListener('click', function() {
        motorSynced = true;
        this.className = 'flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-2 text-xs';
        updateEfficiency();
        
        // Sync affects flux
        fluxValue = Math.min(100, fluxValue + 10);
        document.getElementById('flux-slider').value = fluxValue;
        document.getElementById('flux-value').textContent = fluxValue + '%';
    });

    document.getElementById('motor-reset').addEventListener('click', function() {
        motorSynced = false;
        document.getElementById('motor-sync').className = 'flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 text-xs';
        frequency = 2847;
        document.getElementById('freq-input').value = frequency;
        document.getElementById('freq-display').textContent = frequency;
        updateEfficiency();
    });
}

function initializeWaveformControls() {
    // Waveform type controls
    const waveButtons = ['wave-sine', 'wave-square', 'wave-triangle', 'wave-sawtooth'];
    waveButtons.forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', function() {
            // Reset all buttons
            waveButtons.forEach(id => {
                document.getElementById(id).className = 'bg-gray-700 hover:bg-orange-600 text-white py-2 px-3 text-xs';
            });
            
            // Highlight selected button
            this.className = 'bg-orange-600 text-white py-2 px-3 text-xs font-semibold';
            waveformType = buttonId.replace('wave-', '');
            updateEfficiency();
        });
    });

    // Amplitude control
    document.getElementById('amplitude-slider').addEventListener('input', function() {
        waveAmplitudePercent = parseInt(this.value);
        document.getElementById('amplitude-value').textContent = waveAmplitudePercent + '%';
        updateEfficiency();
    });

    // Phase control
    document.getElementById('phase-slider').addEventListener('input', function() {
        phaseOffset = parseInt(this.value);
        document.getElementById('phase-value').textContent = phaseOffset + '°';
        updateEfficiency();
    });
}

function initializeSystemControls() {
    document.getElementById('system-halt').addEventListener('click', function() {
        systemRunning = false;
        document.getElementById('power-button').click(); // Trigger power button
    });

    document.getElementById('system-reset').addEventListener('click', function() {
        // Reset all values
        fluxValue = 42;
        frequency = 2847;
        pressure = 847;
        bearingsEngaged = false;
        motorSynced = false;
        
        document.getElementById('flux-slider').value = fluxValue;
        document.getElementById('flux-value').textContent = fluxValue + '%';
        document.getElementById('freq-input').value = frequency;
        document.getElementById('pressure-value').textContent = pressure;
        document.getElementById('engage-bearings').textContent = 'ENGAGE BEARINGS';
        document.getElementById('engage-bearings').className = 'w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm';
        
        updateEfficiency();
    });
}

function enableControls() {
    document.getElementById('engage-bearings').disabled = false;
    document.getElementById('motor-sync').disabled = false;
    document.getElementById('motor-reset').disabled = false;
    document.getElementById('system-halt').disabled = false;
    document.getElementById('system-reset').disabled = false;
    document.getElementById('system-backup').disabled = false;
}

function disableControls() {
    document.getElementById('engage-bearings').disabled = true;
    document.getElementById('motor-sync').disabled = true;
    document.getElementById('motor-reset').disabled = true;
    document.getElementById('system-halt').disabled = true;
    document.getElementById('system-reset').disabled = true;
    document.getElementById('system-backup').disabled = true;
}
