// Efficiency calculation and status management
function updateEfficiency() {
    if (!systemRunning) {
        efficiency = 0;
    } else {
        // Calculate efficiency based on various factors
        let baseEfficiency = 20;
        if (bearingsEngaged) baseEfficiency += 25;
        if (motorSynced) baseEfficiency += 20;
        if (fluxValue > 60 && fluxValue < 80) baseEfficiency += 15;
        if (pressure > 800 && pressure < 900) baseEfficiency += 10;
        if (frequency > 2500 && frequency < 3000) baseEfficiency += 10;
        
        // Waveform type affects efficiency
        if (waveformType === 'sine') baseEfficiency += 5;
        if (waveformType === 'square' && fluxValue > 70) baseEfficiency += 8;
        if (waveAmplitudePercent > 40 && waveAmplitudePercent < 80) baseEfficiency += 5;
        
        efficiency = Math.min(100, baseEfficiency);
    }
    
    const efficiencyDisplay = document.getElementById('efficiency-display');
    const statusText = document.getElementById('status-text');
    
    efficiencyDisplay.textContent = efficiency + '%';
    
    // Change status based on efficiency
    if (efficiency < 30) {
        statusText.textContent = 'CRITICAL';
        statusText.className = 'text-red-400';
    } else if (efficiency < 60) {
        statusText.textContent = 'SUBOPTIMAL';
        statusText.className = 'text-yellow-400';
    } else if (efficiency < 85) {
        statusText.textContent = 'OPTIMAL';
        statusText.className = 'text-green-400';
    } else {
        statusText.textContent = 'MAXIMUM EFFICIENCY';
        statusText.className = 'text-cyan-400';
    }
}

// Update Status Square (affected by flux and pressure in weird ways)
function updateStatusSquare() {
    const statusSquare = document.getElementById('status-square');
    const fluxState = document.getElementById('flux-state');
    
    // Non-intuitive logic: color based on flux + pressure modulo
    const colorIndex = (fluxValue + Math.floor(pressure / 100)) % statusColors.length;
    
    // Remove all color classes
    statusColors.forEach(color => statusSquare.classList.remove(color));
    
    // Add new color
    statusSquare.classList.add(statusColors[colorIndex]);
    
    // Update state text based on weird logic
    const states = ['NOMINAL', 'CRITICAL', 'OPTIMAL', 'UNSTABLE', 'RESONANT', 'CHAOTIC'];
    const stateIndex = Math.floor((fluxValue * pressure) / 10000) % states.length;
    fluxState.textContent = states[stateIndex];
}

function updateHeaderBackground() {
    const header = document.getElementById('status-header');
    
    if (!systemRunning) {
        // Offline - dark red glow
        header.className = 'border-b border-gray-800 py-2 transition-colors duration-500 bg-gradient-to-r from-red-900/20 to-gray-900';
    } else if (efficiency < 30) {
        // Critical - pulsing red
        header.className = 'border-b border-red-600 py-2 transition-colors duration-500 bg-gradient-to-r from-red-800/40 to-red-900/20 animate-pulse';
    } else if (efficiency < 60) {
        // Suboptimal - orange/yellow
        header.className = 'border-b border-yellow-600 py-2 transition-colors duration-500 bg-gradient-to-r from-yellow-800/30 to-orange-900/20';
    } else if (efficiency < 85) {
        // Optimal - green
        header.className = 'border-b border-green-600 py-2 transition-colors duration-500 bg-gradient-to-r from-green-800/30 to-green-900/20';
    } else {
        // Maximum efficiency - cyan glow with subtle animation
        header.className = 'border-b border-cyan-400 py-2 transition-colors duration-500 bg-gradient-to-r from-cyan-800/40 to-blue-900/30';
        
        // Add extra glow effect for maximum efficiency
        setTimeout(() => {
            if (efficiency >= 85) {
                header.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
            }
        }, 500);
    }
    
    // Remove box shadow for non-maximum states
    if (efficiency < 85) {
        header.style.boxShadow = 'none';
    }
}
