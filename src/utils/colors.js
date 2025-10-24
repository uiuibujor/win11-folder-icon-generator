// 颜色转换与调整工具
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp >= 0 && hp < 1) { r1 = c; g1 = x; }
  else if (hp >= 1 && hp < 2) { r1 = x; g1 = c; }
  else if (hp >= 2 && hp < 3) { g1 = c; b1 = x; }
  else if (hp >= 3 && hp < 4) { g1 = x; b1 = c; }
  else if (hp >= 4 && hp < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = l - c / 2;
  const r = (r1 + m) * 255;
  const g = (g1 + m) * 255;
  const b = (b1 + m) * 255;
  return { r, g, b };
}

export function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
export function rgbToCss(r, g, b) { return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`; }

export function parseColor(color) {
  if (color.startsWith('#')) return hexToRgb(color);
  if (color.startsWith('rgb')) {
    const nums = color.match(/\d+/g).map(Number);
    return { r: nums[0], g: nums[1], b: nums[2] };
  }
  return hexToRgb(color);
}

export function adjustHslColor(color, { hShift = 0, sShift = 0, lShift = 0 } = {}) {
  const { r, g, b } = parseColor(color);
  let { h, s, l } = rgbToHsl(r, g, b);
  h = (h + hShift) % 360; if (h < 0) h += 360;
  s = clamp(s + sShift, 0, 100);
  l = clamp(l + lShift, 0, 100);
  const { r: nr, g: ng, b: nb } = hslToRgb(h, s, l);
  return rgbToCss(nr, ng, nb);
}

export function adjustBrightness(color, factor) {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
  const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
  const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getCurrentColor(baseColor, hShift, sShift, lShift) {
  const adjustedColor = adjustHslColor(baseColor, { hShift, sShift, lShift });
  const { r, g, b } = parseColor(adjustedColor);
  return rgbToHex(r, g, b);
}

export function calculateHslShifts(baseColor, selectedColor) {
  const baseRgb = parseColor(baseColor);
  const selectedRgb = parseColor(selectedColor);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  const selectedHsl = rgbToHsl(selectedRgb.r, selectedRgb.g, selectedRgb.b);
  let hShift = selectedHsl.h - baseHsl.h;
  if (hShift > 180) hShift -= 360;
  if (hShift < -180) hShift += 360;
  const sShift = selectedHsl.s - baseHsl.s;
  const lShift = selectedHsl.l - baseHsl.l;
  return {
    hShift: clamp(Math.round(hShift), -180, 180),
    sShift: clamp(Math.round(sShift), -100, 100),
    lShift: clamp(Math.round(lShift), -40, 40)
  };
}