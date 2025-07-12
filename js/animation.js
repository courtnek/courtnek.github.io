// Animation and timing functions
function animate() {
    if (systemRunning) {
        updateWaveform();
        updateSpectrum();
        updateFFT();
    } else {
        updateSpectrum(); // Still show spectrum when offline, just dimmed
        updateFFT(); // Show FFT even when offline
    }
    
    // Add status text animation
    animateStatusText();
    
    requestAnimationFrame(animate);
}

// Status square flashing
function flashStatusSquare() {
    const statusSquare = document.getElementById('status-square');
    
    // More flashing when system is running and efficiency is low
    let flashChance = systemRunning ? (efficiency < 50 ? 0.3 : 0.1) : 0.05;
    
    if (Math.random() < flashChance) {
        statusSquare.style.opacity = '0.3';
        setTimeout(() => {
            statusSquare.style.opacity = '1';
        }, 100);
    }
}

function animateStatusText() {
    const statusText = document.getElementById('status-text');
    const efficiencyDisplay = document.getElementById('efficiency-display');
    
    if (systemRunning) {
        // Animate efficiency display with subtle glow based on value
        if (efficiency >= 85) {
            efficiencyDisplay.className = 'text-cyan-400 font-mono animate-pulse';
        } else if (efficiency >= 60) {
            efficiencyDisplay.className = 'text-green-400 font-mono';
        } else if (efficiency >= 30) {
            efficiencyDisplay.className = 'text-yellow-400 font-mono';
        } else {
            efficiencyDisplay.className = 'text-red-400 font-mono animate-pulse';
        }
        
        // Animate status text for critical states
        if (efficiency < 30) {
            statusText.className = 'text-red-400 font-semibold animate-pulse';
        } else if (efficiency >= 85) {
            statusText.className = 'text-cyan-400 font-semibold';
        } else if (efficiency >= 60) {
            statusText.className = 'text-green-400 font-semibold';
        } else {
            statusText.className = 'text-yellow-400 font-semibold';
        }
    } else {
        statusText.className = 'text-red-400 font-semibold';
        efficiencyDisplay.className = 'text-gray-500 font-mono';
    }
}

// Initialize all systems
function initializeSystem() {
    initializeState();
    initializeControls();
    
    // Start animations
    animate();
    setInterval(flashStatusSquare, 500);

    // Initialize displays
    updateStatusSquare();
    updateWaveform();
    updateSpectrum();
    updateFFT();
    updateEfficiency();
    updateHeaderBackground(); // Add this line
    disableControls();
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSystem);
