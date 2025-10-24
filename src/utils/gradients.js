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
  if (v.toLowerCase().startsWith('linear-gradient')) {
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
      // 关键修复：支持大小写并加入 hsl/hsla
      const pm = p.match(/(rgba?\([^\)]+\)|hsla?\([^\)]+\)|#[0-9a-fA-F]{3,6})\s*(\d+(?:\.\d+)?)%?/i);
      const color = pm ? pm[1].trim() : p.trim();
      const offset = pm && pm[2] ? Math.min(1, Math.max(0, parseFloat(pm[2]) / 100)) : (arr.length === 1 ? 0 : i / (arr.length - 1));
      return { color, offset };
    });
    return { type: 'linear', angle, stops: stops.length ? stops : [{ color: v, offset: 0 }, { color: v, offset: 1 }] };
  }
  // 新增：支持 radial-gradient 解析（中心环形渐变）
  if (v.toLowerCase().startsWith('radial-gradient')) {
    const rm = v.match(/radial-gradient\(\s*(circle|ellipse)?\s*(?:at\s*([0-9.]+%|left|center|right)\s*([0-9.]+%|top|center|bottom)?)?\s*,\s*(.*)\)/i);
    const shape = rm && rm[1] ? rm[1].toLowerCase() : 'circle';
    let pxToken = rm && rm[2] ? rm[2] : '50%';
    let pyToken = rm && rm[3] ? rm[3] : '50%';
    // 仅一个方向关键字时，另一方向默认居中
    const horizKeywords = ['left','center','right'];
    const vertKeywords = ['top','center','bottom'];
    if (rm && rm[2] && !rm[3]) {
      const t = rm[2].toLowerCase();
      if (vertKeywords.includes(t)) { pxToken = '50%'; pyToken = t; }
      else if (horizKeywords.includes(t)) { pxToken = t; pyToken = '50%'; }
    }
    const parsePos = (p, isX) => {
      if (!p) return 0.5;
      if (p.endsWith('%')) return Math.min(1, Math.max(0, parseFloat(p) / 100));
      switch (p.toLowerCase()) {
        case 'left': return 0;
        case 'right': return 1;
        case 'top': return 0;
        case 'bottom': return 1;
        case 'center': default: return 0.5;
      }
    };
    const cxPercent = parsePos(pxToken, true);
    const cyPercent = parsePos(pyToken, false);

    const stopsRaw = rm ? rm[4] : v.substring(v.indexOf('(') + 1, v.lastIndexOf(')'));
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
      const pm = p.match(/(rgba?\([^\)]+\)|hsla?\([^\)]+\)|#[0-9a-fA-F]{3,6})\s*(\d+(?:\.\d+)?)%?/i);
      const color = pm ? pm[1].trim() : p.trim();
      const offset = pm && pm[2] ? Math.min(1, Math.max(0, parseFloat(pm[2]) / 100)) : (arr.length === 1 ? 0 : i / (arr.length - 1));
      return { color, offset };
    });
    return { type: 'radial', shape, cxPercent, cyPercent, stops: stops.length ? stops : [{ color: v, offset: 0 }, { color: v, offset: 1 }] };
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

export function makeCanvasRadialGradient(ctx, rect, grad) {
  const { x, y, width, height } = rect;
  const cx = x + width * (grad.cxPercent != null ? grad.cxPercent : 0.5);
  const cy = y + height * (grad.cyPercent != null ? grad.cyPercent : 0.5);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const r = Math.max(
    dist(cx, cy, x, y),
    dist(cx, cy, x + width, y),
    dist(cx, cy, x, y + height),
    dist(cx, cy, x + width, y + height)
  );
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  grad.stops.forEach(s => g.addColorStop(s.offset, s.color));
  return g;
}

export function getFillStyle(ctx, rect, value) {
  const parsed = parseGradientOrColor(value);
  if (parsed.type === 'solid') return parsed.color;
  if (parsed.type === 'linear') return makeCanvasGradient(ctx, rect, parsed);
  if (parsed.type === 'radial') return makeCanvasRadialGradient(ctx, rect, parsed);
  return parsed.color;
}