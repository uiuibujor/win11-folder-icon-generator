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
    });
  }, [canvasRef, iconSize, showHighlight, bodyFill, tabFill, showLabel, labelMode, labelText, labelColor, fontString, customImage, imageSize, imagePositionX, imagePositionY]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full h-auto drop-shadow-2xl"
      style={{ width: `${Math.min(iconSize, 300)}px`, height: `${Math.min(iconSize, 300)}px` }}
    />
  );
};

export default Preview;