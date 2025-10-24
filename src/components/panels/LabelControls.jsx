import React from 'react';
import { Upload, X } from 'lucide-react';

const LabelControls = ({
  showLabel,
  onToggleShowLabel,
  labelMode,
  onChangeLabelMode,
  labelText,
  onChangeLabelText,
  labelColor,
  onChangeLabelColor,
  fontFamily,
  onChangeFontFamily,
  fontOptions,
  fileInputRef,
  handleImageUpload,
  removeImage,
  customImage,
  imageSize,
  onChangeImageSize,
  imagePositionX,
  onChangeImagePositionX,
  imagePositionY,
  onChangeImagePositionY,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🏷️ 标签内容
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showLabel}
            onChange={(e) => onToggleShowLabel(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-600">显示标签</span>
        </label>
      </div>

      {showLabel && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => onChangeLabelMode('text')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                labelMode === 'text'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              📝 文字
            </button>
            <button
              onClick={() => onChangeLabelMode('image')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                labelMode === 'image'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              🖼️ 图片
            </button>
          </div>

          {labelMode === 'text' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 标签文字
                </label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => onChangeLabelText(e.target.value)}
                  placeholder="输入文字..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎨 文字颜色
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={labelColor}
                    onChange={(e) => onChangeLabelColor(e.target.value)}
                    className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-sm"
                  />
                  <input
                    type="text"
                    value={labelColor}
                    onChange={(e) => onChangeLabelColor(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🔤 字体选择
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => onChangeFontFamily(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white transition-colors"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {!customImage ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                >
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">点击上传图片</span>
                  <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF 格式</span>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={customImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {customImage && (
                <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                      📏 图片大小
                      <span className="text-blue-600 font-semibold">{imageSize}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={imageSize}
                      onChange={(e) => onChangeImageSize(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>小 (10%)</span>
                      <span>大 (80%)</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                      ↔️ 水平位置
                      <span className="text-blue-600 font-semibold">{imagePositionX}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePositionX}
                      onChange={(e) => onChangeImagePositionX(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>左</span>
                      <span>中</span>
                      <span>右</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
                      ↕️ 垂直位置
                      <span className="text-blue-600 font-semibold">{imagePositionY}%</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="90"
                      value={imagePositionY}
                      onChange={(e) => onChangeImagePositionY(Number(e.target.value))}
                      className="w-full accent-blue-600 h-3 rounded-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>上</span>
                      <span>中</span>
                      <span>下</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LabelControls;