import React from 'react';

const IconSizeControl = ({ iconSize, onChangeIconSize }) => {
  const trackMin = 100;
  const trackMax = 512;
  const valueToPercent = (v) => ((v - trackMin) / (trackMax - trackMin)) * 100;

  const handleSizeChange = (e) => {
    let value = Number(e.target.value);
    
    // 添加停靠吸附点
    const snapPoints = [128, 256, 384];
    const snapThreshold = 10;
    
    for (const snapPoint of snapPoints) {
      if (Math.abs(value - snapPoint) <= snapThreshold) {
        value = snapPoint;
        break;
      }
    }
    
    onChangeIconSize(value);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/50 shadow-sm mt-6">
      <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-4">
        📐 图标大小
        <span className="text-blue-600 font-bold text-lg">{iconSize}px</span>
      </label>
      <div className="relative">
        <input
          type="range"
          min={trackMin}
          max={trackMax}
          value={iconSize}
          onChange={handleSizeChange}
          className="w-full accent-blue-600 h-3 rounded-lg"
        />
        <div className="relative w-full h-5 mt-3">
          <span
            className="absolute -top-0.5 text-xs text-gray-500"
            style={{ left: '0%', transform: 'translateX(0%)' }}
          >
            小图标 (100px)
          </span>
          <span
            className="absolute -top-0.5 text-xs text-gray-500"
            style={{ left: `${valueToPercent(256)}%`, transform: 'translateX(-50%)' }}
          >
            推荐 (256px)
          </span>
          <span
            className="absolute -top-0.5 text-xs text-gray-500"
            style={{ left: '100%', transform: 'translateX(-100%)' }}
          >
            大图标 (512px)
          </span>
        </div>
      </div>
    </div>
  );
};

export default IconSizeControl;