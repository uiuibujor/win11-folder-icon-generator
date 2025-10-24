// 渐变与填充工具
export function hexToRgba(hex) {
  if (!hex) return 'rgba(0,0,0,1)';
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

// 解析 linear-gradient 或纯色
export function parseGradientOrColor(value) {
  if (!value || typeof value !== 'string') return { type: 'solid', color: 'rgba(255,255,255,1)' };
  const v = value.trim();
  if (v.startsWith('linear-gradient')) {
    const m = v.match(/linear-gradient\(\s*([\d.]+)deg\s*,\s*(.*)\)/i);
    const angle = m ? parseFloat(m[1]) : 90;
    const stopsRaw = m ? m[2] : v.substring(v.indexOf('(') + 1, v.lastIndexOf(')'));
    const parts = [];
    let buf = '';
    let depth = 0;
    for (const ch of stopsRaw) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        parts.push(buf.trim());
        buf = '';
      } else {
        buf += ch;
      }
    }
    if (buf.trim()) parts.push(buf.trim());
    const stops = parts.map((p, i, arr) => {
      const pm = p.match(/(rgba?\([^\)]+\)|#[0-9a-fA-F]{3,6})\s*(\d+(?:\.\d+)?)%?/);
      const color = pm ? pm[1] : p;
      const offset = pm && pm[2] ? Math.min(1, Math.max(0, parseFloat(pm[2]) / 100)) : (arr.length === 1 ? 0 : i / (arr.length - 1));
      return { color, offset };
    });
    return { type: 'linear', angle, stops: stops.length ? stops : [{ color: v, offset: 0 }, { color: v, offset: 1 }] };
  }
  return { type: 'solid', color: v };
}

// 根据角度在矩形区域内创建 Canvas 渐变
export function makeCanvasGradient(ctx, rect, grad) {
  const { x, y, width, height } = rect;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const len = Math.max(width, height);
  const rad = (grad.angle || 90) * Math.PI / 180;
  const dx = Math.cos(rad) * len;
  const dy = Math.sin(rad) * len;
  const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  grad.stops.forEach(s => g.addColorStop(s.offset, s.color));
  return g;
}

export function getFillStyle(ctx, rect, value) {
  const parsed = parseGradientOrColor(value);
  if (parsed.type === 'solid') return parsed.color;
  if (parsed.type === 'linear') return makeCanvasGradient(ctx, rect, parsed);
  return parsed.color;
}