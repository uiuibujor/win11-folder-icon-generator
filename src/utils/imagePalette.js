import { rgbToHex, rgbToHsl } from './colors.js';

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// 改进的颜色量化函数
function quantizeColor(r, g, b, step = 16) {
  const qr = Math.floor(r / step) * step;
  const qg = Math.floor(g / step) * step;
  const qb = Math.floor(b / step) * step;
  return { r: qr, g: qg, b: qb };
}

function isNearWhite(r, g, b, threshold = 240) {
  return r >= threshold && g >= threshold && b >= threshold;
}

function isNearBlack(r, g, b, threshold = 20) {
  return r <= threshold && g <= threshold && b <= threshold;
}

function isNearGray(r, g, b, threshold = 30) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return (max - min) < threshold;
}

// 使用WCAG标准计算亮度
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// 计算对比度比例
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// 改进的文字颜色选择
function contrastTextFor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  
  const whiteContrast = getContrastRatio({ r, g, b }, { r: 255, g: 255, b: 255 });
  const blackContrast = getContrastRatio({ r, g, b }, { r: 0, g: 0, b: 0 });
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#1F2937';
}

// K-means聚类算法提取主要颜色
function kMeansColors(pixels, k = 5, maxIterations = 20) {
  if (pixels.length === 0) return [];
  
  // 初始化聚类中心
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    centroids.push({ ...randomPixel });
  }
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // 分配像素到最近的聚类中心
    const clusters = Array(k).fill().map(() => []);
    
    pixels.forEach(pixel => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(
          Math.pow(pixel.r - centroid.r, 2) +
          Math.pow(pixel.g - centroid.g, 2) +
          Math.pow(pixel.b - centroid.b, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });
      
      clusters[closestCentroid].push(pixel);
    });
    
    // 更新聚类中心
    let converged = true;
    centroids.forEach((centroid, index) => {
      if (clusters[index].length > 0) {
        const newR = clusters[index].reduce((sum, p) => sum + p.r, 0) / clusters[index].length;
        const newG = clusters[index].reduce((sum, p) => sum + p.g, 0) / clusters[index].length;
        const newB = clusters[index].reduce((sum, p) => sum + p.b, 0) / clusters[index].length;
        
        if (Math.abs(centroid.r - newR) > 1 || Math.abs(centroid.g - newG) > 1 || Math.abs(centroid.b - newB) > 1) {
          converged = false;
        }
        
        centroid.r = Math.round(newR);
        centroid.g = Math.round(newG);
        centroid.b = Math.round(newB);
        centroid.count = clusters[index].length;
      }
    });
    
    if (converged) break;
  }
  
  return centroids.filter(c => c.count > 0).sort((a, b) => b.count - a.count);
}

// 生成配色方案
function generateColorSchemes(dominantColors) {
  // 无有效颜色时，提供默认主体与标签分开配色
  if (dominantColors.length === 0) {
    return [{
      name: '默认配色',
      bodyColor: '#FFC83D',
      tabColor: '#FFD666',
      labelColor: '#FFFFFF',
      description: '默认的金黄色主体 + 稍浅标签'
    }];
  }

  const schemes = [];
  const primary = dominantColors[0];
  const primaryHex = rgbToHex(primary.r, primary.g, primary.b);
  const primaryHsl = rgbToHsl(primary.r, primary.g, primary.b);

  // 计算标签颜色：优先使用次要主色，其次为主色的轻微提亮
  let tabHex = null;
  if (dominantColors.length > 1) {
    const secondary = dominantColors[1];
    tabHex = rgbToHex(secondary.r, secondary.g, secondary.b);
  } else {
    const tabHsl = { ...primaryHsl, l: Math.min(0.9, primaryHsl.l + 0.08), s: Math.max(0.3, primaryHsl.s) };
    tabHex = hslToHex(tabHsl.h, tabHsl.s, tabHsl.l);
  }

  // 主色调方案（主体与标签分开配色）
  schemes.push({
    name: '主色调',
    bodyColor: primaryHex,
    tabColor: tabHex,
    labelColor: contrastTextFor(primaryHex),
    description: '基于主要颜色，标签与主体分开配色'
  });

  // 可选：次要色调方案（主体取次要色，标签取第三主色或次要色的轻微提亮）
  if (dominantColors.length > 1) {
    const secondary = dominantColors[1];
    const secondaryHex = rgbToHex(secondary.r, secondary.g, secondary.b);

    let tabForSecondary = null;
    if (dominantColors.length > 2) {
      const third = dominantColors[2];
      tabForSecondary = rgbToHex(third.r, third.g, third.b);
    } else {
      const shsl = rgbToHsl(secondary.r, secondary.g, secondary.b);
      tabForSecondary = hslToHex(shsl.h, shsl.s, Math.min(0.9, shsl.l + 0.08));
    }

    schemes.push({
      name: '次要色调',
      bodyColor: secondaryHex,
      tabColor: tabForSecondary,
      labelColor: contrastTextFor(secondaryHex),
      description: '基于次要颜色，标签与主体分开配色'
    });
  }

  // 明亮色调：提升亮度与适度饱和度，标签再略微提亮
  {
    const s = primaryHsl.s; // 0-100
    const l = primaryHsl.l; // 0-100
    const brightS = clamp(s + 8, 0, 100);
    const brightL = clamp(l + 12, 0, 100);
    const tabBrightL = clamp(brightL + 8, 0, 100);
    const brightHex = hslToHex(primaryHsl.h, brightS, brightL);
    const tabBrightHex = hslToHex(primaryHsl.h, brightS, tabBrightL);
    schemes.push({
      name: '明亮色调',
      bodyColor: brightHex,
      tabColor: tabBrightHex,
      labelColor: contrastTextFor(brightHex),
      description: '提高亮度与饱和度，整体更明快'
    });
  }

  // 互补色调：主体使用互补色，标签用互补的偏亮版本
  {
    const compH = (primaryHsl.h + 180) % 360;
    const compS = clamp(primaryHsl.s, 30, 100);
    const compL = clamp(primaryHsl.l, 35, 65);
    const compTabL = clamp(compL + 10, 0, 100);
    const compHex = hslToHex(compH, compS, compL);
    const compTabHex = hslToHex(compH, compS, compTabL);
    schemes.push({
      name: '互补色调',
      bodyColor: compHex,
      tabColor: compTabHex,
      labelColor: contrastTextFor(compHex),
      description: '使用互补色增强对比，标签稍微提亮'
    });
  }

  return schemes;
}

// HSL转HEX辅助函数
function hslToHex(h, s, l) {
  // 规范化：rgbToHsl 返回 h(0-360)、s/l(0-100)
  const H = ((h % 360) + 360) % 360 / 360; // 转 [0,1]
  const S = s > 1 ? s / 100 : s;           // 转 [0,1]
  const L = l > 1 ? l / 100 : l;           // 转 [0,1]
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs((H * 6) % 2 - 1));
  const m = L - c / 2;
  let r, g, b;
  
  if (H < 1/6) {
    r = c; g = x; b = 0;
  } else if (H < 2/6) {
    r = x; g = c; b = 0;
  } else if (H < 3/6) {
    r = 0; g = c; b = x;
  } else if (H < 4/6) {
    r = 0; g = x; b = c;
  } else if (H < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return rgbToHex(r, g, b);
}

// 改进的配色推荐函数，返回多种配色方案
export async function recommendColorsFromImage(src, options = {}) {
  const {
    maxSize = 150,
    step = 16,
    whiteThreshold = 240,
    alphaThreshold = 20,
    sampleRate = 0.3, // 采样率，提高性能
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const scale = Math.min(1, maxSize / Math.max(w, h));
        const cw = Math.max(1, Math.floor(w * scale));
        const ch = Math.max(1, Math.floor(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, cw, ch);
        
        let imageData;
        try {
          imageData = ctx.getImageData(0, 0, cw, ch);
        } catch (e) {
          resolve(generateColorSchemes([]));
          return;
        }
        
        const data = imageData.data;
        const pixels = [];
        
        // 采样像素，提高性能
        const totalPixels = data.length / 4;
        const sampleStep = Math.max(1, Math.floor(1 / sampleRate));
        
        for (let i = 0; i < data.length; i += 4 * sampleStep) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          
          // 过滤无效像素
          if (a <= alphaThreshold) continue;
          if (isNearWhite(r, g, b, whiteThreshold)) continue;
          if (isNearBlack(r, g, b)) continue;
          if (isNearGray(r, g, b)) continue; // 过滤灰色
          
          const quantized = quantizeColor(r, g, b, step);
          pixels.push(quantized);
        }
        
        // 如果没有足够的有效像素，返回默认方案
        if (pixels.length < 10) {
          resolve(generateColorSchemes([]));
          return;
        }
        
        // 使用K-means聚类提取主要颜色
        const dominantColors = kMeansColors(pixels, Math.min(5, Math.max(2, Math.floor(pixels.length / 50))));
        
        // 生成多种配色方案
        const schemes = generateColorSchemes(dominantColors);
        resolve(schemes);
        
      } catch (err) {
        console.error('配色推荐失败:', err);
        resolve(generateColorSchemes([]));
      }
    };
    
    img.onerror = () => {
      console.error('图片加载失败');
      resolve(generateColorSchemes([]));
    };
    
    img.src = src;
  });
}

// 兼容旧版本的单一配色推荐函数
export async function recommendSingleColorFromImage(src, options = {}) {
  const schemes = await recommendColorsFromImage(src, options);
  const primaryScheme = schemes[0];
  return {
    bodyColor: primaryScheme.bodyColor,
    tabColor: primaryScheme.tabColor || primaryScheme.bodyColor,
    labelColor: primaryScheme.labelColor,
    name: primaryScheme.name
  };
}