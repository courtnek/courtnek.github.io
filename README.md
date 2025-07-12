# Retro Encabulator Control Panel

## Project Overview
An interactive web-based control interface styled as a fictional machine control system for the classic "Turbo Encabulator" technical parody.

- **File**: `index.html` - A single-page application using Tailwind CSS
- **Theme**: Black background with white text, retro industrial aesthetic
- **Domain**: Originally for "kailean.com" but now focused on the control panel concept

## Current Features

### System Control
- Start/Stop button that enables/disables all controls
- Dynamic efficiency tracking (percentage based on optimal parameter ranges)
- Real-time status updates (OFFLINE/ONLINE/CRITICAL/SUBOPTIMAL/OPTIMAL/MAXIMUM EFFICIENCY)

### Interactive Widgets
Named after Turbo Encabulator components:

1. **Dodge Spurving Bearings** - Bearing lubrication slider (0-100%)
2. **Reliance Electric Motors** - Motor RPM input with sync/reset buttons
3. **Hydrocoptic Marzel Vanes** - Vane angle adjustment buttons
4. **Allen-Bradley Controls** - X/Y/Z axis selection buttons
5. **Ambient Lunar Wane Shaft** - Display-only lunar cycles counter
6. **Rockwell Software** - System halt, reset, and backup controls

### Display Outputs
1. **Malleable Logarithmic Casing** - Animated waveform canvas display
2. **Lotus O-Deltoid Main Winding** - Color-changing status indicator square

### Non-intuitive Interactions
Controls affect each other in unexpected ways:
- Flux slider affects motor frequency when > 70%
- High motor frequency affects vane angles
- Axis selection changes waveform amplitude
- Motor sync affects flux values
- System efficiency calculated from multiple parameter ranges

## Technical Details
- Uses Tailwind CSS via CDN
- JavaScript handles all interactivity and animations
- Canvas-based waveform rendering with real-time updates
- Efficiency calculation based on optimal parameter ranges:
  - Base: 20%
  - Bearings engaged: +25%
  - Motor synced: +20%
  - Flux 60-80%: +15%
  - Pressure 800-900: +10%
  - Frequency 2500-3000: +10%

## Development History

### Recent Commits
- `cb05a80`: Inverted colors to black background with white text
- `0139d0d`: Personalized language, removed social media references  
- `951bc7d`: Created the control panel with interactive widgets
- `6ee2901`: Added dynamic waveform and status indicator displays
- `08f650f`: Renamed widgets with authentic Turbo Encabulator component names
- `dff74fa`: Added system start/stop functionality and efficiency tracking

## Usage
Open `index.html` in a web browser. Start the encabulator and adjust various controls to optimize efficiency. The system responds with visual feedback through the waveform display and status indicators.

The project functions as both a nostalgic control panel simulator and an engaging interactive web toy, paying homage to the classic industrial automation parody.
