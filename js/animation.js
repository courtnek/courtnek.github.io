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
    disableControls();
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSystem);
