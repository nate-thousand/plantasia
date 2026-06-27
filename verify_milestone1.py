#!/usr/bin/env python3
"""Static verification for ROADMAP Milestone 1 (Features 01-10)."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
HTML = ROOT / "index.html"

def main():
    html = HTML.read_text(encoding="utf-8")
    scripts = re.findall(r"<script>([\s\S]*?)</script>", html)
    if not scripts:
        print("FAIL: No inline script found")
        return 1
    js = scripts[0]

    checks = []

    def check(feature, name, ok, detail=""):
        status = "PASS" if ok else "FAIL"
        checks.append((feature, name, ok))
        msg = f"[{status}] Feature {feature:02d} {name}"
        if detail:
            msg += f" — {detail}"
        print(msg)

    # Feature 01 — Core Synth Engine
    f01 = all(x in js for x in [
        "function initAudio", "liveBus", "liveFilter", "masterGain",
        "function syncAudioEngine", "function playLiveVoice", "synthState"
    ])
    check(1, "Core Synth Engine", f01)

    # Feature 02 — Keyboard Input
    f02 = "KEY_NOTE_MAP" in js and "keydown" in js and "holdNote('kb-'" in js
    key_count = len(re.findall(r"Key[A-Z]:", js))
    check(2, "Keyboard Input", f02 and key_count >= 10, f"{key_count} key mappings")

    # Feature 03 — Polyphonic Playback
    f03 = "MAX_VOICES" in js and "activeVoices" in js and "function releaseNote" in js
    max_v = re.search(r"MAX_VOICES\s*=\s*(\d+)", js)
    check(3, "Polyphonic Playback", f03, f"MAX_VOICES={max_v.group(1) if max_v else '?'}")

    # Feature 04 — Oscillator Selection
    wf_opts = re.findall(r'<option value="(sine|triangle|sawtooth|square|pulse|noise)"', html)
    f04 = "createVoiceSource" in js and len(set(wf_opts)) >= 6
    check(4, "Oscillator Selection", f04, f"types: {', '.join(sorted(set(wf_opts)))}")

    # Feature 05 — Filter Controls
    f05 = (
        'id="filter"' in html
        and "liveFilter.frequency" in js
        and "'filter'" in js  # bound in bindSynthControls
    )
    check(5, "Filter Controls", f05)

    # Feature 06 — LFO Controls
    f06 = all(x in js for x in ["lfoRate", "lfoAmt", "lfoDest", "routeGlobalLfo", "getLfoDepth"])
    lfo_dests = re.findall(r'<option value="(filter|pitch|volume|pan|flowers)"', html)
    check(6, "LFO Controls", f06 and len(lfo_dests) >= 4, f"destinations: {lfo_dests}")

    # Feature 07 — Delay & Echo
    f07 = all(x in js for x in ["fxDelay", "fxDelayFb", "fxDelayWet", "echoFeedback", "delayMix"])
    check(7, "Delay & Echo", f07)

    # Feature 08 — Master Controls
    f08 = all(f'id="{c}"' in html for c in ["volume", "freq", "bpm"])
    f08 = f08 and "pitchFromBase" in js and "MAX_MASTER" in js
    check(8, "Master Controls", f08)

    # Feature 09 — Preset System
    presets = re.findall(r'option value="(\w+)"', html)
    preset_keys = re.search(r"const presetSettings = \{([\s\S]*?)\n  \};", js)
    preset_count = len(re.findall(r"\w+:\s*\{", preset_keys.group(1) if preset_keys else ""))
    f09 = "applyPresetToSynth" in js and (
      preset_count >= 10 or "buildPresetRegistry" in js
    )
    check(9, "Preset System", f09, f"{preset_count} presets in presetSettings")

    # Feature 10 — Initial Plant Visuals
    f10 = all(x in js for x in ["growVineFrame", "drawJunoFrame", "function animate"])
    check(10, "Initial Plant Visuals", f10)

    # Structural integrity
    brace_ok = js.count("{") == js.count("}")
    paren_ok = js.count("(") == js.count(")")
    check(0, "JS brace balance", brace_ok, f"delta={js.count('{')-js.count('}')}")
    check(0, "JS paren balance", paren_ok)

    # TDZ: readUISynthState before let bpm
    read_pos = js.find("readUISynthState();")
    bpm_pos = js.find("let bpm = 90")
    check(0, "Init order (bpm before readUISynthState)", read_pos > bpm_pos if read_pos >= 0 and bpm_pos >= 0 else False)

    failed = [c for c in checks if not c[2] and c[0] > 0]
    print()
    if failed:
        print(f"RESULT: {len(failed)} feature(s) failed static verification")
        return 1
    print("RESULT: All Milestone 1 features (01-10) pass static verification")
    print("Manual smoke test: open index.html, Enter, play keys A S D F, switch modes")
    return 0

if __name__ == "__main__":
    sys.exit(main())
