// Global state management
let fluxValue = 42;
let frequency = 2847;
let pressure = 847;
let currentAxis = 'Y';
let wavePhase = 0;
let statusColors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-cyan-500'];
let currentColorIndex = 0;
let systemRunning = false;
let efficiency = 0;
let bearingsEngaged = false;
let motorSynced = false;
let spectrumBars = [];
let spectrumPhase = 0;
let waveformType = 'sine';
let waveAmplitudePercent = 50;
let phaseOffset = 0;
let waveformFreq = 440;
let fftBars = [];
let fundamentalFreq = 440;

// Canvas references
let canvas, ctx, spectrumCanvas, spectrumCtx;

// Initialize state
function initializeState() {
    // Get canvas and context
    canvas = document.getElementById('waveform');
    ctx = canvas.getContext('2d');
    spectrumCanvas = document.getElementById('spectrum');
    spectrumCtx = spectrumCanvas.getContext('2d');

    // Initialize spectrum bars
    for (let i = 0; i < 32; i++) {
        spectrumBars.push({
            height: Math.random() * 20 + 5,
            targetHeight: Math.random() * 20 + 5,
            color: getSpectrumColor(i)
        });
    }

    // Initialize FFT bars
    for (let i = 0; i < 64; i++) {
        fftBars.push({
            magnitude: 0,
            targetMagnitude: 0,
            frequency: (i + 1) * 20 // 20Hz per bar
        });
    }
}

function getSpectrumColor(index) {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];
    return colors[Math.floor(index / 5) % colors.length];
}
