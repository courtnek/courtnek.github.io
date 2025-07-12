// Display update functions for waveform, spectrum, and FFT
function updateWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    ctx.strokeStyle = '#10b981'; // green-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const amplitude = document.getElementById('amplitude-display');
    
    // Base parameters affected by axis
    let baseAmplitude = 30;
    let waveFreq = 0.05;
    
    switch(currentAxis) {
        case 'X':
            baseAmplitude = 15;
            waveFreq = 0.1;
            amplitude.textContent = '0.35';
            break;
        case 'Y':
            baseAmplitude = 30;
            waveFreq = 0.05;
            amplitude.textContent = '0.73';
            break;
        case 'Z':
            baseAmplitude = 45;
            waveFreq = 0.02;
            amplitude.textContent = '1.24';
            break;
    }
    
    // Apply amplitude modulation
    const finalAmplitude = baseAmplitude * (waveAmplitudePercent / 100);
    
    // Frequency affects phase shift speed
    const phaseSpeed = frequency / 100000;
    const phaseRad = (phaseOffset * Math.PI) / 180;
    
    for (let x = 0; x < width; x++) {
        let y;
        const t = (x * waveFreq) + wavePhase + phaseRad;
        
        switch(waveformType) {
            case 'sine':
                y = height/2 + Math.sin(t) * finalAmplitude;
                break;
            case 'square':
                y = height/2 + (Math.sin(t) > 0 ? 1 : -1) * finalAmplitude;
                break;
            case 'triangle':
                y = height/2 + (2/Math.PI) * Math.asin(Math.sin(t)) * finalAmplitude;
                break;
            case 'sawtooth':
                y = height/2 + (2 * (t % (2*Math.PI)) / (2*Math.PI) - 1) * finalAmplitude;
                break;
        }
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Update phase for animation
    wavePhase += phaseSpeed;
    
    // Update fundamental frequency for FFT
    fundamentalFreq = frequency / 6.5; // Convert motor RPM to audio frequency
}

function updateSpectrum() {
    const width = spectrumCanvas.width;
    const height = spectrumCanvas.height;
    
    // Clear canvas
    spectrumCtx.fillStyle = '#000000';
    spectrumCtx.fillRect(0, 0, width, height);
    
    // Update spectrum bars based on system parameters
    const barWidth = width / spectrumBars.length;
    
    for (let i = 0; i < spectrumBars.length; i++) {
        const bar = spectrumBars[i];
        
        // Calculate target height based on system parameters
        let baseHeight = 10;
        
        // Flux affects low frequencies
        if (i < 8) {
            baseHeight += (fluxValue / 100) * 40;
        }
        
        // Frequency affects mid frequencies
        if (i >= 8 && i < 24) {
            baseHeight += (frequency / 3500) * 60;
        }
        
        // Pressure affects high frequencies
        if (i >= 24) {
            baseHeight += (pressure / 1000) * 50;
        }
        
        // Add some randomness and system running effects
        if (systemRunning) {
            baseHeight += Math.sin(spectrumPhase + i * 0.5) * 15;
            baseHeight += Math.random() * 10;
        } else {
            baseHeight *= 0.2;
        }
        
        // Efficiency affects overall amplitude
        baseHeight *= (efficiency / 100) * 0.8 + 0.2;
        
        bar.targetHeight = Math.max(2, Math.min(height - 10, baseHeight));
        
        // Smooth animation
        bar.height += (bar.targetHeight - bar.height) * 0.1;
        
        // Draw bar
        const x = i * barWidth;
        const barHeight = bar.height;
        
        // Create gradient based on height
        const gradient = spectrumCtx.createLinearGradient(0, height, 0, height - barHeight);
        
        if (barHeight > height * 0.8) {
            gradient.addColorStop(0, '#ef4444'); // red for high
            gradient.addColorStop(1, '#fbbf24'); // yellow
        } else if (barHeight > height * 0.5) {
            gradient.addColorStop(0, '#22c55e'); // green for optimal
            gradient.addColorStop(1, '#06b6d4'); // cyan
        } else {
            gradient.addColorStop(0, '#3b82f6'); // blue for low
            gradient.addColorStop(1, '#8b5cf6'); // purple
        }
        
        spectrumCtx.fillStyle = gradient;
        spectrumCtx.fillRect(x + 1, height - barHeight, barWidth - 2, barHeight);
        
        // Add glow effect for high bars
        if (barHeight > height * 0.7) {
            spectrumCtx.shadowColor = bar.color;
            spectrumCtx.shadowBlur = 10;
            spectrumCtx.fillRect(x + 1, height - barHeight, barWidth - 2, barHeight);
            spectrumCtx.shadowBlur = 0;
        }
    }
    
    // Update spectrum phase for animation
    spectrumPhase += 0.05;
    
    // Update spectrum displays
    updateSpectrumDisplays();
}

function updateSpectrumDisplays() {
    const resonanceDisplay = document.getElementById('resonance-display');
    const peakFreqDisplay = document.getElementById('peak-freq-display');
    const harmonicDisplay = document.getElementById('harmonic-display');
    
    // Calculate resonance state
    let resonanceState = 'STABLE';
    if (efficiency > 85) {
        resonanceState = 'OPTIMAL';
        resonanceDisplay.className = 'text-green-400';
    } else if (efficiency < 30) {
        resonanceState = 'CRITICAL';
        resonanceDisplay.className = 'text-red-400';
    } else if (efficiency > 70) {
        resonanceState = 'HARMONIC';
        resonanceDisplay.className = 'text-cyan-400';
    } else {
        resonanceDisplay.className = 'text-cyan-400';
    }
    resonanceDisplay.textContent = resonanceState;
    
    // Calculate peak frequency (affected by motor frequency and flux)
    const peakFreq = ((frequency * fluxValue) / 100000).toFixed(1);
    peakFreqDisplay.textContent = peakFreq + ' kHz';
    
    // Calculate harmonic distortion (affected by pressure and bearings)
    let harmonic = (pressure / 10000) + (bearingsEngaged ? 0.01 : 0.05);
    if (motorSynced) harmonic *= 0.5;
    harmonicDisplay.textContent = harmonic.toFixed(3) + '%';
}

function updateFFT() {
    const canvas = document.getElementById('fft-display');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate FFT-like display based on waveform type and parameters
    const barWidth = width / fftBars.length;
    
    for (let i = 0; i < fftBars.length; i++) {
        const bar = fftBars[i];
        let magnitude = 0;
        
        if (systemRunning) {
            // Fundamental frequency
            if (Math.abs(bar.frequency - fundamentalFreq) < 50) {
                magnitude = 80 * (waveAmplitudePercent / 100);
            }
            
            // Harmonics based on waveform type
            switch(waveformType) {
                case 'sine':
                    // Pure sine has only fundamental
                    break;
                case 'square':
                    // Odd harmonics (3rd, 5th, 7th...)
                    for (let h = 3; h <= 15; h += 2) {
                        if (Math.abs(bar.frequency - (fundamentalFreq * h)) < 30) {
                            magnitude = (60 / h) * (waveAmplitudePercent / 100);
                        }
                    }
                    break;
                case 'triangle':
                    // Odd harmonics with 1/h² amplitude
                    for (let h = 3; h <= 11; h += 2) {
                        if (Math.abs(bar.frequency - (fundamentalFreq * h)) < 30) {
                            magnitude = (40 / (h * h)) * (waveAmplitudePercent / 100);
                        }
                    }
                    break;
                case 'sawtooth':
                    // All harmonics with 1/h amplitude
                    for (let h = 2; h <= 10; h++) {
                        if (Math.abs(bar.frequency - (fundamentalFreq * h)) < 30) {
                            magnitude = (50 / h) * (waveAmplitudePercent / 100);
                        }
                    }
                    break;
            }
            
            // Add some system-influenced noise
            magnitude += (efficiency / 100) * Math.random() * 10;
            magnitude *= (fluxValue / 100) * 0.8 + 0.2;
        }
        
        bar.targetMagnitude = magnitude;
        bar.magnitude += (bar.targetMagnitude - bar.magnitude) * 0.15;
        
        // Draw bar
        const x = i * barWidth;
        const barHeight = Math.max(1, bar.magnitude);
        
        // Color based on frequency
        let color;
        if (bar.frequency < 500) {
            color = '#ec4899'; // pink for low freq
        } else if (bar.frequency < 2000) {
            color = '#f59e0b'; // amber for mid freq
        } else {
            color = '#06b6d4'; // cyan for high freq
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, height - barHeight, barWidth - 2, barHeight);
        
        // Add glow for prominent peaks
        if (barHeight > 40) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.fillRect(x + 1, height - barHeight, barWidth - 2, barHeight);
            ctx.shadowBlur = 0;
        }
    }
    
    updateFFTDisplays();
}

function updateFFTDisplays() {
    document.getElementById('fundamental-freq').textContent = Math.round(fundamentalFreq) + ' Hz';
    
    // Count significant harmonics
    let harmonicCount = 0;
    fftBars.forEach(bar => {
        if (bar.magnitude > 10) harmonicCount++;
    });
    document.getElementById('harmonic-count').textContent = harmonicCount;
    
    // Calculate THD based on waveform type
    let thd = 0;
    switch(waveformType) {
        case 'sine': thd = 0.1; break;
        case 'square': thd = 48.3; break;
        case 'triangle': thd = 12.1; break;
        case 'sawtooth': thd = 25.7; break;
    }
    thd *= (waveAmplitudePercent / 100);
    thd += (100 - efficiency) / 50; // System efficiency affects distortion
    document.getElementById('thd-display').textContent = thd.toFixed(1) + '%';
}
