/**
 * Plantasia Signature Sound Engine
 * Analog imperfection, living modulation, botanical routing, growth stages.
 */
(function (global) {
  'use strict';

  const NEON_GREEN = '#39ff14';
  const SYNTH_SMOOTH = 0.045;
  const LIVE_ATTACK_SEC = 0.002;
  const GROWTH_STAGES = ['seed', 'sprout', 'leaves', 'bud', 'bloom', 'pollination'];
  const GROWTH_THRESHOLDS_MS = [0, 400, 1200, 2500, 4500, 8000];

  const STAGE_BLEND = {
    seed: { filter: 0.5, chorus: 0, reverb: 0.08, delay: 0, stereo: 0.25, sat: 0.08, shimmer: 0, visual: 0.15 },
    sprout: { filter: 0.68, chorus: 0.18, reverb: 0.22, delay: 0.12, stereo: 0.42, sat: 0.18, shimmer: 0.12, visual: 0.35 },
    leaves: { filter: 0.82, chorus: 0.32, reverb: 0.42, delay: 0.28, stereo: 0.58, sat: 0.32, shimmer: 0.22, visual: 0.55 },
    bud: { filter: 0.92, chorus: 0.52, reverb: 0.62, delay: 0.42, stereo: 0.72, sat: 0.42, shimmer: 0.38, visual: 0.75 },
    bloom: { filter: 1, chorus: 0.82, reverb: 0.82, delay: 0.58, stereo: 0.95, sat: 0.52, shimmer: 0.58, visual: 1 },
    pollination: { filter: 0.98, chorus: 0.72, reverb: 0.95, delay: 0.72, stereo: 1, sat: 0.48, shimmer: 0.72, visual: 1.1 }
  };

  function defaultBotanical(reverb) {
    return {
      morningMist: { mix: reverb || 0.5, size: 0.38, damp: 0.65 },
      roots: { shelfGain: 2.5, sub: 0.15, sat: 0.18 },
      pollen: { width: 0.4, chorusRate: 0.32, chorusDepth: 0.38, shimmer: 0.25 },
      photosynthesis: { sat: 0.22, lift: 0.3, clip: 0.12 },
      canopy: { spread: 0.5, chorusWidth: 0.45, reverbWidth: 0.5 },
      wind: { depth: 0.28, rate: 0.07, drift: 0.18 }
    };
  }

  function defaultSound(legacy) {
    return {
      waveform: legacy.waveform || 'triangle',
      filterType: legacy.filterType || 'lowpass',
      filterFreq: legacy.filterFreq || 1400,
      filterQ: legacy.filterQ || 4,
      attack: legacy.attack != null ? legacy.attack : 0.12,
      release: legacy.release != null ? legacy.release : 1,
      detuneCents: legacy.detuneCents || [-6, 0, 6],
      pan: legacy.pan != null ? legacy.pan : 0,
      delay: legacy.delay != null ? legacy.delay : 0.35,
      echo: legacy.echo != null ? legacy.echo : 0.25,
      reverb: legacy.reverb != null ? legacy.reverb : 0.45,
      drift: legacy.drift != null ? legacy.drift : 0.55,
      chorus: legacy.chorus != null ? legacy.chorus : 0.35,
      saturation: legacy.saturation != null ? legacy.saturation : 0.22,
      stereoWidth: legacy.stereoWidth != null ? legacy.stereoWidth : 0.45,
      subAmount: legacy.subAmount != null ? legacy.subAmount : 0.12,
      hfRolloff: legacy.hfRolloff != null ? legacy.hfRolloff : 6000
    };
  }

  function defaultGrowth() {
    return { speed: 1, bloomIntensity: 1, movementAmount: 1, particleAmount: 1 };
  }

  function defaultVisuals(color) {
    return {
      palette: [color || NEON_GREEN],
      flowerType: 'ascii',
      environment: 'garden',
      particleStyle: 'pollen',
      lighting: 'neon',
      animationStyle: 'organic'
    };
  }

  /** Legacy flat presets — normalized on load */
  const LEGACY_PRESETS = {
    plants: { scale: [174, 220, 285, 396, 528, 660], color: NEON_GREEN, waveform: 'triangle', attack: 0.25, release: 2, detuneCents: [-7, 0, 7], pan: 0, filterType: 'lowpass', filterFreq: 1800, delay: 0.4, echo: 0.34, reverb: 0.5 },
    mold: { scale: [432, 639, 741, 852], color: NEON_GREEN, waveform: 'sawtooth', attack: 0.04, release: 0.7, detuneCents: [-10, 0, 10], pan: function () { return Math.random() * 2 - 1; }, filterType: 'bandpass', filterFreq: 1100, delay: 0.5, echo: 0.51, reverb: 0.25 },
    bacteria: { scale: [528, 554, 585, 728, 311], color: NEON_GREEN, waveform: 'square', attack: 0.01, release: 0.18, detuneCents: [-12, 0, 12], pan: function () { return Math.random() * 2 - 1; }, filterType: 'highpass', filterFreq: 1400, delay: 0.2, echo: 0.17, reverb: 0.12 },
    mushrooms: { scale: [417, 444, 528, 639, 392], color: NEON_GREEN, waveform: 'sine', attack: 0.11, release: 1.1, detuneCents: [-6, 0, 6], pan: function () { return Math.sin(performance.now() / 950); }, filterType: 'lowpass', filterFreq: 1600, delay: 0.38, echo: 0.24, reverb: 0.44 },
    harmony: { scale: [261, 329, 392, 466, 528, 639], color: NEON_GREEN, waveform: 'triangle', attack: 0.27, release: 2.1, detuneCents: [-8, 0, 8], pan: 0, filterType: 'lowpass', filterFreq: 2400, delay: 0.22, echo: 0.32, reverb: 0.63 },
    plantasiaClassic: { scale: [174, 220, 261.63, 329.63, 392, 523.25], color: NEON_GREEN, waveform: 'triangle', attack: 0.35, release: 2.8, detuneCents: [-7, 0, 7], pan: 0, filterType: 'lowpass', filterFreq: 1400, delay: 0.23, echo: 0.32, reverb: 0.44 },
    greenhouse: { scale: [432, 512, 538, 576, 648], color: NEON_GREEN, waveform: 'sine', attack: 0.45, release: 2.5, detuneCents: [-12, -3, 7, 12], pan: 0, filterType: 'lowpass', filterFreq: 500, delay: 0.4, echo: 0.5, reverb: 0.65 },
    cosmicdew: { scale: [528, 1056, 792, 1584, 2112], color: NEON_GREEN, waveform: 'triangle', attack: 0.6, release: 3.2, detuneCents: [-24, 0, 11], pan: function () { return Math.sin(performance.now() / 370); }, filterType: 'highpass', filterFreq: 800, delay: 0.6, echo: 0.7, reverb: 1 },
    daybeam: { scale: [440, 660, 880, 990, 1320], color: NEON_GREEN, waveform: 'sawtooth', attack: 0.09, release: 0.18, detuneCents: [-4, 0, 4], pan: function () { return Math.random() * 2 - 1; }, filterType: 'bandpass', filterFreq: 1200, delay: 0.2, echo: 0.4, reverb: 0.22 },
    spiralback: { scale: [321.9, 521.3, 843.2, 987, 1598.3], color: NEON_GREEN, waveform: 'triangle', attack: 0.21, release: 0.89, detuneCents: [-13, 0, 8, 21], pan: 0, filterType: 'lowpass', filterFreq: 987, delay: 0.618, echo: 0.382, reverb: 0.5 },
    rockflora: { scale: [440, 660, 880, 1350, 1760], color: NEON_GREEN, waveform: 'square', attack: 0.03, release: 0.13, detuneCents: [-8, 0, 8], pan: function () { return Math.random() * 2 - 1; }, filterType: 'highpass', filterFreq: 1350, delay: 0.18, echo: 0.28, reverb: 0.15 },
    mycomurk: { scale: [198, 259, 396, 420, 792], color: NEON_GREEN, waveform: 'sawtooth', attack: 0.22, release: 2.1, detuneCents: [-24, 0, 12, 19], pan: function () { return Math.random() * 2 - 1; }, filterType: 'lowpass', filterFreq: 420, delay: 0.35, echo: 0.45, reverb: 0.6 },
    microburst: { scale: [333, 666, 999, 555, 777], color: NEON_GREEN, waveform: 'triangle', attack: 0.01, release: 0.07, detuneCents: [-18, 0, 4, 13], pan: function () { return Math.random() * 2 - 1; }, filterType: 'highpass', filterFreq: 1300, delay: 0.1, echo: 0.9, reverb: 0.18 },
    fibonaccishift: { scale: [233, 377, 610, 987, 1597], color: NEON_GREEN, waveform: 'triangle', attack: 0.07, release: 0.3, detuneCents: [-21, 0, 5, 13], pan: 0, filterType: 'bandpass', filterFreq: 987, delay: 0.377, echo: 0.233, reverb: 0.23 },
    luna: {
      scale: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.30, 440, 466.16, 493.88, 523.25],
      color: NEON_GREEN, waveform: 'sawtooth', attack: 0.08, release: 1.2, detuneCents: [-12, -6, 0, 6, 12],
      pan: function () { return (Math.random() - 0.5) * 0.4; }, filterType: 'lowpass', filterFreq: 2200,
      delay: 0.38, echo: 0.25, reverb: 0.55, drift: 0.65, chorus: 0.45, saturation: 0.28, stereoWidth: 0.55, subAmount: 0.18
    },
    junoflowers: {
      name: 'Juno Flowers',
      category: 'Vintage Analog',
      scale: [261.63, 293.66, 329.63, 392, 440, 523.25, 659.25],
      color: NEON_GREEN,
      sound: {
        waveform: 'sawtooth',
        filterType: 'lowpass',
        filterFreq: 1750,
        filterQ: 2.4,
        attack: 0.38,
        release: 2.6,
        detuneCents: [-14, -7, 0, 7, 14],
        pan: function () { return (Math.random() - 0.5) * 0.35; },
        delay: 0.32,
        echo: 0.22,
        reverb: 0.62,
        drift: 0.88,
        chorus: 0.68,
        saturation: 0.38,
        stereoWidth: 0.75,
        subAmount: 0.32,
        hfRolloff: 4200
      },
      botanical: {
        morningMist: { mix: 0.62, size: 0.46, damp: 0.74 },
        roots: { shelfGain: 4.2, sub: 0.32, sat: 0.28 },
        pollen: { width: 0.58, chorusRate: 0.34, chorusDepth: 0.58, shimmer: 0.42 },
        photosynthesis: { sat: 0.35, lift: 0.42, clip: 0.16 },
        canopy: { spread: 0.72, chorusWidth: 0.68, reverbWidth: 0.58 },
        wind: { depth: 0.38, rate: 0.055, drift: 0.22 }
      },
      growth: { speed: 1.15, bloomIntensity: 1.28, movementAmount: 1.18, particleAmount: 1.35 },
      visuals: {
        palette: ['#39ff14', '#8fbc8f', '#ffb347', '#ff9a5c'],
        flowerType: 'ascii-bloom',
        environment: 'flower-bed',
        particleStyle: 'pollen-drift',
        lighting: 'warm-haze',
        animationStyle: 'juno-burst'
      }
    }
  };

  const presetCache = {};

  function normalizePreset(key, raw) {
    if (presetCache[key]) return presetCache[key];

    const legacy = raw.sound ? null : raw;
    const sound = raw.sound || defaultSound(legacy || raw);
    const botanical = raw.botanical || defaultBotanical(sound.reverb);
    const growth = raw.growth || defaultGrowth();
    const visuals = raw.visuals || defaultVisuals(raw.color || legacy && legacy.color);
    const scale = raw.scale || legacy.scale;
    const color = raw.color || legacy.color || NEON_GREEN;

    const flat = {
      name: raw.name || key,
      category: raw.category || 'Botanical',
      scale,
      color,
      sound,
      botanical,
      growth,
      visuals,
      waveform: sound.waveform,
      attack: sound.attack,
      release: sound.release,
      detuneCents: sound.detuneCents,
      pan: sound.pan,
      filterType: sound.filterType,
      filterFreq: sound.filterFreq,
      filterQ: sound.filterQ,
      delay: sound.delay,
      echo: sound.echo,
      reverb: sound.reverb
    };
    presetCache[key] = flat;
    return flat;
  }

  function buildPresetRegistry() {
    const registry = {};
    Object.keys(LEGACY_PRESETS).forEach(function (key) {
      registry[key] = normalizePreset(key, LEGACY_PRESETS[key]);
    });
    return registry;
  }

  let shaperCurve = null;

  function getShaperCurve(amount) {
    const drive = 1.2 + (amount || 0.2) * 2.2;
    const curve = new Float32Array(65536);
    for (let i = 0; i < 65536; ++i) {
      const x = (i - 32768) / 32768;
      curve[i] = Math.tanh(x * drive) * 0.78 + x * 0.22;
    }
    return curve;
  }

  function smoothRandTarget() {
    return 0.15 + Math.random() * 0.7;
  }

  function getGrowthStage(holdMs, growthSpeed) {
    const t = holdMs * (growthSpeed || 1);
    let idx = 0;
    for (let i = GROWTH_THRESHOLDS_MS.length - 1; i >= 0; i--) {
      if (t >= GROWTH_THRESHOLDS_MS[i]) idx = i;
    }
    return { index: idx, name: GROWTH_STAGES[idx], blend: STAGE_BLEND[GROWTH_STAGES[idx]] };
  }

  function createBotanicalGraph(audioCtx) {
    const t = audioCtx.currentTime;
    const graph = { audioCtx };

    graph.liveBus = audioCtx.createGain();
    graph.liveBus.gain.value = 1;

    graph.rootsShelf = audioCtx.createBiquadFilter();
    graph.rootsShelf.type = 'lowshelf';
    graph.rootsShelf.frequency.value = 180;
    graph.rootsShelf.gain.value = 0;

    graph.photoShaper = audioCtx.createWaveShaper();
    graph.photoShaper.curve = getShaperCurve();
    graph.photoShaper.oversample = '2x';

    graph.liveFilter = audioCtx.createBiquadFilter();
    graph.liveFilter.type = 'lowpass';
    graph.liveFilter.frequency.value = 1400;
    graph.liveFilter.Q.value = 4;

    graph.pollenIn = audioCtx.createGain();
    graph.pollenIn.gain.value = 1;
    graph.pollenDelayL = audioCtx.createDelay(0.05);
    graph.pollenDelayR = audioCtx.createDelay(0.05);
    graph.pollenDelayL.delayTime.value = 0.012;
    graph.pollenDelayR.delayTime.value = 0.018;
    graph.pollenMerge = audioCtx.createGain();
    graph.pollenMerge.gain.value = 0;

    graph.fxDry = audioCtx.createGain();
    graph.fxDelay = audioCtx.createDelay(2);
    graph.fxDelayFb = audioCtx.createGain();
    graph.fxDelayWet = audioCtx.createGain();
    graph.fxDry.gain.value = 1;
    graph.fxDelayFb.gain.value = 0.25;
    graph.fxDelayWet.gain.value = 0.2;

    graph.morningMistIn = audioCtx.createGain();
    graph.morningMistDelay = audioCtx.createDelay(1.2);
    graph.morningMistFb = audioCtx.createGain();
    graph.morningMistDamp = audioCtx.createBiquadFilter();
    graph.morningMistWet = audioCtx.createGain();
    graph.morningMistDelay.delayTime.value = 0.38;
    graph.morningMistFb.gain.value = 0.32;
    graph.morningMistDamp.type = 'lowpass';
    graph.morningMistDamp.frequency.value = 2200;
    graph.morningMistWet.gain.value = 0.25;
    graph.morningMistIn.gain.value = 0.55;

    graph.windPan = audioCtx.createStereoPanner();
    graph.windPan.pan.value = 0;
    graph.windLfo = audioCtx.createOscillator();
    graph.windGain = audioCtx.createGain();
    graph.windLfo.type = 'sine';
    graph.windLfo.frequency.value = 0.07;
    graph.windGain.gain.value = 0;
    graph.windLfo.connect(graph.windGain);
    graph.windGain.connect(graph.windPan.pan);
    graph.windLfo.start();

    graph.masterLimiter = audioCtx.createDynamicsCompressor();
    graph.masterLimiter.threshold.value = -4;
    graph.masterLimiter.knee.value = 2;
    graph.masterLimiter.ratio.value = 16;
    graph.masterLimiter.attack.value = 0.003;
    graph.masterLimiter.release.value = 0.12;

    graph.liveBus.connect(graph.rootsShelf);
    graph.rootsShelf.connect(graph.photoShaper);
    graph.photoShaper.connect(graph.liveFilter);

    graph.liveFilter.connect(graph.pollenIn);
    graph.pollenIn.connect(graph.fxDry);
    graph.pollenIn.connect(graph.pollenDelayL);
    graph.pollenIn.connect(graph.pollenDelayR);
    graph.pollenDelayL.connect(graph.pollenMerge);
    graph.pollenDelayR.connect(graph.pollenMerge);

    graph.liveFilter.connect(graph.fxDelay);
    graph.fxDelay.connect(graph.fxDelayFb);
    graph.fxDelayFb.connect(graph.fxDelay);
    graph.fxDelay.connect(graph.fxDelayWet);

    graph.fxDry.connect(graph.morningMistIn);
    graph.morningMistIn.connect(graph.morningMistDelay);
    graph.morningMistDelay.connect(graph.morningMistDamp);
    graph.morningMistDamp.connect(graph.morningMistFb);
    graph.morningMistFb.connect(graph.morningMistDelay);
    graph.morningMistDelay.connect(graph.morningMistWet);

    graph.fxDry.connect(graph.windPan);
    graph.fxDelayWet.connect(graph.windPan);
    graph.morningMistWet.connect(graph.windPan);
    graph.pollenMerge.connect(graph.windPan);

    return graph;
  }

  function wireBotanicalOutputs(graph, masterGain, analyser) {
    graph.windPan.connect(graph.masterLimiter);
    graph.masterLimiter.connect(masterGain);
    graph.liveBus.connect(analyser);
  }

  function syncBotanical(graph, synthState, preset) {
    if (!graph || !graph.audioCtx) return;
    const t = graph.audioCtx.currentTime;
    const smooth = SYNTH_SMOOTH;
    const bot = preset.botanical || defaultBotanical(preset.reverb);
    const sound = preset.sound || preset;

    graph.liveFilter.type = synthState.filterType || sound.filterType || 'lowpass';
    graph.liveFilter.frequency.setTargetAtTime(synthState.filterHz, t, smooth);
    graph.liveFilter.Q.setTargetAtTime(sound.filterQ || synthState.filterQ || 4, t, smooth);

    const beatSec = 60 / (synthState.bpm || 90);
    graph.fxDelay.delayTime.setTargetAtTime(Math.max(0.04, beatSec * 0.375), t, smooth);

    const echoFb = Math.min(0.72, synthState.echoFeedback);
    graph.fxDelayFb.gain.setTargetAtTime(echoFb, t, smooth);

    const wet = Math.max(0, Math.min(1, synthState.delayMix));
    graph.fxDelayWet.gain.setTargetAtTime(wet * 0.58, t, smooth);
    graph.fxDry.gain.setTargetAtTime(1 - wet * 0.22, t, smooth);

    const mist = bot.morningMist;
    graph.morningMistWet.gain.setTargetAtTime(
      Math.min(0.55, mist.mix * 0.42 + synthState.reverbDepth * 0.22), t, smooth
    );
    graph.morningMistIn.gain.setTargetAtTime(0.45 + mist.mix * 0.35, t, smooth);
    graph.morningMistDelay.delayTime.setTargetAtTime(mist.size || 0.38, t, smooth);
    graph.morningMistDamp.frequency.setTargetAtTime(800 + mist.damp * 3200, t, smooth);
    graph.morningMistFb.gain.setTargetAtTime(0.18 + mist.mix * 0.28, t, smooth);

    const roots = bot.roots;
    graph.rootsShelf.gain.setTargetAtTime(roots.shelfGain || 0, t, smooth);

    const pollen = bot.pollen;
    const chorusDepth = (pollen.chorusDepth || 0.3) * (pollen.width || 0.4);
    graph.pollenMerge.gain.setTargetAtTime(chorusDepth * 0.35, t, smooth);
    graph.pollenDelayL.delayTime.setTargetAtTime(0.008 + pollen.chorusRate * 0.02, t, smooth);
    graph.pollenDelayR.delayTime.setTargetAtTime(0.014 + pollen.chorusRate * 0.028, t, smooth);

    const photo = bot.photosynthesis;
    graph.photoShaper.curve = getShaperCurve(photo.sat || 0.2);

    const wind = bot.wind;
    graph.windLfo.frequency.setTargetAtTime(wind.rate || 0.07, t, smooth);
    graph.windGain.gain.setTargetAtTime((wind.depth || 0.25) * 0.45, t, smooth);
  }

  function initVoiceImperfection(preset) {
    const sound = preset.sound || preset;
    const drift = sound.drift || 0.5;
    const width = sound.stereoWidth || 0.45;
    return {
      driftCents: (Math.random() - 0.5) * 10 * drift,
      filterOffset: (Math.random() - 0.5) * 140 * drift,
      attackScale: 0.86 + Math.random() * 0.28,
      releaseScale: 0.9 + Math.random() * 0.2,
      panBase: (Math.random() - 0.5) * 0.42 * width,
      phaseOffset: Math.random() * Math.PI * 2,
      chorusDepthVar: 0.65 + Math.random() * 0.7
    };
  }

  function initVoiceLiving() {
    return {
      nextUpdateMs: 0,
      filterNorm: 0.5,
      panNorm: 0.5,
      detuneNorm: 0.5,
      chorusNorm: 0.5,
      reverbNorm: 0.5,
      delayNorm: 0.5,
      brightNorm: 0.5,
      targets: {
        filter: smoothRandTarget(),
        pan: smoothRandTarget(),
        detune: smoothRandTarget(),
        chorus: smoothRandTarget(),
        reverb: smoothRandTarget(),
        delay: smoothRandTarget(),
        bright: smoothRandTarget()
      }
    };
  }

  function createLiveVoice(options) {
    const audioCtx = options.audioCtx;
    const params = options.params;
    const preset = options.preset;
    const startTime = options.startTime;
    const voiceId = options.voiceId;
    const synthState = options.synthState;
    const graph = options.graph;
    const createVoiceSource = options.createVoiceSource;
    const getLfoDepth = options.getLfoDepth;
    const onGrowthPulse = options.onGrowthPulse;

    const sound = preset.sound || preset;
    const bot = preset.botanical || defaultBotanical(sound.reverb);
    const growthCfg = preset.growth || defaultGrowth();
    const imperfection = initVoiceImperfection(preset);
    const living = initVoiceLiving();
    const growth = {
      holdStartMs: performance.now(),
      stageIndex: 0,
      stage: 'seed',
      blend: STAGE_BLEND.seed
    };

    const velScale = params.velocityScale != null ? params.velocityScale : 1;
    const attack = sound.attack * imperfection.attackScale;
    const release = Math.min(sound.release * imperfection.releaseScale, 4);
    const instantAttack = options.instantAttack !== false;

    const voiceFilter = audioCtx.createBiquadFilter();
    voiceFilter.type = sound.filterType || 'lowpass';
    const baseFilter = params.filterFreq || synthState.filterHz;
    voiceFilter.frequency.setValueAtTime(
      Math.min(sound.hfRolloff || 8000, baseFilter + imperfection.filterOffset), startTime
    );
    voiceFilter.Q.setValueAtTime((sound.filterQ || 4) * (0.85 + Math.random() * 0.3), startTime);

    const voiceGain = audioCtx.createGain();
    const peak = 0.24 * velScale * (0.92 + growthCfg.bloomIntensity * 0.08);
    if (instantAttack) {
      voiceGain.gain.setValueAtTime(peak, startTime);
    } else {
      voiceGain.gain.setValueAtTime(0.001, startTime);
      voiceGain.gain.exponentialRampToValueAtTime(
        Math.max(peak, 0.001), startTime + attack
      );
    }

    const panNode = audioCtx.createStereoPanner();
    const panVal = typeof sound.pan === 'function' ? sound.pan() : (sound.pan || 0);
    panNode.pan.setValueAtTime(panVal + imperfection.panBase, startTime);

    const delaySend = audioCtx.createGain();
    delaySend.gain.value = 0.15;
    const reverbSend = audioCtx.createGain();
    reverbSend.gain.value = 0.12;

    const lfoRate = synthState.lfoRate;
    const lfoAmt = synthState.lfoAmount;
    const lfoDest = synthState.lfoDest;
    const lfoDepth = getLfoDepth(lfoDest, lfoAmt);

    let voiceLfo = null;
    let voiceLfoGain = null;
    const voiceOscillators = [];

    if (lfoDepth > 0 && lfoDest !== 'filter' && lfoDest !== 'flowers') {
      voiceLfo = audioCtx.createOscillator();
      voiceLfo.type = 'sine';
      voiceLfo.frequency.setValueAtTime(lfoRate, startTime);
      voiceLfoGain = audioCtx.createGain();
      voiceLfoGain.gain.setValueAtTime(lfoDepth, startTime);
      voiceLfo.connect(voiceLfoGain);
      voiceLfo.start(startTime);
      if (lfoDest === 'volume') voiceLfoGain.connect(voiceGain.gain);
      if (lfoDest === 'pan') voiceLfoGain.connect(panNode.pan);
    }

    const wf = synthState.waveform;
    const cents = sound.detuneCents || params.detuneCents || [-5, 0, 5];
    const driftBase = imperfection.driftCents;

    cents.forEach(function (offset, idx) {
      const phaseDrift = (Math.random() - 0.5) * 4;
      const voice = createVoiceSource(wf, audioCtx);
      const freq = params.freq;
      if (voice.isNoise) {
        voice.source.connect(voiceGain);
        voice.source.start(startTime);
      } else {
        voice.source.frequency.setValueAtTime(freq, startTime);
        const detuneVal = offset + driftBase + phaseDrift;
        if (lfoDepth > 0 && lfoDest === 'pitch' && voiceLfoGain) {
          voiceLfoGain.connect(voice.source.detune);
          voice.source.detune.setValueAtTime(detuneVal, startTime);
        } else {
          voice.source.detune.setValueAtTime(detuneVal, startTime);
        }
        voice.source.connect(voiceGain);
        voice.source.start(startTime);
      }
      voiceOscillators.push(voice.source);
    });

    if ((sound.subAmount || bot.roots.sub || 0) > 0.05) {
      const subAmt = (sound.subAmount || 0) + (bot.roots.sub || 0);
      const sub = audioCtx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(params.freq * 0.5, startTime);
      const subGain = audioCtx.createGain();
      subGain.gain.setValueAtTime(subAmt * 0.22 * velScale, startTime);
      sub.connect(subGain);
      subGain.connect(voiceGain);
      sub.start(startTime);
      voiceOscillators.push(sub);
    }

    voiceGain.connect(voiceFilter);
    voiceFilter.connect(panNode);
    panNode.connect(graph.liveBus);
    panNode.connect(delaySend);
    delaySend.connect(graph.fxDelay);
    panNode.connect(reverbSend);
    reverbSend.connect(graph.morningMistIn);

    if (onGrowthPulse) onGrowthPulse();

    return {
      voiceId,
      gainNode: voiceGain,
      voiceFilter,
      panNode,
      delaySend,
      reverbSend,
      oscillators: voiceOscillators,
      lfo: voiceLfo,
      release,
      imperfection,
      living,
      growth,
      growthCfg,
      preset,
      botanical: bot,
      sound,
      stageVisual: 0.15
    };
  }

  function tickLivingVoice(voice, audioCtx) {
    if (!voice || !audioCtx) return null;
    const nowMs = performance.now();
    const holdMs = nowMs - voice.growth.holdStartMs;
    const gs = getGrowthStage(holdMs, voice.growthCfg.speed);
    voice.growth.stageIndex = gs.index;
    voice.growth.stage = gs.name;
    voice.growth.blend = gs.blend;
    voice.stageVisual = gs.blend.visual * (voice.growthCfg.bloomIntensity || 1);

    if (nowMs >= voice.living.nextUpdateMs) {
      voice.living.nextUpdateMs = nowMs + 1800 + Math.random() * 2200;
      voice.living.targets = {
        filter: smoothRandTarget(),
        pan: smoothRandTarget(),
        detune: smoothRandTarget(),
        chorus: smoothRandTarget(),
        reverb: smoothRandTarget(),
        delay: smoothRandTarget(),
        bright: smoothRandTarget()
      };
    }

    const ease = 0.018;
    const living = voice.living;
    Object.keys(living.targets).forEach(function (k) {
      const normKey = k + 'Norm';
      if (living[normKey] != null) {
        living[normKey] += (living.targets[k] - living[normKey]) * ease;
      }
    });

    const blend = voice.growth.blend;
    const bot = voice.botanical;
    const sound = voice.sound;
    const imp = voice.imperfection;
    const t = audioCtx.currentTime;
    const smooth = 0.08;

    const filterMul = blend.filter * (0.7 + living.filterNorm * 0.6);
    const baseF = sound.filterFreq || 1400;
    const targetF = Math.min(
      sound.hfRolloff || 8000,
      baseF * filterMul + imp.filterOffset + living.filterNorm * 280
    );
    voice.voiceFilter.frequency.setTargetAtTime(targetF, t, smooth);

    const panDepth = (bot.wind.depth || 0.25) * blend.stereo * voice.growthCfg.movementAmount;
    const panTarget = imp.panBase + (living.panNorm - 0.5) * panDepth * 2;
    voice.panNode.pan.setTargetAtTime(panTarget, t, smooth);

    const detuneWander = (living.detuneNorm - 0.5) * 8 * (sound.drift || 0.5);
    voice.oscillators.forEach(function (osc, i) {
      if (osc.detune) {
        try {
          osc.detune.setTargetAtTime(imp.driftCents + detuneWander + i * 0.5, t, smooth);
        } catch (e) { /* ignore stopped osc */ }
      }
    });

    const revSend = (blend.reverb + living.reverbNorm * 0.25) * (bot.morningMist.mix || 0.5);
    voice.reverbSend.gain.setTargetAtTime(Math.min(0.65, revSend * 0.35), t, smooth);

    const dlySend = (blend.delay + living.delayNorm * 0.2) * (sound.delay || 0.35);
    voice.delaySend.gain.setTargetAtTime(Math.min(0.55, dlySend * 0.4), t, smooth);

    const brightLift = (blend.shimmer + living.brightNorm * 0.3) * (bot.pollen.shimmer || 0.2);
    voice.gainNode.gain.setTargetAtTime(
      Math.min(0.38, voice.gainNode.gain.value + brightLift * 0.02), t, smooth
    );

    return {
      stage: voice.growth.stage,
      stageVisual: voice.stageVisual,
      filterOpen: filterMul,
      shimmer: blend.shimmer + living.chorusNorm * 0.2,
      pan: panTarget
    };
  }

  function tickAllLivingVoices(activeVoices, audioCtx) {
    let maxVisual = 0;
    let maxStage = 0;
    let shimmer = 0;
    let windPan = 0;
    let chorusAmt = 0;
    let reverbHaze = 0;
    let delayTrail = 0;
    let growthLevel = 0;
    let count = 0;

    activeVoices.forEach(function (voice) {
      const r = tickLivingVoice(voice, audioCtx);
      if (!r) return;
      count++;
      maxVisual = Math.max(maxVisual, r.stageVisual);
      maxStage = Math.max(maxStage, voice.growth.stageIndex);
      shimmer = Math.max(shimmer, r.shimmer);
      windPan += r.pan;
      growthLevel = Math.max(growthLevel, r.stageVisual);
    });

    return {
      growthLevel,
      maxStage,
      maxVisual,
      shimmer: count ? shimmer : 0,
      windPan: count ? windPan / count : 0,
      chorusAmt,
      reverbHaze,
      delayTrail,
      voiceCount: count
    };
  }

  function computeVisualState(synthState, preset, livingAgg) {
    const sound = preset.sound || preset;
    const bot = preset.botanical || defaultBotanical(sound.reverb);
    const filterOpen = Math.min(1, synthState.filterHz / (sound.hfRolloff || 5000));
    const resonanceGlow = Math.min(1, (sound.filterQ || 4) / 12);

    return {
      filterOpen,
      volumeScale: synthState.volume / 100,
      echoGlow: Math.min(0.72, synthState.echoFeedback),
      brightness: 0.32 + filterOpen * 0.68 + (livingAgg.shimmer || 0) * 0.25,
      tempoPulse: 0,
      lfoVisual: 0,
      flowerLfo: 0,
      chorusShimmer: (bot.pollen.shimmer || 0.2) + (livingAgg.shimmer || 0),
      reverbHaze: (bot.morningMist.mix || 0.5) * 0.6 + synthState.reverbDepth * 0.4,
      windPan: livingAgg.windPan || 0,
      resonanceGlow,
      growthLevel: livingAgg.growthLevel || 0,
      growthStage: livingAgg.maxStage || 0,
      delayTrail: synthState.delayMix,
      canopySpread: bot.canopy.spread || 0.5,
      palette: preset.visuals && preset.visuals.palette || [preset.color]
    };
  }

  const PlantasiaEngine = {
    NEON_GREEN,
    SYNTH_SMOOTH,
    LIVE_ATTACK_SEC,
    GROWTH_STAGES,
    LEGACY_PRESETS,
    buildPresetRegistry,
    normalizePreset,
    getPreset: function (key) {
      const registry = buildPresetRegistry();
      return registry[key] || registry.plants;
    },
    createBotanicalGraph,
    wireBotanicalOutputs,
    syncBotanical,
    createLiveVoice,
    tickLivingVoice,
    tickAllLivingVoices,
    computeVisualState,
    getGrowthStage,
    STAGE_BLEND
  };

  global.PlantasiaEngine = PlantasiaEngine;
})(typeof window !== 'undefined' ? window : globalThis);
