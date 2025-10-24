// 多语言配置文件
export const locales = {
  zh: {
    // 页面标题和基本信息
    title: 'Windows 11 文件夹图标生成器',
    subtitle: '打造专属的现代化文件夹图标，让你的桌面更加个性化',
    
    // 主要区域标题
    presetStylesTitle: '预设样式',
    preview: '实时预览',
    customSettings: '自定义设置',
    basicSettings: '基础设置',
    contentSettings: '内容设置',
    resetToDefault: '重置为默认设置',
    tips: '使用小贴士',
    defaultText: '我的文件夹',
    
    // 提示内容
    tip1: '选择预设样式快速开始，或自定义颜色创建独特风格',
    tip2: '可以添加文字标签或上传图片来个性化你的文件夹',
    tip3: '推荐使用 256px 尺寸，兼容性最佳',
    tip4: 'PNG 格式支持透明背景，ICO 格式可直接用作系统图标',
    tip5: '开启高光效果让图标更加立体生动',
    
    // 语言切换
    currentLanguage: '中文',
    
    // 基础控件
    showHighlight: '显示高光效果',
    colorCustomization: '颜色自定义',
    
    // 颜色选择器标签
    bodyColor: '📁 主体颜色',
    tabColor: '🏷️ 标签颜色',
    supportsGradient: '✅渐变',
    preview: '预览',
    
    // 标签控件
    labelContent: '标签内容',
    showLabel: '显示标签',
    text: '文字',
    image: '图片',
    labelText: '标签文字',
    textPlaceholder: '输入文字...',
    textColor: '文字颜色',
    fontSelection: '字体选择',
    microsoftYahei: '微软雅黑',
    simhei: '黑体',
    simsun: '宋体',
    textSize: '文字大小',
    smallSize: '小',
    largeSize: '大',
    horizontalPosition: '水平位置',
    verticalPosition: '垂直位置',
    left: '左',
    center: '中',
    right: '右',
    top: '上',
    bottom: '下',
    uploadImage: '点击上传图片',
    supportedFormats: '支持 JPG、PNG、GIF 格式',
    imageSize: '📏 图片大小',
    smallImageSize: '小 (10%)',
    largeImageSize: '大 (80%)',
    
    // 图标尺寸
    iconSize: '图标大小',
    smallIcon: '小图标 (100px)',
    recommendedSize: '推荐 (256px)',
    largeIcon: '大图标 (512px)',
    
    // 导出格式
    exportFormat: '导出格式',
    pngFormat: 'PNG格式',
    icoFormat: 'ICO格式 (256x256，系统图标)',
    downloadIcon: '下载图标',
    
    // 预设样式
    presetStyles: {
      custom: '自定义',
      classicYellow: '经典黄',
      deepBlue: '深海蓝',
      emeraldGreen: '翡翠绿',
      lavender: '薰衣草',
      sunsetOrange: '夕阳橙',
      midnightBlue: '午夜蓝',
      coralPink: '珊瑚粉',
      violet: '紫罗兰'
    }
  },
  
  en: {
    // 页面标题和基本信息
    title: 'Windows 11 Folder Icon Generator',
    subtitle: 'Create personalized modern folder icons to make your desktop more unique',
    
    // 主要区域标题
    presetStylesTitle: 'Preset Styles',
    preview: 'Real-time Preview',
    customSettings: 'Custom Settings',
    basicSettings: 'Basic Settings',
    contentSettings: 'Content Settings',
    resetToDefault: 'Reset to Default',
    tips: 'Tips',
    defaultText: 'My Folder',
    
    // 提示内容
    tip1: 'Choose preset styles to get started quickly, or customize colors to create unique styles',
    tip2: 'Add text labels or upload images to personalize your folder',
    tip3: 'Recommended to use 256px size for best compatibility',
    tip4: 'PNG format supports transparent background, ICO format can be used directly as system icon',
    tip5: 'Enable highlight effect to make icons more three-dimensional and vivid',
    
    // 语言切换
    currentLanguage: 'English',
    
    // 基础控件
    showHighlight: 'Show Highlight Effect',
    colorCustomization: 'Color Customization',
    
    // 颜色选择器标签
    bodyColor: '📁 Body',
    tabColor: '🏷️ Tab',
    supportsGradient: '✅Gradient',
    preview: 'Preview',
    
    // 标签控件
    labelContent: 'Label Content',
    showLabel: 'Show Label',
    text: 'Text',
    image: 'Image',
    labelText: 'Label Text',
    textPlaceholder: 'Enter text...',
    textColor: 'Text Color',
    fontSelection: 'Font Selection',
    microsoftYahei: 'Microsoft YaHei',
    simhei: 'SimHei',
    simsun: 'SimSun',
    textSize: 'Text Size',
    smallSize: 'Small',
    largeSize: 'Large',
    horizontalPosition: 'Horizontal Position',
    verticalPosition: 'Vertical Position',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    top: 'Top',
    bottom: 'Bottom',
    uploadImage: 'Click to upload image',
    supportedFormats: 'Supports JPG, PNG, GIF formats',
    imageSize: '📏 Image Size',
    smallImageSize: 'Small (10%)',
    largeImageSize: 'Large (80%)',
    
    // 图标尺寸
    iconSize: 'Icon Size',
    smallIcon: 'Small Icon (100px)',
    recommendedSize: 'Recommended (256px)',
    largeIcon: 'Large Icon (512px)',
    
    // 导出格式
    exportFormat: 'Export Format',
    pngFormat: 'PNG Format',
    icoFormat: 'ICO Format (256x256, system icon)',
    downloadIcon: 'Download Icon',
    
    // 预设样式
    presetStyles: {
      custom: 'Custom',
      classicYellow: 'Classic Yellow',
      deepBlue: 'Deep Blue',
      emeraldGreen: 'Emerald Green',
      lavender: 'Lavender',
      sunsetOrange: 'Sunset Orange',
      midnightBlue: 'Midnight Blue',
      coralPink: 'Coral Pink',
      violet: 'Violet'
    }
  }
};

export const colorPickerLocales = {
  zh: {
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
  },
  en: {
    CONTROLS: {
      SOLID: 'Solid',
      GRADIENT: 'Gradient'
    },
    INPUTS: {
      HEX: 'Hex',
      RGB: 'RGB',
      HSL: 'HSL',
      HSV: 'HSV',
      CMYK: 'CMYK'
    },
    TOOLS: {
      EYE_DROPPER: 'Eye Dropper',
      COLOR_GUIDE: 'Color Guide',
      ADVANCED: 'Advanced'
    },
    GRADIENT: {
      LINEAR: 'Linear',
      RADIAL: 'Radial',
      ANGLE: 'Angle',
      STOP: 'Stop'
    },
    PRESETS: {
      TITLE: 'Preset Colors'
    }
  }
};