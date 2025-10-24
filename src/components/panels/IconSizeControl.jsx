import React from 'react';

const IconSizeControl = ({ iconSize, onChangeIconSize }) => {
  return (
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
        onChange={(e) => onChangeIconSize(Number(e.target.value))}
        className="w-full accent-blue-600 h-3 rounded-lg"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-3">
        <span>小图标 (100px)</span>
        <span>推荐 (256px)</span>
        <span>大图标 (400px)</span>
      </div>
    </div>
  );
};

export default IconSizeControl;