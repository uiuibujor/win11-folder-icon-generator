// Canvas 导出为 ICO 的工具
export function canvasToICO(canvas, size = 256) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = size;
  tempCanvas.height = size;

  const srcW = canvas.width;
  const srcH = canvas.height;
  const srcCtx = canvas.getContext('2d');
  const srcImage = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcData = srcImage.data;
  let minX = srcW, minY = srcH, maxX = -1, maxY = -1;
  const alphaThreshold = 20;
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
    tempCtx.drawImage(canvas, 0, 0, size, size);
  } else {
    const paddingSrc = Math.round(Math.max(srcW, srcH) * 0.02);
    let sx = Math.max(0, minX - paddingSrc);
    let sy = Math.max(0, minY - paddingSrc);
    let sWidth = Math.min(srcW - sx, (maxX - minX + 1) + paddingSrc * 2);
    let sHeight = Math.min(srcH - sy, (maxY - minY + 1) + paddingSrc * 2);

    const targetPadding = Math.round(size * 0.02);
    const availW = size - targetPadding * 2;
    const availH = size - targetPadding * 2;
    const scaleFit = Math.min(availW / sWidth, availH / sHeight);

    const dw = Math.round(sWidth * scaleFit) - 6;
    const dh = Math.round(sHeight * scaleFit);
    const dx = Math.round((size - dw) / 2) + 1;
    const dy = Math.round((size - dh) / 2) - 4;

    tempCtx.drawImage(canvas, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
  }

  const imageData = tempCtx.getImageData(0, 0, size, size);
  const data = imageData.data;

  const icoHeader = new ArrayBuffer(6);
  const icoHeaderView = new DataView(icoHeader);
  icoHeaderView.setUint16(0, 0, true);
  icoHeaderView.setUint16(2, 1, true);
  icoHeaderView.setUint16(4, 1, true);

  const icoEntry = new ArrayBuffer(16);
  const icoEntryView = new DataView(icoEntry);
  icoEntryView.setUint8(0, size === 256 ? 0 : size);
  icoEntryView.setUint8(1, size === 256 ? 0 : size);
  icoEntryView.setUint8(2, 0);
  icoEntryView.setUint8(3, 0);
  icoEntryView.setUint16(4, 1, true);
  icoEntryView.setUint16(6, 32, true);

  const bmpDataSize = 40 + (size * size * 4) + (size * size / 8);
  icoEntryView.setUint32(8, bmpDataSize, true);
  icoEntryView.setUint32(12, 22, true);

  const bmpHeader = new ArrayBuffer(40);
  const bmpHeaderView = new DataView(bmpHeader);
  bmpHeaderView.setUint32(0, 40, true);
  bmpHeaderView.setInt32(4, size, true);
  bmpHeaderView.setInt32(8, size * 2, true);
  bmpHeaderView.setUint16(12, 1, true);
  bmpHeaderView.setUint16(14, 32, true);
  bmpHeaderView.setUint32(16, 0, true);
  bmpHeaderView.setUint32(20, size * size * 4, true);
  bmpHeaderView.setUint32(24, 0, true);
  bmpHeaderView.setUint32(28, 0, true);
  bmpHeaderView.setUint32(32, 0, true);
  bmpHeaderView.setUint32(36, 0, true);

  const rgbaData = new ArrayBuffer(size * size * 4);
  const rgbaView = new Uint8Array(rgbaData);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcIndex = (y * size + x) * 4;
      const dstIndex = ((size - 1 - y) * size + x) * 4;
      rgbaView[dstIndex] = data[srcIndex + 2];
      rgbaView[dstIndex + 1] = data[srcIndex + 1];
      rgbaView[dstIndex + 2] = data[srcIndex];
      rgbaView[dstIndex + 3] = data[srcIndex + 3];
    }
  }

  const andMask = new ArrayBuffer(size * size / 8);

  const totalSize = icoHeader.byteLength + icoEntry.byteLength + bmpHeader.byteLength + rgbaData.byteLength + andMask.byteLength;
  const icoData = new Uint8Array(totalSize);
  let offset = 0;

  icoData.set(new Uint8Array(icoHeader), offset); offset += icoHeader.byteLength;
  icoData.set(new Uint8Array(icoEntry), offset); offset += icoEntry.byteLength;
  icoData.set(new Uint8Array(bmpHeader), offset); offset += bmpHeader.byteLength;
  icoData.set(rgbaView, offset); offset += rgbaData.byteLength;
  icoData.set(new Uint8Array(andMask), offset);

  return new Blob([icoData], { type: 'image/x-icon' });
}