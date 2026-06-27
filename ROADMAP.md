# Plantasia Roadmap

Status reflects **code as of June 2026** — checkboxes track implementation in `index.html` + `plantasia-engine.js`, not aspiration.

## Current build (installation release)

**Focus:** Ambient Juno flower field art installation with playable synth.

| Area | Status |
|------|--------|
| Default experience | Enter → Juno Flow mode + Juno Flowers preset |
| Keyboard | Full 25-key chromatic map (C3–C5), matches MPK Mini |
| Sound engine | `plantasia-engine.js` — botanical FX, living modulation, growth stages |
| Latency | Instant live attack, sync `holdNote`, visual flush on keypress, audio pre-warm |
| Visual modes | EQ waveform · Growth vine · Juno ASCII flower bed (25 flowers) |
| Presets | 16 playable (ROADMAP names 3; rest use legacy keys) |
| Deploy | `vercel.json` · static site · GitHub `main` |

**Key files:** `index.html`, `plantasia-engine.js`, `custom.css`, `verify_milestone1.py`, `verify_presets.py`

**Design spec:** [DESIGN_SIGNATURE_SOUND_ENGINE.md](DESIGN_SIGNATURE_SOUND_ENGINE.md) — full sonic identity and botanical engine direction.

---

## Milestone 1 Foundation

- [x] Feature 01 Core Synth Engine
- [x] Feature 02 Keyboard Input
- [x] Feature 03 Polyphonic Playback
- [x] Feature 04 Oscillator Selection
- [x] Feature 05 Filter Controls
- [x] Feature 06 LFO Controls
- [x] Feature 07 Delay & Echo
- [x] Feature 08 Master Controls
- [x] Feature 09 Preset System
- [x] Feature 10 Initial Plant Visuals

---

## Milestone 2 User Experience

- [x] Feature 11 Welcome Screen
- [x] Feature 12 ASCII Plantasia Intro
- [x] Feature 13 Press Enter Experience
- [x] Feature 14 Default Luna Preset — _Luna preset exists; experience loads **Juno Flowers** on Enter_
- [x] Feature 15 Keyboard Instructions Popup
- [ ] Feature 16 Settings Panel
- [ ] Feature 17 About Screen
- [ ] Feature 18 Keyboard Shortcut Overlay

---

## Milestone 3 Sound Engine

- [x] Feature 19 Analog Oscillator Drift — _per-voice drift/detune imperfection in `plantasia-engine.js`_
- [x] Feature 20 Voice Detune
- [x] Feature 21 Stereo Spread
- [x] Feature 22 Chorus Effect — _Pollen botanical stereo chorus_
- [x] Feature 23 Tape Saturation — _Photosynthesis waveshaper_
- [ ] Feature 24 Analog Noise — _noise oscillator only; no dedicated analog noise layer_
- [ ] Feature 25 Improved Filter Model — _per-voice + global biquad; no ladder model_
- [ ] Feature 26 ADSR Editor
- [x] Feature 27 Resonance Control — _preset `filterQ` + live filter Q_
- [x] Feature 28 Multiple Oscillators — _detuned voices + sub oscillator (Roots)_

### Signature Sound Engine (shipped, not in original feature IDs)

_Design direction: [DESIGN_SIGNATURE_SOUND_ENGINE.md](DESIGN_SIGNATURE_SOUND_ENGINE.md)_

- [x] Botanical effect routing — Morning Mist, Roots, Pollen, Photosynthesis, Canopy, Wind
- [x] Living voice modulation — slow random filter/pan/detune/send movement on held notes
- [x] Audio growth stages — seed → sprout → leaves → bud → bloom → pollination (hold time)
- [x] Preset personality schema — `sound`, `botanical`, `growth`, `visuals` via `normalizePreset()`
- [x] Master limiter — dynamics compressor on output bus
- [x] Juno Flowers signature preset — warm saw, sub, chorus, saturation, botanical tuning

---

## Milestone 4 Presets

- [x] Feature 29 Luna
- [x] Feature 30 Plants
- [x] Feature 31 Juno Flowers
- [ ] Feature 32 Morning Dew
- [ ] Feature 33 Forest Choir
- [ ] Feature 34 Electric Fern
- [ ] Feature 35 Moon Moss
- [ ] Feature 36 Bloom
- [ ] Feature 37 Golden Moss
- [ ] Feature 38 Wind Garden
- [ ] Feature 39 Desert Bloom

**Also in app (no ROADMAP name):** mold, bacteria, mushrooms, harmony, plantasiaClassic, greenhouse, cosmicdew, daybeam, spiralback, rockflora, mycomurk, microburst, fibonaccishift

---

## Milestone 5 Visual Modes

- [x] Feature 40 EQ Mode
- [x] Feature 41 Growth Mode — _vine + tip bursts, sparkles, pollen, screen flash_
- [x] Feature 42 Juno Flow Mode — _25 flowers, B&W ASCII, neon bursts, warm haze_
- [x] Feature 43 Mode Selector
- [x] Feature 44 Shared Mode State — `synthState.mode`
- [ ] Feature 45 Animated Mode Transitions

---

## Milestone 6 Audio Reactive Visuals

- [x] Feature 46 Waveform Visualizer
- [ ] Feature 47 Spectrum Analyzer
- [ ] Feature 48 Frequency Response
- [x] Feature 49 Flower Bloom Animation
- [x] Feature 50 Plant Growth System
- [x] Feature 51 Leaf Movement
- [x] Feature 52 Particle System — _growth sparkles + Juno pop particles_
- [x] Feature 53 Pollen Effects
- [x] Feature 54 Light Bloom Effects — _glow, echo trails, growthNoteFlash_
- [ ] Feature 55 Sunset Lighting — _subtle warm haze in Juno; no full sunset palette_

### Audio ↔ visual routing (shipped)

- [x] Pitch → flower / vine tip region
- [x] Velocity → bloom intensity
- [x] Volume → flower size / vine width
- [x] Filter → brightness
- [x] Delay / echo → trails and glow
- [x] Reverb → atmospheric haze
- [x] Chorus → petal shimmer
- [x] LFO → sway / flower breathing
- [x] Pan → wind shift (Juno garden)
- [x] Tempo → pulse / background motion
- [x] Growth level → burst boost (held-note stages)

---

## Milestone 7 Sound Control Improvements

- [x] Feature 56 Tempo Controls Delay
- [x] Feature 57 Tempo Controls Animation
- [x] Feature 58 Frequency Controls Pitch
- [x] Feature 59 Filter Controls Brightness
- [x] Feature 60 Volume Controls Scale
- [x] Feature 61 LFO Routing
- [x] Feature 62 Delay Synchronization
- [x] Feature 63 Echo Feedback
- [x] Feature 64 Parameter Smoothing — `SYNTH_SMOOTH`
- [x] Feature 65 Shared Synth State — `synthState` + `synthVisual`

---

## Milestone 8 Interaction

- [x] Feature 66 Interactive Flower Bed
- [x] Feature 67 Mouse Note Triggering
- [x] Feature 68 Touch Controls
- [x] Feature 69 MIDI Support — _MPK Mini map, pads, knobs, CC_
- [x] Feature 70 Velocity Support
- [ ] Feature 71 Sustain Pedal — _no MIDI CC 64_
- [ ] Feature 72 Chord Mode
- [ ] Feature 73 Scale Mode — _partial: digits 1, 4, 8, 9 = scale indices_

**Keyboard map:** 25-key chromatic C3–C5 (`Z–M` + `Q–I` rows); MPK Mini 25 keys → 25 flowers

---

## Milestone 9 Environments

- [ ] Feature 74 Forest
- [ ] Feature 75 Zen Garden
- [ ] Feature 76 Greenhouse
- [ ] Feature 77 Moon Garden
- [ ] Feature 78 Rainforest
- [ ] Feature 79 Desert
- [ ] Feature 80 Winter Garden

---

## Milestone 10 Recording

- [ ] Feature 81 Audio Recording
- [ ] Feature 82 WAV Export
- [ ] Feature 83 MIDI Export
- [ ] Feature 84 Performance Replay
- [ ] Feature 85 Save Presets
- [ ] Feature 86 Import Presets
- [ ] Feature 87 Share Presets

---

## Milestone 11 Performance

- [ ] Feature 88 60 FPS Optimization — _rAF loops + flush draw; not profiled_
- [ ] Feature 89 Mobile Optimization — _responsive CSS + touch; not tuned_
- [x] Feature 90 Low Latency Audio — _instant live attack, sync input, visual flush, pre-warm on Enter_
- [ ] Feature 91 Accessibility — _partial: ARIA on welcome/guide; no full audit_
- [x] Feature 92 Responsive Layout
- [ ] Feature 93 Performance Profiling

---

## Milestone 12 Version 1.0

- [ ] Feature 94 Complete Preset Library — _16/11 ROADMAP names_
- [ ] Feature 95 Complete Visual Mode System — _3 modes live; no transition animations_
- [ ] Feature 96 Complete Audio Engine — _signature engine shipped; ADSR editor missing_
- [x] Feature 97 MIDI Ready — _input/output, MPK Mini, velocity_
- [ ] Feature 98 Recording Ready
- [ ] Feature 99 Cross Platform Testing
- [ ] Feature 100 Public Release — _installation build on GitHub; not marketed v1.0_

---

## Deferred (post-installation)

Per product direction: ship ambient Juno field first; revisit after release.

- Remaining ROADMAP presets (Morning Dew → Desert Bloom)
- M9 environment themes
- M10 recording / export
- M3 ADSR editor, ladder filter, analog noise layer
- M5 animated mode transitions
- M6 spectrum analyzer, full sunset lighting
