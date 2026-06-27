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
- **MIDI** — channel selector, MIDI in/out toggle, pad mapping
- **Keyboard** — Space toggles play/stop (when not focused on a control)

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
