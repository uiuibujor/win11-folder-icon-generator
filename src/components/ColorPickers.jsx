import React from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { colorPickerLocales } from '../constants/colorPickerLocales';

const pickerLightStyles = {
  body: { background: 'rgba(255,255,255,0.95)' },
  rbgcpControlBtnWrapper: { background: '#eef2ff' },
  rbgcpControlBtn: { color: '#334155', background: 'transparent' },
  rbgcpControlIcon: { stroke: '#334155' },
  rbgcpControlIcon2: { fill: '#334155' },
  rbgcpControlBtnSelected: {
    background: '#ffffff',
    color: '#6366f1',
    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.15)'
  },
  rbgcpInputLabel: { color: '#334155' },
  rbgcpInput: {
    border: '1px solid #c7d2fe',
    color: '#0f172a',
    background: 'transparent'
  },
  rbgcpCheckered: {
    background: `linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.08) 0), linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.08) 0), white`,
    backgroundRepeat: 'repeat, repeat',
    backgroundPosition: '0px 0, 7px 7px',
    backgroundSize: '14px 14px, 14px 14px',
    borderRadius: '10px'
  },
  rbgcpComparibleLabel: { color: '#334155' }
};

const ColorPickers = ({ bodyValue, onBodyChange, tabValue, onTabChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      {/* 文件夹主体颜色 */}
      <div className="space-y-4">
        <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
          <span>📁 主体颜色</span>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">支持渐变</span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            预览
            <span className="h-3 w-7 rounded-sm ring-1 ring-gray-300" style={{ background: bodyValue }} />
          </span>
        </label>
        <div className="group relative isolate z-0 w-full min-h-[220px] rounded-2xl p-4 bg-gradient-to-br from-blue-50/70 to-purple-50/70 backdrop-blur-sm shadow-sm ring-1 ring-blue-100 hover:shadow-md hover:ring-blue-300 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-300">
          <ColorPicker
            value={bodyValue}
            onChange={onBodyChange}
            width={180}
            height={120}
            hideOpacity={true}
            hideInputType={true}
            hideColorTypeBtns={false}
            hideColorGuide={true}
            hideAdvancedSliders={true}
            locales={colorPickerLocales}
            disableDarkMode={true}
            style={pickerLightStyles}
          />
        </div>
      </div>

      {/* 标签颜色 */}
      <div className="space-y-4">
        <label className="flex items-center gap-3 text-sm font-bold text-gray-800">
          <span>🏷️ 标签颜色</span>
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">支持渐变</span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            预览
            <span className="h-3 w-7 rounded-sm ring-1 ring-gray-300" style={{ background: tabValue }} />
          </span>
        </label>
        <div className="group relative isolate z-0 w-full min-h-[220px] rounded-2xl p-4 bg-gradient-to-br from-purple-50/70 to-pink-50/70 backdrop-blur-sm shadow-sm ring-1 ring-purple-100 hover:shadow-md hover:ring-purple-300 focus-within:ring-2 focus-within:ring-purple-400 transition-all duration-300">
          <ColorPicker
            value={tabValue}
            onChange={onTabChange}
            width={180}
            height={120}
            hideOpacity={true}
            hideInputType={true}
            hideColorTypeBtns={false}
            hideColorGuide={true}
            hideAdvancedSliders={true}
            locales={colorPickerLocales}
            disableDarkMode={true}
            style={pickerLightStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPickers;