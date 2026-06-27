# Design the Signature Plantasia Sound Engine

Design specification for evolving Plantasia from a browser synth into a living musical instrument. This document defines intent and direction; implementation status is tracked in [ROADMAP.md](ROADMAP.md).

---

## Goal

Transform Plantasia from a traditional browser synthesizer into a living musical instrument inspired by the behavior of plants, ecosystems, and organic growth.

The objective is **not** to emulate a specific vintage synthesizer. Instead, create a unique sonic identity that combines the warmth of classic analog instruments with evolving, textured, botanical sound design.

Every note should feel alive.

---

## Design Philosophy

Plants do not behave like electronic circuits.

They:

- Grow
- Breathe
- Unfold
- Respond to their environment
- Never repeat exactly
- Exist in ecosystems
- Age over time

The synthesizer should behave the same way.

Avoid static, repetitive, or overly digital sounding synthesis.

Favor subtle movement, harmonic evolution, texture, and organic imperfection.

---

## Living Oscillator Engine

Replace static oscillator behavior with living oscillators.

Each voice should have independent variation.

Implement:

- Slow oscillator drift
- Independent phase movement
- Slight tuning variation
- Harmonic fluctuation
- Gentle stereo wandering
- Voice-to-voice differences

No two notes should ever sound exactly alike.

Movement should be slow enough that it feels natural rather than obvious.

**Implementation notes (current):** Per-voice drift, detune, pan variation, and phase offset in `plantasia-engine.js` `createLiveVoice()`. Living modulation tick updates filter, pan, detune, and sends while held.

---

## Photosynthesis

Replace the idea of static sustained notes with harmonic growth.

While a note is held:

| Stage | Behavior |
|-------|----------|
| **Seed** | Simple tone |
| **Sprout** | Filter slowly opens; additional harmonics appear |
| **Leaves** | Stereo image widens; gentle chorus fades in |
| **Bloom** | Maximum harmonic richness; warm analog saturation; lush reverb |
| **Pollination** | Sound releases harmonic particles through delay and echo before naturally fading away |

Holding a note should feel like watching a flower bloom.

**Implementation notes (current):** Six growth stages (`seed` → `pollination`) in `plantasia-engine.js` driven by hold time, velocity, and preset `growth.speed`. Filter, chorus, reverb, delay, and shimmer blend per stage via `STAGE_BLEND`.

---

## Root System

Replace a traditional sub oscillator with a hidden root layer.

Generate subtle low frequency texture using combinations of:

- Filtered analog noise
- Soft resonances
- Gentle tape hum
- Wooden body resonance
- Very low harmonic reinforcement

This layer should not dominate the sound.

Its purpose is to make the synth feel grounded and physical.

**Implementation notes (current):** Roots botanical block — low shelf + sub oscillator per voice. **Not yet:** filtered noise layer, tape hum, wooden resonance.

---

## Wind Engine

Replace predictable LFO movement with natural motion.

Use:

- Perlin Noise
- Brownian Motion
- Random Walk
- Slow evolving modulation

Route this movement to:

- Filter cutoff
- Stereo position
- Oscillator tuning
- Chorus depth
- Flower movement
- Particle drift

Nothing should repeat on an obvious cycle.

**Implementation notes (current):** Wind botanical autopan LFO + smooth random-walk targets in `tickLivingVoice()`. **Not yet:** Perlin noise, dedicated Brownian paths for all routes.

---

## Bark Texture

Create a texture layer that adds physical character.

Possible sources:

- Tape hiss
- Vinyl crackle
- Filtered pink noise
- Granular leaf recordings
- Analog circuitry noise

Keep this layer subtle.

The listener should feel the texture more than consciously hear it.

**Implementation notes (current):** Not implemented as a dedicated layer. Noise oscillator available per voice; Photosynthesis shaper adds warmth.

---

## Pollination Delay

Replace traditional digital delay repeats.

Each repeat should evolve naturally.

With every repeat:

- Slightly darker
- Slightly softer
- Slightly wider
- Slightly more detuned
- Slightly more degraded

Echoes should feel like pollen drifting away in the wind rather than mechanical repetitions.

**Implementation notes (current):** Tempo-synced delay + echo feedback via shared FX bus. **Not yet:** per-repeat evolution (darken, widen, detune per tap).

---

## Botanical Envelope

Replace traditional ADSR terminology internally and visually.

Growth stages:

- Seed
- Sprout
- Leaves
- Bloom
- Wilt

Each stage should influence:

- Filter
- Harmonics
- Chorus
- Saturation
- Stereo width
- Visual bloom
- Particle intensity

The envelope should represent biological growth rather than voltage over time.

**Implementation notes (current):** Audio stages map to seed–pollination; instant attack on live input with slow harmonic swell via growth engine. **Not yet:** explicit Wilt stage; UI still shows ADSR labels in diagnostics.

---

## Ecosystem Interaction

Notes should influence one another.

When multiple notes are held:

- Harmonics interact
- Stereo field expands
- Chorus becomes richer
- Bloom animations overlap
- Particles merge
- Delay becomes more organic

The synth should behave like interconnected plants sharing an ecosystem.

Playing chords should feel different from simply playing multiple notes.

**Implementation notes (current):** Polyphony with per-voice sends; vine pulse scales with `activeVoices.size`; visual `growthLevel` aggregates held voices. **Not yet:** harmonic interaction, merged particles, chorus cross-voice coupling.

---

## Species System

Rename presets to **Species**.

Each Species represents a living organism with unique sound behavior.

Example Species:

- Fern
- Moss
- Willow
- Lotus
- Orchid
- Bamboo
- Night Bloom
- Golden Ivy
- Moon Orchid

Each Species defines:

- Oscillator behavior
- Harmonic evolution
- Growth speed
- Chorus character
- Delay behavior
- Wind response
- Particle style
- Flower type
- Lighting
- Color palette

Changing Species should feel like entering a completely different ecosystem.

**Implementation notes (current):** Preset personality schema (`sound`, `botanical`, `growth`, `visuals`) in `plantasia-engine.js`. UI still uses legacy preset names (Plants, Luna, Juno Flowers, etc.). **Not yet:** Species rename in UI; full per-species ecosystem differentiation.

---

## Signature Effects

Replace generic effect names in the UI with botanical concepts.

| Name | Role |
|------|------|
| **Morning Mist** | Soft atmospheric reverb |
| **Roots** | Warmth and low frequency body |
| **Pollen** | Stereo shimmer and airy harmonics |
| **Photosynthesis** | Progressive harmonic growth |
| **Canopy** | Stereo width and spaciousness |
| **Wind** | Organic movement and autopan |
| **Rain** | Granular delay |
| **Sap** | Soft analog saturation |

These names should reinforce the Plantasia identity while remaining intuitive.

**Implementation notes (current):** Morning Mist, Roots, Pollen, Photosynthesis, Canopy, Wind implemented in code (`botanical` preset block). **Not yet:** Rain, Sap as named UI controls; Rain granular delay behavior.

---

## Audio Visual Integration

Every sound parameter should influence the environment.

| Parameter | Visual |
|-----------|--------|
| Pitch | Which flowers respond |
| Velocity | Bloom intensity |
| Filter | Lighting and brightness |
| Volume | Flower size |
| Delay | Expanding rings of light |
| Echo | Repeated blooms |
| Wind | Leaf and grass movement |
| Photosynthesis | Plant growth over time |

The visuals should feel like a natural extension of the sound engine.

**Implementation notes (current):** `synthState` → `synthVisual` routing; Juno bursts, Growth vine tip/sparkles/pollen, EQ waveform pulse. See ROADMAP M6 audio↔visual routing.

---

## Sound Direction

The finished instrument should combine qualities inspired by:

- Warm analog polysynths
- Tape machines
- Wooden acoustic resonance
- Field recordings
- Ambient music
- Dream pop
- Organic textures
- Vintage electronic music

Avoid harsh digital brightness or clinical precision.

The instrument should sound:

Warm · Organic · Textured · Evolving · Harmonic · Dreamlike · Calming · Expressive · Immediately recognizable as Plantasia

---

## Technical Requirements

Preserve all existing functionality.

Do not replace the current synth engine unless necessary.

Extend the existing architecture.

Use one shared state system for:

- Audio
- Species
- Modes
- Visuals
- Growth engine
- Effects

Use smooth parameter interpolation throughout.

Prevent clicks, pops, zipper noise, clipping, and runaway feedback.

Maintain responsive performance with low latency and smooth animation.

The final result should feel less like software and more like a living instrument that slowly grows, breathes, and evolves as it is played.

**Implementation notes (current):** `synthState`, `synthVisual`, `plantasia-engine.js` botanical graph, `SYNTH_SMOOTH`, master limiter, instant live attack, visual flush on input. Single `index.html` + engine module architecture.

---

## Related files

| File | Purpose |
|------|---------|
| `plantasia-engine.js` | Botanical FX, living voices, growth stages, preset normalization |
| `index.html` | Modes, visuals, input, UI controls |
| `ROADMAP.md` | Feature checklist vs this design |
| `HANDOFF.md` | Project context and architecture |
