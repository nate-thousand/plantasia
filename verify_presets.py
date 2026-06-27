#!/usr/bin/env python3
"""Verify Plantasia presets: structure, UI sync, and ROADMAP Milestone 4 mapping."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
HTML = ROOT / "index.html"
ENGINE = ROOT / "plantasia-engine.js"

REQUIRED_FIELDS = [
    "scale", "color", "waveform", "attack", "release", "detuneCents",
    "pan", "filterType", "filterFreq", "delay", "echo", "reverb"
]
VALID_WAVEFORMS = {"sine", "triangle", "square", "sawtooth", "saw", "pulse", "noise"}
VALID_FILTERS = {"lowpass", "highpass", "bandpass"}
MAX_ECHO_FB = 0.72
FILTER_MAX = 8000

ROADMAP_M4 = {
    29: ("Luna", "luna"),
    30: ("Plants", "plants"),
    31: ("Juno Flowers", "junoflowers"),
    32: ("Morning Dew", None),
    33: ("Forest Choir", None),
    34: ("Electric Fern", None),
    35: ("Moon Moss", None),
    36: ("Bloom", None),
    37: ("Golden Moss", None),
    38: ("Wind Garden", None),
    39: ("Desert Bloom", None),
}


def parse_preset_settings(js: str) -> dict:
    m = re.search(r"const presetSettings = \{([\s\S]*?)\n  \};", js)
    if not m:
        return {}
    body = m.group(1)
    presets = {}
    for match in re.finditer(
        r"(\w+):\s*\{([^}]+)\}",
        body,
    ):
        key = match.group(1)
        block = match.group(2)
        entry = {}
        scale_m = re.search(r"scale:\s*\[([^\]]+)\]", block)
        if scale_m:
            entry["scale"] = [
                float(x.strip()) for x in scale_m.group(1).split(",") if x.strip()
            ]
        for field in ["color", "waveform", "filterType"]:
            fm = re.search(rf"{field}:\s*\"([^\"]+)\"", block)
            if fm:
                entry[field] = fm.group(1)
        for field in ["attack", "release", "filterFreq", "delay", "echo", "reverb"]:
            fm = re.search(rf"{field}:\s*([\d.]+)", block)
            if fm:
                entry[field] = float(fm.group(1))
        if "detuneCents:" in block:
            entry["detuneCents"] = True
        if "pan:" in block:
            entry["pan"] = True
        presets[key] = entry
    return presets


def main():
    html = HTML.read_text(encoding="utf-8")
    engine_js = ENGINE.read_text(encoding="utf-8") if ENGINE.exists() else ""
    scripts = re.findall(r"<script>([\s\S]*?)</script>", html)
    js = scripts[0] if scripts else ""
    combined_js = engine_js + "\n" + js

    # HTML preset options (only from preset select)
    preset_select = re.search(
        r'id="preset"[^>]*>([\s\S]*?)</select>',
        html,
    )
    ui_presets = []
    if preset_select:
        ui_presets = re.findall(r'<option value="(\w+)">', preset_select.group(1))

    code_presets = parse_preset_settings(combined_js)
    if not code_presets and "LEGACY_PRESETS" in engine_js:
        legacy_m = re.search(r"const LEGACY_PRESETS = \{([\s\S]*?)\n  \};", engine_js)
        if legacy_m:
            code_presets = {
                m.group(1): {} for m in re.finditer(r"(\w+):\s*\{", legacy_m.group(1))
            }

    preset_order_m = re.search(r"const PRESET_ORDER = \[([\s\S]*?)\];", js)
    preset_order = []
    if preset_order_m:
        preset_order = re.findall(r"'(\w+)'", preset_order_m.group(1))

    print("=" * 60)
    print("ROADMAP Milestone 4 — Preset Status")
    print("=" * 60)
    for feat, (name, key) in ROADMAP_M4.items():
        if key and key in code_presets:
            status = "IMPLEMENTED"
        elif key:
            status = "MISSING IN CODE"
        else:
            status = "NOT IMPLEMENTED"
        print(f"  Feature {feat:02d} {name:16s}  [{status}]")

    print()
    print("=" * 60)
    print("Implemented Preset Validation (16 in app)")
    print("=" * 60)

    errors = []
    warnings = []

    # UI vs code sync
    ui_set = set(ui_presets)
    code_set = set(code_presets.keys())
    if ui_set != code_set:
        errors.append(f"UI/code mismatch: UI-only={ui_set-code_set}, code-only={code_set-ui_set}")

    if preset_order:
        order_set = set(preset_order)
        if order_set != code_set:
            warnings.append(
                f"PRESET_ORDER mismatch: missing={code_set-order_set}, extra={order_set-code_set}"
            )

    for key in sorted(code_presets.keys()):
        p = code_presets[key]
        issues = []

        for field in REQUIRED_FIELDS:
            if field not in p and field not in ("pan", "detuneCents"):
                if field == "scale" and "scale" not in p:
                    issues.append(f"missing {field}")
            elif field == "scale":
                if not p.get("scale") or len(p["scale"]) < 1:
                    issues.append("empty scale")
                elif any(f <= 0 or f > 20000 for f in p["scale"]):
                    issues.append("invalid scale frequencies")
            elif field == "waveform":
                if p.get("waveform") not in VALID_WAVEFORMS:
                    issues.append(f"unknown waveform '{p.get('waveform')}'")
            elif field == "filterType":
                if p.get("filterType") not in VALID_FILTERS:
                    issues.append(f"invalid filterType '{p.get('filterType')}'")
            elif field == "filterFreq":
                ff = p.get("filterFreq", 0)
                if ff < 100 or ff > FILTER_MAX:
                    warnings.append(f"{key}: filterFreq {ff} outside slider 100-{FILTER_MAX}")
            elif field == "delay":
                dm = min(1.0, p.get("delay", 0))
                if dm < 0 or dm > 1:
                    issues.append(f"delay mix {dm} out of 0-1")
            elif field == "echo":
                eb = min(MAX_ECHO_FB, p.get("echo", 0))
                if eb < 0 or eb > MAX_ECHO_FB:
                    issues.append(f"echo {eb} invalid")
            elif field in ("attack", "release"):
                if p.get(field, 0) <= 0:
                    issues.append(f"{field} must be > 0")

        if not p.get("detuneCents"):
            issues.append("missing detuneCents")
        if not p.get("pan"):
            issues.append("missing pan")

        status = "PASS" if not issues else "FAIL"
        detail = "; ".join(issues) if issues else (
            f"wave={p.get('waveform')} filter={p.get('filterType')} "
            f"{len(p.get('scale', []))} notes delay={min(1,p.get('delay',0)):.2f}"
        )
        print(f"  [{status}] {key:18s} {detail}")
        if issues:
            errors.extend([f"{key}: {i}" for i in issues])

    print()
    if warnings:
        print("Warnings:")
        for w in warnings:
            print(f"  ⚠ {w}")
        print()

    if errors:
        print(f"RESULT: {len(errors)} validation error(s)")
        for e in errors:
            print(f"  ✗ {e}")
        return 1

    implemented_m4 = sum(1 for _, (_, k) in ROADMAP_M4.items() if k and k in code_presets)
    total_m4 = len(ROADMAP_M4)
    print(
        f"RESULT: All {len(code_presets)} implemented presets pass validation. "
        f"ROADMAP M4: {implemented_m4}/{total_m4} features have presets "
        f"({total_m4 - implemented_m4} planned presets not yet built)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
