# Plantasia

Plant-inspired generative synth with **growth mode** vine visualization, 14 presets, LFO modulation, and MIDI control. Inspired by Mort Garson's *Plantasia*.

## Launch

Open [`plantasia.html`](plantasia.html) in a browser, or visit the [GitHub Pages site](https://nate-thousand.github.io/plantasia/plantasia.html) after enabling Pages.

No build step — static HTML/CSS/JS.

## Controls

- **☰ Drawer** — open/close the control panel
- **🌱 Growth Mode** — switch from waveform visualizer to generative vine growth
- **Presets** — 14 lifeform-inspired sound palettes
- **OSC/WAVE** — override oscillator waveform
- **LFO** — modulate filter, pitch, or pan
- **Play / Stop** — start or stop generative playback
- **Keyboard 1–9** — hold scale notes; combine for chords (e.g. 1+3+5). **Space** = play/stop
- **MPK Mini** — pads P1–P5 sustained scale notes; keys chromatic; mix any inputs for chords
- **MPK Bank A** (pads 36–43): notes 1–5, preset+, play, stop
- **MPK Bank B** (pads 44–51): delay/echo/filter, data, growth
- **MPK knobs K1–K8** (CC 70–77): delay, echo, filter, volume, BPM, LFO, frequency
- **Joystick** — filter (CC1) · **MIDI Ch 1** · **CC mode OFF** on controller

## Structure

```
plantasia/
├── index.html              → redirects to plantasia.html
├── plantasia.html          ← canonical synth app
├── plantasia-vines.css     ← drawer UI styles (design tokens)
└── foundation/bootstrap/CUSTOM.css  ← color & typography tokens
```

## License

Personal project — use and modify freely.
