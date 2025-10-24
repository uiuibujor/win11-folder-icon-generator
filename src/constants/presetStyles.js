// 预设样式构建器：返回带有固定预设和动态“自定义”项的列表
export function buildPresetStyles(folderColor, tabColor) {
  return [
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
    // 动态项：使用当前状态颜色
    { name: '自定义', value: 'custom', bodyColor: folderColor, tabColor: tabColor }
  ];
}