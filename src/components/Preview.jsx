import React, { useEffect, useMemo } from 'react';
import { drawFolder } from '../utils/canvasDraw.js';

const Preview = ({
  canvasRef,
  iconSize,
  showHighlight,
  bodyFill,
  tabFill,
  showLabel,
  labelMode,
  labelText,
  labelColor,
  fontFamily,
  fontOptions,
  customImage,
  imageSize,
  imagePositionX,
  imagePositionY,
  clipImageToBody,
  // 新增：文字大小与位置
  textSize,
  textPositionX,
  textPositionY,
}) => {
  const fontString = useMemo(() => {
    const selected = (fontOptions || []).find(f => f.value === fontFamily);
    return selected ? `"${selected.value}", ${selected.fallback}` : `"${fontFamily}", system-ui, sans-serif`;
  }, [fontFamily, fontOptions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = 2;
    canvas.width = iconSize * scale;
    canvas.height = iconSize * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, iconSize, iconSize);

    drawFolder(ctx, {
      iconSize,
      memoizedBodyColorValue: bodyFill,
      memoizedTabColorValue: tabFill,
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
    });
  }, [canvasRef, iconSize, showHighlight, bodyFill, tabFill, showLabel, labelMode, labelText, labelColor, fontString, customImage, imageSize, imagePositionX, imagePositionY, clipImageToBody, textSize, textPositionX, textPositionY]);

  // 固定预览容器大小到最大值（512px对应的显示大小）
  const fixedPreviewSize = 400; // 固定预览区域大小
  const displayScale = Math.min(fixedPreviewSize / iconSize, 1); // 计算显示缩放比例
  const displayWidth = iconSize * displayScale;
  const displayHeight = iconSize * displayScale;

  return (
    <div 
      className="flex items-center justify-center"
      style={{ width: `${fixedPreviewSize}px`, height: `${fixedPreviewSize}px` }}
    >
      <canvas
        ref={canvasRef}
        className="drop-shadow-2xl"
        style={{ 
          width: `${displayWidth}px`, 
          height: `${displayHeight}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};

export default Preview;