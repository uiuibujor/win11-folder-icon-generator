import React from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { colorPickerLocales } from '../constants/colorPickerLocales';

const ColorPickers = ({ bodyValue, onBodyChange, tabValue, onTabChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 文件夹主体颜色 */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
          📁 文件夹主体颜色
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">支持渐变</span>
        </label>
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50 hover:border-blue-400 transition-all duration-300">
          <ColorPicker
            value={bodyValue}
            onChange={onBodyChange}
            hideOpacity={false}
            hideInputType={true}
            hideColorTypeBtns={true}
            locales={colorPickerLocales}
          />
        </div>
      </div>

      {/* 标签颜色 */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
          🏷️ 标签颜色
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">支持渐变</span>
        </label>
        <div className="border-2 border-dashed border-purple-200 rounded-xl p-3 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:border-purple-400 transition-all duration-300">
          <ColorPicker
            value={tabValue}
            onChange={onTabChange}
            hideOpacity={false}
            hideInputType={true}
            hideColorTypeBtns={true}
            locales={colorPickerLocales}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPickers;