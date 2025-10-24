// 预设样式构建器：返回带有固定预设和动态"自定义"项的列表
export function buildPresetStyles(folderColor, tabColor, t) {
  return [
    { name: t('presetStyles.classicYellow'), value: 'classic', bodyColor: '#FFC83D', tabColor: '#e6a800' },
    { name: t('presetStyles.oceanBlue'), value: 'ocean', bodyColor: '#667EEA', tabColor: '#764BA2' },
    { name: t('presetStyles.forestGreen'), value: 'forest', bodyColor: '#11998E', tabColor: '#38EF7D' },
    { name: t('presetStyles.lavender'), value: 'lavender', bodyColor: '#A8EDEA', tabColor: '#FED6E3' },
    { name: t('presetStyles.sunsetOrange'), value: 'sunset', bodyColor: '#FF6B6B', tabColor: '#FFE66D' },
    { name: t('presetStyles.midnightBlue'), value: 'midnight', bodyColor: '#2C3E50', tabColor: '#4CA1AF' },
    { name: t('presetStyles.coralPink'), value: 'coral', bodyColor: '#FF7F7F', tabColor: '#FFBF7F' },
    { name: t('presetStyles.emeraldGreen'), value: 'emerald', bodyColor: '#50C878', tabColor: '#98FB98' },
    { name: t('presetStyles.roseGold'), value: 'rose', bodyColor: '#FF69B4', tabColor: '#FFB6C1' },
    { name: t('presetStyles.sapphireBlue'), value: 'sapphire', bodyColor: '#0F52BA', tabColor: '#6495ED' },
    
    // 渐变色预设样式
    { name: t('presetStyles.sunsetGradient'), value: 'sunsetGrad', bodyColor: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #FF8E53 100%)', tabColor: '#FF6B6B' },
    { name: t('presetStyles.oceanGradient'), value: 'oceanGrad', bodyColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #4FACFE 100%)', tabColor: '#667EEA' },
    { name: t('presetStyles.rainbowGradient'), value: 'rainbowGrad', bodyColor: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 20%, #4ECDC4 40%, #45B7D1 60%, #96CEB4 80%, #FFEAA7 100%)', tabColor: '#FF6B6B' },
    { name: t('presetStyles.purpleGradient'), value: 'purpleGrad', bodyColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #A8EDEA 100%)', tabColor: '#667EEA' },

    // 动态项：使用当前状态颜色
    { name: t('presetStyles.custom'), value: 'custom', bodyColor: folderColor, tabColor: tabColor }
  ];
}