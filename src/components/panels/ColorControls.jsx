import React from 'react';
import ColorPickers from '../ColorPickers.jsx';

const ColorControls = ({ bodyValue, onBodyChange, tabValue, onTabChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        🎨 颜色自定义
      </h3>
      <div className="bg-white rounded-2xl p-6 border-2 border-gradient-to-r from-blue-200/50 to-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <ColorPickers
          bodyValue={bodyValue}
          onBodyChange={onBodyChange}
          tabValue={tabValue}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};

export default ColorControls;