import { getFillStyle } from './gradients.js';

// 纯绘制函数：根据配置在已准备好的 ctx 上绘制文件夹
// 约定：canvas 尺寸与缩放由调用方处理（例如 Preview 组件）
export function drawFolder(ctx, config) {
  const {
    iconSize,
    memoizedBodyColorValue,
    memoizedTabColorValue,
    showHighlight,
    showLabel,
    labelMode,
    labelText,
    labelColor,
    fontString,
    customImage,
    imageSize,
    imagePositionX,
    imagePositionY,
    clipImageToBody,
    // 新增：文字大小与位置
    textSize,
    textPositionX,
    textPositionY,
  } = config;

  // 基础阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;

  // 主体几何参数
  const x = iconSize * 0.154;
  const y = iconSize * 0.285;
  const width = iconSize * 0.68;
  const height = iconSize * 0.43;
  const radius = 8;

  // 主体填充（支持纯色/线性渐变）
  const bodyRect = { x, y, width, height };
  ctx.fillStyle = getFillStyle(ctx, bodyRect, memoizedBodyColorValue);
  ctx.beginPath();

  // 不对称顶部与斜坡过渡
  const heightDiff = height * 0.1;
  const leftHeightAdjust = (iconSize / 256) * 5;
  const rightHeightAdjust = (iconSize / 256) * 3;
  const leftTopY = y + heightDiff - leftHeightAdjust;
  const transitionStart = x + width / 3;
  const slopeLength = width * 0.1;
  const transitionEnd = transitionStart + slopeLength;

  // 路径绘制
  ctx.moveTo(x + radius, leftTopY);
  ctx.lineTo(transitionStart, leftTopY);

  const cp1X = transitionStart + slopeLength * 0.35;
  const cp1Y = leftTopY;
  const cp2X = transitionStart + slopeLength * 0.75;
  const rightTopY = y - rightHeightAdjust;
  const cp2Y = rightTopY;
  ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, transitionEnd, rightTopY);

  ctx.lineTo(x + width - radius, rightTopY);
  ctx.quadraticCurveTo(x + width, rightTopY, x + width, rightTopY + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, leftTopY + radius);
  ctx.quadraticCurveTo(x, leftTopY, x + radius, leftTopY);
  ctx.closePath();
  ctx.fill();

  // 标签几何与填充
  ctx.shadowBlur = 10;
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 0;
  ctx.globalCompositeOperation = 'destination-over';
  ctx.beginPath();

  const tabX = iconSize * 0.154;
  const tabY = iconSize * 0.195;
  const tabWidth = iconSize * 0.68;
  const tabHeight = iconSize * 0.2;
  const tabRadius = Math.max(4, iconSize * 0.04);

  const tabRect = { x: tabX, y: tabY, width: tabWidth, height: tabHeight };
  ctx.fillStyle = getFillStyle(ctx, tabRect, memoizedTabColorValue);

  const rightTopDrop = tabHeight * 0.35;
  const topStartY = tabY;
  const topEndY = tabY + rightTopDrop;
  const tabTransitionStart = tabX + tabWidth / 3;
  const tabSlopeLength = tabWidth * 0.12;
  const tabTransitionEnd = tabTransitionStart + tabSlopeLength;

  ctx.moveTo(tabX + tabRadius, topStartY);
  ctx.lineTo(tabTransitionStart, topStartY);

  const tcp1X = tabTransitionStart + tabSlopeLength * 0.35;
  const tcp1Y = topStartY;
  const tcp2X = tabTransitionStart + tabSlopeLength * 0.75;
  const tcp2Y = topEndY;
  ctx.bezierCurveTo(tcp1X, tcp1Y, tcp2X, tcp2Y, tabTransitionEnd, topEndY);

  ctx.lineTo(tabX + tabWidth - tabRadius, topEndY);
  ctx.quadraticCurveTo(tabX + tabWidth, topEndY, tabX + tabWidth, topEndY + tabRadius);
  ctx.lineTo(tabX + tabWidth, tabY + tabHeight - tabRadius);
  ctx.quadraticCurveTo(tabX + tabWidth, tabY + tabHeight, tabX + tabWidth - tabRadius, tabY + tabHeight);
  ctx.lineTo(tabX + tabRadius, tabY + tabHeight);
  ctx.quadraticCurveTo(tabX, tabY + tabHeight, tabX, tabY + tabHeight - tabRadius);
  ctx.lineTo(tabX, tabY + tabRadius);
  ctx.quadraticCurveTo(tabX, tabY, tabX + tabRadius, tabY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 高光效果
  if (showHighlight) {
    ctx.shadowColor = 'transparent';
    ctx.save();
    ctx.beginPath();

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

    const highlight = ctx.createLinearGradient(0, iconSize * 0.35, 0, iconSize * 0.5);
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = highlight;
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
      const fontPx = iconSize * ((textSize ?? 12) / 100);
      ctx.font = `bold ${fontPx}px ${fontString}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tx = iconSize * ((textPositionX ?? 50) / 100);
      const ty = iconSize * ((textPositionY ?? 62) / 100);
      ctx.fillText(labelText, tx, ty);
    } else if (labelMode === 'image' && customImage) {
      const img = new Image();
      // 允许跨域图片用于绘制，避免画布污染
      img.crossOrigin = 'anonymous';
      img.src = customImage;
      img.onload = () => {
        // 移除图片阴影效果，避免描边
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 将 imageSize 视为最大边界框尺寸，绘制时保持长宽比（contain）
        const boxSize = iconSize * (imageSize / 100);
        const posX = typeof imagePositionX === 'string'
          ? (imagePositionX === 'left' ? 30 : imagePositionX === 'right' ? 70 : 50)
          : imagePositionX;
        const posY = typeof imagePositionY === 'string'
          ? (imagePositionY === 'top' ? 40 : imagePositionY === 'bottom' ? 80 : 50)
          : imagePositionY;
        const centerX = iconSize * (posX / 100);
        const centerY = iconSize * (posY / 100);
        const aspect = img.width / img.height;
        const drawW = aspect >= 1 ? boxSize : boxSize * aspect;
        const drawH = aspect >= 1 ? boxSize / aspect : boxSize;
        const drawX = centerX - drawW / 2;
        const drawY = centerY - drawH / 2;
        if (clipImageToBody) {
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
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();
        } else {
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
      };
      img.onerror = () => {
        // 图片加载失败时，不阻塞其他绘制
      };
    }
  }
}