// 简易透明背景处理：将近白背景（或检测到的边缘背景色）置为透明
// 尽量避免画布污染：优先处理 data: URL；外链尝试 crossOrigin 加载，失败则原样返回
export async function ensureTransparentBackground(src, options = {}) {
  const {
    whiteThreshold = 245,      // 近白阈值（0-255），>=该值认为接近白色
    similarity = 20,           // 与背景色的容差（欧氏距离近似）
    sampleSize = 8             // 角落采样区域像素边长
  } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let imageData;
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
          // 可能被跨域污染，无法读取像素
          resolve(src);
          return;
        }

        const data = imageData.data; // RGBA 顺序

        // 采样四角平均背景色
        const samples = [];
        const coords = [
          [0, 0],
          [canvas.width - sampleSize, 0],
          [0, canvas.height - sampleSize],
          [canvas.width - sampleSize, canvas.height - sampleSize]
        ];
        for (const [sx, sy] of coords) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          for (let y = sy; y < sy + sampleSize; y++) {
            for (let x = sx; x < sx + sampleSize; x++) {
              const i = (y * canvas.width + x) * 4;
              const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
              if (a > 0) { // 忽略已经透明的像素
                sumR += r; sumG += g; sumB += b; count++;
              }
            }
          }
          if (count > 0) {
            samples.push([sumR / count, sumG / count, sumB / count]);
          }
        }

        // 背景颜色：角落平均（如果角落透明或无法采样，则使用近白阈）
        let bgR = 255, bgG = 255, bgB = 255;
        if (samples.length > 0) {
          bgR = samples.reduce((a, s) => a + s[0], 0) / samples.length;
          bgG = samples.reduce((a, s) => a + s[1], 0) / samples.length;
          bgB = samples.reduce((a, s) => a + s[2], 0) / samples.length;
        }

        const isNearWhite = (r, g, b) => (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold);
        const isNearBg = (r, g, b) => {
          const dr = r - bgR, dg = g - bgG, db = b - bgB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);
          return dist <= similarity;
        };

        // 遍历像素，近白或近背景的像素置为透明
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (isNearWhite(r, g, b) || isNearBg(r, g, b)) {
            data[i + 3] = 0; // alpha = 0
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}