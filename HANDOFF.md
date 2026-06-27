````md
# Plantasia Handoff

**Project:** Plantasia  
**Status:** Active Development  
**Version:** Alpha

---

# Overview

Plantasia is an interactive browser based synthesizer inspired by classic analog synthesizers, organic environments, and the visual philosophy of Mort Garson's *Plantasia*.

The experience combines a playable synthesizer with real time audio reactive plant animations to create a relaxing, exploratory musical instrument.

---

# Current Features

## Audio

- Polyphonic synthesizer
- Keyboard input
- Oscillator selection
- Filter
- LFO
- Delay
- Echo
- Master Volume
- Preset system

## Visuals

- Waveform visualization
- Audio spectrum visualization
- Flower animation system
- Plant growth visualization
- Particle effects

## User Experience

- ASCII welcome screen
- Press Enter startup
- Luna preset loads by default
- Keyboard instruction popup
- Responsive layout

---

# Design Goals

Plantasia should feel like:

- A vintage analog synthesizer
- A living garden
- An art installation
- A relaxing musical toy
- A modern browser instrument

The interface should remain minimal while providing rich interaction.

---

# Current Architecture

## Audio

Single shared synth engine.

All presets reference the same engine.

All sound controls modify shared synth parameters.

## Visuals

Visual rendering is audio reactive.

Animations should always reflect current synth state.

## State

The application should move toward one centralized state object.

Example:

```javascript
appState = {
  mode,
  preset,
  synth,
  visuals,
  environment
}
```

Avoid duplicate state.

---

# Current Modes

The application is being reorganized into three primary modes.

## EQ Mode

Technical visualization.

Features

- Waveform
- Spectrum
- Oscilloscope
- Frequency response

Purpose

Traditional synthesizer visualization.

---

## Growth Mode

Organic visualization.

Features

- Flower blooming
- Plant growth
- Leaves
- Pollen
- Wind
- Audio reactive animation

Purpose

Sound grows the environment.

---

## Juno Flow Mode

Interactive flower instrument.

Features

- Flower bed
- Clickable flowers
- Keyboard reactive flowers
- Vintage analog aesthetic
- Sunset environment

Purpose

Play the garden like an instrument.

---

# Current Presets

Implemented

- Luna

In Progress

- Juno Flowers

Planned

- Morning Dew
- Moon Moss
- Bloom
- Electric Fern
- Forest Choir
- Golden Moss
- Wind Garden

---

# Immediate Priorities

## High Priority

Finish Mode system.

Connect every sound control to actual audio parameters.

Improve analog sound quality.

Finish Juno Flowers preset.

Strengthen visual feedback.

Refactor application state.

---

## Medium Priority

Preset browser improvements.

Additional environments.

Performance optimization.

Recording.

MIDI.

---

## Low Priority

Cloud presets.

Sharing.

Community.

---

# Audio Goals

Move away from a basic Web Audio demo.

Create a warm analog character.

Implement

- Oscillator drift
- Voice variation
- Stereo width
- Chorus
- Tape saturation
- Analog noise
- Better filters
- Smoother envelopes

All parameter changes should be smoothed.

No clicks.

No zipper noise.

---

# Visual Goals

Every sound parameter should visibly affect the environment.

Examples

Volume

- Flower size

Filter

- Brightness

Delay

- Light trails

Echo

- Bloom repeats

LFO

- Plant breathing

Pitch

- Color movement

Tempo

- Wind speed

The visuals should never feel decorative.

They should behave like an extension of the instrument.

---

# UX Goals

Immediate playability.

No setup required.

Beautiful first impression.

Fast startup.

Minimal controls.

Rich interaction.

Everything should encourage experimentation.

---

# Coding Standards

- Preserve existing functionality.
- Refactor instead of rewriting.
- Keep components modular.
- Keep audio and visuals synchronized.
- Avoid duplicate logic.
- Use descriptive naming.
- Keep animations performant.
- Target 60 FPS.
- Keep latency as low as possible.

---

# Definition of Version 1.0

Plantasia 1.0 should include:

- Welcome experience
- Three visual modes
- Mature analog sound engine
- Complete preset library
- Responsive UI
- Audio reactive visuals
- Interactive flower garden
- MIDI support
- Recording
- Preset saving
- Stable performance
- Public deployment

---

# Long Term Vision

Plantasia should become a browser based audiovisual instrument where users grow music instead of simply playing notes.

The experience should blend the warmth of vintage analog synthesizers with living, responsive environments that make every performance unique.
````
