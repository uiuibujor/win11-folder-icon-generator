// 预设样式构建器：返回带有固定预设和动态"自定义"项的列表
export function buildPresetStyles(folderColor, tabColor, t) {
  return [
    { name: t('presetStyles.classicYellow'), value: 'classic', bodyColor: '#FFC83D', tabColor: '#e6a800' },
    { name: t('presetStyles.deepBlue'), value: 'ocean', bodyColor: '#667EEA', tabColor: '#764BA2' },
    { name: t('presetStyles.emeraldGreen'), value: 'forest', bodyColor: '#11998E', tabColor: '#38EF7D' },
    { name: t('presetStyles.lavender'), value: 'lavender', bodyColor: '#A8EDEA', tabColor: '#FED6E3' },
    { name: t('presetStyles.sunsetOrange'), value: 'sunset', bodyColor: '#FF6B6B', tabColor: '#FFE66D' },
    { name: t('presetStyles.midnightBlue'), value: 'midnight', bodyColor: '#2C3E50', tabColor: '#4CA1AF' },
    { name: t('presetStyles.coralPink'), value: 'coral', bodyColor: '#FF7F7F', tabColor: '#FFBF7F' },
    { name: t('presetStyles.emeraldGreen'), value: 'emerald', bodyColor: '#50C878', tabColor: '#98FB98' },
    { name: t('presetStyles.coralPink'), value: 'rose', bodyColor: '#FF69B4', tabColor: '#FFB6C1' },
    { name: t('presetStyles.deepBlue'), value: 'sapphire', bodyColor: '#0F52BA', tabColor: '#6495ED' },
    { name: t('presetStyles.sunsetOrange'), value: 'amber', bodyColor: '#FFBF00', tabColor: '#FFD700' },
    { name: t('presetStyles.emeraldGreen'), value: 'mint', bodyColor: '#98FB98', tabColor: '#F0FFF0' },
    { name: t('presetStyles.violet'), value: 'plum', bodyColor: '#8E4585', tabColor: '#DDA0DD' },
    { name: t('presetStyles.deepBlue'), value: 'sky', bodyColor: '#87CEEB', tabColor: '#E0F6FF' },
    { name: t('presetStyles.coralPink'), value: 'cherry', bodyColor: '#DE3163', tabColor: '#FFB7C5' },
    { name: t('presetStyles.emeraldGreen'), value: 'sage', bodyColor: '#9CAF88', tabColor: '#C8D5B9' },
    { name: t('presetStyles.classicYellow'), value: 'pearl', bodyColor: '#F8F6F0', tabColor: '#FFFDD0' },
    { name: t('presetStyles.sunsetOrange'), value: 'bronze', bodyColor: '#CD7F32', tabColor: '#D2B48C' },
    { name: t('presetStyles.violet'), value: 'iris', bodyColor: '#5D4E75', tabColor: '#9B59B6' },
    { name: t('presetStyles.classicYellow'), value: 'cream', bodyColor: '#FFFDD0', tabColor: '#FFF8DC' },
    // 动态项：使用当前状态颜色
    { name: t('presetStyles.custom'), value: 'custom', bodyColor: folderColor, tabColor: tabColor }
  ];
}