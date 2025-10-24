import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Download, RefreshCw, Folder, Camera, Upload, X } from 'lucide-react';
import ColorPickers from './components/ColorPickers.jsx';
import { getFillStyle, parseGradientOrColor } from './utils/gradients.js';
import { canvasToICO } from './utils/exportIcon.js';
import { calculateHslShifts, getCurrentColor, adjustBrightness, rgbToHex, parseColor } from './utils/colors.js';


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
              Windows 11 文件夹图标生成器
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
                  <ColorPickers
                    bodyValue={bodyColorValue}
                    onBodyChange={handleBodyColorChange}
                    tabValue={tabColorValue}
                    onTabChange={handleTabColorChange}
                  />
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
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-4">
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