import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Download, RefreshCw, Folder, Camera, Upload, X, Languages, ChevronDown } from 'lucide-react';
import ColorPickers from './components/ColorPickers.jsx';
import Preview from './components/Preview.jsx';
import ExportControls from './components/ExportControls.jsx';
import BasicSettings from './components/panels/BasicSettings.jsx';
import ColorControls from './components/panels/ColorControls.jsx';
import LabelControls from './components/panels/LabelControls.jsx';
import IconSizeControl from './components/panels/IconSizeControl.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import ImageLabelsPanel from './components/ImageLabelsPanel.jsx';
import { getFillStyle, parseGradientOrColor } from './utils/gradients.js';
import { canvasToICO } from './utils/exportIcon.js';
import { calculateHslShifts, getCurrentColor, adjustBrightness, rgbToHex, parseColor } from './utils/colors.js';
import { buildPresetStyles } from './constants/presetStyles.js';
import { useLanguage } from './hooks/useLanguage.jsx';
import { ensureTransparentBackground } from './utils/imageProcessing.js';
import { recommendColorsFromImage } from './utils/imagePalette.js';


const Win11FolderGenerator = () => {
  const { t, toggleLanguage, language, isZh } = useLanguage();
  
  const [folderColor, setFolderColor] = useState('#FFC83D');
  const [tabColor, setTabColor] = useState('#FFD666');
  const [labelText, setLabelText] = useState(() => t('defaults.folderName', '我的文件夹'));
  const [labelColor, setLabelColor] = useState('#FFFFFF');
  const [showLabel, setShowLabel] = useState(true);
  const [labelMode, setLabelMode] = useState('text'); // 'text' or 'image'
  const [customImage, setCustomImage] = useState(null);
  // 从图片推荐配色状态
  const [recommendedColors, setRecommendedColors] = useState([]);
  const [isRecommendingColors, setIsRecommendingColors] = useState(false);
  const [folderStyle, setFolderStyle] = useState('custom');
  const [iconSize, setIconSize] = useState(256);
  const [imageSize, setImageSize] = useState(25); // 图片大小百分比 (相对于图标大小)
  const [imagePositionX, setImagePositionX] = useState(51); // 图片X位置百分比 (0-100)
  const [imagePositionY, setImagePositionY] = useState(50); // 图片Y位置百分比 (0-100)
  const [fontFamily, setFontFamily] = useState('Segoe UI'); // 字体选择
  const [exportFormat, setExportFormat] = useState('png'); // 导出格式选择
  const [showHighlight, setShowHighlight] = useState(false); // 高光效果开关
  const [presetCollapsed, setPresetCollapsed] = useState(true); // 预设样式栏收缩状态
  // AI 图片标签列表（来自左侧 AIAssistant 上报）
  const [aiImageLabels, setAiImageLabels] = useState([]);
  // 图片遮罩：限制图片在文件夹主体内
  const [clipImageToBody, setClipImageToBody] = useState(false);
  // 新增：标签文字大小与位置
  const [textSize, setTextSize] = useState(8); // 文字大小百分比 (相对于图标大小)
  const [textPositionX, setTextPositionX] = useState(50); // 文字X位置百分比 (0-100)
  const [textPositionY, setTextPositionY] = useState(50); // 文字Y位置百分比 (0-100)
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
          // 移除图片阴影效果，避免描边
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          
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
        // 更换图片时清空推荐配色
        setRecommendedColors([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCustomImage(null);
    setRecommendedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 从已上传图片推荐配色
  const handleRecommendColorsFromImage = async () => {
    if (!customImage) return;
    setIsRecommendingColors(true);
    try {
      const schemes = await recommendColorsFromImage(customImage, {
        maxSize: 160,
        step: 16,
        sampleRate: 0.35,
      });
      setRecommendedColors(Array.isArray(schemes) ? schemes : []);
    } catch (err) {
      console.error('推荐配色失败: ', err);
      setRecommendedColors([]);
    } finally {
      setIsRecommendingColors(false);
    }
  };

  // 应用某个推荐配色到当前图标
  const handleApplyRecommendedColors = (scheme) => {
    if (!scheme) return;
    const { bodyColor, tabColor, labelColor } = scheme;
    setBodyColorValue(bodyColor);
    setTabColorValue(tabColor || bodyColor); // 标签与主体分开配色，若无则回退主体色
    setLabelColor(labelColor);
    // 兼容旧状态
    setFolderColor(bodyColor);
    setTabColor(tabColor || bodyColor);
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

  // AI功能处理函数
  const handleAILabelGenerated = (label) => {
    setLabelText(label);
  };

  const handleAIColorRecommended = (bodyColor, labelColor) => {
    // 更新颜色值
    setBodyColorValue(bodyColor);
    setTabColorValue(bodyColor); // 标签页使用相同的主体颜色
    setLabelColor(labelColor);
    
    // 同时更新旧的颜色状态以保持兼容性
    setFolderColor(bodyColor);
    setTabColor(bodyColor);
  };

  const handleAIImageLabelGenerated = async (imageLabel) => {
    // 将生成的图片设置为自定义图片（先进行透明背景处理）
    if (imageLabel && imageLabel.url) {
      const src = imageLabel.url;
      try {
        const processed = await ensureTransparentBackground(src, {
          whiteThreshold: 245,
          similarity: 22,
          sampleSize: 10,
        });
        setCustomImage(processed || src);
      } catch (e) {
        setCustomImage(src);
      }
      setLabelMode('image'); // 切换到图片模式
      setShowLabel(true);
      
      // 如果有描述，也设置为标签文字
      if (imageLabel.description) {
        setLabelText(imageLabel.description);
      }
    }
  };

  const handleBatchApply = (batchResult) => {
    setLabelText(batchResult.label);
    setBodyColorValue(batchResult.bodyColor);
    setTabColorValue(batchResult.bodyColor);
    setLabelColor(batchResult.labelColor);
    setFolderColor(batchResult.bodyColor);
    setTabColor(batchResult.bodyColor);
  };


  const presetStyles = buildPresetStyles(folderColor, tabColor, t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部区域 - 优化间距和视觉效果 */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 relative">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Folder className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            {/* 语言切换按钮 */}
            <button
              onClick={toggleLanguage}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-blue-300 hover:bg-blue-50/80 transition-all duration-300 shadow-sm hover:shadow-md"
              title={isZh ? "Switch to English" : "切换到中文"}
            >
              <Languages className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {isZh ? 'EN' : '中文'}
              </span>
            </button>
          </div>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </div>

        {/* 预设样式区域 - 改进响应式设计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">🎨 {t('presetStylesTitle')}</h2>
            <button
              onClick={() => setPresetCollapsed(prev => !prev)}
              aria-expanded={!presetCollapsed}
              className={`ml-auto flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md border ${
                presetCollapsed
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600 hover:from-purple-700 hover:to-blue-700'
              }`}
              title={isZh ? (presetCollapsed ? '展开预设' : '收起预设') : (presetCollapsed ? 'Show Presets' : 'Hide Presets')}
            >
              <ChevronDown className={`w-4 h-4 text-white transition-transform ${presetCollapsed ? '' : 'rotate-180'}`} />
              <span className="text-sm font-semibold">
                {isZh ? (presetCollapsed ? '展开预设' : '收起预设') : (presetCollapsed ? 'Show Presets' : 'Hide Presets')}
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">{presetStyles.length}</span>
            </button>
          </div>
          {presetCollapsed && (
            <p className="-mt-2 mb-4 text-xs text-gray-600">{isZh ? '已收起，点击右侧按钮展开查看所有预设' : 'Collapsed. Click the button to show all presets.'}</p>
          )}
          <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-14 gap-2 lg:gap-3 ${presetCollapsed ? 'hidden' : ''}`}>
            {presetStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => {
                  setFolderStyle(style.value);
                  setBodyColorValue(style.bodyColor);
                  setTabColorValue(style.tabColor);
                  if (style.value !== 'custom') setPresetCollapsed(false);
                }}
                className={`group flex flex-col items-center p-2 lg:p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  folderStyle === style.value
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                }`}
              >
                <div className="relative w-6 h-6 lg:w-8 lg:h-8 rounded-lg mb-1 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="absolute inset-0 rounded-lg" style={{ background: style.bodyColor }}></div>
                  <div className="absolute top-0 left-0 w-4 lg:w-5 h-2 lg:h-3 rounded-tl-lg" style={{ background: style.tabColor }}></div>
                </div>
                <span className="text-[10px] lg:text-xs text-gray-700 font-medium text-center leading-tight">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主要内容区域 - 改进布局和响应式 */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 预览区域 - 优化设计 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">📱 {t('preview')}</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl p-6 lg:p-8 min-h-[300px] lg:min-h-[400px] border border-gray-200/50">
              <Preview
                canvasRef={canvasRef}
                iconSize={iconSize}
                showHighlight={showHighlight}
                bodyFill={memoizedBodyColorValue}
                tabFill={memoizedTabColorValue}
                showLabel={showLabel}
                labelMode={labelMode}
                labelText={labelText}
                labelColor={labelColor}
                fontFamily={fontFamily}
                fontOptions={fontOptions}
                customImage={customImage}
                imageSize={imageSize}
                imagePositionX={imagePositionX}
                imagePositionY={imagePositionY}
                clipImageToBody={clipImageToBody}
                // 新增：文字大小与位置
                textSize={textSize}
                onChangeTextSize={setTextSize}
                textPositionX={textPositionX}
                onChangeTextPositionX={setTextPositionX}
                textPositionY={textPositionY}
                onChangeTextPositionY={setTextPositionY}
              />
              
              <ExportControls
                exportFormat={exportFormat}
                onChangeExportFormat={setExportFormat}
                canvasRef={canvasRef}
                fileName={labelText || 'folder'}
              />
            </div>
            
            {/* 图标大小控制 - 独立组件 */}
            <div className="mt-4">
              <IconSizeControl iconSize={iconSize} onChangeIconSize={setIconSize} />
            </div>
          </div>

          {/* 控制面板 - 大幅优化设计和布局 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">⚙️ {t('customSettings')}</h2>
            </div>
            
            <div className="space-y-8 max-h-[600px] lg:max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {/* 基础设置区域 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  ⚡ {t('basicSettings')}
                </h3>
                
                <BasicSettings showHighlight={showHighlight} onToggleHighlight={setShowHighlight} />
              </div>

              <ColorControls
                bodyValue={bodyColorValue}
                onBodyChange={handleBodyColorChange}
                tabValue={tabColorValue}
                onTabChange={handleTabColorChange}
              />

              {/* 内容设置区域 */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  📝 {t('contentSettings')}
                </h3>
                
                <div className="space-y-4">
                  <LabelControls
                    showLabel={showLabel}
                    onToggleShowLabel={setShowLabel}
                    labelMode={labelMode}
                    onChangeLabelMode={setLabelMode}
                    labelText={labelText}
                    onChangeLabelText={setLabelText}
                    labelColor={labelColor}
                    onChangeLabelColor={setLabelColor}
                    fontFamily={fontFamily}
                    onChangeFontFamily={setFontFamily}
                    fontOptions={fontOptions}
                    fileInputRef={fileInputRef}
                    handleImageUpload={handleImageUpload}
                    removeImage={removeImage}
                    customImage={customImage}
                    imageSize={imageSize}
                    onChangeImageSize={setImageSize}
                    imagePositionX={imagePositionX}
                    onChangeImagePositionX={setImagePositionX}
                    imagePositionY={imagePositionY}
                  onChangeImagePositionY={setImagePositionY}
                  clipImageToBody={clipImageToBody}
                  onToggleClipImageToBody={setClipImageToBody}
                  // 新增：文字大小与位置
                  textSize={textSize}
                  onChangeTextSize={setTextSize}
                  textPositionX={textPositionX}
                  onChangeTextPositionX={setTextPositionX}
                  textPositionY={textPositionY}
                  onChangeTextPositionY={setTextPositionY}
                  // 新增：从图片推荐配色回调（移动到内容设置里）
                  recommendedColors={recommendedColors}
                  isRecommendingColors={isRecommendingColors}
                  onRecommendColorsFromImage={handleRecommendColorsFromImage}
                  onApplyRecommendedColors={handleApplyRecommendedColors}
                />
                </div>
              </div>

              {/* 重置按钮 - 大幅改进设计 */}
              <button
                onClick={() => {
                  setFolderStyle('custom');
                  setBodyColorValue('#FFC83D');
                  setTabColorValue('#FFD666');
                  setLabelText(t('defaultText'));
                  setLabelColor('#FFFFFF');
                  setShowLabel(true);
                  setLabelMode('text');
                  setCustomImage(null);
                  setIconSize(256);
                  setImageSize(25);
                  setImagePositionX(50);
                  setImagePositionY(50);
                  // 新增重置：文字大小与位置
                  setTextSize(8);
                  setTextPositionX(50);
                  setTextPositionY(50);
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
                  setClipImageToBody(false);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300/50"
              >
                🔄 {t('resetToDefault')}
              </button>
            </div>
          </div>
        </div>

        {/* AI功能区域 */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <AIAssistant
            onLabelGenerated={handleAILabelGenerated}
            onImageLabelGenerated={handleAIImageLabelGenerated}
            onImageLabelsGenerated={(list) => setAiImageLabels(Array.isArray(list) ? list : [])}
            currentLabel={labelText}
            currentDescription=""
          />
          <ImageLabelsPanel
            imageLabels={aiImageLabels}
            onApplyImageLabel={handleAIImageLabelGenerated}
          />
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-3xl p-6 lg:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{t('tips')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">🎨</span>
                <span className="text-sm text-gray-700">{t('tip1')}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">🏷️</span>
                <span className="text-sm text-gray-700">{t('tip2')}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 font-bold">📐</span>
                <span className="text-sm text-gray-700">{t('tip3')}</span>
              </div>
            </div>
            <div className="space-y-3">

              <div className="flex items-start gap-3">
                <span className="text-red-600 font-bold">💾</span>
                <span className="text-sm text-gray-700">{t('tip4')}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold">✨</span>
                <span className="text-sm text-gray-700">{t('tip5')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
 export default Win11FolderGenerator;

// 在重置时也重置文字大小与位置
const resetLabelSettings = () => {
  setLabelText('');
  setLabelColor('#000000');
  setFontFamily('Inter');
  setCustomImage(null);
  setImageSize(40);
  setImagePositionX(50);
  setImagePositionY(50);
  setTextSize(12);
  setTextPositionX(50);
  setTextPositionY(50);
};