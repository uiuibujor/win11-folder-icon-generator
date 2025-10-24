import React, { useState, useRef, useEffect, useMemo } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { Download, RefreshCw, Folder, Camera, Upload, X } from 'lucide-react';

// 颜色选择器中文本地化配置
const colorPickerLocales = {
  CONTROLS: {
    SOLID: '纯色',
    GRADIENT: '渐变'
  },
  INPUTS: {
    HEX: '十六进制',
    RGB: 'RGB',
    HSL: 'HSL',
    HSV: 'HSV',
    CMYK: 'CMYK'
  },
  TOOLS: {
    EYE_DROPPER: '取色器',
    COLOR_GUIDE: '色彩指南',
    ADVANCED: '高级'
  },
  GRADIENT: {
    LINEAR: '线性',
    RADIAL: '径向',
    ANGLE: '角度',
    STOP: '色标'
  },
  PRESETS: {
    TITLE: '预设颜色'
  }
};

const Win11FolderGenerator = () => {
  const [folderColor, setFolderColor] = useState('#FFC83D');
  const [tabColor, setTabColor] = useState('#FFD666');
  const [labelText, setLabelText] = useState('我的文件夹');
  const [labelColor, setLabelColor] = useState('#FFFFFF');
  const [showLabel, setShowLabel] = useState(true);
  const [labelMode, setLabelMode] = useState('text'); // 'text' or 'image'
  const [customImage, setCustomImage] = useState(null);
  const [folderStyle, setFolderStyle] = useState('custom');
  const [iconSize, setIconSize] = useState(200);
  const [imageSize, setImageSize] = useState(25); // 图片大小百分比 (相对于图标大小)
  const [imagePositionX, setImagePositionX] = useState(51); // 图片X位置百分比 (0-100)
  const [imagePositionY, setImagePositionY] = useState(60); // 图片Y位置百分比 (0-100)
  const [fontFamily, setFontFamily] = useState('Segoe UI'); // 字体选择
  const [exportFormat, setExportFormat] = useState('png'); // 导出格式选择
  const [showHighlight, setShowHighlight] = useState(true); // 高光效果开关
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 渐变调节（仅自定义样式生效）
  const [bodyGradAngle, setBodyGradAngle] = useState(90);
  const [bodyHueShift, setBodyHueShift] = useState(0);
  const [bodySatShift, setBodySatShift] = useState(0);
  const [bodyLightShift, setBodyLightShift] = useState(-15);

  const [tabGradAngle, setTabGradAngle] = useState(90);
  const [tabHueShift, setTabHueShift] = useState(0);
  const [tabSatShift, setTabSatShift] = useState(0);
  const [tabLightShift, setTabLightShift] = useState(8);

  // 渐变模式：简易 / 高级
  const [gradMode, setGradMode] = useState('simple');

  // 起始与中间停靠点调节（仅自定义样式生效）
  const [bodyStartHueShift, setBodyStartHueShift] = useState(0);
  const [bodyStartSatShift, setBodyStartSatShift] = useState(0);
  const [bodyStartLightShift, setBodyStartLightShift] = useState(0);
  const [bodyMidStop, setBodyMidStop] = useState(50); // 0-100
  const [bodyMidHueShift, setBodyMidHueShift] = useState(0);
  const [bodyMidSatShift, setBodyMidSatShift] = useState(0);
  const [bodyMidLightShift, setBodyMidLightShift] = useState(-5);

  const [tabStartHueShift, setTabStartHueShift] = useState(0);
  const [tabStartSatShift, setTabStartSatShift] = useState(0);
  const [tabStartLightShift, setTabStartLightShift] = useState(5);
  const [tabMidStop, setTabMidStop] = useState(50); // 0-100
  const [tabMidHueShift, setTabMidHueShift] = useState(0);
  const [tabMidSatShift, setTabMidSatShift] = useState(0);
  const [tabMidLightShift, setTabMidLightShift] = useState(3);

  // 颜色选择器值（支持纯色或linear-gradient字符串）
  const [bodyColorValue, setBodyColorValue] = useState(folderColor);
  const [tabColorValue, setTabColorValue] = useState(tabColor);

  // 使用 useMemo 缓存颜色值，避免无限循环
  const memoizedBodyColorValue = useMemo(() => bodyColorValue, [bodyColorValue]);
  const memoizedTabColorValue = useMemo(() => tabColorValue, [tabColorValue]);

  // 十六进制转 rgba
  function hexToRgba(hex) {
    if (!hex) return 'rgba(0,0,0,1)';
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  // 解析 linear-gradient 或纯色
  function parseGradientOrColor(value) {
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
  function makeCanvasGradient(ctx, rect, grad) {
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

  function getFillStyle(ctx, rect, value) {
    const parsed = parseGradientOrColor(value);
    if (parsed.type === 'solid') return parsed.color;
    if (parsed.type === 'linear') return makeCanvasGradient(ctx, rect, parsed);
    return parsed.color;
  }

  // 将 ColorPicker 返回值规范为十六进制或保留渐变
  const normalizePickerValueToHexOrGradient = (v) => {
    const parsed = parseGradientOrColor(v);
    if (parsed.type === 'solid') {
      const c = parsed.color;
      if (typeof c === 'string' && c.startsWith('#')) return c;
      if (typeof c === 'string' && c.startsWith('rgb')) {
        const nums = c.match(/\d+/g).map(Number);
        return '#' + nums.slice(0,3).map(n => n.toString(16).padStart(2, '0')).join('');
      }
      return c;
    }
    return v;
  };

  const handleBodyColorChange = (v) => {
    setBodyColorValue(normalizePickerValueToHexOrGradient(v));
  };

  const handleTabColorChange = (v) => {
    setTabColorValue(normalizePickerValueToHexOrGradient(v));
  };

  const fontOptions = [
    { name: 'Segoe UI', value: 'Segoe UI', fallback: 'system-ui, sans-serif' },
    { name: '微软雅黑', value: 'Microsoft YaHei', fallback: 'sans-serif' },
    { name: '宋体', value: 'SimSun', fallback: 'serif' },
    { name: '黑体', value: 'SimHei', fallback: 'sans-serif' },
    { name: '楷体', value: 'KaiTi', fallback: 'serif' },
    { name: 'Arial', value: 'Arial', fallback: 'sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman', fallback: 'serif' },
    { name: 'Courier New', value: 'Courier New', fallback: 'monospace' },
    { name: 'Helvetica', value: 'Helvetica', fallback: 'sans-serif' },
    { name: 'Georgia', value: 'Georgia', fallback: 'serif' }
  ];

  const drawFolder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scale = 2;
    canvas.width = iconSize * scale;
    canvas.height = iconSize * scale;
    ctx.scale(scale, scale);
    
    ctx.clearRect(0, 0, iconSize, iconSize);
    
    // 文件夹阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    
    // 文件夹主体绘制
    
    // 绘制不对称文件夹主体
    const x = iconSize * 0.154;
    const y = iconSize * 0.285;
    const width = iconSize * 0.68;
    const height = iconSize * 0.43;
    const radius = 8;

    // 主体填充（由 ColorPicker 控制，支持纯色/线性渐变）
    const bodyRect = { x, y, width, height };
    ctx.fillStyle = getFillStyle(ctx, bodyRect, memoizedBodyColorValue);
    ctx.beginPath();
    
    // 计算关键点位置
    const heightDiff = height * 0.1; // 左边比右边短10%
    const leftHeightAdjust = (iconSize / 256) * 5; // 左侧高度增加5px (按比例缩放)
    const rightHeightAdjust = (iconSize / 256) * 3; // 右侧高度增加3px (按比例缩放)
    const leftTopY = y + heightDiff - leftHeightAdjust; // 左侧顶部Y坐标 (向上移动)
    const transitionStart = x + width / 3; // 三分之一处开始过渡
    const slopeLength = width * 0.1; // 斜坡长度为10%
    const transitionEnd = transitionStart + slopeLength;
    
    // 开始绘制自定义路径
    // 从左上角开始（较高位置）
    ctx.moveTo(x + radius, leftTopY);
    
    // 左侧顶边 - 到过渡开始点
    ctx.lineTo(transitionStart, leftTopY);
    
    // 斜坡过渡 - 使用三次贝塞尔曲线，保证两端水平切线
    const cp1X = transitionStart + slopeLength * 0.35; // 起点切线控制
    const cp1Y = leftTopY; // 起点保持水平切线
    const cp2X = transitionStart + slopeLength * 0.75; // 终点切线控制
    const rightTopY = y - rightHeightAdjust; // 右侧顶部Y坐标 (向上移动)
    const cp2Y = rightTopY; // 终点保持水平切线
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, transitionEnd, rightTopY);
    
    // 右侧顶边 - 过渡结束到右上角
    ctx.lineTo(x + width - radius, rightTopY);
    ctx.quadraticCurveTo(x + width, rightTopY, x + width, rightTopY + radius);
    
    // 右边 - 从顶部到底部
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    
    // 底边
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    
    // 左边 - 从底部到左侧顶部（较短）
    ctx.lineTo(x, leftTopY + radius);
    ctx.quadraticCurveTo(x, leftTopY, x + radius, leftTopY);
    
    ctx.closePath();
    ctx.fill();  // 填充绘制的矩形
    
    // 文件夹标签部分 - 圆角矩形（置于主体下方）
    ctx.shadowBlur = 10;
    ctx.save();
    // 标签不需要投影，避免颜色偏暗
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 0;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.beginPath();

    // 自定义标签参数
    const tabX = iconSize * 0.154; // 起始X位置
    const tabY = iconSize * 0.195; // 起始Y位置
    const tabWidth = iconSize * 0.68; // 标签宽度（与文件夹主体一致）
    const tabHeight = iconSize * 0.2; // 标签高度
    const tabRadius = Math.max(4, iconSize * 0.04); // 圆角半径

    // 标签填充（由 ColorPicker 控制，支持纯色/线性渐变）
    const tabRect = { x: tabX, y: tabY, width: tabWidth, height: tabHeight };
    ctx.fillStyle = getFillStyle(ctx, tabRect, memoizedTabColorValue);

    // 顶部几何：右侧比左侧短20%（上边），从左起1/3处开始向下过渡，斜坡长为宽度的10%
    const rightTopDrop = tabHeight * 0.35; // 右侧顶部向下 20%
    const topStartY = tabY; // 左侧顶部基线
    const topEndY = tabY + rightTopDrop; // 右侧顶部位置
    const tabTransitionStart = tabX + tabWidth / 3; // 1/3 处开始过渡
    const tabSlopeLength = tabWidth * 0.12; // 斜坡长度 12%
    const tabTransitionEnd = tabTransitionStart + tabSlopeLength;

    // 起点：左上圆角之后
    ctx.moveTo(tabX + tabRadius, topStartY);

    // 顶边水平到斜坡起点
    ctx.lineTo(tabTransitionStart, topStartY);

    // 顶部斜坡（两端保持水平切线）
    const tcp1X = tabTransitionStart + tabSlopeLength * 0.35;
    const tcp1Y = topStartY;
    const tcp2X = tabTransitionStart + tabSlopeLength * 0.75;
    const tcp2Y = topEndY;
    ctx.bezierCurveTo(tcp1X, tcp1Y, tcp2X, tcp2Y, tabTransitionEnd, topEndY);

    // 斜坡结束到右上圆角前
    ctx.lineTo(tabX + tabWidth - tabRadius, topEndY);
    ctx.quadraticCurveTo(tabX + tabWidth, topEndY, tabX + tabWidth, topEndY + tabRadius);

    // 右侧边到底部圆角前
    ctx.lineTo(tabX + tabWidth, tabY + tabHeight - tabRadius);
    ctx.quadraticCurveTo(tabX + tabWidth, tabY + tabHeight, tabX + tabWidth - tabRadius, tabY + tabHeight);

    // 底边到左下圆角前
    ctx.lineTo(tabX + tabRadius, tabY + tabHeight);
    ctx.quadraticCurveTo(tabX, tabY + tabHeight, tabX, tabY + tabHeight - tabRadius);

    // 左侧边回到左上圆角
    ctx.lineTo(tabX, tabY + tabRadius);
    ctx.quadraticCurveTo(tabX, tabY, tabX + tabRadius, tabY);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // 高光效果 - 与主体形状一致（使用主体路径进行裁剪）
    if (showHighlight) {
      ctx.shadowColor = 'transparent';
      ctx.save();
      ctx.beginPath();
      
      // 使用主体相同路径作为裁剪区域
      ctx.moveTo(x + radius, leftTopY);
      ctx.lineTo(transitionStart, leftTopY);
      const hcp1X = transitionStart + slopeLength * 0.35;
      const hcp1Y = leftTopY;
      const hcp2X = transitionStart + slopeLength * 0.75;
      const hcp2Y = rightTopY;
      ctx.bezierCurveTo(hcp1X, hcp1Y, hcp2X, hcp2Y, transitionEnd, rightTopY);
      ctx.lineTo(x + width - radius, rightTopY);
      ctx.quadraticCurveTo(x + width, rightTopY, x + width, rightTopY + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, leftTopY + radius);
      ctx.quadraticCurveTo(x, leftTopY, x + radius, leftTopY);
      ctx.closePath();
      ctx.clip();

      // 顶部高光渐变（只影响裁剪区域内）
      const highlight = ctx.createLinearGradient(0, iconSize * 0.35, 0, iconSize * 0.5);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = highlight;
      // 用矩形铺满高光范围，裁剪保证形状一致
      ctx.fillRect(x, y, width, height * 0.6);
      ctx.restore();
    }

    
    // 标签内容（文字或图片）
    if (showLabel) {
      if (labelMode === 'text' && labelText) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = labelColor;
        const selectedFont = fontOptions.find(font => font.value === fontFamily);
        const fontString = selectedFont ? `"${selectedFont.value}", ${selectedFont.fallback}` : `"${fontFamily}", system-ui, sans-serif`;
        ctx.font = `bold ${iconSize * 0.08}px ${fontString}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, iconSize * 0.5, iconSize * 0.62);
      } else if (labelMode === 'image' && customImage) {
        const img = new Image();
        img.src = customImage;
        img.onload = () => {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetY = 2;
          
          const imgSize = iconSize * (imageSize / 100);
          const imgX = iconSize * (imagePositionX / 100) - imgSize / 2;
          const imgY = iconSize * (imagePositionY / 100) - imgSize / 2;
          
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
        };
      }
    }
  };

  // 颜色工具：HEX/RGB/HSL 转换与渐变调节
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
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
  };

  const hslToRgb = (h, s, l) => {
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
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const rgbToCss = (r, g, b) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

  const parseColor = (color) => {
    if (color.startsWith('#')) return hexToRgb(color);
    if (color.startsWith('rgb')) {
      const nums = color.match(/\d+/g).map(Number);
      return { r: nums[0], g: nums[1], b: nums[2] };
    }
    // 默认当作hex
    return hexToRgb(color);
  };

  const adjustHslColor = (color, { hShift = 0, sShift = 0, lShift = 0 } = {}) => {
    const { r, g, b } = parseColor(color);
    let { h, s, l } = rgbToHsl(r, g, b);
    h = (h + hShift) % 360; if (h < 0) h += 360;
    s = clamp(s + sShift, 0, 100);
    l = clamp(l + lShift, 0, 100);
    const { r: nr, g: ng, b: nb } = hslToRgb(h, s, l);
    return rgbToCss(nr, ng, nb);
  };

  // 保留亮度调整以兼容现有调用（基于RGB简单乘法）
  const adjustBrightness = (color, factor) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 颜色选择器辅助函数：将RGB转换为HEX格式
  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // 计算当前颜色（基于基础颜色和HSL调整）
  const getCurrentColor = (baseColor, hShift, sShift, lShift) => {
    const adjustedColor = adjustHslColor(baseColor, { hShift, sShift, lShift });
    const { r, g, b } = parseColor(adjustedColor);
    return rgbToHex(r, g, b);
  };

  // 从选择的颜色计算HSL调整值
  const calculateHslShifts = (baseColor, selectedColor) => {
    const baseRgb = parseColor(baseColor);
    const selectedRgb = parseColor(selectedColor);
    
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const selectedHsl = rgbToHsl(selectedRgb.r, selectedRgb.g, selectedRgb.b);
    
    let hShift = selectedHsl.h - baseHsl.h;
    // 处理色相环绕
    if (hShift > 180) hShift -= 360;
    if (hShift < -180) hShift += 360;
    
    const sShift = selectedHsl.s - baseHsl.s;
    const lShift = selectedHsl.l - baseHsl.l;
    
    return {
      hShift: clamp(Math.round(hShift), -180, 180),
      sShift: clamp(Math.round(sShift), -100, 100),
      lShift: clamp(Math.round(lShift), -40, 40)
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCustomImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ICO格式转换函数
  const canvasToICO = (canvas, size = 256) => {
    // 创建临时canvas用于调整尺寸
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = size;
    tempCanvas.height = size;
    
    // 计算源内容的上下左右留白并进行内容裁剪 + 居中缩放
    const srcW = canvas.width;
    const srcH = canvas.height;
    const srcCtx = canvas.getContext('2d');
    const srcImage = srcCtx.getImageData(0, 0, srcW, srcH);
    const srcData = srcImage.data;
    let minX = srcW, minY = srcH, maxX = -1, maxY = -1;
    const alphaThreshold = 20; // 忽略低透明度阴影
    for (let y = 0; y < srcH; y++) {
      for (let x = 0; x < srcW; x++) {
        const a = srcData[(y * srcW + x) * 4 + 3];
        if (a > alphaThreshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0) {
      // 没有内容，直接缩放
      tempCtx.drawImage(canvas, 0, 0, size, size);
    } else {
      // 在源图上为阴影留出少量边距，避免被裁掉
      const paddingSrc = Math.round(Math.max(srcW, srcH) * 0.02);
      let sx = Math.max(0, minX - paddingSrc);
      let sy = Math.max(0, minY - paddingSrc);
      let sWidth = Math.min(srcW - sx, (maxX - minX + 1) + paddingSrc * 2);
      let sHeight = Math.min(srcH - sy, (maxY - minY + 1) + paddingSrc * 2);

      // 目标画布留出少量边距，最大化内容占比
      const targetPadding = Math.round(size * 0.02); // 2% 画布边距
      const availW = size - targetPadding * 2;
      const availH = size - targetPadding * 2;
      const scaleFit = Math.min(availW / sWidth, availH / sHeight);

      const dw = Math.round(sWidth * scaleFit) - 6; // 总宽度减少6px (左4px + 右2px)
      const dh = Math.round(sHeight * scaleFit);
      const dx = Math.round((size - dw) / 2) + 1; // 向右偏移1px (左减4px，右减2px的平衡点)
      const dy = Math.round((size - dh) / 2) - 4; // 向上偏移4px

      // 使用裁剪矩形进行绘制，确保内容居中且更大
      tempCtx.drawImage(canvas, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
    }
    
    // 获取图像数据
    const imageData = tempCtx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // ICO文件头结构
    const icoHeader = new ArrayBuffer(6);
    const icoHeaderView = new DataView(icoHeader);
    icoHeaderView.setUint16(0, 0, true); // Reserved
    icoHeaderView.setUint16(2, 1, true); // Type (1 = ICO)
    icoHeaderView.setUint16(4, 1, true); // Number of images
    
    // ICO目录条目
    const icoEntry = new ArrayBuffer(16);
    const icoEntryView = new DataView(icoEntry);
    icoEntryView.setUint8(0, size === 256 ? 0 : size); // Width (0 = 256)
    icoEntryView.setUint8(1, size === 256 ? 0 : size); // Height (0 = 256)
    icoEntryView.setUint8(2, 0); // Color palette
    icoEntryView.setUint8(3, 0); // Reserved
    icoEntryView.setUint16(4, 1, true); // Color planes
    icoEntryView.setUint16(6, 32, true); // Bits per pixel
    
    // 计算BMP数据大小
    const bmpDataSize = 40 + (size * size * 4) + (size * size / 8); // Header + RGBA + AND mask
    icoEntryView.setUint32(8, bmpDataSize, true); // Size of bitmap data
    icoEntryView.setUint32(12, 22, true); // Offset to bitmap data (6 + 16)
    
    // BMP信息头
    const bmpHeader = new ArrayBuffer(40);
    const bmpHeaderView = new DataView(bmpHeader);
    bmpHeaderView.setUint32(0, 40, true); // Header size
    bmpHeaderView.setInt32(4, size, true); // Width
    bmpHeaderView.setInt32(8, size * 2, true); // Height (doubled for ICO)
    bmpHeaderView.setUint16(12, 1, true); // Planes
    bmpHeaderView.setUint16(14, 32, true); // Bits per pixel
    bmpHeaderView.setUint32(16, 0, true); // Compression
    bmpHeaderView.setUint32(20, size * size * 4, true); // Image size
    bmpHeaderView.setUint32(24, 0, true); // X pixels per meter
    bmpHeaderView.setUint32(28, 0, true); // Y pixels per meter
    bmpHeaderView.setUint32(32, 0, true); // Colors used
    bmpHeaderView.setUint32(36, 0, true); // Important colors
    
    // 创建RGBA数据（需要垂直翻转）
    const rgbaData = new ArrayBuffer(size * size * 4);
    const rgbaView = new Uint8Array(rgbaData);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const srcIndex = (y * size + x) * 4;
        const dstIndex = ((size - 1 - y) * size + x) * 4;
        rgbaView[dstIndex] = data[srcIndex + 2]; // B
        rgbaView[dstIndex + 1] = data[srcIndex + 1]; // G
        rgbaView[dstIndex + 2] = data[srcIndex]; // R
        rgbaView[dstIndex + 3] = data[srcIndex + 3]; // A
      }
    }

    // 创建AND掩码（全部设为0，表示不透明）
    const andMask = new ArrayBuffer(size * size / 8);
    
    // 合并所有数据
    const totalSize = icoHeader.byteLength + icoEntry.byteLength + bmpHeader.byteLength + rgbaData.byteLength + andMask.byteLength;
    const icoData = new Uint8Array(totalSize);
    let offset = 0;
    
    icoData.set(new Uint8Array(icoHeader), offset);
    offset += icoHeader.byteLength;
    
    icoData.set(new Uint8Array(icoEntry), offset);
    offset += icoEntry.byteLength;
    
    icoData.set(new Uint8Array(bmpHeader), offset);
    offset += bmpHeader.byteLength;
    
    icoData.set(rgbaView, offset);
    offset += rgbaData.byteLength;
    
    icoData.set(new Uint8Array(andMask), offset);
    
    return new Blob([icoData], { type: 'image/x-icon' });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    const fileName = labelText || 'folder';
    
    if (exportFormat === 'ico') {
      // 导出ICO格式（256x256）
      const icoBlob = canvasToICO(canvas, 256);
      link.download = `${fileName}.ico`;
      link.href = URL.createObjectURL(icoBlob);
    } else {
      // 导出PNG格式
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
    }
    
    link.click();
    
    // 清理URL对象（仅ICO格式需要）
    if (exportFormat === 'ico') {
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }
  };

  React.useEffect(() => {
    drawFolder();
  }, [
    folderColor, tabColor,
    labelText, labelColor, showLabel, labelMode, customImage,
    folderStyle, iconSize,
    imageSize, imagePositionX, imagePositionY,
    fontFamily, showHighlight,
    bodyGradAngle, bodyHueShift, bodySatShift, bodyLightShift,
    tabGradAngle, tabHueShift, tabSatShift, tabLightShift,
    bodyStartHueShift, bodyStartSatShift, bodyStartLightShift,
    bodyMidStop, bodyMidHueShift, bodyMidSatShift, bodyMidLightShift,
    tabStartHueShift, tabStartSatShift, tabStartLightShift,
    tabMidStop, tabMidHueShift, tabMidSatShift, tabMidLightShift,
    memoizedBodyColorValue, memoizedTabColorValue
  ]);

  const presetStyles = [
    { name: '经典黄', value: 'classic', bodyColor: '#FFC83D', tabColor: '#e6a800' },
    { name: '深海蓝', value: 'ocean', bodyColor: '#667EEA', tabColor: '#764BA2' },
    { name: '翡翠绿', value: 'forest', bodyColor: '#11998E', tabColor: '#38EF7D' },
    { name: '薰衣草', value: 'lavender', bodyColor: '#A8EDEA', tabColor: '#FED6E3' },
    { name: '夕阳橙', value: 'sunset', bodyColor: '#FF6B6B', tabColor: '#FFE66D' },
    { name: '午夜蓝', value: 'midnight', bodyColor: '#2C3E50', tabColor: '#4CA1AF' },
    { name: '珊瑚粉', value: 'coral', bodyColor: '#FF7F7F', tabColor: '#FFBF7F' },
    { name: '祖母绿', value: 'emerald', bodyColor: '#50C878', tabColor: '#98FB98' },
    { name: '玫瑰红', value: 'rose', bodyColor: '#FF69B4', tabColor: '#FFB6C1' },
    { name: '蓝宝石', value: 'sapphire', bodyColor: '#0F52BA', tabColor: '#6495ED' },
    { name: '琥珀金', value: 'amber', bodyColor: '#FFBF00', tabColor: '#FFD700' },
    { name: '薄荷绿', value: 'mint', bodyColor: '#98FB98', tabColor: '#F0FFF0' },
    { name: '梅子紫', value: 'plum', bodyColor: '#8E4585', tabColor: '#DDA0DD' },
    { name: '天空蓝', value: 'sky', bodyColor: '#87CEEB', tabColor: '#E0F6FF' },
    { name: '樱桃红', value: 'cherry', bodyColor: '#DE3163', tabColor: '#FFB7C5' },
    { name: '鼠尾草', value: 'sage', bodyColor: '#9CAF88', tabColor: '#C8D5B9' },
    { name: '珍珠白', value: 'pearl', bodyColor: '#F8F6F0', tabColor: '#FFFDD0' },
    { name: '青铜色', value: 'bronze', bodyColor: '#CD7F32', tabColor: '#D2B48C' },
    { name: '鸢尾紫', value: 'iris', bodyColor: '#5D4E75', tabColor: '#9B59B6' },
    { name: '奶油色', value: 'cream', bodyColor: '#FFFDD0', tabColor: '#FFF8DC' },
    { name: '自定义', value: 'custom', bodyColor: folderColor, tabColor: tabColor }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部区域 - 优化间距和视觉效果 */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Folder className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Windows 11 文件夹生成器
            </h1>
          </div>
          <p className="text-gray-600 text-lg">打造专属的现代化文件夹图标，让你的桌面更加个性化</p>
        </div>

        {/* 预设样式区域 - 改进响应式设计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">🎨 预设样式</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 lg:gap-4">
            {presetStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => {
                  setFolderStyle(style.value);
                  setBodyColorValue(style.bodyColor);
                  setTabColorValue(style.tabColor);
                }}
                className={`group flex flex-col items-center p-3 lg:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  folderStyle === style.value
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                }`}
              >
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-lg mb-2 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="absolute inset-0 rounded-lg" style={{ background: style.bodyColor }}></div>
                  <div className="absolute top-0 left-0 w-5 lg:w-6 h-3 lg:h-4 rounded-tl-lg" style={{ background: style.tabColor }}></div>
                </div>
                <span className="text-xs lg:text-sm text-gray-700 font-medium text-center leading-tight">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主要内容区域 - 改进布局和响应式 */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 预览区域 - 优化设计 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">📱 实时预览</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl p-6 lg:p-8 min-h-[300px] lg:min-h-[400px] border border-gray-200/50">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto drop-shadow-2xl"
                style={{ width: `${Math.min(iconSize, 300)}px`, height: `${Math.min(iconSize, 300)}px` }}
              />
              
              {/* 导出控制区域 - 改进设计 */}
              <div className="mt-6 w-full space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200/50">
                  <label className="block text-sm font-semibold text-gray-700">
                    📁 导出格式
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white transition-colors text-sm lg:text-base"
                  >
                    <option value="png">PNG格式 (透明背景，推荐)</option>
                    <option value="ico">ICO格式 (256x256，系统图标)</option>
                  </select>
                </div>
                
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  下载图标 ({exportFormat.toUpperCase()})
                </button>
              </div>
            </div>
          </div>

          {/* 控制面板 - 大幅优化设计和布局 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">⚙️ 自定义设置</h2>
            </div>
            
            <div className="space-y-8 max-h-[600px] lg:max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {/* 基础设置区域 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  ⚡ 基础设置
                </h3>
                
                {/* 高光效果开关 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHighlight}
                      onChange={(e) => setShowHighlight(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">✨ 显示高光效果</span>
                  </label>
                </div>
              </div>

              {/* 颜色自定义区域 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  🎨 颜色自定义
                </h3>
                
                {/* 并排布局的颜色选择器 */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gradient-to-r from-blue-200/50 to-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 文件夹主体颜色 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        📁 文件夹主体颜色
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">支持渐变</span>
                      </label>
                      <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50 hover:border-blue-400 transition-all duration-300">
                        <ColorPicker
                          value={bodyColorValue}
                          onChange={handleBodyColorChange}
                          hideOpacity={false}
                          hideInputType={true}
                          hideColorTypeBtns={true}
                          locales={colorPickerLocales}
                        />
                      </div>
                    </div>

                    {/* 标签颜色 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        🏷️ 标签颜色
                        <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">支持渐变</span>
                      </label>
                      <div className="border-2 border-dashed border-purple-200 rounded-xl p-3 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:border-purple-400 transition-all duration-300">
                        <ColorPicker
                          value={tabColorValue}
                          onChange={handleTabColorChange}
                          hideOpacity={false}
                          hideInputType={true}
                          hideColorTypeBtns={true}
                          locales={colorPickerLocales}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 内容设置区域 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  📝 内容设置
                </h3>
                
                <div className="space-y-4">
                  {/* 标签内容区域 */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        🏷️ 标签内容
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showLabel}
                          onChange={(e) => setShowLabel(e.target.checked)}
                          className="w-5 h-5 accent-blue-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-600">显示标签</span>
                      </label>
                    </div>
                    
                    {showLabel && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLabelMode('text')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                              labelMode === 'text'
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            📝 文字
                          </button>
                          <button
                            onClick={() => setLabelMode('image')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                              labelMode === 'image'
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            🖼️ 图片
                          </button>
                        </div>

                        {labelMode === 'text' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                📝 标签文字
                              </label>
                              <input
                                type="text"
                                value={labelText}
                                onChange={(e) => setLabelText(e.target.value)}
                                placeholder="输入文字..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                🎨 文字颜色
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={labelColor}
                                  onChange={(e) => setLabelColor(e.target.value)}
                                  className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-sm"
                                />
                                <input
                                  type="text"
                                  value={labelColor}
                                  onChange={(e) => setLabelColor(e.target.value)}
                                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                🔤 字体选择
                              </label>
                              <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white transition-colors"
                              >
                                {fontOptions.map((font) => (
                                  <option key={font.value} value={font.value}>
                                    {font.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            {!customImage ? (
                              <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                              >
                                <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">点击上传图片</span>
                                <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF 格式</span>
                              </label>
                            ) : (
                              <div className="relative">
                                <img
                                  src={customImage}
                                  alt="Preview"
                                  className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                />
                                <button
                                  onClick={removeImage}
                                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            
                            {/* 图片控制区域 */}
                            {customImage && (
                              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                                <div>
                                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                                    📏 图片大小
                                    <span className="text-blue-600 font-semibold">{imageSize}%</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="10"
                                    max="80"
                                    value={imageSize}
                                    onChange={(e) => setImageSize(Number(e.target.value))}
                                    className="w-full accent-blue-600 h-2 rounded-lg"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>小 (10%)</span>
                                    <span>大 (80%)</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                                    ↔️ 水平位置
                                    <span className="text-blue-600 font-semibold">{imagePositionX}%</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={imagePositionX}
                                    onChange={(e) => setImagePositionX(Number(e.target.value))}
                                    className="w-full accent-blue-600 h-2 rounded-lg"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>左</span>
                                    <span>中</span>
                                    <span>右</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                                    ↕️ 垂直位置
                                    <span className="text-blue-600 font-semibold">{imagePositionY}%</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="20"
                                    max="90"
                                    value={imagePositionY}
                                    onChange={(e) => setImagePositionY(Number(e.target.value))}
                                    className="w-full accent-blue-600 h-3 rounded-lg"
                                  />
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>上</span>
                                    <span>中</span>
                                    <span>下</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 图标大小控制 */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200/50 shadow-sm">
                    <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-4">
                      📐 图标大小
                      <span className="text-blue-600 font-bold text-lg">{iconSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={iconSize}
                      onChange={(e) => setIconSize(Number(e.target.value))}
                      className="w-full accent-blue-600 h-3 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span>小图标 (100px)</span>
                      <span>推荐 (256px)</span>
                      <span>大图标 (400px)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重置按钮 - 大幅改进设计 */}
              <button
                onClick={() => {
                  setFolderStyle('custom');
                  setBodyColorValue('#FFC83D');
                  setTabColorValue('#FFD666');
                  setLabelText('我的文件夹');
                  setLabelColor('#FFFFFF');
                  setShowLabel(true);
                  setLabelMode('text');
                  setCustomImage(null);
                  setIconSize(200);
                  setImageSize(25);
                  setImagePositionX(50);
                  setImagePositionY(62);
                  setFontFamily('Segoe UI');
                  setExportFormat('png');
                  setBodyGradAngle(90);
                  setBodyHueShift(0);
                  setBodySatShift(0);
                  setBodyLightShift(-15);
                  setTabGradAngle(90);
                  setTabHueShift(0);
                  setTabSatShift(0);
                  setTabLightShift(8);
                  // Multi-stop gradient defaults
                  setBodyStartHueShift(0);
                  setBodyStartSatShift(0);
                  setBodyStartLightShift(0);
                  setBodyMidStop(50);
                  setBodyMidHueShift(0);
                  setBodyMidSatShift(0);
                  setBodyMidLightShift(-5);

                  setTabStartHueShift(0);
                  setTabStartSatShift(0);
                  setTabStartLightShift(5);
                  setTabMidStop(50);
                  setTabMidHueShift(0);
                  setTabMidSatShift(0);
                  setTabMidLightShift(3);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300/50"
              >
                <RefreshCw className="w-5 h-5" />
                🔄 重置为默认设置
              </button>
            </div>
          </div>
        </div>

        
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-3xl p-6 lg:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800">使用小贴士</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">🎨</span>
                <span className="text-sm text-gray-700">选择预设样式或自定义渐变颜色，打造独特风格</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">🏷️</span>
                <span className="text-sm text-gray-700">添加文字标签或上传图片，让文件夹更具辨识度</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">📐</span>
                <span className="text-sm text-gray-700">推荐使用 256px 或 512px 尺寸，适配各种显示场景</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">🖼️</span>
                <span className="text-sm text-gray-700">图片会自动裁剪成圆形，建议使用方形图片</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-bold">💾</span>
                <span className="text-sm text-gray-700">PNG 格式支持透明背景，ICO 格式可直接用作系统图标</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">✨</span>
                <span className="text-sm text-gray-700">开启高光效果让图标更加立体生动</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
 export default Win11FolderGenerator;